'use server';

import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { createAdminClient } from '@/utils/supabase/admin';
import { OfferLetterPDF } from '@/components/admin/OfferLetterPDF';
import { AdmissionLetterPDF } from '@/components/admin/AdmissionLetterPDF';
import { format, addDays } from 'date-fns';
import path from 'path';
import fs from 'fs';
import { sendEmail } from '@/lib/email';
import OfferLetterEmail from '@/emails/OfferLetterEmail';
import AdmissionLetterEmail from '@/emails/AdmissionLetterEmail';
import { getTuitionFee, calculateDiscountedFee, mapSchoolToTuitionField } from '@/utils/tuition';

export async function generateAndStoreOfferLetter(applicationId: string) {
    const supabase = createAdminClient();

    // 1. Fetch all required data for the letter
    const { data: app, error: appError } = await supabase
        .from('applications')
        .select(`
            *,
            course:Course(*, school:School(name, slug)),
            user:profiles(*),
            offer:admission_offers(*)
        `)
        .eq('id', applicationId)
        .order('created_at', { foreignTable: 'admission_offers', ascending: false })
        .single();

    if (appError || !app) {
        console.error('Error fetching app data for PDF:', appError);
        throw new Error('Failed to fetch application data');
    }

    const { user, course } = app;
    const personalInfo = app.personal_info || {};
    const currentOffer = app.offer?.[0]; // Get the latest offer

    // Determine Fees (Fallback to defaults if no offer exists)
    let tuitionFee = currentOffer?.tuition_fee;
    let discountAmount = currentOffer?.discount_amount || 0;

    if (!tuitionFee) {
        console.log(`[PDF Generation] No offer found for ${applicationId}, calculating defaults.`);
        const field = mapSchoolToTuitionField(course.school?.slug || 'technology');
        const degreeLevel = course.degree_level || course.degreeLevel || 'BACHELOR';
        const baseFee = getTuitionFee(degreeLevel as any, field);
        tuitionFee = baseFee;

        // Default to Early-bird for new offers if within validity logic (simplified here)
        discountAmount = baseFee - calculateDiscountedFee(baseFee);
    }

    // 2. Read images and convert to base64
    const logoBase64 = getBase64Image('sykli-logo-official.png');
    const signatureBase64 = getBase64Image('official-signature.png');

    // 3. Generate References & Dates
    const offerReference = `OFFR-${format(new Date(), 'yyyy')}-${applicationId.slice(0, 5).toUpperCase()}`;
    const issueDate = format(new Date(), 'd MMMM yyyy');
    const expiryDate = currentOffer?.payment_deadline
        ? format(new Date(currentOffer.payment_deadline), 'd MMMM yyyy')
        : format(addDays(new Date(), 14), 'd MMMM yyyy');

    const letterData = {
        offer_reference: offerReference,
        full_name: `${user.first_name} ${user.last_name}`,
        student_id: applicationId.slice(0, 8).toUpperCase(), // Use part of ID as App ID
        date_of_birth: user.date_of_birth || personalInfo.dateOfBirth || '2000-01-01',
        program: course.title,
        degree_level: (course.degree_level || course.degreeLevel || '').toLowerCase().includes('master') ? "Master's Degree" : "Bachelor's Degree",
        intake: 'Fall', // Should probably come from course/app config
        academic_year: '2026',
        school: course.school?.name || 'Academic Faculty',
        course: course.title,
        program_length: course.duration || '2 Years – Full-Time',
        total_ects: course.credits || 120,
        issue_date: issueDate,
        expiry_date: expiryDate,
        tuition_fee: tuitionFee,
        discount_amount: discountAmount,
        logo_path: logoBase64,
        signature_path: signatureBase64
    };

    // 4. Generate PDF Buffer
    try {
        const buffer = await renderToBuffer(<OfferLetterPDF data={letterData} />);
        const filePath = `${user.id}/${applicationId}_offer_letter.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('offer-letters')
            .upload(filePath, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) throw new Error(`Failed to upload offer letter: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage.from('offer-letters').getPublicUrl(filePath);
        const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

        // 5. Update/Create Admission Offer Record (Required for Payment)
        if (!currentOffer) {
            console.log(`[PDF Generation] Creating new admission_offers record for ${applicationId}`);
            const { error: offerError } = await supabase
                .from('admission_offers')
                .insert({
                    application_id: applicationId,
                    tuition_fee: tuitionFee,
                    discount_amount: discountAmount,
                    payment_deadline: addDays(new Date(), 14).toISOString(), // Default 14 days
                    status: 'PENDING',
                    document_url: cacheBustedUrl
                });

            if (offerError) console.error('Failed to create admission_offer record:', offerError);
        } else {
            // Update existing offer with new PDF URL if needed
            await supabase
                .from('admission_offers')
                .update({ document_url: cacheBustedUrl })
                .eq('id', currentOffer.id);
        }

        // 6. Update Legacy Admissions Record (if still used)
        const { error: admissionError } = await supabase
            .from('admissions')
            .upsert({
                user_id: user.id,
                student_id: user.student_id || letterData.student_id,
                full_name: letterData.full_name,
                program: letterData.program,
                offer_letter_url: cacheBustedUrl,
                offer_reference: offerReference,
                decision_date: new Date().toISOString(),
                tuition_fee: tuitionFee, // Use calculated fee
                payment_deadline: expiryDate,
                discount_amount: discountAmount,
                date_of_birth: letterData.date_of_birth,
                school: letterData.school,
                course: letterData.course, // Added to fix not-null constraint
                degree_level: letterData.degree_level,
                intake: letterData.intake,
                academic_year: letterData.academic_year,
                program_length: letterData.program_length,
                total_ects: letterData.total_ects
            }, {
                onConflict: 'user_id, program'
            });

        if (admissionError) throw new Error(`Failed to update admissions record: ${admissionError.message}`);

        // 7. Send Email Notification with Attachment
        try {
            await sendEmail({
                to: user.email,
                subject: 'Offer of Admission - SYKLI College',
                react: <OfferLetterEmail
                    firstName={user.first_name || personalInfo.firstName}
                    courseTitle={course.title}
                />,
                attachments: [
                    {
                        filename: `Offer_Letter_${offerReference}.pdf`,
                        content: buffer,
                    }
                ]
            });
        } catch (emailError) {
            console.error('Failed to send offer letter email:', emailError);
        }

        return { success: true, url: publicUrl, path: filePath };
    } catch (error: any) {
        console.error('PDF Generation Error (Offer):', error);
        throw error;
    }
}

export async function generateAndStoreAdmissionLetter(applicationId: string) {
    const supabase = createAdminClient();

    // 1. Fetch data
    const { data: app, error: appError } = await supabase
        .from('applications')
        .select(`
            *,
            course:Course(*, school:School(name)),
            user:profiles(*),
            offer:admission_offers(*)
        `)
        .eq('id', applicationId)
        .single();

    if (appError || !app) throw new Error('Failed to fetch application data');

    const { user, course } = app;
    const logoBase64 = getBase64Image('sykli-logo-official.png');
    const signatureBase64 = getBase64Image('official-signature.png');

    // 2. References
    const admissionReference = `ADMS-${format(new Date(), 'yyyy')}-${applicationId.slice(0, 5).toUpperCase()}`;
    const issueDate = format(new Date(), 'd MMMM yyyy');

    const letterData = {
        admission_reference: admissionReference,
        full_name: `${user.first_name} ${user.last_name}`,
        student_id: user.student_id || `STU-${applicationId.slice(0, 5).toUpperCase()}`,
        program: course.title,
        degree_level: (course.degree_level || course.degreeLevel || '').toLowerCase().includes('master') ? "Master's Degree" : "Bachelor's Degree",
        academic_year: '2026',
        intake: 'Fall',
        issue_date: issueDate,
        program_start_date: 'August 2026', // Placeholder
        logo_path: logoBase64,
        signature_path: signatureBase64
    };

    // 3. Render and Upload
    try {
        const buffer = await renderToBuffer(<AdmissionLetterPDF data={letterData} />);
        const filePath = `${user.id}/${applicationId}_admission_letter.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('admission-letters')
            .upload(filePath, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) throw new Error(`Failed to upload admission letter: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage.from('admission-letters').getPublicUrl(filePath);
        const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

        // 4. Update Admissions Record
        const { error: admissionError } = await supabase
            .from('admissions')
            .update({
                admission_letter_url: cacheBustedUrl,
                admission_reference: admissionReference,
                student_id: letterData.student_id,
                admission_status: 'ENROLLED'
            })
            .eq('user_id', user.id)
            .eq('program', course.title);

        if (admissionError) throw new Error(`Failed to update admissions record: ${admissionError.message}`);

        // 5. Send Email Notification
        try {
            await sendEmail({
                to: user.email,
                subject: 'Official Admission Finalized - SYKLI College',
                react: <AdmissionLetterEmail
                    firstName={user.first_name}
                    courseTitle={course.title}
                />,
                attachments: [
                    {
                        filename: `Admission_Letter_${admissionReference}.pdf`,
                        content: buffer,
                    }
                ]
            });
        } catch (emailError) {
            console.error('Failed to send admission letter email:', emailError);
        }

        return { success: true, url: publicUrl, path: filePath };
    } catch (error: any) {
        console.error('PDF Generation Error (Admission):', error);
        throw error;
    }
}

// Helper to avoid repetitive FS calls
function getBase64Image(filename: string) {
    const imgPath = path.join(process.cwd(), 'public', 'images', filename);
    if (!fs.existsSync(imgPath)) {
        console.error(`[PDF] Asset missing: ${imgPath}`);
        return '';
    }
    const buffer = fs.readFileSync(imgPath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
}

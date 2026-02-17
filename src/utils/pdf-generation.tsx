import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { AdmissionLetterPDF } from '@/components/admin/AdmissionLetterPDF';
import { createClient } from '@/utils/supabase/client';

export async function generateAndUploadAdmissionLetter(applicationId: string) {
    const supabase = createClient();

    try {
        // 1. Fetch Application Data
        const { data: app, error: appError } = await supabase
            .from("applications")
            .select(`*, user:profiles(*), course:Course(*, school:School(*))`)
            .eq("id", applicationId)
            .single();

        if (appError) throw new Error(`App fetch error: ${appError.message}`);

        // 2. Fetch Offer Data (for reference/deadline if needed, though mostly admission doesn't need it)
        const { data: offerData } = await supabase
            .from("admission_offers")
            .select("*")
            .eq("application_id", applicationId)
            .maybeSingle();

        // 3. Fetch Payment Reference (for receipt confirmation)
        let paymentRef = 'PENDING';
        if (offerData?.id) {
            const { data: payment } = await supabase
                .from("tuition_payments")
                .select("transaction_reference")
                .eq("offer_id", offerData.id)
                .eq("status", "COMPLETED")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (payment) paymentRef = payment.transaction_reference;
        }

        // 4. Fetch Student record for the official ID
        const { data: studentRecord } = await supabase
            .from('students')
            .select('student_id')
            .eq('application_id', applicationId)
            .maybeSingle();

        // 5. Prepare Data for PDF
        const firstName = app.personal_info?.firstName || app.user?.first_name || 'Student';
        const lastName = app.personal_info?.lastName || app.user?.last_name || '';
        const fullName = `${firstName} ${lastName}`;
        const programTitle = app.course?.title || 'N/A';
        const degreeLevel = app.course?.degreeLevel === 'MASTER' ? "Master's Degree" : "Bachelor's Degree";
        const studentId = studentRecord?.student_id || app.user?.student_id || 'PENDING';

        // Dates
        const today = new Date();
        const issueDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const academicYear = '2026 / 2027';
        const intake = 'Autumn 2026';
        const programStartDate = '24th August 2026'; // Hardcoded/Standard start

        // Reference
        const refId = `ADMN-${applicationId.substring(0, 8).toUpperCase()}`;

        const pdfData = {
            admission_reference: refId,
            full_name: fullName,
            student_id: studentId,
            program: programTitle,
            degree_level: degreeLevel,
            academic_year: academicYear,
            intake: intake,
            issue_date: issueDate,
            program_start_date: programStartDate,
            payment_reference: paymentRef,
            logo_path: 'https://syklicollege.fi/logo.png', // Ensure this exists public access
            // signature_path: '...' // Optional
        };

        // 5. Generate PDF Blob
        const blob = await pdf(<AdmissionLetterPDF data={pdfData as any} />).toBlob();

        // 5. Upload to Storage
        const fileName = `admission_letter_${applicationId}.pdf`;
        const filePath = `admission-letters/${fileName}`;

        const { error: storageError } = await supabase.storage
            .from("application-documents")
            .upload(filePath, blob, { contentType: "application/pdf", upsert: true });

        if (storageError) throw new Error(`Storage error: ${storageError.message}`);

        // 6. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("application-documents")
            .getPublicUrl(filePath);

        // 7. Update Application Status (if not already enrolled, but this action is idempotently safe)
        // If called from payment flow, status update happens there too. 
        // But updating here ensures consistency.
        await supabase
            .from("applications")
            .update({ status: "ENROLLED" })
            .eq("id", applicationId);

        // 8. Update Offer Record with Document URL
        if (offerData?.id) {
            await supabase
                .from("admission_offers")
                .update({ document_url: publicUrl })
                .eq("id", offerData.id);
        }

        return { success: true, url: publicUrl };

    } catch (error: any) {
        console.error("Client-side PDF Generation Error:", error);
        return { success: false, error: error.message };
    }
}

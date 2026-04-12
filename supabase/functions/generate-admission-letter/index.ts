import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper: wrap text into lines that fit within maxWidth
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

// Helper: draw horizontal rule
function drawLine(page: any, x: number, y: number, w: number, thickness = 0.5, color = rgb(0.85, 0.85, 0.85)) {
    page.drawRectangle({ x, y, width: w, height: thickness, color });
}

// Helper: draw a section heading
function drawSectionHeading(page: any, text: string, x: number, y: number, w: number, font: any, black: any) {
    page.drawText(text, { x, y, size: 8, font, color: black });
    drawLine(page, x, y - 5, w);
    return y - 22;
}

// Helper: draw wrapped paragraph, returns new y
function drawParagraph(page: any, text: string, x: number, y: number, font: any, fontSize: number, maxWidth: number, color: any, lineHeight = 14): number {
    const lines = wrapText(text, font, fontSize, maxWidth);
    for (const line of lines) {
        page.drawText(line, { x, y, size: fontSize, font, color });
        y -= lineHeight;
    }
    return y;
}

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { applicationId, type = 'ADMISSION' } = await req.json();
        const isOffer = type === 'OFFER';

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Fetch application data
        const { data: app, error: appError } = await supabase
            .from("applications")
            .select(`*, user:profiles(*), course:Course(*, school:School(*))`)
            .eq("id", applicationId)
            .single();

        if (appError) throw appError;

        // Fetch admission offer data
        const { data: offerData } = await supabase
            .from("admission_offers")
            .select("*")
            .eq("application_id", applicationId)
            .maybeSingle();

        // ADMISSION LETTER GUARD: if type is ADMISSION, verify payment exists
        if (!isOffer) {
            const { data: payments } = await supabase
                .from("tuition_payments")
                .select("id, status, transaction_reference")
                .eq("offer_id", offerData?.id || '')
                .eq("status", "COMPLETED")
                .limit(1);

            if (!payments || payments.length === 0) {
                throw new Error("Cannot generate admission letter: no confirmed payment found.");
            }
        }

        // Fetch payment reference for admission letter
        let paymentRef = '';
        if (!isOffer && offerData?.id) {
            const { data: payment } = await supabase
                .from("tuition_payments")
                .select("transaction_reference")
                .eq("offer_id", offerData.id)
                .eq("status", "COMPLETED")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            paymentRef = payment?.transaction_reference || '';
        }

        // 2. Generate PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const { width, height } = page.getSize();

        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

        const margin = 50;
        const cw = width - margin * 2; // content width
        let y = height - margin;

        const black = rgb(0, 0, 0);
        const grey = rgb(0.4, 0.4, 0.4);
        const lightGrey = rgb(0.6, 0.6, 0.6);
        const darkGrey = rgb(0.3, 0.3, 0.3);

        // Applicant info
        const firstName = app.personal_info?.firstName || app.user?.first_name || 'Student';
        const lastName = app.personal_info?.lastName || app.user?.last_name || '';
        const fullName = `${firstName} ${lastName}`;
        const programTitle = app.course?.title || 'N/A';
        const degreeLevel = app.course?.degreeLevel === 'MASTER' ? "Master's Degree" : "Bachelor's Degree";
        const studentId = app.user?.student_id || 'PENDING';
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const refPrefix = isOffer ? 'OFFR' : 'ADMN';
        const refId = `${refPrefix}-${applicationId.substring(0, 8).toUpperCase()}`;

        // =====================================================
        // SECTION 1: HEADER — Institution + Address
        // =====================================================
        page.drawText('KESTORA COLLEGE', { x: margin, y, size: 14, font: boldFont, color: black });
        y -= 16;
        page.drawText('\u2013 Helsinki Campus', { x: margin, y, size: 9, font: regularFont, color: darkGrey });

        // Right-aligned address
        const addr = ['Pohjoisesplanadi 51', '00150 Helsinki, Finland', 'Phone: +358 09 42721884', 'kestora.online', 'admissions@kestora.online'];
        let ay = height - margin;
        for (const line of addr) {
            const lw = regularFont.widthOfTextAtSize(line, 8);
            page.drawText(line, { x: width - margin - lw, y: ay, size: 8, font: regularFont, color: lightGrey });
            ay -= 12;
        }

        y -= 16;
        drawLine(page, margin, y, cw, 1.5, black);
        y -= 30;

        // =====================================================
        // DOCUMENT TITLE
        // =====================================================
        const title = isOffer ? 'OFFICIAL LETTER OF OFFER' : 'OFFICIAL LETTER OF ADMISSION';
        const tw = boldFont.widthOfTextAtSize(title, 16);
        page.drawText(title, { x: (width - tw) / 2, y, size: 16, font: boldFont, color: black });
        y -= 30;

        // Date + Reference grid
        page.drawRectangle({ x: margin, y: y - 5, width: cw, height: 45, color: rgb(0.97, 0.97, 0.97) });
        const c1 = margin + 15, c2 = margin + cw / 3 + 15, c3 = margin + (cw * 2) / 3 + 15;
        const ly = y + 20, vy = y + 5;

        page.drawText('DATE ISSUED', { x: c1, y: ly, size: 7, font: boldFont, color: lightGrey });
        page.drawText(isOffer ? 'OFFER REFERENCE' : 'ADMISSION REFERENCE', { x: c2, y: ly, size: 7, font: boldFont, color: lightGrey });
        page.drawText('APPLICATION ID', { x: c3, y: ly, size: 7, font: boldFont, color: lightGrey });
        page.drawText(dateStr, { x: c1, y: vy, size: 9, font: boldFont, color: black });
        page.drawText(refId, { x: c2, y: vy, size: 9, font: boldFont, color: black });
        page.drawText(applicationId.substring(0, 8).toUpperCase(), { x: c3, y: vy, size: 9, font: boldFont, color: black });
        y -= 50;

        // ---- Tuition Fee Computation (from degree level + school) ----
        const TUITION_FEES: Record<string, Record<string, number>> = {
            BACHELOR: { BUSINESS: 4000, ARTS: 4000, TECHNOLOGY: 6000, SCIENCE: 7500 },
            MASTER: { BUSINESS: 6000, ARTS: 6000, TECHNOLOGY: 6000, SCIENCE: 9500 },
        };
        const EARLY_DISCOUNT_PERCENT = 25;

        function schoolSlugToField(slug: string): string {
            const s = (slug || '').toLowerCase();
            if (s.includes('business')) return 'BUSINESS';
            if (s.includes('arts') || s.includes('design')) return 'ARTS';
            if (s.includes('technology') || s.includes('engineering')) return 'TECHNOLOGY';
            if (s.includes('science')) return 'SCIENCE';
            return 'TECHNOLOGY';
        }

        const schoolSlug = app.course?.school?.slug || '';
        const courseDegreeLevel = app.course?.degreeLevel || 'BACHELOR';
        const tuitionField = schoolSlugToField(schoolSlug);
        const computedBaseFee = TUITION_FEES[courseDegreeLevel]?.[tuitionField] || 6000;
        const computedDiscount = Math.round(computedBaseFee * EARLY_DISCOUNT_PERCENT / 100);
        const computedNetFee = computedBaseFee - computedDiscount;

        if (isOffer) {
            // ==========================================================
            // OFFER LETTER
            // ==========================================================
            y = drawSectionHeading(page, 'APPLICANT & PROGRAMME DETAILS', margin, y, cw, boldFont, black);

            const dl = [
                { label: 'FULL NAME (PASSPORT MATCH)', value: fullName },
                { label: 'INTENDED PROGRAMME', value: programTitle },
            ];
            const dr = [
                { label: 'INTAKE & YEAR', value: 'Autumn Semester 2026' },
                { label: 'DEGREE LEVEL', value: degreeLevel },
            ];
            for (let i = 0; i < dl.length; i++) {
                page.drawText(dl[i].label, { x: margin, y, size: 7, font: boldFont, color: lightGrey });
                page.drawText(dl[i].value, { x: margin, y: y - 13, size: 10, font: boldFont, color: black });
                page.drawText(dr[i].label, { x: margin + cw / 2, y, size: 7, font: boldFont, color: lightGrey });
                page.drawText(dr[i].value, { x: margin + cw / 2, y: y - 13, size: 10, font: boldFont, color: black });
                y -= 35;
            }

            // Offer Statement — light background with full details
            y = drawSectionHeading(page, 'OFFER STATEMENT', margin, y, cw, boldFont, black);
            const offerPara1 = `Dear ${firstName},`;
            y = drawParagraph(page, offerPara1, margin, y, regularFont, 9, cw, black);
            y -= 6;
            const offerPara2 = `We are pleased to inform you that, following a thorough review of your application, the Admissions Committee of Kestora University has decided to offer you a place in the ${programTitle} (${degreeLevel}) programme for the Autumn 2026 intake.`;
            y = drawParagraph(page, offerPara2, margin, y, regularFont, 9, cw, darkGrey);
            y -= 6;
            const offerPara3 = `This offer is subject to the conditions outlined below, including acceptance of the offer via the student portal and confirmation of tuition payment by the specified deadline. Upon fulfillment of these conditions, an official Letter of Admission will be issued confirming your enrollment.`;
            y = drawParagraph(page, offerPara3, margin, y, regularFont, 9, cw, darkGrey);
            y -= 12;

            // Conditions
            y = drawSectionHeading(page, 'CONDITIONS OF OFFER', margin, y, cw, boldFont, black);
            y = drawParagraph(page, 'This offer is conditional upon acceptance and fulfillment of all stated requirements:', margin, y, regularFont, 9, cw, grey);
            y -= 4;
            for (const c of ['Formal acceptance of this offer via the student portal.', 'Payment of required tuition fees by the specified deadline.', 'Submission of any outstanding original documents (if applicable).']) {
                page.drawText('\u2022', { x: margin + 10, y, size: 9, font: regularFont, color: black });
                page.drawText(c, { x: margin + 25, y, size: 9, font: regularFont, color: darkGrey });
                y -= 16;
            }
            y -= 5;

            // Tuition info — computed from programme data
            y = drawSectionHeading(page, 'TUITION & FINANCIAL INFORMATION', margin, y, cw, boldFont, black);
            const computedDeposit = Math.round(computedBaseFee * 0.5);
            y = drawParagraph(page, 'The following tuition information is provided for your reference based on the programme and degree level.', margin, y, regularFont, 8, cw, grey);
            y -= 8;

            page.drawRectangle({ x: margin, y: y - 5, width: cw, height: 40, color: rgb(0.97, 0.97, 0.97) });
            
            // Deposit Row
            page.drawText('Tuition Deposit (50% to Secure Place)', { x: margin + 10, y, size: 10, font: boldFont, color: black });
            const duet = `\u20AC${computedDeposit.toLocaleString()} EUR`;
            const duew = boldFont.widthOfTextAtSize(duet, 10);
            page.drawText(duet, { x: width - margin - 10 - duew, y, size: 10, font: boldFont, color: black });
            
            y -= 18;
            drawLine(page, margin + 10, y, cw - 20, 0.3);
            y -= 12;

            // Balance Row
            page.drawText('Remaining Balance (Due before commencement)', { x: margin + 10, y, size: 9, font: regularFont, color: grey });
            const balt = `\u20AC${computedDeposit.toLocaleString()} EUR`;
            const balw = boldFont.widthOfTextAtSize(balt, 9);
            page.drawText(balt, { x: width - margin - 10 - balw, y, size: 9, font: boldFont, color: grey });
            
            y -= 25;

            // Next steps & Validity
            const hw = cw / 2 - 10;
            page.drawText('NEXT STEPS', { x: margin, y, size: 8, font: boldFont, color: black });
            page.drawText('OFFER VALIDITY', { x: margin + cw / 2, y, size: 8, font: boldFont, color: black });
            y -= 5; drawLine(page, margin, y, hw); drawLine(page, margin + cw / 2, y, hw); y -= 18;

            let sy = y;
            for (const s of ['1.  Accept offer via the student portal.', '2.  Proceed to tuition payment.', '3.  Admission letter issued after payment.']) {
                page.drawText(s, { x: margin, y: sy, size: 9, font: regularFont, color: darkGrey });
                sy -= 15;
            }
            const dl2 = offerData?.payment_deadline ? new Date(offerData.payment_deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '14 Days from Issue';
            page.drawText(dl2, { x: margin + cw / 2, y, size: 10, font: boldFont, color: black });
            page.drawText('This offer will lapse automatically', { x: margin + cw / 2, y: y - 14, size: 8, font: regularFont, color: lightGrey });
            page.drawText('if not accepted by the specified date.', { x: margin + cw / 2, y: y - 25, size: 8, font: regularFont, color: lightGrey });
            y = sy - 10;

            // Signature
            y -= 10; drawLine(page, margin, y, cw, 0.5); y -= 30;
            page.drawText('Admissions Office', { x: margin, y, size: 10, font: boldFont, color: black });
            y -= 13;
            page.drawText('Kestora University | Helsinki, Finland', { x: margin, y, size: 8, font: regularFont, color: lightGrey });
            const did1 = 'Verified Document ID';
            const dw1 = regularFont.widthOfTextAtSize(did1, 8);
            page.drawText(did1, { x: width - margin - dw1, y: y + 13, size: 8, font: regularFont, color: lightGrey });
            const dw2 = boldFont.widthOfTextAtSize(refId, 8);
            page.drawText(refId, { x: width - margin - dw2, y, size: 8, font: boldFont, color: black });

            // Disclaimer
            y -= 30; drawLine(page, margin, y, cw, 0.3); y -= 15;
            const disc2 = 'LEGAL DISCLAIMER: This Offer Letter does not constitute confirmation of enrollment. Official admission is granted only after acceptance of the offer and confirmation of required tuition payment.';
            const dl3 = wrapText(disc2, italicFont, 7, cw - 20);
            for (const line of dl3) {
                const lw = italicFont.widthOfTextAtSize(line, 7);
                page.drawText(line, { x: (width - lw) / 2, y, size: 7, font: italicFont, color: lightGrey });
                y -= 11;
            }

        } else {
            // ==========================================================
            // ADMISSION LETTER — Official Post-Payment Enrollment
            // ==========================================================

            // 1. Recipient Address Block
            const contact = app.contact_details || {};
            const personal = app.personal_info || {};
            const street = personal.streetAddress || contact.streetAddress || 'N/A';
            const city = personal.city || contact.city || '';
            const country = personal.country || contact.country || '';
            const addressLine2 = city && country ? `${city}, ${country}` : (city || country || '');

            y = height - 120;
            page.drawText('To:', { x: margin, y, size: 9, font: boldFont, color: black });
            y -= 14;
            page.drawText(fullName, { x: margin, y, size: 10, font: boldFont, color: black });
            y -= 12;
            page.drawText(street, { x: margin, y, size: 9, font: regularFont, color: darkGrey });
            if (addressLine2) {
                y -= 12;
                page.drawText(addressLine2, { x: margin, y, size: 9, font: regularFont, color: darkGrey });
            }
            y -= 12;
            page.drawText(`Student ID: ${studentId}`, { x: margin, y, size: 9, font: boldFont, color: black });
            y -= 40;

            // 2. Admission Letter Title
            const admitTitle = 'Official Admission Letter';
            const atw = boldFont.widthOfTextAtSize(admitTitle, 16);
            page.drawText(admitTitle, { x: (width - atw) / 2, y, size: 16, font: boldFont, color: black });
            y -= 35;

            // 3. Header Data Grid
            page.drawRectangle({ x: margin, y: y - 5, width: cw, height: 45, color: rgb(0.98, 0.98, 0.98) });
            const c1 = margin + 15, c2 = margin + cw / 3 + 15, c3 = margin + (cw * 2) / 3 + 15;
            const gy = y + 20, gv = y + 5;

            page.drawText('Enrollment Date', { x: c1, y: gy, size: 7, font: boldFont, color: lightGrey });
            page.drawText('Admission Reference', { x: c2, y: gy, size: 7, font: boldFont, color: lightGrey });
            page.drawText('Official Student ID', { x: c3, y: gy, size: 7, font: boldFont, color: lightGrey });
            page.drawText(dateStr, { x: c1, y: gv, size: 10, font: boldFont, color: black });
            page.drawText(refId, { x: c2, y: gv, size: 10, font: boldFont, color: black });
            page.drawText(studentId, { x: c3, y: gv, size: 10, font: boldFont, color: black });
            y -= 60;

            // 4. Official Statement
            const passport = personal.passportNumber || personal.passport_number || 'N/A';
            const dobRaw = app.user?.date_of_birth || personal.dateOfBirth || personal.dob;
            const dobDisplay = dobRaw ? new Date(dobRaw).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
            
            const officialStatement = `This letter serves as official notification that ${fullName} (Passport: ${passport}, DOB: ${dobDisplay}) has been formally admitted and fully enrolled as a degree student at Kestora University for the 2026 - 2027 academic year. Having satisfied all academic entrance criteria and fulfilled the mandated tuition fee obligations, the student is officially registered for the ${programTitle} (${app.course?.programType || 'Full-time'}). This program is a full-time course of study conducted in the English language at our Helsinki campus location (Pohjoisesplanadi 51, 00150 Helsinki, Finland).`;
            
            y = drawParagraph(page, officialStatement, margin, y, regularFont, 10, cw, black, 16);
            y -= 25;

            // 5. Details Table
            const details = [
                { label: 'Date of Admission', value: dateStr },
                { label: 'Academic Year', value: '2026 - 2027' },
                { label: 'Intake', value: 'Autumn 2026' },
                { label: 'Programme of Study', value: `${programTitle} (${app.course?.programType || 'Full-time'})` },
            ];

            for (const d of details) {
                page.drawText(d.label, { x: margin, y, size: 9, font: boldFont, color: black });
                page.drawText(d.value, { x: margin + 180, y, size: 9, font: regularFont, color: darkGrey });
                y -= 18;
            }
            y -= 15;

            // 6. Sectioned Content
            const sections = [
                {
                    title: 'Student Rights & Access',
                    content: 'As an enrolled student, you are granted full access to:\n\u2022 Campus facilities (Library, Labs, Study Areas)\n\u2022 Digital learning resources and student portal\n\u2022 Academic advising and student support services'
                },
                {
                    title: 'Immigration / Official Use',
                    content: 'This document is an official certificate of admission and may be used for visa applications, residence permit processing (Migri), and other official purposes requiring proof of student status in Finland.'
                },
                {
                    title: 'Next Steps',
                    content: '1. Activate your student email and IT account (credentials sent separately).\n2. Register for the orientation week sessions via the student portal.\n3. Submit your housing application if you have not done so.\n4. Arrival instructions will be communicated to your student email.'
                },
                {
                    title: 'Refund Policy',
                    content: 'Tuition fees are subject to the university\u2019s refund policy. Full details can be found at https://kestora.online/refund-withdrawal-policy/.'
                }
            ];

            for (const s of sections) {
                page.drawText(s.title, { x: margin, y, size: 10, font: boldFont, color: black });
                y -= 14;
                const lines = s.content.split('\n');
                for (const line of lines) {
                    y = drawParagraph(page, line, margin, y, regularFont, 9, cw, darkGrey, 14);
                }
                y -= 12;
            }

            // 7. Signature area
            y = 130;
            drawLine(page, margin, y, cw, 0.5, black);
            y -= 25;
            page.drawText('Official Signature', { x: margin, y, size: 8, font: boldFont, color: black });
            y -= 15;
            page.drawText('Office of the Registrar', { x: margin, y, size: 10, font: boldFont, color: black });
            y -= 13;
            page.drawText('Dosentti (Docent) Anna Virtanen, FT (Doctor of Philosophy)', { x: margin, y, size: 9, font: regularFont, color: black });
            y -= 12;
            page.drawText('Kestora University | Finland', { x: margin, y, size: 8, font: regularFont, color: lightGrey });

            // Footer
            y = 40;
            const footerText = 'Generated electronically via Kestora SIS. Valid without physical signature if verified online.';
            const fw = regularFont.widthOfTextAtSize(footerText, 8);
            page.drawText(footerText, { x: (width - fw) / 2, y, size: 8, font: italicFont, color: grey });
        }

        const pdfBytes = await pdfDoc.save();

        // 3. Upload to Storage
        const prefix = isOffer ? 'offer_letter' : 'admission_letter';
        const fileName = `${prefix}_${applicationId}.pdf`;
        const folder = isOffer ? 'offer-letters' : 'admission-letters';
        const filePath = `${folder}/${fileName}`;

        const { error: storageError } = await supabase.storage
            .from("application-documents")
            .upload(filePath, pdfBytes, { contentType: "application/pdf", upsert: true });

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
            .from("application-documents")
            .getPublicUrl(filePath);

        // 4. Update application status (Admission letter sets ENROLLED)
        if (!isOffer) {
            await supabase
                .from("applications")
                .update({ status: "ENROLLED" })
                .eq("id", applicationId);
        }

        // 5. Update admission_offers document_url
        if (offerData?.id) {
            await supabase
                .from("admission_offers")
                .update({ document_url: publicUrl })
                .eq("id", offerData.id);
        }

        return new Response(JSON.stringify({ success: true, url: publicUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Generate Document Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

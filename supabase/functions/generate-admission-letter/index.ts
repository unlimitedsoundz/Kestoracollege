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
        page.drawText('Kestora COLLEGE', { x: margin, y, size: 14, font: boldFont, color: black });
        y -= 16;
        page.drawText('College of Art and Design', { x: margin, y, size: 9, font: regularFont, color: grey });

        // Right-aligned address
        const addr = ['Pohjoisesplanadi 51', '00150 Helsinki, Finland', 'https://kestora.fi', 'admissions@kestora.fi'];
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
            const offerPara2 = `We are pleased to inform you that, following a thorough review of your application, the Admissions Committee of Kestora College has decided to offer you a place in the ${programTitle} (${degreeLevel}) programme for the Autumn 2026 intake.`;
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
            y = drawParagraph(page, 'The following tuition information is provided for your reference based on the programme and degree level.', margin, y, regularFont, 8, cw, grey);
            y -= 8;

            page.drawText('Standard Annual Tuition Fee', { x: margin + 10, y, size: 9, font: regularFont, color: grey });
            const ft = `\u20AC${computedBaseFee.toLocaleString()} EUR`;
            const fw = boldFont.widthOfTextAtSize(ft, 9);
            page.drawText(ft, { x: width - margin - 10 - fw, y, size: 9, font: boldFont, color: black });
            y -= 5; drawLine(page, margin, y, cw, 0.3); y -= 16;

            // Early payment discount
            page.drawText(`Early Payment Discount (${EARLY_DISCOUNT_PERCENT}%)`, { x: margin + 10, y, size: 9, font: regularFont, color: rgb(0.13, 0.55, 0.13) });
            const dt = `- \u20AC${computedDiscount.toLocaleString()} EUR`;
            const ddw = boldFont.widthOfTextAtSize(dt, 9);
            page.drawText(dt, { x: width - margin - 10 - ddw, y, size: 9, font: boldFont, color: rgb(0.13, 0.55, 0.13) });
            y -= 5; drawLine(page, margin, y, cw, 0.3); y -= 16;

            page.drawRectangle({ x: margin, y: y - 5, width: cw, height: 25, color: rgb(0.97, 0.97, 0.97) });
            page.drawText('Amount Due to Secure Admission', { x: margin + 10, y, size: 10, font: boldFont, color: black });
            const duet = `\u20AC${computedNetFee.toLocaleString()} EUR`;
            const duew = boldFont.widthOfTextAtSize(duet, 12);
            page.drawText(duet, { x: width - margin - 10 - duew, y: y - 1, size: 12, font: boldFont, color: black });
            y -= 35;

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
            page.drawText('Kestora College | Helsinki, Finland', { x: margin, y, size: 8, font: regularFont, color: lightGrey });
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

            // SECTION 2: STUDENT INFORMATION
            y = drawSectionHeading(page, 'STUDENT INFORMATION', margin, y, cw, boldFont, black);

            const infoLeft = [
                { label: 'FULL NAME (PASSPORT MATCH)', value: fullName },
                { label: 'PROGRAMME', value: programTitle },
                { label: 'ACADEMIC YEAR', value: '2026 / 2027' },
            ];
            const infoRight = [
                { label: 'STUDENT ID', value: studentId },
                { label: 'DEGREE LEVEL', value: degreeLevel },
                { label: 'INTAKE', value: 'Autumn 2026' },
            ];
            for (let i = 0; i < infoLeft.length; i++) {
                page.drawText(infoLeft[i].label, { x: margin, y, size: 7, font: boldFont, color: lightGrey });
                page.drawText(infoLeft[i].value, { x: margin, y: y - 13, size: 10, font: boldFont, color: black });
                page.drawText(infoRight[i].label, { x: margin + cw / 2, y, size: 7, font: boldFont, color: lightGrey });
                page.drawText(infoRight[i].value, { x: margin + cw / 2, y: y - 13, size: 10, font: boldFont, color: black });
                y -= 32;
            }
            y -= 5;

            // SECTION 3: ADMISSION CONFIRMATION (LOCKED WORDING — black bar)
            const confirmH = 55;
            page.drawRectangle({ x: margin, y: y - confirmH + 15, width: cw, height: confirmH, color: black });
            const confirmText = '\u201CWe are pleased to confirm that you have been officially admitted and enrolled as a student of Kestora College for the above-named programme and academic year.\u201D';
            const cl = wrapText(confirmText, italicFont, 9, cw - 40);
            let cy = y - 2;
            for (const line of cl) {
                const lw = italicFont.widthOfTextAtSize(line, 9);
                page.drawText(line, { x: (width - lw) / 2, y: cy, size: 9, font: italicFont, color: rgb(1, 1, 1) });
                cy -= 14;
            }
            y -= confirmH + 10;

            // SECTION 4: TUITION CONFIRMATION
            y = drawSectionHeading(page, 'TUITION CONFIRMATION', margin, y, cw, boldFont, black);
            y = drawParagraph(page, 'The required tuition fees for the first academic year have been received and confirmed.', margin, y, regularFont, 9, cw, darkGrey);
            y -= 8;

            // Payment details grid
            page.drawRectangle({ x: margin, y: y - 5, width: cw, height: 55, color: rgb(0.97, 0.97, 0.97) });

            page.drawText('STANDARD FEE', { x: margin + 15, y: y + 25, size: 7, font: boldFont, color: lightGrey });
            page.drawText(`\u20AC${computedBaseFee.toLocaleString()} EUR`, { x: margin + 15, y: y + 12, size: 9, font: regularFont, color: grey });

            page.drawText('DISCOUNT APPLIED', { x: margin + 15, y: y - 2, size: 7, font: boldFont, color: lightGrey });
            page.drawText(`- \u20AC${computedDiscount.toLocaleString()} EUR (${EARLY_DISCOUNT_PERCENT}%)`, { x: margin + 15, y: y - 14, size: 9, font: regularFont, color: rgb(0.13, 0.55, 0.13) });

            page.drawText('AMOUNT PAID', { x: margin + cw / 3, y: y + 25, size: 7, font: boldFont, color: lightGrey });
            const paidAmt = `\u20AC${computedNetFee.toLocaleString()} EUR`;
            page.drawText(paidAmt, { x: margin + cw / 3, y: y + 12, size: 10, font: boldFont, color: black });

            page.drawText('ACADEMIC YEAR', { x: margin + (cw * 2) / 3, y: y + 25, size: 7, font: boldFont, color: lightGrey });
            page.drawText('2026 / 2027', { x: margin + (cw * 2) / 3, y: y + 12, size: 10, font: boldFont, color: black });

            page.drawText('RECEIPT REFERENCE', { x: margin + (cw * 2) / 3, y: y - 2, size: 7, font: boldFont, color: lightGrey });
            page.drawText(paymentRef || 'See Portal', { x: margin + (cw * 2) / 3, y: y - 14, size: 10, font: boldFont, color: black });
            y -= 65;

            // SECTION 5: ENROLLMENT STATUS
            y = drawSectionHeading(page, 'ENROLLMENT STATUS', margin, y, cw, boldFont, black);
            page.drawText('Status:', { x: margin, y, size: 9, font: regularFont, color: grey });
            page.drawText('ACTIVE', { x: margin + 45, y, size: 9, font: boldFont, color: rgb(0.13, 0.55, 0.13) });
            y -= 16;
            page.drawText('Programme commences:', { x: margin, y, size: 9, font: regularFont, color: grey });
            page.drawText('Autumn Semester 2026', { x: margin + 130, y, size: 9, font: boldFont, color: black });
            y -= 22;

            // SECTION 6: RIGHTS & ACCESS
            y = drawSectionHeading(page, 'RIGHTS & ACCESS', margin, y, cw, boldFont, black);
            y = drawParagraph(page, 'As an enrolled student, you are entitled to access academic systems, student services, and institutional resources in accordance with college regulations.', margin, y, regularFont, 9, cw, darkGrey);
            y -= 10;

            // SECTION 7: IMMIGRATION / OFFICIAL USE STATEMENT
            y = drawSectionHeading(page, 'OFFICIAL USE STATEMENT', margin, y, cw, boldFont, black);
            y = drawParagraph(page, 'This letter serves as official confirmation of admission and enrollment for institutional, banking, and immigration purposes.', margin, y, italicFont, 9, cw, darkGrey);
            y -= 10;

            // SECTION 8: NEXT STEPS
            y = drawSectionHeading(page, 'NEXT STEPS', margin, y, cw, boldFont, black);
            const nextSteps = [
                '1.  Activate your student email via the Student Portal.',
                '2.  Access the LMS (Learning Management System) for course materials.',
                '3.  Complete course registration for the upcoming semester.',
                '4.  Attend the orientation programme (details on Student Portal).'
            ];
            for (const step of nextSteps) {
                page.drawText(step, { x: margin, y, size: 9, font: regularFont, color: darkGrey });
                y -= 15;
            }
            y -= 5;

            // SECTION 9: REFUND POLICY
            y = drawSectionHeading(page, 'REFUND POLICY', margin, y, cw, boldFont, black);
            y = drawParagraph(page, 'For details regarding tuition refund terms, please visit: https://kestora.fi/refund-policy', margin, y, regularFont, 9, cw, darkGrey);
            y -= 12;

            // SECTION 10: AUTHORIZATION / SIGNATURE
            drawLine(page, margin, y, cw, 0.5);
            y -= 30;
            page.drawText('Office of the Registrar', { x: margin, y, size: 10, font: boldFont, color: black });
            y -= 13;
            page.drawText('Kestora College | Helsinki, Finland', { x: margin, y, size: 8, font: regularFont, color: lightGrey });

            // Right-aligned doc ID
            const did1 = 'Verified Document ID';
            const dw1 = regularFont.widthOfTextAtSize(did1, 8);
            page.drawText(did1, { x: width - margin - dw1, y: y + 13, size: 8, font: regularFont, color: lightGrey });
            const dw2 = boldFont.widthOfTextAtSize(refId, 8);
            page.drawText(refId, { x: width - margin - dw2, y, size: 8, font: boldFont, color: black });

            // Legal notice
            y -= 30; drawLine(page, margin, y, cw, 0.3); y -= 15;
            const notice = 'LEGAL NOTICE: This document serves as official confirmation of admission and enrollment. The student is expected to comply with all academic regulations and code of conduct of Kestora College.';
            const nl = wrapText(notice, italicFont, 7, cw - 20);
            for (const line of nl) {
                const lw = italicFont.widthOfTextAtSize(line, 7);
                page.drawText(line, { x: (width - lw) / 2, y, size: 7, font: italicFont, color: lightGrey });
                y -= 11;
            }
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

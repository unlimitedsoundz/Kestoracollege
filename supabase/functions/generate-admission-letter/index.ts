
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib@^1.17.1?dts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { applicationId, type = 'ADMISSION' } = await req.json();
        const isOffer = type === 'OFFER';

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Fetch data
        const { data: app, error: appError } = await supabase
            .from("applications")
            .select(`
                *,
                user:profiles(*),
                course:Course(*)
            `)
            .eq("id", applicationId)
            .single();

        if (appError) throw appError;

        // 2. Generate PDF using pdf-lib
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        const { width, height } = page.getSize();

        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Header
        page.drawText('SYKLI COLLEGE OF ART AND DESIGN', {
            x: 50,
            y: height - 50,
            size: 16,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        page.drawText(isOffer ? 'ACADEMIC ADMISSION OFFER' : 'OFFICIAL ADMISSION LETTER', {
            x: 50,
            y: height - 80,
            size: 20,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        const today = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        page.drawText(`Date: ${today}`, { x: 50, y: height - 110, size: 10, font: regularFont });
        page.drawText(`Ref: ${isOffer ? 'OFF' : 'ADM'}-${applicationId.substring(0, 8).toUpperCase()}`, { x: width - 200, y: height - 110, size: 10, font: regularFont });

        // Content
        let y = height - 150;
        const firstName = app.user?.first_name || 'Student';
        const lastName = app.user?.last_name || '';

        page.drawText(`Dear ${firstName} ${lastName},`, { x: 50, y, size: 11, font: boldFont });
        y -= 30;

        const bodyText = isOffer ? [
            "We are pleased to offer you admission to SYKLI College of Art and Design for the upcoming academic intake. Your application has been thoroughly reviewed, and we believe your profile is an excellent fit for our creative community.",
            "",
            `Program: ${app.course?.title || 'N/A'}`,
            `Degree Level: ${app.course?.degree_level || 'N/A'}`,
            `Tuition Fee: ${app.course?.tuitionFee || 'N/A'}`,
            "",
            "To secure your place, please log in to the student portal to accept this offer and proceed with the initial fee payment by the specified deadline.",
            "",
            "We look forward to welcoming you to our campus in Helsinki."
        ] : [
            "On behalf of the Office of the Registrar and the Academic Board of SYKLI College of Art and Design, we are pleased to formally confirm your individual admission and subsequent official enrollment as a student.",
            "",
            `Program: ${app.course?.title || 'N/A'}`,
            `Degree Level: ${app.course?.degree_level || 'N/A'}`,
            `Student ID: ${app.user?.student_id || 'N/A'}`,
            "",
            "Your enrollment is finalized for the current Academic Year. This document certifies that you have successfully satisfied all required conditions of admission.",
            "",
            "As a member of our degree-seeking cohort, you are granted full access to the college's academic resources, infrastructure, and international support network. We welcome you to SYKLI College and look forward to supporting your professional development and academic success.",
            "",
            "This letter serves as official confirmation of admission for institutional, banking, and immigration residency purposes."
        ];

        for (const line of bodyText) {
            if (line === "") {
                y -= 10;
                continue;
            }
            page.drawText(line, { x: 50, y, size: 10, font: regularFont, maxWidth: 500, lineHeight: 14 });
            y -= line.length > 80 ? 30 : 20;
        }

        // Footer / Signature
        y -= 40;
        page.drawText('Office of the Registrar', { x: 50, y, size: 11, font: boldFont });
        y -= 15;
        page.drawText('SYKLI College | Helsinki, Finland', { x: 50, y, size: 9, font: regularFont });

        const pdfBytes = await pdfDoc.save();

        // 3. Upload to Storage
        const prefix = isOffer ? 'offer_letter' : 'admission_letter';
        const fileName = `${prefix}_${applicationId}.pdf`;
        const folder = isOffer ? 'offer-letters' : 'admission-letters';
        const filePath = `${folder}/${fileName}`;

        const { data: storageData, error: storageError } = await supabase.storage
            .from("application-documents")
            .upload(filePath, pdfBytes, {
                contentType: "application/pdf",
                upsert: true
            });

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
            .from("application-documents")
            .getPublicUrl(filePath);

        // 4. Update status
        if (!isOffer) {
            await supabase
                .from("applications")
                .update({ status: "ADMISSION_LETTER_GENERATED" })
                .eq("id", applicationId);
        }

        // 5. Update admission_offers document_url
        const { data: offer } = await supabase
            .from("admission_offers")
            .select("id")
            .eq("application_id", applicationId)
            .single();

        if (offer) {
            await supabase
                .from("admission_offers")
                .update({ document_url: publicUrl })
                .eq("id", offer.id);
        }

        return new Response(JSON.stringify({ success: true, url: publicUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Generate Document Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

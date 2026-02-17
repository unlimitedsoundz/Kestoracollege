
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const resendKey = Deno.env.get("RESEND_API_KEY");
        if (!resendKey) {
            console.error("Missing RESEND_API_KEY environment variable");
            return new Response(JSON.stringify({ error: "Email service not configured (Missing API Key)" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const resend = new Resend(resendKey);
        const { record, old_record, type, table, applicationId, documentUrl } = await req.json();

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        let applicationData = record;

        // If applicationId is provided but no record, fetch it
        if (!applicationData && applicationId) {
            const { data: app, error } = await supabase
                .from('applications')
                .select('*, user:profiles(*), course:Course(title)')
                .eq('id', applicationId)
                .single();

            if (app) {
                applicationData = {
                    ...app,
                    email: app.user?.email,
                    first_name: app.user?.first_name || app.personal_info?.firstName,
                };
            }
        }

        if (!applicationData && !record) {
            return new Response(JSON.stringify({ message: "No record provided" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Determine notification type if not explicitly provided
        let notificationType = type;
        const status = applicationData?.status;
        const oldStatus = old_record?.status;

        if (!notificationType && (table === 'applications' || applicationId)) {
            if (status === 'ADMITTED' && oldStatus !== 'ADMITTED') {
                notificationType = 'OFFER_LETTER_READY';
            } else if ((status === 'ADMISSION_LETTER_GENERATED' && oldStatus !== 'ADMISSION_LETTER_GENERATED') ||
                (status === 'ENROLLED' && oldStatus !== 'ENROLLED')) {
                notificationType = 'ADMISSION_LETTER_READY';
            } else if (status === 'REJECTED' && oldStatus !== 'REJECTED') {
                notificationType = 'APPLICATION_REJECTED';
            }
        } else if (!notificationType && table === 'tuition_payments') {
            if (status === 'COMPLETED' && oldStatus !== 'COMPLETED') {
                notificationType = 'PAYMENT_CONFIRMED';
            }
        }

        if (!notificationType) {
            return new Response(JSON.stringify({ message: "No notification action required" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Fetch User Email and Name
        let userEmail = applicationData.email;
        let firstName = applicationData.first_name || 'Student';

        if (!userEmail && applicationData.user_id) {
            const { data: users } = await supabase
                .from('profiles')
                .select('email, first_name')
                .eq('id', applicationData.user_id)
                .single();

            if (users) {
                userEmail = users.email;
                firstName = users.first_name;
            }
        }

        if (!userEmail) throw new Error("Could not determine recipient email");

        let subject = "";
        let html = "";

        switch (notificationType) {
            case 'OFFER_LETTER_READY':
                subject = "Your Offer Letter from SYKLI College";
                html = `<h1>Congratulations ${firstName}!</h1><p>Your offer letter is ready. Please log in to the student portal to review and accept your offer.</p><a href="https://syklicollege.fi/portal/student/offer">View Offer</a>`;
                break;
            case 'ADMISSION_LETTER_READY':
                subject = "Official Admission Letter - SYKLI College";
                const docLink = documentUrl || "https://syklicollege.fi/portal/student/offer";
                html = `<h1>Admission Confirmed</h1><p>Dear ${firstName}, your official admission letter has been generated.</p><p>You can view it directly here:</p><a href="${docLink}" style="display:inline-block;background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">View Admission Letter</a><p>Or log in to the student portal to view details.</p>`;
                break;
            case 'PAYMENT_CONFIRMED':
                subject = "Tuition Payment Confirmed";
                html = `<h1>Payment Successful</h1><p>We have successfully received your tuition payment. Your enrollment process is moving forward.</p>`;
                break;
            case 'APPLICATION_REJECTED':
                subject = "Update regarding your application";
                html = `<p>Dear ${firstName}, thank you for your interest in SYKLI College. After careful review, we regret to inform you that we cannot offer you admission at this time.</p>`;
                break;
            default:
                return new Response(JSON.stringify({ message: "Unknown notification type" }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
        }

        const { data, error } = await resend.emails.send({
            from: "SYKLI College <admissions@syklicollege.fi>",
            to: [userEmail],
            subject: subject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <img src="https://syklicollege.fi/logo.png" alt="SYKLI" style="width: 50px; margin-bottom: 20px;">
                    ${html}
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #666;">SYKLI College of Art and Design | Helsinki, Finland</p>
                </div>
            `,
        });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Notification Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

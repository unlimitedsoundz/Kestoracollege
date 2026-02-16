
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { record, old_record, type, table } = await req.json();

        // Determine notification type if not explicitly provided
        let notificationType = type;
        const status = record?.status;
        const oldStatus = old_record?.status;

        if (!notificationType && table === 'applications') {
            if (status === 'ADMITTED' && oldStatus !== 'ADMITTED') {
                notificationType = 'OFFER_LETTER_READY';
            } else if (status === 'ADMISSION_LETTER_GENERATED' && oldStatus !== 'ADMISSION_LETTER_GENERATED') {
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

        // Fetch User Email and Name (Internal fetch safely using service role)
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Dynamic fetch of user data based on the record
        let userEmail = record.email;
        let firstName = record.first_name || 'Student';

        if (!userEmail && record.user_id) {
            const resp = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${record.user_id}&select=email,first_name`, {
                headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
            });
            const users = await resp.json();
            if (users?.[0]) {
                userEmail = users[0].email;
                firstName = users[0].first_name;
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
                html = `<h1>Admission Confirmed</h1><p>Dear ${firstName}, your official admission letter has been generated and is now available in your portal.</p><a href="https://syklicollege.fi/portal/student/offer">Download Admission Letter</a>`;
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

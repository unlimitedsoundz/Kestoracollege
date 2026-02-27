
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { record } = await req.json();

        // The 'record' will be the profile that was just inserted
        const { email, first_name, student_id } = record;

        if (!email) {
            throw new Error("No email found in record");
        }

        console.log(`Sending welcome email to ${email} (${first_name})`);

        // Branded HTML Template (Simplified for Edge Runtime compatibility)
        // In a full implementation, we'd render the React component to HTML
        // But here we'll use a high-quality HTML string that matches the design.
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Kestora College</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0; }
    .container { max-width: 465px; margin: 40px auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 4px; }
    .logo { display: block; margin: 32px auto; width: 40px; height: 40px; }
    h1 { font-size: 24px; font-weight: 400; text-align: center; margin: 30px 0; }
    p { font-size: 14px; line-height: 24px; color: #000000; }
    .id-box { background-color: #171717; border-radius: 8px; padding: 24px; margin: 32px 0; text-align: center; }
    .id-label { color: rgba(255, 255, 255, 0.6); font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .id-value { color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.05em; margin: 0; }
    .id-note { color: rgba(255, 255, 255, 0.8); font-size: 10px; margin-top: 16px; text-transform: uppercase; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { background-color: #000000; color: #ffffff; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600; }
    .footer { border-top: 1px solid #eaeaea; margin-top: 26px; padding-top: 26px; color: #666666; font-size: 12px; }
    a { color: #2563eb; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://kestora.fi/logo.png" alt="Kestora College" class="logo">
    <h1>Welcome to Kestora College</h1>
    <p>Dear ${first_name || 'Student'},</p>
    <p>Congratulations on creating your student account at Kestora College! We are excited to have you join our academic community.</p>
    
    <div class="id-box">
      <div class="id-label">Your Unique Student ID</div>
      <div class="id-value">${student_id || 'N/A'}</div>
      <div class="id-note">Use this ID along with your Date of Birth to access the student portal.</div>
    </div>

    <p>You can now access your dashboard to complete your application, upload documents, and track your progress.</p>

    <div class="button-container">
      <a href="https://kestora.fi/portal/account/login" class="button">Enter Student Portal</a>
    </div>

    <p>If you have any questions or need assistance, please reach out to our Admissions Office at <a href="mailto:admissions@kestora.fi">admissions@kestora.fi</a>.</p>

    <div class="footer">
      This email was sent to confirm your account registration at Kestora College.
    </div>
  </div>
</body>
</html>
    `;

        const { data, error } = await resend.emails.send({
            from: "Kestora College <admissions@kestora.fi>",
            to: [email],
            subject: "Welcome to Kestora College",
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return new Response(JSON.stringify({ error }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

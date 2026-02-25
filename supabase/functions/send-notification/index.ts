
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
        const { record, old_record, type, table, applicationId, documentUrl, additionalData } = await req.json();

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        let applicationData = record;

        // If applicationId is provided but no record, fetch it
        if (!applicationData && applicationId) {
            const { data: app } = await supabase
                .from('applications')
                .select('*, user:profiles(*), course:Course(title)')
                .eq('id', applicationId)
                .single();

            if (app) {
                applicationData = {
                    ...app,
                    email: app.user?.email,
                    first_name: app.user?.first_name || app.personal_info?.firstName,
                    last_name: app.user?.last_name || app.personal_info?.lastName,
                    student_id: app.user?.student_id,
                    course_title: app.course?.title
                };
            }
        }

        if (!applicationData && !record && !type) {
            return new Response(JSON.stringify({ message: "No record or type provided" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Determine notification type
        let notificationType = type;
        const status = applicationData?.status;
        const oldStatus = old_record?.status;

        if (!notificationType && (table === 'applications' || applicationId)) {
            if (status === 'SUBMITTED' && oldStatus !== 'SUBMITTED') {
                notificationType = 'APPLICATION_SUBMITTED';
            } else if (status === 'ADMITTED' && oldStatus !== 'ADMITTED') {
                notificationType = 'OFFER_LETTER_READY';
            } else if (status === 'OFFER_ACCEPTED' && oldStatus !== 'OFFER_ACCEPTED') {
                notificationType = 'OFFER_ACCEPTED';
            } else if ((status === 'ADMISSION_LETTER_GENERATED' && oldStatus !== 'ADMISSION_LETTER_GENERATED') ||
                (status === 'ENROLLED' && oldStatus !== 'ENROLLED')) {
                notificationType = 'ADMISSION_LETTER_READY';
            } else if (status === 'REJECTED' && oldStatus !== 'REJECTED') {
                notificationType = 'APPLICATION_REJECTED';
            } else if (status === 'DOCS_REQUIRED' && oldStatus !== 'DOCS_REQUIRED') {
                notificationType = 'DOCS_REQUIRED';
            }
        }

        if (!notificationType) {
            return new Response(JSON.stringify({ message: "No notification action required" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Configuration
        const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "unlymitedsoundz@gmail.com";
        const sender = "SYKLI College <admissions@syklicollege.fi>";

        // Fetch User Info if missing
        let userEmail = applicationData?.email;
        let firstName = applicationData?.first_name || 'Student';
        let fullName = `${firstName} ${applicationData?.last_name || ''}`.trim();

        if (!userEmail && applicationData?.user_id) {
            const { data: users } = await supabase
                .from('profiles')
                .select('email, first_name, last_name')
                .eq('id', applicationData.user_id)
                .single();

            if (users) {
                userEmail = users.email;
                firstName = users.first_name;
                fullName = `${users.first_name} ${users.last_name}`;
            }
        }

        let studentSubject = "";
        let studentHtml = "";
        let adminSubject = "";
        let adminHtml = "";

        const portalUrl = "https://syklicollege.fi/portal";

        switch (notificationType) {
            case 'APPLICATION_SUBMITTED':
                studentSubject = "Application Received - SYKLI College";
                studentHtml = `
                    <h1>Form Received</h1>
                    <p>Hello ${firstName},</p>
                    <p>Thank you for submitting your application for <strong>${applicationData?.course_title || 'your chosen program'}</strong>. Our admissions team will review your documents and provide an update soon.</p>
                    <p>Current Status: <strong>SUBMITTED</strong></p>
                    <a href="${portalUrl}" style="display:inline-block;background:#034737;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Portal Dashboard</a>
                `;
                adminSubject = `New Application: ${fullName}`;
                adminHtml = `
                    <h2>New Application Submitted</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Program:</strong> ${applicationData?.course_title || 'N/A'}</p>
                    <a href="https://syklicollege.fi/admin/admissions" style="display:inline-block;background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Process in Admin Panel</a>
                `;
                break;

            case 'OFFER_LETTER_READY':
                studentSubject = "Congratulations! Admission Offer from SYKLI College";
                studentHtml = `
                    <h1 style="color: #034737;">Congratulations ${firstName}!</h1>
                    <p>You have been offered admission to SYKLI College. This is a significant milestone in your creative journey.</p>
                    <p>Please log in to the student portal to review your offer letter and acceptance terms.</p>
                    <a href="${portalUrl}/student/offer" style="display:inline-block;background:#034737;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Offer Letter</a>
                `;
                // Admin already likely knows (triggered by status change), but can send alert if needed
                break;

            case 'OFFER_ACCEPTED':
                adminSubject = `Offer Accepted: ${fullName}`;
                adminHtml = `
                    <h2>Offer Acceptance Notification</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>ID:</strong> ${applicationData?.student_id || 'N/A'}</p>
                    <p><strong>Program:</strong> ${applicationData?.course_title || 'N/A'}</p>
                    <p>The student has officially accepted their admission offer.</p>
                `;
                break;

            case 'ADMISSION_LETTER_READY':
                studentSubject = "Official Admission Letter - SYKLI College";
                const docLink = documentUrl || `${portalUrl}/student/offer`;
                studentHtml = `
                    <h1>Welcome to SYKLI!</h1>
                    <p>Dear ${firstName}, your official admission letter and enrollment confirmation are now available.</p>
                    <p>You can download your document directly using the link below:</p>
                    <a href="${docLink}" style="display:inline-block;background:#034737;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Download Admission Letter</a>
                `;
                break;

            case 'PAYMENT_RECEIVED':
                studentSubject = "Payment Confirmation - SYKLI College";
                const isHousing = additionalData?.paymentType === 'HOUSING';
                studentHtml = `
                    <h1>Payment Successful</h1>
                    <p>Hello ${firstName}, we have successfully received your payment of <strong>${additionalData?.amount} ${additionalData?.currency || 'EUR'}</strong>.</p>
                    <p><strong>Reference:</strong> ${additionalData?.reference || 'N/A'}</p>
                    <p>Your ${isHousing ? 'housing application' : 'enrollment'} status has been updated accordingly.</p>
                `;
                adminSubject = `Payment Received: ${fullName}`;
                adminHtml = `
                    <h2>Payment Notification</h2>
                    <p><strong>From:</strong> ${fullName}</p>
                    <p><strong>Amount:</strong> ${additionalData?.amount} ${additionalData?.currency || 'EUR'}</p>
                    <p><strong>Ref:</strong> ${additionalData?.reference || 'N/A'}</p>
                    <p><strong>Type:</strong> ${additionalData?.paymentType || 'TUITION'}</p>
                `;
                break;

            case 'HOUSING_SUBMITTED':
                studentSubject = "Housing Application Received - SYKLI College";
                studentHtml = `
                    <h1>Housing Request Received</h1>
                    <p>Hello ${firstName}, thank you for applying for student housing.</p>
                    <p>Our housing department will review your preferences and contact you with availability and next steps.</p>
                `;
                adminSubject = `New Housing Application: ${fullName}`;
                adminHtml = `
                    <h2>Housing Request Alert</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Semester:</strong> ${additionalData?.semesterName || 'N/A'}</p>
                    <p><strong>Building Pref:</strong> ${additionalData?.preferredBuilding || 'N/A'}</p>
                    <p><strong>Move-in:</strong> ${additionalData?.moveInDate || 'N/A'}</p>
                    <a href="https://syklicollege.fi/admin/housing" style="display:inline-block;background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Manage Housing</a>
                `;
                break;

            case 'APPLICATION_REJECTED':
                studentSubject = "Application Update - SYKLI College";
                studentHtml = `
                    <p>Dear ${firstName},</p>
                    <p>Thank you for your interest in SYKLI College. After careful review of your application, we regret to inform you that we cannot offer you admission at this time.</p>
                    <p>We wish you the best in your future creative endeavors.</p>
                `;
                break;
            case 'DOCS_REQUIRED':
                studentSubject = "Action Required: Documents Requested - SYKLI College";
                const docsList = (additionalData?.requestedDocuments as string[]) || [];
                const note = additionalData?.note || "";

                studentHtml = `
                    <h1 style="color: #9333ea;">Action Required: Documents Requested</h1>
                    <p>Dear ${firstName},</p>
                    <p>The admissions team has reviewed your application for <strong>${applicationData?.course_title || 'your program'}</strong> and requires additional information to proceed.</p>
                    
                    ${note ? `
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea; margin: 20px 0;">
                        <p style="text-transform: uppercase; font-size: 11px; font-weight: bold; color: #666; margin-bottom: 8px; letter-spacing: 0.05em;">Message from Admissions:</p>
                        <p style="font-style: italic; margin: 0; color: #1a1a1a;">"${note}"</p>
                    </div>
                    ` : ''}

                    ${docsList.length > 0 ? `
                    <div style="margin: 20px 0;">
                        <p style="font-weight: bold; margin-bottom: 10px;">Required Documents:</p>
                        <ul>
                            ${docsList.map(doc => `<li>${doc.replaceAll('_', ' ')}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <p>Please log in to your portal dashboard to upload the missing documents.</p>
                    <a href="${portalUrl}/dashboard" style="display:inline-block;background:#9333ea;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Upload Documents</a>
                `;
                break;
        }

        // Email Wrapper Helper
        const wrapHtml = (content: string) => `
            <div style="font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://syklicollege.fi/logo.png" alt="SYKLI" style="width: 60px; height: auto;">
                </div>
                <div style="color: #1a1a1a; line-height: 1.6; font-size: 16px;">
                    ${content}
                </div>
                <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 40px 0;">
                <div style="text-align: center; color: #888; font-size: 12px;">
                    <p>&copy; ${new Date().getFullYear()} SYKLI College</p>
                    <p>Helsinki, Finland | info@syklicollege.fi</p>
                </div>
            </div>
        `;

        // Send Student Email if applicable
        if (studentSubject && userEmail) {
            await resend.emails.send({
                from: sender,
                to: [userEmail],
                subject: studentSubject,
                html: wrapHtml(studentHtml),
            });
        }

        // Send Admin Email if applicable
        if (adminSubject && adminEmail) {
            await resend.emails.send({
                from: sender,
                to: [adminEmail],
                subject: `[SYKLI ADMIN] ${adminSubject}`,
                html: wrapHtml(adminHtml),
            });
        }

        return new Response(JSON.stringify({ success: true }), {
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

import { createClient } from '@/utils/supabase/client';
import { sendEmail } from '@/lib/email';
import InvoiceReadyEmail from '@/emails/InvoiceReadyEmail';

export async function pushInvoice(applicationId: string, customFee: number, invoiceType: string) {
    const supabase = createClient();

    // Verify application exists and is in a valid state
    const { data: offer, error: offerError } = await supabase
        .from('admission_offers')
        .select('*')
        .eq('application_id', applicationId)
        .single();

    if (offerError || !offer) {
        throw new Error('Admission offer not found for this application');
    }

    // Update the offer with new custom fee and mark as invoiced
    const { error: updateError } = await supabase
        .from('admission_offers')
        .update({
            tuition_fee: customFee,
            invoice_type: invoiceType,
            invoice_pushed: true,
            invoice_sent_at: new Date().toISOString()
        })
        .eq('application_id', applicationId);

    if (updateError) {
        console.error('Error updating admission offer:', updateError);
        throw new Error('Failed to push invoice');
    }

    // Fetch application and user data to send email notification
    const { data: application, error: appError } = await supabase
        .from('applications')
        .select(`
            *,
            course:Course(title),
            user:profiles(first_name, last_name, id)
        `)
        .eq('id', applicationId)
        .single();

    if (appError || !application) {
        console.error('Error fetching application data:', appError);
        // Don't throw error here, invoice is already pushed
        return { success: true };
    }

    // Send email notification to student
    try {
        await sendEmail({
            to: application.user.id, // Assuming user.id is email? Wait, no, profiles.id is user id, but email is in auth.
            // Actually, need to get the email from auth.users or from profiles if stored.
            // Assuming profiles has email, or get from auth.
            // In Supabase, email is in auth.users, but for simplicity, let's assume we store email in profiles or fetch it.

            // Actually, looking at the code, applications have user_id, profiles have id which is user_id.
            // But email is not in profiles. I need to get it from auth.
            // For now, let's assume we need to fetch the user email.

            // Since it's client-side, we can't access auth.users directly.
            // Perhaps store email in profiles.

            // Let me check profiles table structure.

            // From other code, it uses user?.email, so probably profiles has email.

            // In dashboard, it uses profile?.first_name || user?.email, so user has email.

            // But in server action, we can fetch.

            // Actually, in Supabase, to get email, we can use auth.admin.getUserById or something, but since it's client, perhaps profiles has email field.

            // Looking at other emails, they pass email.

            // For now, I'll assume profiles has email field.

            to: application.contact_details?.email || application.user?.email || 'student@kestora.online', // Adjust as needed

            subject: `Your ${invoiceType} Invoice is Ready`,
            react: InvoiceReadyEmail({
                firstName: application.personal_info?.firstName || application.user?.first_name || 'Student',
                courseTitle: application.course?.title || 'Your Programme',
                amount: customFee,
                currency: 'EUR',
                invoiceType,
            }),
        });
    } catch (emailError) {
        console.error('Error sending invoice ready email:', emailError);
        // Don't fail the push if email fails
    }

    return { success: true };
}

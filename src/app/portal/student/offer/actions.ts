import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from '@/utils/supabase/admin';

export async function respondToOffer(admissionId: string, decision: 'ACCEPTED' | 'REJECTED') {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 2. Fetch the admission record to verify ownership and current status
    const { data: admission, error: fetchError } = await supabase
        .from('admissions')
        .select('*')
        .eq('id', admissionId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !admission) throw new Error('Offer not found');

    // 3. Prevent multiple responses
    if (admission.offer_status !== 'PENDING') {
        throw new Error('You have already submitted a response to this offer.');
    }

    // 4. Update the record
    const updateData: any = {
        offer_status: decision
    };

    if (decision === 'ACCEPTED') {
        updateData.accepted_at = new Date().toISOString();
    }

    const { error: updateError } = await adminSupabase
        .from('admissions')
        .update(updateData)
        .eq('id', admissionId);

    if (updateError) {
        console.error('Error updating offer response:', updateError);
        throw new Error(`Failed to save your decision: ${updateError.message}`);
    }

    // 5. Trigger next steps / notifications
    if (decision === 'ACCEPTED') {
        await adminSupabase
            .from('applications')
            .update({ status: 'OFFER_ACCEPTED' })
            .eq('user_id', user.id)
            .eq('status', 'ADMITTED');
    } else {
        await adminSupabase
            .from('applications')
            .update({ status: 'OFFER_DECLINED' })
            .eq('user_id', user.id)
            .eq('status', 'ADMITTED');
    }

    return { success: true };
}

export async function acceptApplicationOffer(applicationId: string) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 2. Verify Application Ownership
    const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('id, user_id, status')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !application) throw new Error('Application not found');

    if (application.status !== 'ADMITTED') {
        if (application.status === 'OFFER_ACCEPTED' || application.status === 'ADMISSION_LETTER_GENERATED' || application.status === 'ENROLLED') {
            return { success: true };
        }
        throw new Error('This application is not in a state to accept an offer.');
    }

    // 3. Update Admission Offer Status
    const { error: offerError } = await adminSupabase
        .from('admission_offers')
        .update({
            status: 'ACCEPTED',
            accepted_at: new Date().toISOString()
        })
        .eq('application_id', applicationId);

    if (offerError) {
        console.error('Failed to update offer status:', offerError);
        throw new Error('Failed to update offer status');
    }

    // 4. Update Application Status
    const { error: appError } = await adminSupabase
        .from('applications')
        .update({
            status: 'OFFER_ACCEPTED',
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    if (appError) {
        console.error('Failed to update application status:', appError);
        throw new Error('Failed to update application status');
    }

    // 5. Trigger Admission Letter Generation (Edge Function)
    try {
        const { error: funcError } = await adminSupabase.functions.invoke('generate-admission-letter', {
            body: { applicationId }
        });
        if (funcError) {
            console.error('Edge Function Error:', funcError);
        }
    } catch (err) {
        console.error('Failed to trigger admission letter generation:', err);
    }

    // 6. Try updating legacy admissions table
    try {
        const { data: courseData } = await adminSupabase
            .from('applications')
            .select('course(title)')
            .eq('id', applicationId)
            .single();

        const courseTitle = (courseData?.course as any)?.title;

        if (courseTitle) {
            await adminSupabase
                .from('admissions')
                .update({
                    offer_status: 'ACCEPTED',
                    accepted_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('program', courseTitle);
        }
    } catch (err) {
        console.warn('Legacy admission update failed silently', err);
    }

    return { success: true };
}

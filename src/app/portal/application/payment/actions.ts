'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Initialize Admin Client (Bypass RLS)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in server environment.');
}

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey || ''
);

export async function recordTuitionPayment(
    offerId: string,
    applicationId: string,
    amount: number,
    details: {
        method: string;
        country: string;
        currency: string;
        fxMetadata: any;
    }
) {
    console.log('Server Action: recordTuitionPayment started', { offerId, applicationId, amount });

    if (!serviceRoleKey) {
        return { success: false, error: 'Server misconfiguration: Missing Service Role Key' };
    }

    try {
        const supabase = await createClient();

        // 1. Verify User Session
        console.log('Server Action: Verifying session...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Server Action: Auth error', authError);
            throw new Error('Unauthorized: No valid session');
        }
        console.log('Server Action: Session verified for user', user.id);

        const reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // 2. Insert Payment Record (Admin Bypass)
        console.log('Server Action: Inserting payment...');
        const { error: paymentError } = await adminSupabase
            .from('tuition_payments')
            .insert({
                offer_id: offerId,
                amount: amount,
                status: 'COMPLETED',
                payment_method: details.method,
                transaction_reference: reference,
                country: details.country,
                currency: details.currency,
                fx_metadata: details.fxMetadata
            });

        if (paymentError) {
            console.error('Server Action: Payment insert failed', paymentError);
            throw new Error(`DB Insert Failed: ${paymentError.message}`);
        }
        console.log('Server Action: Payment inserted successfully');

        // 3. Update Application Status (Admin Bypass)
        console.log('Server Action: Updating application status...');
        const { error: appError } = await adminSupabase
            .from('applications')
            .update({
                status: 'PAYMENT_SUBMITTED',
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (appError) {
            console.error('Server Action: App update failed', appError);
            throw new Error(`App Update Failed: ${appError.message}`);
        }
        console.log('Server Action: Application updated');

        // 4. Update Offer Status
        console.log('Server Action: Updating offer status...');
        await adminSupabase
            .from('admission_offers')
            .update({ status: 'ACCEPTED' }) // Ensure it's marked accepted if paying
            .eq('id', offerId);

        console.log('Server Action: Success');
        return { success: true };

    } catch (error: any) {
        console.error('Payment Action Error (Caught):', error);
        return { success: false, error: error.message };
    }
}

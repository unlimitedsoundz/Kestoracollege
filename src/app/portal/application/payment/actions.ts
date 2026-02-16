import { createClient } from '@/utils/supabase/client';

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
    console.log('recordTuitionPayment started', { offerId, applicationId, amount });

    try {
        const supabase = createClient();

        // 1. Verify User Session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Auth error', authError);
            throw new Error('Unauthorized: No valid session');
        }

        const reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // 2. Insert Payment Record
        const { error: paymentError } = await supabase
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
            console.error('Payment insert failed', paymentError);
            throw new Error(`DB Insert Failed: ${paymentError.message}`);
        }

        // 3. Update Application Status
        const { error: appError } = await supabase
            .from('applications')
            .update({
                status: 'PAYMENT_SUBMITTED',
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (appError) {
            console.error('App update failed', appError);
            throw new Error(`App Update Failed: ${appError.message}`);
        }

        // 4. Update Offer Status
        await supabase
            .from('admission_offers')
            .update({ status: 'ACCEPTED' })
            .eq('id', offerId);

        return { success: true };

    } catch (error: any) {
        console.error('Payment Action Error:', error);
        return { success: false, error: error.message };
    }
}

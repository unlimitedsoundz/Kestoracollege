import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 1. Get User
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        const { offerId, applicationId, amount, details } = await req.json();

        console.log('Processing payment for User:', user.id, 'Offer:', offerId);

        const reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // 2. Insert Payment Record
        const { error: paymentError } = await adminClient
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

        if (paymentError) throw paymentError;

        // 3. AUTO-ENROLL
        const { data: application, error: appError } = await adminClient
            .from('applications')
            .select(`*, user:profiles!user_id(*), course:Course(*)`)
            .eq('id', applicationId)
            .single();

        if (!appError && application) {
            const currentYear = new Date().getFullYear();
            const studentId = `SYK-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
            const appUser = application.user;
            const institutionalEmail = `${appUser.first_name.toLowerCase()}.${appUser.last_name.toLowerCase()}@syklicollege.fi`;

            // Create Student Record
            const { error: studentError } = await adminClient
                .from('students')
                .upsert({
                    user_id: appUser.id,
                    student_id: studentId,
                    application_id: application.id,
                    program_id: application.course_id,
                    institutional_email: institutionalEmail,
                    personal_email: appUser.email,
                    enrollment_status: 'ACTIVE',
                    start_date: new Date().toISOString(),
                    expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString()
                }, { onConflict: 'application_id' });

            if (!studentError) {
                // Update Application Status
                await adminClient.from('applications').update({ status: 'ENROLLED' }).eq('id', applicationId);
                // Update User Profile Role
                await adminClient.from('profiles').update({ role: 'STUDENT', student_id: studentId }).eq('id', appUser.id);
            }
        }

        // 4. Update Offer Status
        await adminClient
            .from('admission_offers')
            .update({ status: 'PAID' })
            .eq('id', offerId);

        // 5. Update Offer Document URL (Admission Letter)
        const admissionLetterUrl = `https://syklicollege.fi/portal/application/admission-letter?id=${applicationId}`;
        await adminClient
            .from('admission_offers')
            .update({ document_url: admissionLetterUrl })
            .eq('id', offerId);

        // 6. Trigger Notification
        try {
            await supabaseClient.functions.invoke('send-notification', {
                body: {
                    applicationId,
                    type: 'ADMISSION_LETTER_READY',
                    documentUrl: admissionLetterUrl
                }
            });
        } catch (e) {
            console.error('Notification failed', e);
        }

        return new Response(JSON.stringify({ success: true, reference }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

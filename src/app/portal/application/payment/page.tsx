'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import PaymentView from './PaymentView';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        application: any;
        offer: any;
    } | null>(null);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchPaymentData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserEmail = sbUser?.email;
                let currentUserId = sbUser?.id;

                // 2. Secondary Auth Check (LocalStorage Fallback)
                if (!sbUser) {
                    const savedUser = localStorage.getItem('Kestora_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserEmail = localProfile.email;
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserEmail) {
                    router.push('/portal/account/login');
                    return;
                }

                // 3. Fetch Application and Offer
                const { data: applicationRaw, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        offer:admission_offers(*),
                        course:Course(duration)
                    `)
                    .eq('id', id)
                    .eq('user_id', currentUserId || '')
                    .single();

                if (appError || !applicationRaw || (!applicationRaw.offer && (!Array.isArray(applicationRaw.offer) || applicationRaw.offer.length === 0))) {
                    console.error('Application or offer not found', appError);
                    router.push('/portal/dashboard');
                    return;
                }

                const application = applicationRaw;
                // Handle both 1:1 (object) and 1:N (array) returns from Supabase
                const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;

                if (!offer) {
                    console.error('Offer object is null or empty');
                    router.push('/portal/dashboard');
                    return;
                }

                // Security Check: Only allow if OFFER_ACCEPTED, ADMISSION_LETTER_GENERATED, or if already ENROLLED (to view receipt)
                if (application.status === 'ADMITTED') {
                    router.push(`/portal/application/letter?id=${id}`);
                    return;
                }

                setData({ application, offer });
            } catch (err) {
                console.error('CRITICAL: Fetching payment data failed', err);
                router.push('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id, router, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Securing Payment Gateway...</p>
                </div>
            </div>
        );
    }

    if (!data || !id) return null;

    return (
        <PaymentView
            params={{ id }}
            application={data.application}
            admissionOffer={data.offer}
        />
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Securing Payment Gateway... (Suspense)</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}

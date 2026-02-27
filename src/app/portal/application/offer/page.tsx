'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import {
    CaretLeft as ChevronLeft,
    CheckCircle as CheckCircle2,
    XCircle,
    Calendar,
    CurrencyEur as Euro,
    FileText,
    ShieldCheck,
    CaretRight as ArrowRight,
    CreditCard,
    Lightning as Zap,
    DownloadSimple as Download
} from "@phosphor-icons/react/dist/ssr";
import { calculateDiscountedFee, EARLY_PAYMENT_DISCOUNT_PERCENT, EARLY_PAYMENT_WINDOW_DAYS, isWithinEarlyPaymentWindow } from '@/utils/tuition';
import { formatToDDMMYYYY } from '@/utils/date';

function OfferContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        application: any;
        offer: any;
    } | null>(null);
    const [isResponding, setIsResponding] = useState(false);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchOfferData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data: application, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*),
                        offer:admission_offers(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;

                if (appError || !application || !offer) {
                    console.error('Application or offer not found', appError);
                    router.push('/portal/dashboard');
                    return;
                }

                setData({ application, offer });
            } catch (err) {
                console.error('Error fetching offer data', err);
                router.push('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchOfferData();
    }, [id, router, supabase]);

    const handleResponse = async (action: 'ACCEPT' | 'DECLINE') => {
        if (!data || !id) return;

        const confirmed = window.confirm(
            action === 'ACCEPT'
                ? "Are you sure you want to accept this admission offer?"
                : "Are you sure you want to decline this admission offer? This action cannot be undone."
        );

        if (!confirmed) return;

        setIsResponding(true);
        try {
            const status = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
            const appStatus = action === 'ACCEPT' ? 'OFFER_ACCEPTED' : 'OFFER_DECLINED';

            // 1. Update the offer status
            const { error: offerError } = await supabase
                .from('admission_offers')
                .update({ status })
                .eq('id', data.offer.id);

            if (offerError) throw offerError;

            // 2. Update the application status
            const { error: appError } = await supabase
                .from('applications')
                .update({
                    status: appStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (appError) throw appError;

            if (action === 'ACCEPT') {
                router.push(`/portal/application/payment?id=${id}`);
            } else {
                router.push('/portal/dashboard');
            }
        } catch (err) {
            console.error('Failed to respond to offer', err);
            alert('Failed to respond to offer. Please try again.');
        } finally {
            setIsResponding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data || !id) return null;

    const { application, offer } = data;
    const isEarly = isWithinEarlyPaymentWindow(offer.created_at);
    const baseFee = offer.tuition_fee;
    const finalFee = isEarly ? calculateDiscountedFee(baseFee) : baseFee;

    return (
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-20">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/portal/dashboard" className="p-1 hover:bg-neutral-50 rounded transition-colors">
                        <ChevronLeft size={16} weight="bold" className="text-black" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold uppercase tracking-tight text-primary">Admission Offer</h1>
                        <p className="text-black text-sm font-medium uppercase tracking-widest">Official Enrollment Invitation</p>
                    </div>
                </div>
                {(offer.status === 'ACCEPTED' || (offer.status === 'PENDING' && application.status === 'ADMITTED')) && application.status !== 'ENROLLED' && (
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href={`/portal/application/letter?id=${id}`}
                            className="bg-white text-neutral-600 border border-neutral-200 rounded-sm px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Download size={14} weight="bold" />
                            Download Letter
                        </Link>
                        <Link
                            href={`/portal/application/payment?id=${id}`}
                            className="bg-[#00A651] text-white rounded-sm px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#008c44] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/10 group"
                        >
                            <CreditCard size={14} weight="bold" />
                            Pay Tuition
                            <ArrowRight size={12} weight="bold" className="group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8 md:space-y-12">
                    <section className="p-8 rounded-sm border border-primary">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-primary leading-none mb-3">Admission Granted</h2>
                        <p className="text-black font-semibold text-sm leading-relaxed max-w-lg uppercase tracking-tight">
                            Invitation for enrollment into the <span className="text-primary">{application.course?.title}</span> program
                            {application.course?.programType && <span className="text-primary capitalize"> ({application.course.programType})</span>}.
                            {application.course?.duration && (
                                <span className="text-black block mt-1 font-medium lowercase text-sm">Duration: {application.course.duration}</span>
                            )}
                        </p>
                    </section>

                    <div className="space-y-8 md:space-y-10">
                        <section className="space-y-6">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-black pb-2 border-b border-neutral-100 mb-6">Program Details</h3>
                            <div className="p-8 rounded-sm border border-neutral-100 space-y-8">
                                <div>
                                    <h2 className="text-sm font-semibold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <CheckCircle2 size={16} weight="bold" className="text-primary" />
                                        Admission Granted
                                    </h2>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-neutral-900 leading-tight">
                                            {application.course?.title}
                                            <div className="flex gap-2 mt-1">
                                                {application.course?.programType && (
                                                    <span className="text-primary font-bold lowercase text-sm">{application.course.programType}</span>
                                                )}
                                                {application.course?.duration && (
                                                    <span className="text-black font-medium lowercase text-sm">— {application.course.duration}</span>
                                                )}
                                            </div>
                                        </h3>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-neutral-100">
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-black uppercase tracking-[0.2em]">Financial Obligation</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-black uppercase tracking-widest leading-none">Tuition Fee</p>
                                                <p className="text-2xl font-bold text-primary">€{offer.tuition_fee}</p>
                                                <p className="text-sm font-medium text-black lowercase tracking-tight">Per academic year</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-black uppercase tracking-widest leading-none">Response Deadline</p>
                                                <p className="text-2xl font-bold text-primary">{formatToDDMMYYYY(offer.payment_deadline)}</p>
                                                <p className="text-sm font-medium text-black lowercase tracking-tight">Required for session reservation</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-primary p-6 md:p-12 rounded-sm text-primary relative overflow-hidden">
                                <div className="relative z-10 space-y-3">
                                    <h4 className="text-sm font-bold uppercase tracking-widest leading-none">Incentive Plan</h4>
                                    <p className="text-black text-sm font-medium leading-relaxed uppercase tracking-tight">
                                        Complete payment within {EARLY_PAYMENT_WINDOW_DAYS} days of accepting your offer to receive a {EARLY_PAYMENT_DISCOUNT_PERCENT}% early enrollment credit.
                                    </p>
                                    <div className="pt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-primary">€{calculateDiscountedFee(offer.tuition_fee)}</span>
                                        <span className="text-sm font-semibold text-black uppercase tracking-widest">Discounted Rate</span>
                                    </div>
                                </div>
                                <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-primary opacity-5 -rotate-12" weight="bold" />
                            </div>
                        </section>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-8 space-y-6">
                        {offer.status === 'PENDING' ? (
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold uppercase tracking-widest text-black">Your Decision</h4>
                                    <p className="text-primary text-sm font-bold uppercase tracking-tight">Action Required</p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleResponse('ACCEPT')}
                                        disabled={isResponding}
                                        className="w-full border border-primary text-primary rounded-sm py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isResponding ? 'Processing...' : 'Confirm Acceptance'}
                                    </button>
                                    <button
                                        onClick={() => handleResponse('DECLINE')}
                                        disabled={isResponding}
                                        className="w-full text-black py-3 text-sm font-semibold uppercase tracking-widest hover:text-red-500 transition-all hover:bg-neutral-50 rounded-sm disabled:opacity-50"
                                    >
                                        Decline Position
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-widest text-black leading-none mb-1">Status</h4>
                                    <p className="text-primary text-lg font-bold uppercase tracking-tight">
                                        Offer {offer.status}
                                    </p>
                                    <p className="text-black text-sm font-medium mt-2 uppercase tracking-tight leading-relaxed mb-6">
                                        {offer.status === 'ACCEPTED'
                                            ? (application.status === 'ENROLLED'
                                                ? 'Your enrollment is confirmed and your student account is active.'
                                                : 'Finalize enrollment by completing the tuition payment below.')
                                            : 'This admission offer has been declined.'}
                                    </p>
                                </div>
                                {(offer.status === 'ACCEPTED' || (offer.status === 'PENDING' && application.status === 'ADMITTED')) && application.status !== 'ENROLLED' && (
                                    <div className="space-y-4">
                                        <Link
                                            href={`/portal/application/letter?id=${id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-white text-neutral-600 border border-neutral-200 px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-sm"
                                        >
                                            <Download size={16} weight="bold" />
                                            Download Formal Letter
                                        </Link>
                                        <Link
                                            href={`/portal/application/payment?id=${id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm"
                                        >
                                            <CreditCard size={16} weight="bold" />
                                            Pay Tuition
                                        </Link>
                                    </div>
                                )}
                                <Link href="/portal/dashboard" className="inline-block pt-2 text-sm font-semibold uppercase tracking-widest text-primary hover:underline transition-all">
                                    Return to Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OfferPage() {
    return (
        <Suspense fallback={<div>Loading Offer...</div>}>
            <OfferContent />
        </Suspense>
    );
}

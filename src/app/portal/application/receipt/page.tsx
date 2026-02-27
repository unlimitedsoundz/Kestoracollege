'use client';

import { createClient } from '@/utils/supabase/client';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import PrintButton from '@/components/portal/PrintButton';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';

function ReceiptContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [admission, setAdmission] = useState<any>(null);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchData = async () => {
            const supabase = createClient();
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data: applicationRaw, error } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*),
                        offer:admission_offers(*, payments:tuition_payments(*))
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (error || !applicationRaw) {
                    setData(null);
                    setLoading(false);
                    return;
                }

                const application = applicationRaw;
                const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;

                // Fallback: if the join didn't return payments, fetch them directly
                if (offer && (!offer.payments || offer.payments.length === 0)) {
                    const { data: paymentsData } = await supabase
                        .from('tuition_payments')
                        .select('*')
                        .eq('offer_id', offer.id)
                        .order('created_at', { ascending: false });

                    if (paymentsData && paymentsData.length > 0) {
                        offer.payments = paymentsData;
                    }
                }

                setData(applicationRaw);

                // Fetch admission details for intake info
                const { data: admissionData } = await supabase
                    .from('admissions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('program', applicationRaw.course?.title)
                    .maybeSingle();

                if (admissionData) setAdmission(admissionData);

            } catch (e) {
                console.error('Error fetching receipt data:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Loading Receipt...</p>
                </div>
            </div>
        );
    }

    if (!data) return notFound();

    const application = data;
    // Safely extract offer (handles both object and single-item array)
    const offer = Array.isArray(application?.offer)
        ? application.offer[0]
        : application?.offer;

    // Safely extract payment
    const payment = offer?.payments?.[0];

    if (!payment || (application.status !== 'ENROLLED' && application.status !== 'PAYMENT_SUBMITTED')) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Receipt Not Available</p>
                <p className="text-sm text-neutral-500 max-w-md text-center">Your payment receipt is not available yet. This may be because the payment is still being processed.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">Retry</button>
                    <Link href="/portal/dashboard" className="px-6 py-2 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest rounded-sm">Dashboard</Link>
                </div>
            </div>
        );
    }


    // Locks the receipt page if passing through verification
    if (application.status === 'PAYMENT_SUBMITTED') {
        return (
            <div className="flex items-center justify-center min-h-[60vh] font-rubik px-4">
                <div className="max-w-md w-full bg-white border border-neutral-200 p-8 rounded-sm text-center shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                        <Suspense><div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div></Suspense>
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-neutral-900 mb-2">Payment Under Review</h2>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-8">
                        Your transaction has been recorded (Ref: <span className="font-mono text-black">{payment?.transaction_reference || 'N/A'}</span>).<br />
                        The official receipt will be available here once our finance team confirms the funds.
                    </p>
                    <Link
                        href="/portal/dashboard"
                        className="block w-full bg-black text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all border border-black"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate years paid
    const yearsPaid = Math.max(1, Math.round((payment?.amount || 0) / (offer?.tuition_fee || 1)));
    const intake = admission?.intake || 'Autumn 2026';
    const academicYear = admission?.academic_year || '2026/2027';
    const isPending = application.status === 'PAYMENT_SUBMITTED';

    const formatPaymentMethod = (methodId: string | undefined) => {
        if (!methodId) return 'N/A';
        const methods: Record<string, string> = {
            'upi': 'UPI',
            'in_bank': 'Net Banking',
            'sepa': 'SEPA Transfer',
            'nordea': 'Nordea Online',
            'ng_bank': 'Bank Transfer',
            'flutterwave_uae': 'Flutterwave',
            'ach': 'ACH Direct Debit',
            'wire': 'International Wire',
            'credit_card': 'Credit / Debit Card',
            'paygowire': 'Paygowire' // fallback
        };
        const name = methods[methodId.toLowerCase()] || methodId.replace(/_/g, ' ');
        return `Paygowire - ${name}`;
    };

    return (
        <div className="min-h-screen bg-neutral-100/50 py-6 md:py-12 px-4 sm:px-6 font-rubik">
            {/* Control Bar (Hidden on Print) */}
            <div className="max-w-[210mm] mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-black transition-colors"
                >
                    <ChevronLeft size={14} weight="bold" />
                    Back to Dashboard
                </Link>
                <PrintButton />
            </div>

            {/* Document Container */}
            <div className="w-full max-w-[210mm] mx-auto bg-white print:shadow-none p-6 md:p-8 print:border-0 relative overflow-hidden">

                {isPending && (
                    <div className="absolute top-12 right-12 opacity-10 pointer-events-none z-0 border-[8px] border-black p-4 rotate-[-15deg]">
                        <span className="text-6xl font-black uppercase tracking-widest text-black">PENDING</span>
                    </div>
                )}

                {/* Header Header */}
                <div className="flex flex-col sm:flex-row print-header-row justify-between items-start mb-8 gap-4 relative z-10 border-b-2 border-black pb-6 p-1">
                    <div className="space-y-4">
                        <div className="relative w-40 h-10">
                            <Image
                                src="/logo-kestora.png"
                                alt="Kestora College"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-[12px] font-black uppercase tracking-[0.05em] text-black">Kestora College</div>
                            <div className="text-[9px] text-black font-medium leading-relaxed max-w-[200px]">
                                Kestora College – Helsinki Campus, Pohjoisesplanadi 51, 00150 Helsinki, Finland<br />
                                financial.services@kestora.fi
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end print-right mt-4 sm:mt-0">
                        <div className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-1">Receipt</div>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-black">Transaction ID</span>
                            <span className="text-xs font-mono font-bold text-black border-r-4 border-black pr-3">{payment?.transaction_reference || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 relative z-10">
                    <div className="md:col-span-7 space-y-6">
                        <div>
                            <div className="text-[9px] font-black text-black uppercase tracking-widest mb-2 border-b border-black pb-0.5">Received From (Payer)</div>
                            <div className="space-y-0.5">
                                <div className="text-lg font-black text-black uppercase tracking-tight">
                                    {application.personal_info?.firstName} {application.personal_info?.lastName}
                                </div>
                                <div className="text-sm text-black font-medium">
                                    {application.contact_details?.addressLine1 || application.contact_details?.address}<br />
                                    {application.contact_details?.city}, {application.contact_details?.country}
                                </div>
                                <div className="text-[10px] font-bold text-black border border-black inline-block px-2 py-0.5 mt-2">
                                    PASSPORT No: {application.personal_info?.passportNumber || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black text-black uppercase tracking-widest mb-3 border-b border-black pb-1">Payment Method & Status</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase mb-0.5">Method</div>
                                    <div className="text-xs font-bold text-black uppercase">{formatPaymentMethod(payment.payment_method)}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase mb-0.5">Status</div>
                                    {isPending ? (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 uppercase">
                                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                                            Pending Verification
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase">
                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                            Verified & Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-5">
                        <div className="bg-white p-4 space-y-4">
                            <div className="flex flex-col gap-0.5 pr-4">
                                <span className="text-[8px] font-bold text-black uppercase">Amount Paid (EUR)</span>
                                <span className="text-2xl font-black text-black leading-none">€ {payment?.amount?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-black">
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                    <span className="text-black uppercase tracking-wider">Date Received</span>
                                    <span className="text-black">{formatToDDMMYYYY(payment?.created_at)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                    <span className="text-black uppercase tracking-wider">Currency</span>
                                    <span className="text-black">{offer.currency || 'EUR'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Table */}
                <div className="relative z-10 mb-8">
                    <div className="text-[10px] font-black text-black uppercase tracking-widest mb-3 border-b border-black pb-1">Payment Breakdown</div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-[9px] font-black uppercase tracking-widest text-black border-b-2 border-black">
                                <th className="text-left py-2 px-2">Description</th>
                                <th className="text-center py-2 px-2">Duration</th>
                                <th className="text-right py-2 px-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                            <tr>
                                <td className="py-4 px-2">
                                    <div className="font-bold text-black uppercase tracking-tight">Tuition Fees - {application.course?.title}</div>
                                    <div className="text-[10px] text-black mt-0.5">
                                        Intake: {intake} | Academic Year {academicYear}
                                    </div>
                                </td>
                                <td className="py-4 px-2 text-center align-top">
                                    <div className="text-xs font-bold text-black">{yearsPaid} {yearsPaid === 1 ? 'Year' : 'Years'}</div>
                                </td>
                                <td className="py-4 px-2 text-right align-top whitespace-nowrap">
                                    <div className="font-bold text-black text-sm md:text-base">€ {payment.amount.toLocaleString()}</div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-black">
                                <td colSpan={2} className="py-4 px-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-right">Total Net Paid</td>
                                <td className="py-4 px-2 text-right text-base md:text-xl font-black text-black whitespace-nowrap">€ {payment?.amount?.toLocaleString() || '0'}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="relative z-10 mt-auto pt-8">
                    <p className="text-[8px] text-black uppercase tracking-widest leading-relaxed text-center font-medium">
                        This document serves as an official proof of payment for the specified student and program. It is electronically generated and verified through the Kestora SIS Gateway.
                    </p>
                </div>

            </div>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 15mm; size: A4; }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    header, nav, footer,
                    [data-theme="portal"] > header,
                    [data-theme="portal"] > footer,
                    .print\\:hidden { display: none !important; }
                    [data-theme="portal"] { min-height: 0 !important; }
                    [data-theme="portal"] > main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
                    .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
                    .min-h-\\[297mm\\] { min-height: 0 !important; }
                    .max-w-\\[210mm\\] { max-width: 100% !important; margin: 0 !important; padding: 15mm 0 !important; }
                    .shadow-xl, .shadow-sm, .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-0 { border: none !important; }
                    .print-header-row { display: flex !important; flex-direction: row !important; justify-content: space-between !important; }
                    .print-right { text-align: right !important; align-items: flex-end !important; }
                    * { color: black !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    a { text-decoration: none !important; }
                }
            ` }} />
        </div>
    );
}

export default function TuitionReceiptPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Loading Receipt...</p>
                </div>
            </div>
        }>
            <ReceiptContent />
        </Suspense>
    );
}

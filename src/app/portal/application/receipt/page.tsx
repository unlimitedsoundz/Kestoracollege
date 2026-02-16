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

                if (error || !applicationRaw || !applicationRaw.offer?.[0]) {
                    setData(null);
                    return;
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
    const offer = application.offer[0];
    const payment = offer.payments?.[0]; // Assuming single payment for now

    if (!payment) {
        router.push(`/portal/application/payment?id=${id}`);
        return null;
    }

    // Calculate years paid
    const yearsPaid = Math.max(1, Math.round(payment.amount / offer.tuition_fee));
    const intake = admission?.intake || 'Autumn 2026';
    const academicYear = admission?.academic_year || '2026/2027';

    return (
        <div className="min-h-screen bg-neutral-100/50 py-6 md:py-12 px-4 sm:px-6 font-rubik">
            {/* Control Bar (Hidden on Print) */}
            <div className="max-w-[210mm] mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                >
                    <ChevronLeft size={14} weight="bold" />
                    Back to Dashboard
                </Link>
                <PrintButton />
            </div>

            {/* Document Container */}
            <div className="w-full max-w-[210mm] mx-auto bg-white print:shadow-none p-6 md:p-8 border border-neutral-200 print:border-0 relative overflow-hidden">

                {/* Header Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6 relative z-10 border-b-2 border-black pb-6">
                    <div className="space-y-4">
                        <div className="relative w-40 h-10">
                            <Image
                                src="/images/sykli-logo-official.png"
                                alt="Sykli College"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-[12px] font-black uppercase tracking-[0.05em] text-black">SYKLI College</div>
                            <div className="text-[9px] text-neutral-500 font-medium leading-relaxed max-w-[200px]">
                                Pohjoisesplanadi 51, 00150 Helsinki, Finland<br />
                                financial.services@syklicollege.fi
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-1">Receipt</div>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Transaction ID</span>
                            <span className="text-xs font-mono font-bold text-black border-r-4 border-black pr-3">{payment.transaction_reference}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 relative z-10">
                    <div className="md:col-span-7 space-y-6">
                        <div>
                            <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-100 pb-0.5">Received From (Payer)</div>
                            <div className="space-y-0.5">
                                <div className="text-lg font-black text-black uppercase tracking-tight">
                                    {application.personal_info?.firstName} {application.personal_info?.lastName}
                                </div>
                                <div className="text-sm text-neutral-600 font-medium">
                                    {application.contact_details?.addressLine1 || application.contact_details?.address}<br />
                                    {application.contact_details?.city}, {application.contact_details?.country}
                                </div>
                                <div className="text-[10px] font-bold text-black border border-black inline-block px-2 py-0.5 mt-2">
                                    PASSPORT No: {application.personal_info?.passportNumber || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3 border-b border-neutral-100 pb-1">Payment Method & Status</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Method</div>
                                    <div className="text-xs font-bold text-black uppercase">{payment.payment_method?.replace(/_/g, ' ')}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Status</div>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase">
                                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                        Verified & Completed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-5">
                        <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-sm space-y-4">
                            <div className="flex flex-col gap-0.5 pr-4">
                                <span className="text-[8px] font-bold text-neutral-400 uppercase">Amount Paid (EUR)</span>
                                <span className="text-2xl font-black text-black leading-none">€ {payment.amount.toLocaleString()}</span>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-neutral-200">
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                    <span className="text-neutral-500 uppercase tracking-wider">Date Received</span>
                                    <span className="text-black">{formatToDDMMYYYY(payment.created_at)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                    <span className="text-neutral-500 uppercase tracking-wider">Currency</span>
                                    <span className="text-black">{offer.currency || 'EUR'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Table */}
                <div className="relative z-10 mb-8">
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3 border-b border-neutral-100 pb-1">Payment Breakdown</div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-[9px] font-black uppercase tracking-widest text-black border-b-2 border-black">
                                <th className="text-left py-2 px-2">Description</th>
                                <th className="text-center py-2 px-2">Duration</th>
                                <th className="text-right py-2 px-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            <tr>
                                <td className="py-4 px-2">
                                    <div className="font-bold text-black uppercase tracking-tight">Tuition Fees - {application.course?.title}</div>
                                    <div className="text-[10px] text-neutral-500 mt-0.5">
                                        Intake: {intake} | Academic Year {academicYear}
                                    </div>
                                </td>
                                <td className="py-4 px-2 text-center align-top">
                                    <div className="text-xs font-bold text-black">{yearsPaid} {yearsPaid === 1 ? 'Year' : 'Years'}</div>
                                </td>
                                <td className="py-4 px-2 text-right align-top">
                                    <div className="font-bold text-black">€ {payment.amount.toLocaleString()}</div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-black">
                                <td colSpan={2} className="py-4 px-2 text-[9px] font-black uppercase tracking-widest text-right">Total Net Paid</td>
                                <td className="py-4 px-2 text-right text-lg font-black text-black">€ {payment.amount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="relative z-10 mt-auto pt-8">
                    <p className="text-[8px] text-black uppercase tracking-widest leading-relaxed text-center font-medium">
                        This document serves as an official proof of payment for the specified student and program. It is electronically generated and verified through the Sykli SIS Gateway.
                    </p>
                </div>

                <div className="absolute bottom-[20mm] left-0 right-0 text-center px-8">
                    <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-black border-t border-neutral-100 pt-8">
                        SYKLI COLLEGE OF ART AND DESIGN | EDUCATION FOR THE FUTURE
                    </div>
                </div>
            </div>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; }
                    body { background: white; padding: 0; }
                    .min-h-screen { min-height: 0; background: white; padding: 0; }
                    .max-w-[210mm] { max-width: 100%; margin: 0; padding: 0; }
                    .shadow-xl { box-shadow: none !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:border-0 { border: none !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
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

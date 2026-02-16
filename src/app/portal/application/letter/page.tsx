'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Application } from '@/types/database';
import Link from 'next/link';
import { CaretLeft as ChevronLeft, CheckCircle, WarningCircle as AlertCircle } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import PrintButton from '@/components/portal/PrintButton';
import RejectOfferButton from './RejectOfferButton';
import Image from 'next/image';
import { getTuitionFee, calculateDiscountedFee, mapSchoolToTuitionField } from '@/utils/tuition';

interface EnrichedApplication extends Application {
    offer?: any[];
    admission_details?: any;
}

function AdmissionLetterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState<EnrichedApplication | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchLetterData = async () => {
            if (!id) {
                router.push('/portal/dashboard');
                return;
            }

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
                        course:Course(*, school:School(*)),
                        user:profiles(*),
                        offer:admission_offers(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (error || !applicationRaw) {
                    console.error('Letter data not found', error);
                    router.push('/portal/dashboard');
                    return;
                }

                // Fetch Admission Details
                const { data: admissionData } = await supabase
                    .from('admissions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('program', applicationRaw.course?.title)
                    .maybeSingle();

                setData({ ...applicationRaw, admission_details: admissionData });
            } catch (err) {
                console.error('CRITICAL: Fetching letter data failed', err);
                router.push('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLetterData();
    }, [id, router, supabase]);

    const handleAcceptOffer = async () => {
        if (!id || !data) return;

        const confirmed = window.confirm(
            'Are you sure you want to accept this offer? This will finalize your admission process and proceed to tuition payment.'
        );

        if (!confirmed) return;

        setIsSaving(true);
        try {
            // Use Server Action to bypass RLS and ensure atomic updates
            const { acceptApplicationOffer } = await import('@/app/portal/student/offer/actions');
            await acceptApplicationOffer(id);

            alert('Offer accepted successfully! Proceeding to tuition payment.');
            router.push(`/portal/application/payment?id=${id}`);
        } catch (err: any) {
            console.error('Error accepting offer:', err);
            alert(err.message || 'Failed to accept offer. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data || !id) return null;

    const application = data;

    // Determine Fees (Fallback to defaults if missing in DB)
    let displayOffer = data.offer?.[0] || {};
    let tuitionFee = displayOffer.tuition_fee;
    let discountAmount = displayOffer.discount_amount || 0;

    if (!tuitionFee && application.course) {
        const field = mapSchoolToTuitionField(application.course.school?.slug || 'technology');
        const baseFee = getTuitionFee(application.course.degreeLevel, field);
        tuitionFee = baseFee;
        discountAmount = baseFee - calculateDiscountedFee(baseFee);
        displayOffer = { ...displayOffer, tuition_fee: tuitionFee, discount_amount: discountAmount };
    }

    const today = new Date();
    const showAcceptButton = application.status === 'ADMITTED';

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
            {/* Control Bar (Hidden on Print) */}
            <div className="max-w-[210mm] mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors"
                >
                    <ChevronLeft size={14} weight="bold" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    {application.admission_details?.offer_letter_url && (
                        <a
                            href={application.admission_details.offer_letter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm"
                        >
                            Download PDF
                        </a>
                    )}
                    {showAcceptButton && (
                        <button
                            onClick={handleAcceptOffer}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CheckCircle size={16} weight="bold" />
                            )}
                            Accept Offer
                        </button>
                    )}
                    {showAcceptButton && (
                        <RejectOfferButton applicationId={id} />
                    )}
                    <PrintButton />
                </div>
            </div>

            {/* Letter Container */}
            <div className="w-full max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none min-h-[297mm] p-6 md:p-[25mm] relative overflow-hidden text-neutral-900 border border-neutral-100 print:border-0">
                {/* ... existing letter content ... */}
                {/* 1. Header: Logo & Address */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0 mb-12 md:mb-16 border-b-2 border-neutral-900 pb-8">
                    <div>
                        <div className="mb-4 relative w-48 h-12">
                            <Image
                                src="/images/sykli-logo-official.png"
                                alt="Sykli College Official Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                                priority
                            />
                        </div>
                    </div>
                    <div className="text-left md:text-right text-[10px] font-medium text-neutral-600 leading-relaxed uppercase tracking-wide">
                        <strong className="text-black">SYKLI College</strong><br />
                        Pohjoisesplanadi 51<br />
                        00150 Helsinki, Finland<br />
                        Website: <a href="https://syklicollege.fi" className="underline">https://syklicollege.fi</a><br />
                        Email: admissions@syklicollege.fi
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-black">Official Letter of Offer</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-neutral-50 p-6 mb-12">
                    <div>
                        <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date Issued</span>
                        <span className="font-bold text-xs">{formatToDDMMYYYY(today.toISOString())}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Offer Reference</span>
                        <span className="font-bold text-xs font-mono">{application.admission_details?.offer_reference || 'PENDING'}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Application ID</span>
                        <span className="font-bold text-xs font-mono">{application.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                {/* 2. Applicant Info */}
                <div className="mb-10">
                    <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-4 border-b border-neutral-200 pb-1">Applicant & Programme Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Full Name (Passport Match)</div>
                            <div className="text-sm font-bold text-neutral-900">{application.personal_info?.firstName} {application.personal_info?.lastName}</div>
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Intake & Year</div>
                            <div className="text-sm font-bold text-neutral-900">Autumn Semester 2026</div>
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Intended Programme</div>
                            <div className="text-sm font-bold text-neutral-900">{application.course?.title}</div>
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Degree Level</div>
                            <div className="text-sm font-bold text-neutral-900">{application.course?.degreeLevel === 'MASTER' ? "Master's Degree" : "Bachelor's Degree"}</div>
                        </div>
                    </div>
                </div>

                {/* 3. Offer Statement (LOCKED WORDING) */}
                <div className="bg-black text-white p-8 mb-10 text-center rounded-sm">
                    <p className="text-sm italic font-medium leading-relaxed">
                        “We are pleased to inform you that you have been offered a place in the above-named programme at SYKLI College, subject to the conditions outlined in this letter.”
                    </p>
                </div>

                {/* 4. Conditions */}
                <div className="mb-10 text-sm leading-relaxed text-neutral-800">
                    <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-3 border-b border-neutral-200 pb-1">Conditions of Offer</h4>
                    <p className="mb-3">This offer is conditional upon acceptance and fulfillment of all stated requirements:</p>
                    <ul className="list-disc ml-5 space-y-1 mb-4">
                        <li>Formal acceptance of this offer via the student portal.</li>
                        <li>Payment of required tuition fees by the specified deadline.</li>
                        <li>Submission of any outstanding original documents (if applicable).</li>
                    </ul>
                    <p className="text-xs italic text-neutral-500 font-medium">
                        “This offer is conditional upon acceptance and fulfillment of all stated requirements.”
                    </p>
                </div>

                {/* 5. Tuition & Financial Information */}
                <div className="mb-10">
                    <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-4 border-b border-neutral-200 pb-1">Tuition & Financial Information (Informational Only)</h4>
                    <div className="border border-neutral-100 rounded-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <tbody className="text-neutral-900">
                                <tr className="border-b border-neutral-50">
                                    <td className="py-3 px-4 text-neutral-600">Standard Annual Tuition Fee</td>
                                    <td className="py-3 px-4 text-right font-bold">€{((tuitionFee || 0) + (discountAmount || 0)).toLocaleString()} EUR</td>
                                </tr>
                                {discountAmount > 0 && (
                                    <tr className="border-b border-neutral-50 text-emerald-600 bg-emerald-50/30">
                                        <td className="py-3 px-4">Early-bird Discount (First Academic Year only)</td>
                                        <td className="py-3 px-4 text-right font-bold">- €{discountAmount.toLocaleString()} EUR</td>
                                    </tr>
                                )}
                                <tr className="bg-neutral-50 font-bold">
                                    <td className="py-4 px-4">Amount Due to Secure Admission</td>
                                    <td className="py-4 px-4 text-right text-lg">€{tuitionFee?.toLocaleString() || '0'} EUR</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. Next Steps & Validity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                    <div>
                        <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-3 border-b border-neutral-200 pb-1">Next Steps</h4>
                        <ol className="list-decimal ml-5 text-sm text-neutral-700 space-y-1">
                            <li>Accept offer via the student portal.</li>
                            <li>Proceed to tuition payment.</li>
                            <li>Admission letter issued after payment confirmation.</li>
                        </ol>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-3 border-b border-neutral-200 pb-1">Offer Validity</h4>
                        <div className="text-sm font-bold mb-1">{displayOffer.payment_deadline ? formatToDDMMYYYY(displayOffer.payment_deadline) : '14 Days from Issue'}</div>
                        <p className="text-[10px] text-neutral-500">This offer will lapse automatically if not accepted by the specified date.</p>
                    </div>
                </div>

                {/* 7. Signature & Closing */}
                <div className="mt-auto pt-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0">
                    <div>
                        <div className="w-48 h-16 mb-2 relative">
                            <Image
                                src="/images/official-signature.png"
                                alt="Signature"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
                            />
                        </div>
                        <div className="text-sm font-bold text-neutral-900 uppercase">
                            Admissions Office
                        </div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">
                            SYKLI College | Finland
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[10px] text-neutral-400 mb-1 font-mono">Verified Document ID</p>
                        <p className="text-[10px] text-black font-mono font-bold">{application.admission_details?.offer_reference || 'OFFR-PENDING'}</p>
                    </div>
                </div>

                {/* Mandatory Disclaimer */}
                <div className="mt-12 pt-8 border-t border-neutral-100">
                    <p className="text-[10px] text-neutral-400 leading-relaxed italic text-center max-w-2xl mx-auto">
                        LEGAL DISCLAIMER: “This Offer Letter does not constitute confirmation of enrollment. Official admission is granted only after acceptance of the offer and confirmation of required tuition payment.”
                    </p>
                </div>
            </div>

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

export default function AdmissionLetterPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <AdmissionLetterContent />
        </Suspense>
    );
}

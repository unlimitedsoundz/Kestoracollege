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
            const { acceptApplicationOffer } = await import('@/app/portal/student/offer/actions');
            await acceptApplicationOffer(id);

            // Navigate to payment immediately
            window.location.href = `/portal/application/payment?id=${id}`;
        } catch (err: any) {
            console.error('Error accepting offer:', err);
            // If offer was already accepted, still navigate to payment
            if (err.message?.includes('already') || err.message?.includes('not in a state')) {
                window.location.href = `/portal/application/payment?id=${id}`;
            } else {
                alert(err.message || 'Failed to accept offer. Please try again.');
            }
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
    // Handle both array and single object due to recent UNIQUE constraint change
    let displayOffer = Array.isArray(data.offer) ? data.offer[0] : data.offer;
    displayOffer = displayOffer || {};

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
            <div className="max-w-[210mm] mx-auto mb-6 md:mb-8 print:hidden space-y-3 md:space-y-0">
                <div className="flex items-center justify-between">
                    <Link
                        href="/portal/dashboard"
                        className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors"
                    >
                        <ChevronLeft size={14} weight="bold" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                    <PrintButton />
                </div>
                {showAcceptButton && (
                    <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
                        <button
                            onClick={handleAcceptOffer}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-3 md:px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider md:tracking-widest hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CheckCircle size={14} weight="bold" />
                            )}
                            Accept<span className="hidden md:inline"> Offer</span>
                        </button>
                        <RejectOfferButton applicationId={id} />
                    </div>
                )}

            </div>

            {/* Letter Container */}
            <div className="w-full max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none min-h-[297mm] p-6 md:p-[25mm] relative overflow-hidden text-black border border-neutral-100 print:border-0" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                
                {/* 1. Header: Logo & Address */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0 mb-6 md:mb-8 border-b-2 border-neutral-900 pb-4">
                    <div>
                        <div className="mb-2 relative w-56 h-12">
                            <Image
                                src="/logo-kestora.png"
                                alt="Kestora University Official Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                                priority
                            />
                        </div>
                    </div>
                    <div className="text-left md:text-right text-[10px] font-medium text-black leading-relaxed uppercase tracking-wide">
                        <strong className="text-black text-xs">Kestora University – Helsinki Campus</strong><br />
                        Pohjoisesplanadi 51<br />
                        00150 Helsinki, Finland<br />
                        Phone: +358 09 42721884<br />
                        kestora.online<br />
                        admissions@kestora.online
                    </div>
                </div>

                {application.status === 'ENROLLED' ? (
                    /* ADMISSION LETTER VIEW */
                    <div className="space-y-6">
                        {/* 1a. Recipient Address Block (Top Left) */}
                        <div className="mb-6 flex flex-col justify-between items-start gap-8">
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">To:</div>
                                <div className="text-sm font-bold text-black mb-1">{application.personal_info?.firstName} {application.personal_info?.lastName}</div>
                                <div className="text-xs text-neutral-600 max-w-[250px] leading-relaxed">
                                    {(application.personal_info?.streetAddress || application.contact_details?.streetAddress) ? (
                                        <>
                                            {application.personal_info?.streetAddress || application.contact_details?.streetAddress}<br />
                                            {application.personal_info?.city || application.contact_details?.city}, {application.personal_info?.country || application.contact_details?.country}
                                        </>
                                    ) : (
                                        'Address Pending'
                                    )}
                                </div>
                                <div className="text-xs font-bold text-black mt-2">Student ID: {application.user?.student_id || application.id.slice(0, 8).toUpperCase()}</div>
                            </div>
                        </div>

                        <div className="text-center mb-10 pt-4">
                            <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-black">
                                Official Admission Letter
                            </h1>
                        </div>
                        {/* Admission Details Grid */}
                        <div className="grid grid-cols-3 gap-6 p-4 mb-8 border-y border-black">
                            <div className="text-center">
                                <span className="block text-[8px] font-bold text-black uppercase tracking-widest mb-1">Enrollment Date</span>
                                <span className="block font-bold text-xs text-black">{formatToDDMMYYYY(today.toISOString())}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[8px] font-bold text-black uppercase tracking-widest mb-1">Admission Reference</span>
                                <span className="block font-bold text-xs font-mono text-black">{application.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[8px] font-bold text-black uppercase tracking-widest mb-1">Official Student ID</span>
                                <span className="block font-bold text-xs font-mono text-black">{application.user?.student_id || 'SK9166922'}</span>
                            </div>
                        </div>

                        {/* Official Statement */}
                        <div className="text-sm leading-relaxed text-black mb-8">
                            <p className="mb-4 text-black">
                                This letter serves as official notification that {application.personal_info?.firstName} {application.personal_info?.lastName} (Passport: {application.personal_info?.passportNumber || 'N/A'}, DOB: {formatToDDMMYYYY(application.user?.date_of_birth || application.personal_info?.dateOfBirth || today.toISOString())}) has been formally admitted and fully enrolled as a degree student at Kestora University for the 2026 - 2027 academic year.
                            </p>
                            <p className="text-black">
                                Having satisfied all academic entrance criteria and fulfilled the mandated tuition fee obligations, the student is officially registered for the <strong className="text-black">{application.course?.title} ({application.course?.programType || 'Full-time'})</strong>. This program is a full-time course of study conducted in the English language at our Helsinki campus location (Pohjoisesplanadi 51, 00150 Helsinki, Finland).
                            </p>
                        </div>

                        {/* Details Table */}
                        <div className="space-y-1 mb-10">
                            {[
                                { label: 'Date of Admission', value: formatToDDMMYYYY(today.toISOString()) },
                                { label: 'Academic Year', value: '2026 - 2027' },
                                { label: 'Intake', value: 'August / Autumn 2026' },
                                { label: 'Programme of Study', value: `${application.course?.title} (${application.course?.programType || 'Full-time'})` }
                            ].map((row, idx) => (
                                <div key={idx} className="flex justify-between py-2 border-b border-black">
                                    <span className="text-xs font-bold uppercase text-black">{row.label}</span>
                                    <span className="text-xs font-medium text-black">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Rights & Access, Official Use, Next Steps, Refund Policy */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 border-b border-black pb-1 text-center">Student Rights & Access</h4>
                                <p className="text-[10px] text-black leading-relaxed">
                                    As an enrolled student, you are granted full access to:
                                </p>
                                <ul className="list-disc ml-4 text-[10px] text-black space-y-1 mt-1">
                                    <li>Campus facilities (Library, Labs, Study Areas)</li>
                                    <li>Digital learning resources and student portal</li>
                                    <li>Academic advising and student support services</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 border-b border-black pb-1 text-center">Immigration / Official Use</h4>
                                <p className="text-[10px] text-black leading-relaxed italic">
                                    This document is an official certificate of admission and may be used for visa applications, residence permit processing (Migri), and other official purposes requiring proof of student status in Finland.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 border-b border-black pb-1 text-center">Next Steps</h4>
                                <ul className="list-decimal ml-4 text-[10px] text-black space-y-1">
                                    <li>Activate your student email and IT account (credentials sent separately).</li>
                                    <li>Register for the orientation week sessions via the student portal.</li>
                                    <li>Submit your housing application if you have not done so.</li>
                                    <li>Arrival instructions will be communicated to your student email.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 border-b border-black pb-1 text-center">Refund Policy</h4>
                                <p className="text-[10px] text-black leading-relaxed">
                                    Tuition fees are subject to the university’s refund policy. Full details can be found at <a href="https://kestora.online/refund-withdrawal-policy/" className="underline text-black">kestora.online/refund-withdrawal-policy/</a>.
                                </p>
                            </div>
                        </div>

                        {/* Signature Block */}
                        <div className="mt-8 pt-4 border-t border-black flex justify-between items-end">
                            <div>
                                <div className="w-40 h-16 mb-2 relative">
                                    <Image
                                        src="/images/anna-virtanen-signature.jpg"
                                        alt="Official Signature"
                                        fill
                                        style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
                                    />
                                </div>
                                <div className="text-[11px] font-black text-black uppercase">Office of the Registrar</div>
                                <div className="text-[11px] font-bold text-black mt-0.5">Dosentti (Docent) Anna Virtanen, FT (Doctor of Philosophy)</div>
                                <div className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">Kestora University | Finland</div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-black italic">
                                Generated electronically via Kestora SIS. Valid without physical signature if verified online.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* OFFER LETTER VIEW (EXISTING) */
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-black">
                                Official Letter of Offer
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 mb-6">
                            <div>
                                <span className="block text-[9px] font-bold text-black uppercase tracking-widest mb-1">Date Issued</span>
                                <span className="font-bold text-xs">{formatToDDMMYYYY(today.toISOString())}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] font-bold text-black uppercase tracking-widest mb-1">Offer Reference</span>
                                <span className="font-bold text-xs font-mono">{application.admission_details?.offer_reference || 'OFFR-PENDING'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] font-bold text-black uppercase tracking-widest mb-1">Application ID</span>
                                <span className="font-bold text-xs font-mono">{application.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                        </div>

                        {/* 2. Applicant Info */}
                        <div className="mb-6">
                            <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3 pb-1">Applicant & Programme Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12">
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase tracking-widest mb-1">Full Name (Passport Match)</div>
                                    <div className="text-sm font-bold text-black">{application.personal_info?.firstName} {application.personal_info?.lastName}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase tracking-widest mb-1">Intake & Year</div>
                                    <div className="text-sm font-bold text-black">Autumn Semester 2026</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase tracking-widest mb-1">Intended Programme</div>
                                    <div className="text-sm font-bold text-black">{application.course?.title}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase tracking-widest mb-1">Degree Level</div>
                                    <div className="text-sm font-bold text-black">{application.course?.degreeLevel === 'MASTER' ? "Master's Degree" : "Bachelor's Degree"}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-black uppercase tracking-widest mb-1">Study Mode</div>
                                    <div className="text-sm font-bold text-black">{application.course?.programType || 'Full-time'}</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Offer Statement */}
                        <div className="p-4 md:p-6 mb-6">
                            <p className="text-sm font-bold text-neutral-900 mb-3">
                                Dear {application.personal_info?.firstName},
                            </p>
                            <p className="text-sm leading-relaxed text-black mb-3">
                                We are pleased to inform you that, following a thorough review of your application, the Admissions Committee of Kestora University has decided to offer you a place in the <strong>{application.course?.title}</strong> ({application.course?.programType || 'Full-time'}) programme for the <strong>Autumn 2026</strong> intake.
                            </p>
                            <p className="text-sm leading-relaxed text-black">
                                This offer is subject to the conditions outlined below, including acceptance of the offer via the student portal and confirmation of tuition payment by the specified deadline. Upon fulfillment of these conditions, an official Letter of Admission will be issued confirming your enrollment.
                            </p>
                        </div>

                        {/* 4. Conditions */}
                        <div className="mb-6 text-sm leading-relaxed text-black">
                            <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3 pb-1">Conditions of Offer</h4>
                            <p className="mb-3">This offer is conditional upon acceptance and fulfillment of all stated requirements:</p>
                            <ul className="list-disc ml-5 space-y-1 mb-4">
                                <li>Formal acceptance of this offer via the student portal.</li>
                                <li>Payment of required tuition deposit by the specified deadline.</li>
                                <li>Submission of any outstanding original documents (if applicable).</li>
                            </ul>
                            <p className="text-xs italic text-black font-medium">
                                “This offer is conditional upon acceptance and fulfillment of all stated requirements.”
                            </p>
                        </div>

                        {/* 5. Tuition & Financial Information */}
                        <div className="mb-6">
                            <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3 pb-1">Tuition & Financial Information</h4>
                            <p className="text-xs text-black mb-2">The following tuition information is provided for your reference based on the programme and degree level.</p>
                            <div className="overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <tbody className="text-black">
                                        <tr className="font-bold bg-neutral-50/10 text-black border-y border-neutral-100">
                                            <td className="py-4 px-4 uppercase tracking-tighter">Tuition Deposit (50% to Secure Place)</td>
                                            <td className="py-4 px-4 text-right text-lg border-l border-neutral-100">€{(Math.round(((tuitionFee || 0) + (discountAmount || 0)) * 0.5)).toLocaleString()} EUR</td>
                                        </tr>
                                        <tr className="bg-white/50">
                                            <td className="py-3 px-4 text-[10px] font-bold uppercase text-neutral-500">Remaining Balance (Due before commencement)</td>
                                            <td className="py-3 px-4 text-right font-bold text-neutral-600">€{(Math.round(((tuitionFee || 0) + (discountAmount || 0)) * 0.5)).toLocaleString()} EUR</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 6. Next Steps & Validity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
                            <div>
                                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3 pb-1">Next Steps</h4>
                                <ol className="list-decimal ml-5 text-sm text-black space-y-1">
                                    <li>Accept offer via the student portal.</li>
                                    <li>Proceed to tuition payment.</li>
                                    <li>Admission letter issued after payment confirmation.</li>
                                </ol>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3 pb-1">Offer Validity</h4>
                                <div className="text-sm font-bold mb-1">{displayOffer.payment_deadline ? formatToDDMMYYYY(displayOffer.payment_deadline) : '14 Days from Issue'}</div>
                                <p className="text-[10px] text-black">This offer will lapse automatically if not accepted by the specified date.</p>
                            </div>
                        </div>

                        {/* 7. Signature & Closing */}
                        <div className="mt-auto pt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                            <div>
                                <div className="w-48 h-16 mb-2 relative">
                                    <Image
                                        src="/images/official-signature.png"
                                        alt="Signature"
                                        fill
                                        style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
                                    />
                                </div>
                                <div className="text-sm font-bold text-black uppercase">
                                    Admissions Office
                                </div>
                                <div className="text-[9px] font-bold text-black uppercase tracking-widest leading-none mt-1">
                                    Kestora University | Finland
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-[10px] text-black mb-1 font-mono">Verified Document ID</p>
                                <p className="text-[10px] text-black font-mono font-bold">{application.admission_details?.offer_reference || 'OFFR-PENDING'}</p>
                            </div>
                        </div>

                        {/* Mandatory Disclaimer */}
                        <div className="mt-6 pt-4">
                            <p className="text-[10px] text-black leading-relaxed italic text-center max-w-2xl mx-auto">
                                LEGAL DISCLAIMER: “This Offer Letter does not constitute confirmation of enrollment. Official admission is granted only after acceptance of the offer and confirmation of required tuition payment.”
                            </p>
                        </div>
                    </>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 15mm; size: A4; }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    
                    /* Hide nav header, footer, and control bar */
                    header, nav, footer,
                    [data-theme="portal"] > header,
                    [data-theme="portal"] > footer,
                    .print\\:hidden { display: none !important; }
                    
                    /* Reset layout containers */
                    [data-theme="portal"] { min-height: 0 !important; }
                    [data-theme="portal"] > main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
                    .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
                    .min-h-\\[297mm\\] { min-height: 0 !important; }
                    
                    /* Letter container reset */
                    .max-w-\\[210mm\\] { max-width: 100% !important; margin: 0 !important; padding: 15mm 0 !important; }
                    .shadow-xl, .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-0 { border: none !important; }
                    
                    /* Ensure black text */
                    * { color: black !important; }
                    a { text-decoration: none !important; }
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

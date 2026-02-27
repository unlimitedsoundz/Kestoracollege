'use client';

import { createClient } from '@/utils/supabase/client';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import PrintButton from '@/components/portal/PrintButton';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { format } from 'date-fns';

function AdmissionLetterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [admission, setAdmission] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [payment, setPayment] = useState<any>(null);

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

                // Fetch Application with Offer and Payments
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
                    console.error('Fetch error:', error || 'Application not found');
                    setData(null);
                    setLoading(false);
                    return;
                }

                setData(applicationRaw);

                // Fetch admission details
                const { data: admissionData } = await supabase
                    .from('admissions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('program', applicationRaw.course?.title)
                    .maybeSingle();

                if (admissionData) setAdmission(admissionData);

                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, student_id, address_line1, city, country_of_residence')
                    .eq('id', user.id)
                    .single();

                if (profileData) setProfile(profileData);

                // Fetch Student record for the official ID
                const { data: studentRecord } = await supabase
                    .from('students')
                    .select('*')
                    .eq('application_id', id)
                    .maybeSingle();

                if (studentRecord) setStudent(studentRecord);

                // Get completed payment
                const offer = Array.isArray(applicationRaw.offer) ? applicationRaw.offer[0] : applicationRaw.offer;
                const completedPayment = offer?.payments?.find((p: any) => p.status === 'COMPLETED');
                setPayment(completedPayment);

            } catch (e) {
                console.error('Error fetching admission letter data:', e);
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
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Loading Admission Letter...</p>
                </div>
            </div>
        );
    }

    if (!data && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Document Not Found</p>
                <p className="text-sm text-neutral-500 max-w-md text-center">We couldn't retrieve your admission letter. This might be due to a session timeout or a temporary connection issue.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">Retry</button>
                    <Link href="/portal/dashboard" className="px-6 py-2 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest rounded-sm">Dashboard</Link>
                </div>
            </div>
        );
    }

    const application = data;
    // Check if enrolled or admitted/paid
    const isEnrolled = application.status === 'ENROLLED' || (application.status === 'ADMITTED' && payment);

    if (!isEnrolled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg font-medium text-neutral-900">Admission Letter Not Available</p>
                <p className="text-sm text-neutral-500">You must be officially enrolled to view this document.</p>
                <Link href="/portal/dashboard" className="text-sm text-blue-600 underline hover:text-blue-800">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    // Current Date
    const today = new Date();
    const issueDate = admission?.created_at
        ? format(new Date(admission.created_at), "MMMM d, yyyy")
        : format(today, "MMMM d, yyyy");

    const academicYear = "2026 - 2027";
    const intake = "Autumn 2026";

    // Dynamic Student ID (if available, otherwise fallback)
    const displayStudentId = student?.student_id || admission?.student_id || profile?.student_id || application.user?.student_id || "Generating...";

    // Improved Name detection
    const firstName = profile?.first_name || application.personal_info?.firstName || application.user?.first_name;
    const lastName = profile?.last_name || application.personal_info?.lastName || application.user?.last_name;
    const studentName = firstName && lastName ? `${firstName} ${lastName}` : application.user?.email;

    // Data for detailed wording
    const passportNumber = application.personal_info?.passportNumber || "N/A";
    const dob = application.personal_info?.dateOfBirth ? format(new Date(application.personal_info.dateOfBirth), "MMMM d, yyyy") : "N/A";

    const studentAddress = (profile?.address_line1 || application.contact_details?.addressLine1) ? (
        <>
            {profile?.address_line1 || application.contact_details?.addressLine1 || 'Address Pending'}<br />
            {(profile?.city || application.contact_details?.city) ? `${profile?.city || application.contact_details?.city}, ` : ''}{profile?.country_of_residence || application.contact_details?.country || ''}
        </>
    ) : 'Address Pending';

    const programStart = '24th August 2026'; // Hardcoded as per previous logic

    return (
        <div className="min-h-screen bg-neutral-100/50 py-6 md:py-12 px-4 sm:px-6 font-rubik">
            {/* Control Bar */}
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

            {/* Document Container - A4 Size */}
            <div className="w-full max-w-[210mm] mx-auto bg-white print:shadow-none p-[15mm] md:p-[20mm] border border-neutral-200 print:border-0 relative overflow-hidden min-h-[297mm] flex flex-col justify-between" style={{ fontFamily: '"Open Sans", sans-serif' }}>

                {/* Content Wrapper */}
                <div>
                    {/* 1. Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6 border-b-2 border-black pb-4">
                        <div className="space-y-6">
                            <div className="relative w-48 h-12">
                                <Image
                                    src="/logo-kestora.png"
                                    alt="Kestora College"
                                    fill
                                    style={{ objectFit: 'contain', objectPosition: 'left center' }}
                                />
                            </div>
                            {/* To: Section */}
                            <div className="text-[11px] leading-relaxed text-black font-medium">
                                <span className="text-[9px] font-bold text-black uppercase tracking-widest block mb-1">To:</span>
                                <strong className="text-sm block mb-1">{studentName}</strong>
                                <span className="text-black block">{studentAddress}</span>
                                <span className="block mt-2 font-mono text-xs">Student ID: {displayStudentId}</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right text-[10px] font-medium text-black leading-relaxed uppercase tracking-wide">
                            <strong className="text-black block mb-2 text-xs">Kestora College – Helsinki Campus</strong>
                            Pohjoisesplanadi 51<br />
                            00150 Helsinki, Finland<br />
                            <div className="mt-2 space-y-0.5 text-[9px] text-black">
                                <div>kestora.fi</div>
                                <div>admissions@kestora.fi</div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-black uppercase tracking-[0.1em] text-black">Official Admission Letter</h1>
                    </div>

                    {/* 2. Meta Data */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-4">
                        <div>
                            <span className="block text-[8px] font-black text-black uppercase tracking-widest mb-1">Enrollment Date</span>
                            <span className="font-bold text-xs">{issueDate}</span>
                        </div>
                        <div>
                            <span className="block text-[8px] font-black text-black uppercase tracking-widest mb-1">Admission Reference</span>
                            <span className="font-bold text-xs font-mono">{admission?.admission_reference || application.application_number || 'PENDING'}</span>
                        </div>
                        <div>
                            <span className="block text-[8px] font-black text-black uppercase tracking-widest mb-1">Official Student ID</span>
                            <span className="font-bold text-xs font-mono">{displayStudentId}</span>
                        </div>
                    </div>

                    <div className="border-l-4 border-black pl-6 py-3 mb-4">
                        <p className="text-sm font-medium text-black leading-relaxed text-justify">
                            This letter serves as official notification that <strong className="text-black uppercase">{studentName}</strong> (Passport: <strong className="text-black">{passportNumber}</strong>, DOB: <strong className="text-black">{dob}</strong>) has been formally admitted and fully enrolled as a degree student at Kestora College for the <strong className="text-black">{academicYear}</strong> academic year. Having satisfied all academic entrance criteria and fulfilled the mandated tuition fee obligations, the student is officially registered for the <strong className="text-black underline">{application.course?.title}</strong> ({application.course?.programType || 'Full-time'}). This program is a {application.course?.programType?.toLowerCase() || 'full-time'} course of study conducted in the English language at our Helsinki campus location (Pohjoisesplanadi 51, 00150 Helsinki, Finland).
                        </p>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">Date of Admission</div>
                        <div className="text-sm font-bold text-black border-b border-black pb-1">
                            {issueDate}
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">Academic Year</div>
                        <div className="text-sm font-bold text-black border-b border-black pb-1">
                            {academicYear}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">Intake</div>
                        <div className="text-sm font-bold text-black border-b border-black pb-1">
                            {intake}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">Programme of Study</div>
                        <div className="text-sm font-bold text-black border-b border-black pb-1">
                            {application.course?.title} ({application.course?.programType || 'Full-time'})
                        </div>
                    </div>
                </div>

                {/* Rights & Access */}
                <div className="mb-4">
                    <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-2 border-b border-black pb-1">Student Rights & Access</h4>
                    <p className="text-[11px] leading-relaxed text-black mb-2">
                        As an enrolled student, you are granted full access to:
                    </p>
                    <ul className="list-disc list-inside text-[11px] leading-relaxed text-black ml-2 space-y-0.5">
                        <li>Campus facilities (Library, Labs, Study Areas)</li>
                        <li>Digital learning resources and student portal</li>
                        <li>Academic advising and student support services</li>
                    </ul>
                </div>

                {/* 7. Official Use Statement */}
                <div className="mb-6">
                    <h4 className="text-[12px] font-black text-black uppercase tracking-widest mb-2 border-b border-black pb-1">Immigration / Official Use</h4>
                    <p className="text-[11px] leading-relaxed text-black">
                        This document is an official certificate of admission and may be used for visa applications, residence permit processing (Migri), and other official purposes requiring proof of student status in Finland.
                    </p>
                </div>

                {/* 8. Next Steps */}
                <div className="mb-6">
                    <h4 className="text-[12px] font-black text-black uppercase tracking-widest mb-2 border-b border-black pb-1">Next Steps</h4>
                    <ul className="text-[11px] leading-relaxed text-black list-disc ml-4 space-y-1">
                        <li>Activate your student email and IT account (credentials sent separately).</li>
                        <li>Register for the orientation week sessions via the student portal.</li>
                        <li>Submit your housing application if you have not done so.</li>
                        <li>Arrival instructions will be communicated to your student email.</li>
                    </ul>
                </div>

                {/* 9. Refund Policy */}
                <div className="mb-4">
                    <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-2 border-b border-black pb-1">Refund Policy</h4>
                    <p className="text-[11px] leading-relaxed text-black">
                        Tuition fees are subject to the college’s refund policy. Full details can be found at <a href="https://kestora.fi/refund-withdrawal-policy/" className="underline text-black">https://kestora.fi/refund-withdrawal-policy/</a>.
                    </p>
                </div>

                {/* Footer Content */}
                <div>
                    {/* 10. Authorization */}
                    <div className="mt-4 pt-4 border-t border-black flex flex-row justify-between items-end">
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
                            <div className="text-[10px] font-bold text-black uppercase tracking-widest">Kestora College | Finland</div>
                        </div>
                        <div className="text-right">
                            {/* Authentication Code or QR could go here in future */}
                        </div>
                    </div>

                    {/* Footer Legal */}
                    <div className="mt-4 text-center pt-2">
                        <p className="text-[10px] text-black uppercase tracking-widest">
                            Generated electronically via Kestora SIS. Valid without physical signature if verified online.
                        </p>
                    </div>
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
                    * { color: black !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    a { text-decoration: none !important; }
                }
            ` }} />
        </div >
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

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatToDDMMYYYY } from '@/utils/date';
import { Plus, CreditCard, WarningCircle as AlertCircle, GraduationCap, SquaresFour as LayoutDashboard, FileText } from "@phosphor-icons/react/dist/ssr";
import DeleteApplicationBtn from './DeleteApplicationBtn';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchDashboardData = async () => {
        try {
            // 1. Auth Check
            const { data: { user: sbUser } } = await supabase.auth.getUser();
            if (!sbUser) {
                router.push('/portal/account/login');
                return;
            }
            setUser(sbUser);

            // Fetch Data
            const [profileRes, appsRes, studentRes, admissionRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', sbUser.id).single(),
                supabase.from('applications').select('*, course:Course(title, duration), offer:admission_offers(*)').eq('user_id', sbUser.id).order('updated_at', { ascending: false }),
                supabase.from('students').select('*, program:Course(*), user:profiles(*)').eq('user_id', sbUser.id).maybeSingle(),
                supabase.from('admissions').select('*').eq('user_id', sbUser.id)
            ]);

            const admissionsMap = new Map((admissionRes.data || []).map(a => [a.program, a]));

            if (profileRes.data) setProfile(profileRes.data);
            if (appsRes.data) {
                // Enrich apps with admission letter info
                const enrichedApps = appsRes.data.map(app => ({
                    ...app,
                    admission_details: admissionsMap.get(app.course?.title)
                }));
                setApplications(enrichedApps);

                // Auto-redirect to student portal if enrolled and no urgent actions required
                if (studentRes.data) {
                    const hasUrgentAction = (appsRes.data || []).some(app =>
                        app.status === 'ADMITTED' || app.status === 'OFFER_ACCEPTED'
                    );
                    if (!hasUrgentAction) {
                        // Smoothly transition to student portal
                        router.push('/portal/student');
                        return; // Stop further execution for this render
                    }
                }
            }
            if (studentRes.data) setStudent(studentRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold uppercase tracking-tight text-neutral-900 leading-none">My Applications</h1>
                        {profile?.student_id && (
                            <span className="border border-primary text-primary px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-widest leading-none">
                                ID: {profile.student_id}
                            </span>
                        )}
                    </div>
                    <p className="text-neutral-600 text-xs font-medium uppercase tracking-widest mt-1">
                        Welcome back, <span className="text-primary">{profile?.first_name || user?.email}</span>
                    </p>
                </div>
                {!student && (
                    <Link
                        href="/portal/apply"
                        className="border border-primary text-primary px-4 py-2 rounded-sm text-[10px] font-semibold uppercase tracking-widest hover:bg-neutral-50 transition-all self-start md:self-auto"
                    >
                        New Application
                    </Link>
                )}
            </div>

            {/* Enrolled Student Alert Card */}
            {student && (
                <div className="flex items-start justify-between border-2 border-black p-6 md:p-8 rounded-sm text-black relative overflow-hidden bg-neutral-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 w-full">
                        <div>
                            <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <GraduationCap size={14} weight="bold" /> Active Student Status
                            </h4>
                            <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-tight mt-1">
                                You are officially enrolled in <span className="text-black">{student.program?.title}</span>. Access your academic tools below.
                            </p>
                        </div>
                        <Link
                            href="/portal/student"
                            className="bg-black text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all whitespace-nowrap shadow-lg"
                        >
                            Enter Student Portal
                        </Link>
                    </div>
                </div>
            )}

            {/* Applications List */}
            {applications && applications.length > 0 ? (
                <div className="grid gap-3">
                    {applications.map((app) => (
                        <div key={app.id}>
                            {/* Decision Alert Card - ADMITTED */}
                            {app.status === 'ADMITTED' && (
                                <div className="flex items-start justify-between border-2 border-black p-6 md:p-8 rounded-sm text-black relative overflow-hidden bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 w-full">
                                        <div>
                                            <h4 className="font-black text-[12px] uppercase tracking-widest flex items-center gap-2">
                                                <GraduationCap size={16} weight="bold" /> Formal Offer of Admission
                                            </h4>
                                            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tight mt-1">
                                                An official offer letter has been issued. Action is required to secure your place.
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Link
                                                href={`/portal/application/letter?id=${app.id}`}
                                                className="bg-black text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all whitespace-nowrap text-center shadow-lg"
                                            >
                                                Accept Official Offer
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Pending Alert Card - OFFER_ACCEPTED */}
                            {app.status === 'OFFER_ACCEPTED' && (
                                <div className="flex items-start justify-between border border-neutral-200 p-6 md:p-8 rounded-sm text-neutral-900 relative overflow-hidden bg-white shadow-sm mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 w-full">
                                        <div>
                                            <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-neutral-500">
                                                <CreditCard size={14} weight="bold" /> Payment Required
                                            </h4>
                                            <p className="text-neutral-900 text-[10px] font-bold uppercase tracking-tight mt-1">
                                                Complete your tuition payment via PayGoWire to secure your enrollment.
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Link
                                                href={`/portal/application/letter?id=${app.id}`}
                                                className="px-6 py-3 border border-neutral-200 text-neutral-600 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all whitespace-nowrap text-center"
                                            >
                                                View Offer
                                            </Link>
                                            <Link
                                                href={`/portal/application/payment?id=${app.id}`}
                                                className="bg-black text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all whitespace-nowrap text-center"
                                            >
                                                Pay Tuition
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Verification Pending - PAYMENT_SUBMITTED */}
                            {app.status === 'PAYMENT_SUBMITTED' && (
                                <div className="flex items-start justify-between border border-neutral-200 p-6 md:p-8 rounded-sm text-black relative overflow-hidden bg-neutral-50 mb-4 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 w-full">
                                        <div className="flex-1">
                                            <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-black">
                                                <AlertCircle size={14} weight="bold" /> Payment Verification Pending
                                            </h4>
                                            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tight mt-1">
                                                Your payment has been received. Our team is verifying the transaction before finalizing your enrollment.
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center gap-3">
                                            <Link
                                                href={`/portal/application/receipt?id=${app.id}`}
                                                className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all whitespace-nowrap text-center flex items-center gap-2"
                                            >
                                                <FileText size={12} weight="bold" />
                                                View Receipt
                                            </Link>
                                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 whitespace-nowrap">
                                                <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-black">Verifying</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {app.status === 'REJECTED' && (
                                <div className="border border-neutral-200 p-6 rounded-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                                    <div>
                                        <h4 className="font-semibold text-[10px] uppercase tracking-widest">Decision updated</h4>
                                        <p className="text-neutral-400 text-[10px] font-medium uppercase tracking-tight mt-0.5">A decision has been reached regarding your application.</p>
                                    </div>
                                    <Link
                                        href={`/portal/application?id=${app.id}`}
                                        className="border border-neutral-200 text-neutral-600 px-4 py-2 rounded-sm text-[10px] font-semibold uppercase tracking-widest hover:bg-neutral-50 transition-all whitespace-nowrap"
                                    >
                                        Details
                                    </Link>
                                </div>
                            )}

                            <div className="bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all border-b border-neutral-100 hover:bg-neutral-50/50">
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-semibold text-sm uppercase tracking-tight text-neutral-900 leading-none">
                                            {app.course?.title || 'Untitled Application'}
                                            {app.course?.duration && (
                                                <span className="text-neutral-500 font-medium lowercase"> — {app.course.duration}</span>
                                            )}
                                        </h3>
                                        {app.application_number && (
                                            <span className="text-neutral-500 font-medium text-[10px]">#{app.application_number}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest leading-none mt-1">
                                        <span className={`${app.status === 'ADMITTED' || app.status === 'OFFER_ACCEPTED' || app.status === 'ENROLLED' || app.status === 'PAYMENT_SUBMITTED' ? 'text-black' :
                                            app.status === 'REJECTED' ? 'text-neutral-500' :
                                                'text-neutral-600'
                                            }`}>
                                            {app.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-neutral-400">Updated: {formatToDDMMYYYY(app.updated_at)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Draft State */}
                                    {app.status === 'DRAFT' && (
                                        <Link
                                            href={`/portal/application?id=${app.id}`}
                                            className="px-4 py-2 border border-primary text-primary rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all"
                                        >
                                            Continue
                                        </Link>
                                    )}

                                    {/* Submitted / Under Review */}
                                    {(app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW') && (
                                        <Link
                                            href={`/portal/application/view?id=${app.id}`}
                                            className="px-4 py-2 border border-neutral-200 text-neutral-500 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all"
                                        >
                                            View Form
                                        </Link>
                                    )}

                                    {/* Decision / Pay Buttons */}
                                    {app.status === 'ADMITTED' && (
                                        <Link
                                            href={`/portal/application/letter?id=${app.id}`}
                                            className="px-4 py-2 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                                        >
                                            <CreditCard size={12} />
                                            View Offer
                                        </Link>
                                    )}

                                    {(app.status === 'ADMITTED' || app.status === 'OFFER_ACCEPTED') && (
                                        <Link
                                            href={app.status === 'OFFER_ACCEPTED' ? `/portal/application/payment?id=${app.id}` : '#'}
                                            className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${app.status === 'OFFER_ACCEPTED'
                                                ? 'bg-black text-white hover:bg-neutral-800'
                                                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                                                }`}
                                            onClick={(e) => app.status === 'ADMITTED' && e.preventDefault()}
                                        >
                                            <CreditCard size={12} />
                                            Pay Tuition
                                        </Link>
                                    )}

                                    {/* Enrolled State */}
                                    {app.status === 'ENROLLED' && (
                                        <div className="flex gap-2">
                                            {app.admission_details?.admission_letter_url && (
                                                <a
                                                    href={app.admission_details.admission_letter_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-2"
                                                >
                                                    Admission Letter
                                                </a>
                                            )}
                                            <Link
                                                href={`/portal/application/receipt?id=${app.id}`}
                                                className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2"
                                            >
                                                <FileText size={12} weight="bold" />
                                                Receipt
                                            </Link>
                                            <Link
                                                href={`/portal/student`}
                                                className="px-4 py-2 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                                            >
                                                <LayoutDashboard size={12} weight="bold" />
                                                Enter Portal
                                            </Link>
                                        </div>
                                    )}

                                    {/* Offer Letter link for other states if available */}
                                    {app.status !== 'ENROLLED' && app.admission_details?.offer_letter_url && (
                                        <a
                                            href={app.admission_details.offer_letter_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 border border-neutral-200 text-neutral-500 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all"
                                        >
                                            Offer Letter
                                        </a>
                                    )}

                                    {/* Delete Button for non-enrolled */}
                                    {app.status !== 'ENROLLED' && (
                                        <DeleteApplicationBtn id={app.id} onSuccess={fetchDashboardData} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center border border-neutral-100 rounded-sm">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">No active applications</h3>
                    <Link
                        href="/portal/apply"
                        className="inline-block border border-primary text-primary px-6 py-2 rounded-sm text-[10px] font-semibold uppercase tracking-widest hover:bg-neutral-50 transition-all"
                    >
                        Start Journey
                    </Link>
                </div>
            )}

            <div className="mt-12 pt-6 border-t border-neutral-200 text-center">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold flex flex-wrap justify-center gap-6">
                    <Link href="/student-handbook" className="hover:text-black transition-colors">Student Handbook</Link>
                    <Link href="/code-of-conduct" className="hover:text-black transition-colors">Code of Conduct</Link>
                    <Link href="/refund-withdrawal-policy/" className="hover:text-black transition-colors">Refund Policy</Link>
                </p>
            </div>
        </div>
    );
}

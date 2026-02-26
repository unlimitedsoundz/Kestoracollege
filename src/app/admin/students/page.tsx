'use client';

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { User, Envelope as Mail, Globe, CheckCircle, XCircle, Clock, CreditCard, ShieldCheck, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';
import DeleteStudentBtn from './DeleteStudentBtn';
import { useState, useEffect } from 'react';

export default function AdminStudentsPage() {
    const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
    const [pendingApplications, setPendingApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const supabase = createClient();

    const fetchData = async () => {
        try {
            // Check current user
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setCurrentUser(authUser);

            if (authUser) {
                // Also check their profile role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authUser.id)
                    .single();

                if (profile) {
                    setCurrentUser((prev: any) => ({ ...prev, profileRole: profile.role }));
                }
            }

            // Fetch Enrolled Students
            const { data: students, error: studentError } = await supabase
                .from('students')
                .select(`
                    *,
                    user:profiles(first_name, last_name, email),
                    program:Course(title),
                    application:applications!application_id(personal_info)
                `)
                .order('created_at', { ascending: false });

            if (studentError) {
                setError(studentError.message);
            }

            // Fetch Pending Enrollments
            const { data: apps, error: appError } = await supabase
                .from('applications')
                .select(`
                    *,
                    user:profiles(first_name, last_name, email),
                    program:Course(title),
                    offer:admission_offers(
                        id,
                        payments:tuition_payments(transaction_reference, created_at, amount, status)
                    )
                `)
                // .in('status', ['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED']) // Removed filter to catch ALL potential stuck states
                .neq('status', 'REJECTED') // Optional: exclude rejected keys to keep list clean, but keep everything else
                .order('updated_at', { ascending: false });

            if (appError) {
                if (!studentError) setError(appError.message);
            }

            setEnrolledStudents(students || []);

            // Filter out applications that are already fully enrolled (exist in students table)
            const enrolledAppIds = new Set(students?.map((s: any) => s.application_id));

            // Define statuses that should appear in Pending list
            // We include ENROLLED and ADMISSION_LETTER_GENERATED here because if they are NOT in enrolledAppIds, they are "Stuck" and need manual repair.
            const pendingStatuses = ['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'];

            const pendingApps = apps?.filter((app: any) =>
                !enrolledAppIds.has(app.id) && pendingStatuses.includes(app.status)
            ) || [];

            setPendingApplications(pendingApps);

            console.log("Fetched Data (Client):", { students, apps });
        } catch (error) {
            console.error("Outer Error fetching students data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproveTuition = async (applicationId: string) => {
        if (!confirm("Are you sure you want to officially ENROLL this student? This will generate a Student ID and institutional email.")) return;

        setActionLoading(applicationId);
        try {
            const { enrollStudent } = await import('./actions');
            const result = await enrollStudent(applicationId);

            if (result.success) {
                alert(`Student enrolled successfully! ID: ${result.studentId}`);
                await fetchData(); // Refresh lists
            } else {
                alert(`Enrollment failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            alert("An unexpected error occurred during enrollment.");
        } finally {
            setActionLoading(null);
        }
    };

    const getPaymentInfo = (app: any) => {
        // Check all common ways the data might be keyed
        const rawOffer = app.offer || app.admission_offers || app.admission_offer;
        const offers = Array.isArray(rawOffer) ? rawOffer : (rawOffer ? [rawOffer] : []);

        if (offers.length === 0) return { ref: 'N/A', date: 'N/A' };

        // Flatten all payments from all offers
        const allPayments = offers.flatMap((o: any) => {
            const rawPayments = o.payments || o.tuition_payments || o.tuition_payment;
            return Array.isArray(rawPayments) ? rawPayments : (rawPayments ? [rawPayments] : []);
        }).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (allPayments.length === 0) return { ref: 'N/A', date: 'N/A' };

        return {
            ref: allPayments[0].transaction_reference || 'N/A',
            date: formatToDDMMYYYY(allPayments[0].created_at)
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-20 text-center">
                <XCircle size={48} weight="bold" className="mx-auto mb-4 text-red-500 opacity-20" />
                <h2 className="text-xl font-bold text-neutral-900">Error loading data</h2>
                <p className="text-neutral-500 text-sm mt-1">{error}</p>
                <button
                    onClick={() => { setError(null); setLoading(true); fetchData(); }}
                    className="mt-6 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Enrolled Students</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage official student records.</p>
                </div>
            </div>

            {/* PENDING ENROLLMENTS SECTION */}
            {pendingApplications && pendingApplications.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Clock size={20} weight="bold" className="text-amber-500" />
                        Pending Enrollments
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pendingApplications.length}</span>
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-amber-50/50 border-b border-neutral-200">
                                <tr>
                                    <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Applicant</th>
                                    <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Program</th>
                                    <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Offer Status</th>
                                    <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Payment Ref</th>
                                    <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Submitted</th>
                                    <th className="p-4 font-bold text-neutral-600 text-xs uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {pendingApplications.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-neutral-900 text-sm">{app.user?.first_name || app.personal_info?.firstName} {app.user?.last_name || app.personal_info?.lastName}</div>
                                            <div className="text-xs text-neutral-500">{app.user?.email || app.personal_info?.email || 'No Email'}</div>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-neutral-600">
                                            {app.program?.title}
                                        </td>
                                        <td className="p-4">
                                            {app.status === 'PAYMENT_SUBMITTED' ? (
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                    <CheckCircle size={10} weight="bold" /> Payment Success
                                                </span>
                                            ) : (app.status === 'ENROLLED' || app.status === 'ADMISSION_LETTER_GENERATED') ? (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                    <CheckCircle size={10} weight="bold" /> Payment Verified
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                    <Clock size={10} weight="bold" /> Offer Accepted
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs font-mono text-neutral-500 uppercase">
                                            {getPaymentInfo(app).ref}
                                        </td>
                                        <td className="p-4 text-xs text-neutral-500">
                                            {getPaymentInfo(app).date}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleApproveTuition(app.id)}
                                                disabled={actionLoading === app.id || !['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'].includes(app.status)}
                                                className={`px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ml-auto ${['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'].includes(app.status)
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    : 'bg-neutral-900 text-white hover:bg-neutral-700 opacity-50'
                                                    } ${actionLoading === app.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'].includes(app.status) ? 'Finalize Enrollment' : 'Waiting for student payment'}
                                            >
                                                {actionLoading === app.id ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : (
                                                    <CreditCard size={12} weight="bold" />
                                                )}
                                                {actionLoading === app.id ? 'Processing...' : (['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'].includes(app.status) ? (app.status === 'OFFER_ACCEPTED' ? 'Manual Enroll' : 'Confirm & Enroll') : 'Wait for Payment')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} weight="bold" className="text-emerald-500" />
                Active Student Body
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Student ID</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Student</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Program</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Email</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Status</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Joined</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {enrolledStudents?.map((student: any) => (
                            <tr key={student.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="p-4 text-xs font-mono font-medium text-neutral-500">
                                    {student.student_id}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 font-bold text-xs">
                                            {(student.user?.first_name || student.application?.personal_info?.firstName)?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-neutral-900 text-sm">{student.user?.first_name || student.application?.personal_info?.firstName} {student.user?.last_name || student.application?.personal_info?.lastName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs font-medium text-neutral-600 truncate max-w-[200px] block" title={student.program?.title}>
                                        {student.program?.title || 'N/A'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-neutral-500 font-mono">
                                    {student.institutional_email}
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                        <CheckCircle size={10} weight="bold" /> {student.enrollment_status}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-neutral-400">
                                    {formatToDDMMYYYY(student.created_at)}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/admin/admissions/review?id=${student.application_id}`}
                                            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black"
                                        >
                                            View
                                        </Link>
                                        <DeleteStudentBtn id={student.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!enrolledStudents || enrolledStudents.length === 0) && (
                    <div className="p-20 text-center text-neutral-400">
                        <User size={48} weight="regular" className="mx-auto mb-4 opacity-20" />
                        <p>No enrolled students found.</p>
                        <p className="text-xs mt-2">Students appear here after tuition payment and enrollment confirmation.</p>
                        {/* Dev Info to track down the empty list issue */}
                        <div className="mt-10 p-4 bg-neutral-50 rounded text-left border border-neutral-200">
                            <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2">Supabase Response Debug:</p>
                            <pre className="text-[10px] font-mono overflow-auto max-h-40">
                                {JSON.stringify({
                                    studentCount: enrolledStudents?.length,
                                    pendingCount: pendingApplications?.length,
                                    loading: loading,
                                    hasError: !!error,
                                    currentUser: currentUser ? {
                                        id: currentUser.id,
                                        email: currentUser.email,
                                        role: currentUser.profileRole
                                    } : 'Not logged in'
                                }, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
function StatusBadge({ status }: { status: string }) {
    const s = status.toUpperCase();
    if (s === 'APPROVED') return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><CheckCircle size={10} weight="bold" /> Approved</span>;
    if (s === 'REJECTED') return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><XCircle size={10} weight="bold" /> Rejected</span>;
    return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><Clock size={10} weight="bold" /> Pending</span>;
}

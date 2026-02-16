'use client';

import { createClient } from '@/utils/supabase/client';
import {
    getAdmissionsApplicationById,
    updateApplicationInternalNotesAdmin
} from '@/app/admin/actions';
import {
    updateApplicationStatus,
    regenerateOfferLetter,
    generateAdmissionLetterAction
} from '../actions';
import Link from 'next/link';
import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CaretLeft as ChevronLeft, User, Envelope as Mail, Phone, Globe, Calendar, MapPin,
    GraduationCap, Trophy as Award, FileText, DownloadSimple as Download,
    CheckCircle as CheckCircle2, XCircle, WarningCircle as AlertCircle, Clock,
    ArrowCounterClockwise as RotateCcw, CircleNotch as Loader2, Info
} from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';
import { getTuitionFee, mapSchoolToTuitionField, getProgramYears } from '@/utils/tuition';
import { FinancialOfferForm } from '../FinancialOfferForm';

function ApplicationReviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();

    const [app, setApp] = useState<any>(null);
    const [admissionRecord, setAdmissionRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getAdmissionsApplicationById(id) as any;

            if (result.success && result.data) {
                setApp(result.data);
                setAdmissionRecord(result.admissions);
            } else {
                console.error("Error fetching application details:", result.error);
                setError(result.error || "Application not found");
                // Don't redirect immediately so the user can see the error
            }
        } catch (err: any) {
            console.error("Error fetching application details:", err);
            setError(err.message || "Failed to load application");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            router.push('/admin/admissions');
            return;
        }
        fetchData();
    }, [id, router, supabase]);

    const handleUpdateStatus = async (status: string) => {
        if (!id) return;
        setUpdating(true);
        try {
            const result = await updateApplicationStatus(id, status as any) as any;
            if (!result.success) throw new Error(result.error);
            await fetchData();
        } catch (error: any) {
            alert("Error updating status: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveNotes = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        const formData = new FormData(e.currentTarget);
        const notes = formData.get('notes') as string;
        setUpdating(true);
        try {
            const result = await updateApplicationInternalNotesAdmin(id, notes);
            if (!result.success) throw new Error(result.error);
            await fetchData();
        } catch (error: any) {
            alert("Error saving notes: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-white border border-neutral-100 rounded-3xl">
                <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">Application Not Found</h2>
                <p className="text-neutral-500 text-sm mt-2 mb-6">{error}</p>
                <Link
                    href="/admin/admissions"
                    className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                >
                    <ChevronLeft size={14} weight="bold" /> Back to Admissions
                </Link>
            </div>
        );
    }

    if (!app) return null;

    const personal = app.personal_info || {};
    const contact = app.contact_details || {};
    const education = app.education_history || {};
    const motivation = app.motivation || {};

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/admissions" className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                    <ChevronLeft size={24} weight="bold" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 border-l-4 border-black pl-4">Application Review</h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">Viewing details for {(!app.user?.first_name || app.user?.first_name === 'Applicant') && app.personal_info?.firstName ? `${app.personal_info.firstName} ${app.personal_info.lastName || ''}` : `${app.user?.first_name || ''} ${app.user?.last_name || ''}`}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Applicant Section */}
                    <div className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm">
                        <div className="bg-neutral-900 p-8 text-white flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-2xl border border-white/20">
                                    {(app.user?.first_name?.[0] || 'A').toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        {(!app.user?.first_name || app.user?.first_name === 'Applicant') && app.personal_info?.firstName
                                            ? `${app.personal_info.firstName} ${app.personal_info.lastName || ''}`
                                            : `${app.user?.first_name || ''} ${app.user?.last_name || ''}`}
                                    </h2>
                                    <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mt-1">Student ID: {app.user?.student_id || 'Generating...'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-1">Applying For</span>
                                <span className="text-sm font-black uppercase tracking-tight text-amber-500">{app.course?.title}</span>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">Personal Information</h3>
                                <div className="space-y-4">
                                    <InfoItem icon={Calendar} label="Date of Birth" value={personal.dateOfBirth} />
                                    <InfoItem icon={User} label="Gender" value={personal.gender} isCapitalized />
                                    <InfoItem icon={Globe} label="Nationality" value={personal.nationality} />
                                    <InfoItem icon={FileText} label="Passport/ID" value={personal.passportNumber} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">Contact Details</h3>
                                <div className="space-y-4">
                                    <InfoItem icon={Mail} label="Email Address" value={contact.email || app.user?.email} />
                                    <InfoItem icon={Phone} label="Phone Number" value={contact.phone} />
                                    <InfoItem icon={MapPin} label="Address" value={`${contact.addressLine1}${contact.addressLine2 ? ', ' + contact.addressLine2 : ''}, ${contact.city}, ${contact.country}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic History */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">
                            <GraduationCap size={16} weight="bold" /> Academic History
                        </h3>
                        {education.education?.length > 0 ? (
                            <div className="space-y-8">
                                {education.education.map((edu: any, idx: number) => (
                                    <div key={idx} className={`${idx !== 0 ? 'pt-8 border-t border-neutral-50 border-dashed' : ''}`}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <InfoItem label="Institution Name" value={edu.institution} />
                                                <InfoItem label="Degree / Qualification" value={edu.degree} />
                                                <InfoItem label="Period" value={`${edu.startYear} - ${edu.endYear}`} />
                                            </div>
                                            <div className="space-y-4">
                                                <InfoItem label="GPA / Grade" value={edu.grade} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest py-4">No academic history provided.</p>
                        )}
                    </div>

                    {/* Motivation */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">
                            <Award size={16} weight="bold" /> Motivation & Goals
                        </h3>
                        <div className="text-sm font-medium leading-relaxed text-neutral-600 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                            {motivation.statementOfPurpose || "No motivation statement provided."}
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">
                            <FileText size={16} weight="bold" /> Attached Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {app.documents?.length > 0 ? (
                                app.documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group hover:border-black transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                                <FileText size={18} weight="regular" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-tight">{doc.type.replace('_', ' ')}</div>
                                                <div className="text-[10px] font-bold text-neutral-400 truncate max-w-[150px]">{doc.name}</div>
                                            </div>
                                        </div>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black hover:text-white rounded-lg transition-all">
                                            <Download size={16} weight="bold" />
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest italic col-span-2">No documents uploaded yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-lg sticky top-8">
                        <div className="mb-6">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-3">Current Status</span>
                            <StatusDisplay status={app.status} />
                        </div>

                        <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2">Update Pipeline</span>
                            <div className="grid grid-cols-1 gap-2">
                                <StatusBtn label="Move to Review" status="UNDER_REVIEW" currentStatus={app.status} variant="warning" onClick={handleUpdateStatus} disabled={updating} />
                                <StatusBtn label="Request Documents" status="DOCS_REQUIRED" currentStatus={app.status} variant="purple" onClick={handleUpdateStatus} disabled={updating} />
                                <StatusBtn label="Admit Student" status="ADMITTED" currentStatus={app.status} variant="success" onClick={handleUpdateStatus} disabled={updating} />
                                {app.status === 'PAYMENT_SUBMITTED' && (
                                    <StatusBtn label="Finalize Enrollment" status="ENROLLED" currentStatus={app.status} variant="success" onClick={handleUpdateStatus} disabled={updating} />
                                )}
                                <StatusBtn label="Reject Application" status="REJECTED" currentStatus={app.status} variant="danger" onClick={handleUpdateStatus} disabled={updating} />
                            </div>
                        </div>

                        {/* Document & Offer Management */}
                        <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Document & Offer Management</span>

                            {/* Actions */}
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={async () => {
                                        if (!confirm('Regenerate Offer Letter? This will overwrite the existing PDF.')) return;
                                        setUpdating(true);
                                        try {
                                            await regenerateOfferLetter(id!);
                                            alert('Offer Letter regenerated successfully.');
                                            await fetchData();
                                        } catch (e: any) {
                                            alert('Error: ' + e.message);
                                        } finally {
                                            setUpdating(false);
                                        }
                                    }}
                                    disabled={updating || app.status === 'DRAFT' || app.status === 'SUBMITTED' || app.status === 'REJECTED'}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    <RotateCcw size={14} weight="bold" /> Regenerate Offer Letter
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!confirm('Generate Admission Letter? This will overwrite any existing version.')) return;
                                        setUpdating(true);
                                        try {
                                            const result = await generateAdmissionLetterAction(id!);
                                            if (result.success) {
                                                alert('Admission Letter generated successfully.');
                                                await fetchData();
                                            } else {
                                                alert('Error: ' + result.error);
                                            }
                                        } catch (e: any) {
                                            alert('Unexpected Error: ' + e.message);
                                        } finally {
                                            setUpdating(false);
                                        }
                                    }}
                                    disabled={updating || (app.status !== 'ENROLLED' && app.status !== 'ADMISSION_LETTER_GENERATED' && app.status !== 'OFFER_ACCEPTED' && app.status !== 'PAYMENT_SUBMITTED')}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} weight="bold" />
                                        {app.status === 'ADMISSION_LETTER_GENERATED' ? 'Regenerate Admission Letter' : 'Generate Admission Letter'}
                                    </div>
                                    {app.offer?.[0]?.document_url && (
                                        <a
                                            href={app.offer[0].document_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 bg-white rounded-lg border border-neutral-200 text-neutral-400 hover:text-black hover:border-black transition-all"
                                            title="View Document"
                                        >
                                            <Download size={14} weight="bold" />
                                        </a>
                                    )}
                                </button>
                            </div>

                            {/* Financial Offer Form (Manual Override) */}
                            {app.status !== 'REJECTED' && app.status !== 'DRAFT' && (
                                <div className="mt-4 pt-4 border-t border-neutral-100 border-dashed">
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Issue/Update Financial Offer</p>
                                    <FinancialOfferForm
                                        applicationId={id!}
                                        baseTuition={getTuitionFee(app.course?.degreeLevel || 'BACHELOR', mapSchoolToTuitionField(app.course?.school?.slug || 'technology'))}
                                        programYears={getProgramYears(app.course?.duration || '3 years')}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Internal Notes */}
                        <div className="mt-8 pt-6 border-t border-neutral-100">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-4 leading-none underline decoration-amber-400 decoration-2 underline-offset-4">Internal Staff Notes</span>
                            <form onSubmit={handleSaveNotes} className="space-y-3">
                                <textarea
                                    name="notes"
                                    defaultValue={app.internal_notes || ''}
                                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold font-mono outline-none focus:border-black transition-all min-h-[120px] shadow-inner"
                                    placeholder="Add notes for the admissions team..."
                                />
                                <button type="submit" disabled={updating} className="w-full bg-neutral-900 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-sm disabled:opacity-50">
                                    {updating ? 'Saving...' : 'Update Notes'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value, isCapitalized }: { icon?: any, label: string, value: any, isCapitalized?: boolean }) {
    return (
        <div className="flex gap-4">
            {Icon && <Icon size={18} weight="bold" className="text-neutral-200 mt-1 shrink-0" />}
            <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className={`text-sm font-black text-neutral-900 ${isCapitalized ? 'capitalize' : ''}`}>
                    {value || <span className="text-neutral-300 italic opacity-50">Pending</span>}
                </p>
            </div>
        </div>
    );
}

function StatusDisplay({ status }: { status: string }) {
    const variants: Record<string, { label: string, color: string, icon: any }> = {
        'DRAFT': { label: 'Draft', color: 'bg-neutral-100 text-neutral-500 border-neutral-200', icon: Clock },
        'SUBMITTED': { label: 'Submitted', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: AlertCircle },
        'UNDER_REVIEW': { label: 'In Review', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
        'DOCS_REQUIRED': { label: 'Action Needed', color: 'bg-purple-50 text-purple-600 border-purple-200', icon: AlertCircle },
        'ADMITTED': { label: 'Admitted', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
        'OFFER_ACCEPTED': { label: 'Offer Accepted', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
        'PAYMENT_SUBMITTED': { label: 'Paid', color: 'bg-cyan-50 text-cyan-600 border-cyan-200', icon: CheckCircle2 },
        'ADMISSION_LETTER_GENERATED': { label: 'Admitted & Documented', color: 'bg-emerald-950 text-emerald-400 border-emerald-900', icon: FileText },
        'ENROLLED': { label: 'Enrolled', color: 'bg-emerald-900 text-white border-emerald-800', icon: CheckCircle2 },
        'REJECTED': { label: 'Rejected', color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
    };

    const s = variants[status] || variants['DRAFT'];
    const Icon = s.icon;

    return (
        <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${s.color} font-black uppercase text-xs tracking-widest border`}>
            <Icon size={16} weight="bold" />
            {s.label}
        </div>
    );
}

function StatusBtn({ label, status, currentStatus, variant, onClick, disabled }: { label: string, status: string, currentStatus: string, variant: string, onClick: (s: string) => void, disabled: boolean }) {
    if (currentStatus === status) return null;
    const variantClasses: Record<string, string> = {
        'success': 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white',
        'warning': 'bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white',
        'danger': 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white',
        'purple': 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white',
    };
    return (
        <button
            onClick={() => onClick(status)}
            disabled={disabled}
            className={`w-full text-left px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${variantClasses[variant]} disabled:opacity-50`}
        >
            {label}
        </button>
    );
}

export default function ApplicationReviewPage() {
    return (
        <Suspense fallback={<div>Loading Reviews...</div>}>
            <ApplicationReviewContent />
        </Suspense>
    );
}

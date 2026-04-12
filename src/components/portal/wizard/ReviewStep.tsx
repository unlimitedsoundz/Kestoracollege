import { useState } from 'react';
import {
    CheckCircle,
    User,
    Envelope as Mail,
    Phone,
    Globe,
    Calendar,
    MapPin,
    GraduationCap,
    Trophy as Award,
    FileText,
    ShieldCheck,
    WarningCircle as AlertCircle,
    CaretRight
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Application } from '@/types/database';

interface Props {
    application: Application & {
        user: { email: string },
        documents: any[],
        course?: { title: string }
    };
}

export default function ReviewStep({ application }: Props) {
    const [isAttested, setIsAttested] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const personal = application.personal_info as any || {};
    const contact = application.contact_details as any || {};
    const education = application.education_history as any || {};
    const motivation = application.motivation as any || {};

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAttested) return;

        setIsSubmitting(true);
        try {
            // 1. Basic validation (optional client-side)
            if (!application.personal_info || !application.contact_details || !application.education_history) {
                throw new Error('Please complete all required sections before submitting.');
            }

            // 2. Update status
            const { error } = await supabase
                .from('applications')
                .update({
                    status: 'SUBMITTED',
                    submitted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', application.id);

            if (error) throw error;

            router.push('/portal/dashboard');
        } catch (error: any) {
            console.error('Submission failed:', error);
            alert(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="max-w-xl">
                <h3 className="text-xl font-semibold uppercase tracking-tight mb-2 text-neutral-900 leading-none">Review & Submit</h3>
                <p className="text-black text-[10px] font-medium uppercase tracking-widest leading-relaxed">
                    Once submitted, your application will be locked for review.
                </p>
            </div>

            {/* Data Summary */}
            <div className="space-y-6">
                {/* Personal & Contact Section */}
                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-black mb-6 pb-2">
                        Personal & Contact Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <SummaryItem label="Full Name" value={`${personal.firstName} ${personal.lastName}`} />
                            <SummaryItem label="Date of Birth" value={personal.dateOfBirth} />
                            <SummaryItem label="Nationality" value={personal.nationality} />
                        </div>
                        <div className="space-y-2">
                            <SummaryItem label="Email" value={contact.email || application.user?.email} />
                            <SummaryItem
                                label="Phone"
                                value={contact.phoneCode ? `${contact.phoneCode} ${contact.phone}` : contact.phone}
                            />
                            <SummaryItem
                                label="Address"
                                value={[
                                    contact.addressLine1,
                                    contact.addressLine2,
                                    contact.postalCode,
                                    contact.city,
                                    contact.country
                                ].filter(Boolean).join(', ')}
                            />
                        </div>
                    </div>
                </div>

                {/* Academic History */}
                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-black mb-6 pb-2">
                        Academic History
                    </h4>
                    {education.education?.length > 0 ? (
                        <div className="space-y-4">
                            {education.education.map((edu: any, idx: number) => (
                                <div key={idx} className={idx !== 0 ? 'pt-4 border-t border-neutral-200/50' : ''}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-semibold uppercase tracking-tight text-neutral-900 leading-none">{edu.institution}</div>
                                            <div className="text-[10px] font-medium text-[#2d2d2d] uppercase tracking-tight">{edu.degree}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-[9px] font-semibold text-[#2d2d2d] uppercase tracking-widest">{edu.startYear} - {edu.endYear}</div>
                                            <div className="text-[10px] font-medium text-neutral-900">Grade: {edu.grade || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[10px] italic text-[#2d2d2d] font-medium uppercase">No entries found.</p>
                    )}
                </div>

                {/* Motivation Section */}
                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-black mb-6 pb-2">
                        Motivation Letter / Statement of Purpose
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Motivation Letter / Statement of Purpose</h4>
                            <div className="text-xs text-neutral-700 font-medium leading-relaxed bg-white p-4 rounded border border-neutral-100 whitespace-pre-wrap break-words">
                                {motivation.statementOfPurpose || "No statement provided."}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SummaryItem label="English Level" value={motivation.languageProficiency?.englishLevel} />
                            <SummaryItem label="Test Taken" value={motivation.languageProficiency?.testTaken} />
                        </div>
                    </div>
                </div>

                {/* Documents Summary */}
                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-black mb-6 pb-2">
                        Uploaded Documents
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {application.documents?.map((doc: any, idx: number) => (
                            <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-neutral-100 text-xs font-semibold text-primary uppercase tracking-widest shadow-sm">
                                {doc.type.replace('_', ' ')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Attestation & Submit */}
            <div className="p-6 bg-neutral-50 border border-neutral-100 rounded-sm space-y-6">
                <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900 leading-none">Final Declaration</h4>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                        I certify that the information provided is accurate and complete.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="flex items-center gap-3 cursor-pointer group outline-none">
                        <input
                            type="checkbox"
                            checked={isAttested}
                            onChange={(e) => setIsAttested(e.target.checked)}
                            className="appearance-none w-5 h-5 border-2 border-neutral-300 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:opacity-0 checked:after:opacity-100 after:font-bold after:text-xs"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 transition-colors group-hover:text-black">
                            I verify that all data is correct
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={!isAttested || isSubmitting}
                        className={`w-full py-4 rounded-sm font-black uppercase tracking-widest transition-all text-xs flex items-center justify-center gap-3 ${isAttested && !isSubmitting
                            ? 'bg-primary text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg'
                            : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Official Application'}
                        {!isSubmitting && <CaretRight size={16} weight="bold" />}
                    </button>
                    {!isAttested && (
                        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                            Check verification box to enable submission
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

function SummaryItem({ label, value }: { label: string, value?: string }) {
    return (
        <div className="py-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-black mb-1 leading-none">{label}</div>
            <div className="text-sm font-semibold text-black leading-tight">{value || 'N/A'}</div>
        </div>
    );
}

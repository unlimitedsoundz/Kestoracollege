'use client';

import { createClient } from '@/utils/supabase/client';
import { notFound, redirect, useSearchParams } from 'next/navigation';
import { Application } from '@/types/database';
import Link from 'next/link';
import { CaretRight as ChevronRight, ArrowSquareOut as ExternalLink, FileText, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';
import { useState, useEffect, Suspense } from 'react';

function ViewApplicationContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<any>(null);
    const [isOfferAccepted, setIsOfferAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!id) {
                redirect('/portal/dashboard');
                return;
            }

            const supabase = createClient();

            try {
                // Verify Access
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    redirect('/portal/account/login');
                    return;
                }

                const { data: applicationRaw, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*, school:School(*)),
                        user:profiles(*),
                        documents:application_documents(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (appError || !applicationRaw) {
                    setError("Application not found.");
                    return;
                }

                setApplication(applicationRaw);

                // Fetch Admission Offer status
                const { data: offer } = await supabase
                    .from('admission_offers')
                    .select('status')
                    .eq('application_id', id)
                    .maybeSingle();

                const accepted = offer?.status === 'ACCEPTED' ||
                    applicationRaw.status === 'PAYMENT_SUBMITTED' ||
                    applicationRaw.status === 'ENROLLED';
                setIsOfferAccepted(accepted);

            } catch (err: any) {
                console.error("Error loading application:", err);
                setError(err.message || "Failed to load application");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-900 mb-4">{error || "Application not found"}</h2>
                <Link href="/portal/dashboard" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const sectionHeader = (title: string) => (
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 pb-1 border-b border-primary/10">
            {title}
        </h3>
    );

    const dataRow = (label: string, value: any) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-neutral-50 last:border-0">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-neutral-400">{label}</span>
            <span className="md:col-span-2 text-xs font-semibold text-neutral-900">
                {value || <span className="text-neutral-300 italic">Not provided</span>}
            </span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                        <Link href="/portal/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                        <ChevronRight size={10} weight="bold" />
                        <span>Application Summary</span>
                        <ChevronRight size={10} weight="bold" />
                        <span className="text-neutral-900">#{application.application_number || application.id.slice(0, 8)}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 uppercase">
                        {application.course?.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            Status: {application.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            Submitted: {application.submitted_at ? formatToDDMMYYYY(application.submitted_at) : 'Not submitted'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isOfferAccepted ? (
                        <Link
                            href={`/portal/application/admission-letter/?id=${application.id}`}
                            className="px-4 py-2 border border-primary text-primary rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2"
                        >
                            <FileText size={14} weight="bold" />
                            Admission Letter
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="px-4 py-2 border border-neutral-200 text-neutral-400 bg-neutral-50 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-not-allowed opacity-60"
                            title="Admission letter becomes available once you accept your offer"
                        >
                            <FileText size={14} weight="bold" />
                            Admission Letter
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white border border-neutral-100 rounded-sm overflow-hidden">
                <div className="p-8 space-y-8 md:space-y-12">
                    {/* Personal Info */}
                    <section>
                        {sectionHeader("Personal Information")}
                        <div className="grid grid-cols-1 divide-y divide-neutral-50">
                            {dataRow("Full Name", `${application.personal_info?.firstName} ${application.personal_info?.lastName}`)}
                            {dataRow("Date of Birth", application.personal_info?.dateOfBirth)}
                            {dataRow("Gender", application.personal_info?.gender)}
                            {dataRow("Nationality", application.personal_info?.nationality)}
                        </div>
                    </section>

                    {/* Contact Details */}
                    <section>
                        {sectionHeader("Contact Details")}
                        <div className="grid grid-cols-1 divide-y divide-neutral-50">
                            {dataRow("Email Address", application.contact_details?.email)}
                            {dataRow("Phone Number", application.contact_details?.phone)}
                            {dataRow("Current Address", [
                                application.contact_details?.addressLine1,
                                application.contact_details?.addressLine2,
                                application.contact_details?.postalCode,
                                application.contact_details?.city,
                                application.contact_details?.country
                            ].filter(Boolean).join(', '))}
                        </div>
                    </section>

                    {/* Academic History */}
                    <section>
                        {sectionHeader("Academic History")}
                        <div className="space-y-6">
                            {application.education_history?.education?.map((edu: any, index: number) => (
                                <div key={index} className="bg-neutral-50 p-4 rounded-sm border border-neutral-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xs font-bold text-neutral-900 uppercase">{edu.institution}</h4>
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{edu.startYear} - {edu.endYear}</span>
                                    </div>
                                    <p className="text-[10px] font-semibold text-primary uppercase tracking-tight">{edu.degree}</p>
                                    {edu.grade && <p className="text-[10px] text-neutral-500 mt-1 uppercase">Grade: {edu.grade}</p>}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Motivation */}
                    <section>
                        {sectionHeader("Motivation Letter / Statement of Purpose")}
                        <div className="bg-neutral-50 p-6 rounded-sm border border-neutral-100 italic">
                            <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                "{application.motivation?.statementOfPurpose}"
                            </p>
                        </div>
                    </section>

                    {/* Documents */}
                    <section>
                        {sectionHeader("Uploaded Documents")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {application.documents?.map((doc: any) => (
                                <a
                                    key={doc.id}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 border border-neutral-100 rounded-sm hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                            <FileText size={16} weight="bold" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-tight">{doc.type}</p>
                                            <p className="text-[9px] text-neutral-400 font-medium">{doc.name}</p>
                                        </div>
                                    </div>
                                    <ExternalLink size={14} weight="bold" className="text-neutral-300 group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Link
                    href="/portal/dashboard"
                    className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default function ViewApplicationPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <ViewApplicationContent />
        </Suspense>
    );
}

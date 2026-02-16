'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Application } from '@/types/database';
import Link from 'next/link';
import { CheckCircle as CheckCircle2, CaretRight as ChevronRight } from "@phosphor-icons/react/dist/ssr";
import PersonalInfoForm from '@/components/portal/wizard/PersonalInfoForm';
import ContactDetailsForm from '@/components/portal/wizard/ContactDetailsForm';
import AcademicHistoryForm from '@/components/portal/wizard/AcademicHistoryForm';
import MotivationForm from '@/components/portal/wizard/MotivationForm';
import DocumentsForm from '@/components/portal/wizard/DocumentsForm';
import ReviewStep from '@/components/portal/wizard/ReviewStep';
import WelcomeStep from '@/components/portal/wizard/WelcomeStep';
import { getProgrammeInstructions } from '@/utils/programme-instructions';

function ApplicationWizardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const stepParam = searchParams.get('step');

    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<(Application & {
        user: { email: string },
        documents: any[],
        course: any
    }) | null>(null);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchApplicationData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: currentUser } } = await supabase.auth.getUser();

                if (!currentUser) {
                    console.log('[ApplicationWizard] No active session, redirecting to login');
                    router.push('/portal/account/login');
                    return;
                }

                const currentUserId = currentUser.id;

                const { data: applicationRaw, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*, school:School(*)),
                        user:profiles(email),
                        documents:application_documents(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', currentUserId || '')
                    .single();

                if (appError || !applicationRaw) {
                    if (appError?.code === 'PGRST116' || !applicationRaw) {
                        console.warn(`[ApplicationWizard] Application not found. ID: ${id}, User: ${currentUserId}`);
                    } else {
                        console.error('[ApplicationWizard] Error fetching application:', appError);
                    }
                    router.push('/portal/dashboard');
                    return;
                }

                setApplication(applicationRaw as any);
            } catch (err) {
                console.error('CRITICAL: Fetching application failed', err);
                router.push('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
    }, [id, stepParam, router, supabase]);

    const refreshApplication = async () => {
        setLoading(true);
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const { data: applicationRaw } = await supabase
                .from('applications')
                .select(`
                    *,
                    course:Course(*, school:School(*)),
                    user:profiles(email),
                    documents:application_documents(*)
                `)
                .eq('id', id)
                .eq('user_id', currentUser.id)
                .single();

            if (applicationRaw) {
                setApplication(applicationRaw as any);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!application) return null;

    // Define Base Steps
    const stepsConf = [
        { id: 1, name: 'Instructions', key: 'instructions' },
        { id: 2, name: 'Personal Info', key: 'personal_info' },
        { id: 3, name: 'Contact Details', key: 'contact_details' },
        { id: 4, name: 'Academic History', key: 'education_history' },
        { id: 5, name: 'Motivation Letter / Statement of Purpose', key: 'motivation' },
        { id: 6, name: 'Documents', key: 'documents' },
        { id: 7, name: 'Review', key: 'review' },
    ];

    // Calculate Progress and Allowed Step
    const getStepStatus = (index: number) => {
        const step = stepsConf[index];
        if (step.key === 'instructions') return true;
        if (step.key === 'documents') {
            const requiredTypes = ['PASSPORT', 'TRANSCRIPT', 'CERTIFICATE', 'CV'];
            const uploadedTypes = application.documents?.map(d => d.type) || [];
            return requiredTypes.every(type => uploadedTypes.includes(type));
        }
        if (step.key === 'review') return false;
        return (application as any)[step.key] != null;
    };

    // Find the latest step reached
    let maxAllowedStep = 1;
    const hasStartedFilling = application.personal_info != null;

    for (let i = 0; i < stepsConf.length - 1; i++) {
        if (getStepStatus(i)) {
            maxAllowedStep = i + 2;
        } else {
            break;
        }
    }

    // Determine requested step vs allowed step
    const defaultStep = hasStartedFilling ? maxAllowedStep : 1;
    const requestedStep = stepParam ? parseInt(stepParam) : defaultStep;
    const currentStepId = Math.min(requestedStep, maxAllowedStep);
    const currentStep = stepsConf.find(s => s.id === currentStepId) || stepsConf[0];

    // Instructions for the current course
    const programmeInstructions = getProgrammeInstructions(application.course?.slug);

    const steps = stepsConf.map((step) => {
        const isCompleted = getStepStatus(step.id - 1);
        let status = 'upcoming';
        if (step.id === currentStepId) {
            status = 'current';
        } else if (isCompleted || step.id < currentStepId) {
            status = 'completed';
        }
        return { ...step, status, isLocked: step.id > maxAllowedStep };
    });

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 border-b border-neutral-200 pb-6 text-neutral-900">
                <div className="flex items-center gap-2 text-sm text-[#2d2d2d] mb-2">
                    <Link href="/portal/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                    <ChevronRight size={14} weight="bold" />
                    <span className="font-medium">Application #{application.application_number || application.id.slice(0, 8)}</span>
                </div>
                <h1 className="text-xl font-semibold tracking-tight uppercase">
                    {application.course?.title}
                    {application.course?.duration && (
                        <span className="text-[#2d2d2d] font-medium lowercase"> — {application.course.duration}</span>
                    )}
                    {application.course?.school && (
                        <span className="text-[#2d2d2d] font-medium lowercase"> — {application.course.school.name}</span>
                    )}
                </h1>
                <p className="text-[#2d2d2d] font-semibold tracking-tight text-xs uppercase">Step {currentStepId} / {stepsConf.length}: {currentStep.name}</p>
            </div>

            {application.status === 'ADMITTED' && (
                <div className="mb-8 bg-emerald-50 border border-emerald-100 p-6 rounded-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-emerald-900 font-bold uppercase tracking-tight text-sm mb-1">Congratulations! You have an admission offer.</h3>
                        <p className="text-emerald-700 text-xs font-medium uppercase tracking-widest">Please review your offer letter and accept it to proceed with your enrollment.</p>
                    </div>
                    <Link
                        href={`/portal/application/letter?id=${application.id}`}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} weight="bold" />
                        View Offer Letter
                    </Link>
                </div>
            )}

            {application.status === 'OFFER_ACCEPTED' && (
                <div className="mb-8 bg-blue-50 border border-blue-100 p-6 rounded-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-blue-900 font-bold uppercase tracking-tight text-sm mb-1">Offer Accepted</h3>
                        <p className="text-blue-700 text-xs font-medium uppercase tracking-widest">You have accepted the offer. Please finalize your tuition payment to complete enrollment.</p>
                    </div>
                    <Link
                        href={`/portal/application/payment?id=${application.id}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                    >
                        Proceed to Payment
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-2 space-y-0.5">
                    {steps.map((step) => {
                        const isClickable = !step.isLocked;
                        const content = (
                            <div
                                className={`flex items-center gap-2 p-2 rounded-sm text-[10px] font-semibold transition-all ${step.status === 'current' ? 'border border-primary text-primary' :
                                    step.status === 'completed' ? 'text-primary hover:bg-neutral-50' : 'text-[#2d2d2d]'
                                    } ${!isClickable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${step.status === 'current' ? 'border-primary' : 'border-current'
                                    }`}>
                                    {step.id}
                                </div>
                                <span className="uppercase tracking-widest">{step.name}</span>
                            </div>
                        );

                        if (isClickable) {
                            return <Link key={step.id} href={`?id=${id}&step=${step.id}`}>{content}</Link>;
                        }
                        return <div key={step.id}>{content}</div>;
                    })}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-neutral-100 h-fit space-y-6">
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold uppercase tracking-widest mb-6 pb-2 border-b border-neutral-100 text-neutral-900 leading-none">
                            {currentStep.name}
                        </h2>

                        {currentStep.id === 1 && (
                            <WelcomeStep
                                instructions={programmeInstructions}
                                nextStepHref={`?id=${id}&step=2`}
                            />
                        )}

                        {currentStep.id === 2 && (
                            <PersonalInfoForm
                                applicationId={application.id}
                                initialData={application.personal_info}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 3 && (
                            <ContactDetailsForm
                                applicationId={application.id}
                                initialData={application.contact_details}
                                defaultEmail={application.user?.email}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 4 && (
                            <AcademicHistoryForm
                                applicationId={application.id}
                                initialData={application.education_history}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 5 && (
                            <MotivationForm
                                applicationId={application.id}
                                initialData={application.motivation}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 6 && (
                            <DocumentsForm
                                applicationId={application.id}
                                existingDocuments={application.documents}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 7 && (
                            <ReviewStep application={application} />
                        )}
                    </div>
                </div>

                {/* Summary Sidebar (Always On) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white md:bg-neutral-50/50 p-4 md:p-8 rounded-sm border border-neutral-100 min-h-[500px]">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2d2d2d] mb-4">Application Summary</h3>

                        <div className="space-y-4">
                            {application.personal_info && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#2d2d2d] uppercase tracking-tight">Applicant</p>
                                    <p className="text-sm font-semibold text-neutral-900 leading-tight">
                                        {application.personal_info.firstName} {application.personal_info.lastName}
                                    </p>
                                </div>
                            )}

                            {application.contact_details && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#2d2d2d] uppercase tracking-tight">Contact</p>
                                    <p className="text-sm font-semibold text-neutral-900 leading-tight">{application.contact_details.email}</p>
                                    <p className="text-sm font-semibold text-neutral-900 leading-tight">{application.contact_details.phone}</p>
                                    {(application.contact_details.city || application.contact_details.country) && (
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {[application.contact_details.city, application.contact_details.country].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {application.motivation && application.motivation.statementOfPurpose && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#2d2d2d] uppercase tracking-tight">Statement</p>
                                    <p className="text-xs font-medium text-neutral-500 line-clamp-2">
                                        {application.motivation.statementOfPurpose}
                                    </p>
                                </div>
                            )}

                            {application.education_history?.education?.[0] && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#2d2d2d] uppercase tracking-tight">Latest Education</p>
                                    <p className="text-sm font-semibold text-neutral-900 leading-tight">
                                        {application.education_history.education[0].institution}
                                    </p>
                                    <p className="text-xs text-[#2d2d2d] font-medium">
                                        {application.education_history.education[0].degree}
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-neutral-200">
                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-tight text-[#2d2d2d]">
                                    <span>Documents</span>
                                    <span>{application.documents?.length || 0} / 4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationWizardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <ApplicationWizardContent />
        </Suspense>
    );
}

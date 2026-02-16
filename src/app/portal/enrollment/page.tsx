import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Application } from '@/types/database';
import Link from 'next/link';
import { CaretLeft as ChevronLeft, DownloadSimple as Download } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import PrintButton from '@/components/portal/PrintButton';
import Image from 'next/image';

export default async function EnrollmentConfirmationPage(props: {
    searchParams: Promise<{ id: string }>
}) {
    const { id } = await props.searchParams;

    if (!id) redirect('/portal/dashboard');

    const supabase = await createClient();

    // Verify Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/portal/account/login');

    const { data: applicationRaw } = await supabase
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

    if (!applicationRaw || applicationRaw.status !== 'ENROLLED') {
        // Redirect to dashboard if not enrolled yet
        redirect('/portal/dashboard');
    }

    // Fetch specific student record for this application
    const { data: student } = await supabase
        .from('students')
        .select('student_id')
        .eq('application_id', id)
        .single();

    const application = applicationRaw as Application & {
        user: any,
        course: any,
        offer: any[]
    };

    // In a real system, we'd have an enrollment_date timestamp. Using updated_at for now.
    const enrollmentDate = new Date(application.updated_at);
    const validUntil = new Date(enrollmentDate);
    validUntil.setFullYear(validUntil.getFullYear() + 1);

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
                    {/* Mock Download Button */}
                    <button className="flex items-center gap-2 border border-neutral-200 bg-white text-neutral-600 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all">
                        <Download size={16} weight="bold" />
                        Visa Support Pack
                    </button>
                    <PrintButton />
                </div>
            </div>

            {/* Document Container */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none min-h-[297mm] p-[20mm] md:p-[25mm] relative text-neutral-900 border border-neutral-100 print:border-0">

                <div className="flex justify-between items-start mb-16 border-b-2 border-neutral-900 pb-8">
                    <div>
                        <div className="mb-4 relative w-48 h-16">
                            <Image
                                src="/images/sykli-logo-official.png"
                                alt="Sykli College Official Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                                priority
                            />
                        </div>
                    </div>
                    <div className="text-right text-[10px] font-medium text-neutral-600 leading-relaxed uppercase tracking-wide">
                        <strong className="text-black">Office of the Registrar</strong><br />
                        Student Records Division<br />
                        Pohjoisesplanadi 51<br />
                        00150 Helsinki, Finland
                    </div>
                </div>

                {/* Meta Data Row */}
                <div className="flex justify-between items-end mb-12 text-xs">
                    <div>
                        <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date</span>
                        <span className="font-bold">{formatToDDMMYYYY(enrollmentDate.toISOString())}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Student ID</span>
                        <span className="font-mono bg-neutral-100 px-3 py-1.5 rounded-sm text-xs font-bold">{student?.student_id || application.user?.student_id || 'PENDING'}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-16">
                    <h1 className="text-2xl font-black uppercase tracking-widest text-neutral-900 mb-2">Confirmation of Enrollment</h1>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Academic Year 2026/2027</p>
                </div>

                {/* Student Details Grid */}
                <div className="bg-neutral-50 p-8 rounded-sm mb-12">
                    <div className="grid grid-cols-2 gap-y-6">
                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Student Name</div>
                            <div className="text-sm font-bold text-neutral-900 uppercase">{application.personal_info?.firstName} {application.personal_info?.lastName}</div>
                        </div>

                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date of Birth</div>
                            <div className="text-sm font-bold text-neutral-900">{formatToDDMMYYYY(application.user?.date_of_birth || '2006-01-01')}</div>
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Passport / ID</div>
                            <div className="text-sm font-bold text-neutral-900">{application.personal_info?.passportNumber || 'N/A'} (On File)</div>
                        </div>
                    </div>
                </div>

                {/* Certification Statement */}
                <div className="mb-12 text-sm leading-relaxed text-neutral-800">
                    <p className="mb-6">
                        This is to certify that <strong>{application.personal_info?.firstName} {application.personal_info?.lastName}</strong> is officially
                        enrolled as a full-time student at Sykli College.
                    </p>
                    <p className="mb-6">
                        The student has successfully completed all admission requirements, accepted the offer of place, and satisfied the initial tuition payment obligations for the <strong>{application.course?.title}</strong> programme.
                    </p>

                    <table className="w-full text-sm text-left border-t border-b border-neutral-200 my-8">
                        <tbody className="text-neutral-900">
                            <tr className="border-b border-neutral-100">
                                <td className="py-3 font-bold text-neutral-600 w-1/3">Programme</td>
                                <td className="py-3 font-bold">{application.course?.title}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="py-3 font-bold text-neutral-600">Level</td>
                                <td className="py-3">{application.course?.degreeLevel}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="py-3 font-bold text-neutral-600">Start Date</td>
                                <td className="py-3">September 1, 2026</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="py-3 font-bold text-neutral-600">Expected Graduation</td>
                                <td className="py-3">June 30, {application.course?.degreeLevel === 'MASTER' ? '2028' : '2030'}</td>
                            </tr>
                            <tr>
                                <td className="py-3 font-bold text-neutral-600">Study Mode</td>
                                <td className="py-3">Full-time, On-Campus</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        This certificate is issued for the purpose of residence permit applications, opening a bank account,
                        and obtaining student benefits.
                    </p>
                </div>

                {/* Signature */}
                <div className="mt-20 flex justify-between items-end">
                    <div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Issued Date</div>
                        <div className="text-sm font-bold text-neutral-900 mb-8">
                            {formatToDDMMYYYY(enrollmentDate.toISOString())}
                        </div>

                        <div className="w-48 h-20 mb-2 relative">
                            <Image
                                src="/images/official-signature.png"
                                alt="Signature"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
                            />
                        </div>
                        <div className="text-sm font-bold text-neutral-900 uppercase">
                            Helena Vihreä
                        </div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">
                            College Registrar
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-[10mm] left-[20mm] right-[20mm] border-t border-neutral-100 pt-2 flex justify-between items-center opacity-60">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                        Sykli College | Pohjoisesplanadi 51, 00150 Helsinki, Finland
                    </div>
                    <div className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                        Page 1 of 1
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

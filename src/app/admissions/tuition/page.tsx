import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, CreditCard, Bank as Landmark, ArrowsClockwise as RefreshCw, Calendar, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import TableOfContents from '@/components/course/TableOfContents';
import TuitionFAQ from '@/components/admissions/TuitionFAQ';

export const metadata = {
    title: 'Paying the Tuition Fee | Sykli College',
    description: 'Structure of tuition fees, payment methods (Flywire), and refund policies for international students at Sykli College.',
};

const tocSections = [
    { id: 'fee-structure', title: 'Fee Structure', content: '' },
    { id: 'bachelor-fees', title: 'Bachelor’s Fees', content: '' },
    { id: 'master-fees', title: 'Master’s Fees', content: '' },
    { id: 'merit-scholarship', title: 'Merit Scholarship', content: '' },
    { id: 'payment-methods', title: 'Payment Methods', content: '' },
    { id: 'timing', title: 'Payment Schedule', content: '' },
    { id: 'additional-fees', title: 'Additional Fees & Benefits', content: '' },
    { id: 'refunds', title: 'Refund Policy', content: '' },
    { id: 'faq', title: 'General FAQ', content: '' },
    { id: 'contact', title: 'Contact Support', content: '' },
];

import { SchemaLD } from '@/components/seo/SchemaLD';

export default function TuitionPaymentPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Who is required to pay tuition fees at Sykli College?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tuition fees are mandatory for students who are not citizens of the European Union (EU), European Economic Area (EEA), or Switzerland, and who are enrolled in English-taught Bachelor's or Master's degree programmes. Exemptions apply for holders of permanent Finnish residence permits, EU Blue Cards, and EU Family Member's Residence Cards."
                }
            },
            {
                "@type": "Question",
                "name": "How does the Paygowire payment process work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sykli College partners with Paygowire to provide a secure international payment experience. To pay: 1) Log in to your Sykli Applicant Portal. 2) Navigate to the 'Payment' section and click the Paygowire link. 3) Select your country and payment method. 4) Complete the payment to receive an official receipt."
                }
            },
            {
                "@type": "Question",
                "name": "What are the specific requirements for the Early Payment Discount?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer a 25% reduction on the first year's tuition fee if you accept your study offer within 14 days of receiving the admission letter AND the full payment reaches Sykli College's account within 21 days of the admission offer."
                }
            },
            {
                "@type": "Question",
                "name": "Detailed Refund Policy: When can I get my money back?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can receive a 100% refund (minus €100 admin fee) for a negative residence permit decision, failure to meet conditional admission requirements, or program cancellation. A 50% refund is available if you withdraw before the 'Add/Drop' deadline (within the first 4 weeks)."
                }
            },
            {
                "@type": "Question",
                "name": "Can I pay in instalments?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For the first academic year, the tuition fee must be paid in one full instalment to facilitate the residence permit process. For subsequent years, you may choose to pay in two instalments (per semester) with a small €50 administrative surcharge."
                }
            },
            {
                "@type": "Question",
                "name": "How do I maintain my scholarship eligibility?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To qualify for a 50% waiver on the next year's fee, you must complete at least 55 ECTS credits within the academic year and maintain a minimum weighted GPA of 3.5 / 5.0."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white">
            <SchemaLD data={faqSchema} />

            {/* Hero Section - Phase 3 Standard */}
            <div className="relative bg-neutral-900 text-white min-h-[450px] lg:h-[500px] flex items-center">
                <Image
                    src="/images/admissions/tuition-hero-new.jpg"
                    alt="Paying Tuition Fees"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="container mx-auto px-4 pt-32 pb-12 md:pt-48 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-[36px] md:text-5xl lg:text-7xl font-bold mb-6 leading-tight pt-8">
                            Paying the Tuition Fee
                        </h1>
                        <p className="text-[21px] text-white leading-relaxed max-w-2xl">
                            Comprehensive guide to fee levels, payment channels, and financial policies for the 2026 academic year.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <Link href="/admissions" className="inline-flex items-center gap-2 text-black hover:text-black mb-8 transition-colors group">
                    <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> Back to Admissions
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="lg:sticky lg:top-24">
                            <TableOfContents sections={tocSections} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-8 md:space-y-16">

                        {/* Intro */}
                        <section id="fee-structure" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6 text-black pb-10 pl-2">
                                How Much is the Tuition Fee?
                            </h2>
                            <p className="text-lg text-black leading-relaxed mb-6">
                                Tuition fees at Sykli College depend on your degree level, your field of study, and the start date of your study right.
                                The exact amount for your programme is always listed in your personal admission letter.
                            </p>
                            <div className="bg-neutral-50 p-6 md:p-12 pl-6 md:pl-16 rounded-xl">
                                <p className="font-medium text-black">
                                    <strong>Note:</strong> Students whose right to study began on or before 1 August 2025 may have different fee levels.
                                    The tables below apply to new students starting in <strong>2026</strong>.
                                </p>
                            </div>
                        </section>

                        {/* Bachelor's Fees */}
                        <section id="bachelor-fees" className="scroll-mt-32">
                            <h3 className="text-2xl font-bold mb-6 text-black">Bachelor’s Programmes</h3>
                            <p className="text-black mb-6 font-medium">Right to study starting on or after 1 August 2026</p>

                            <div className="rounded-xl border border-neutral-200 mb-8 overflow-hidden">
                                {/* Mobile View: Stacked Cards */}
                                <div className="md:hidden divide-y divide-neutral-200 bg-white">
                                    {[
                                        { field: "Business", year: "€4 000", term: "€2 000" },
                                        { field: "Arts and Architecture", year: "€4 000", term: "€2 000" },
                                        { field: "Technology & Engineering", year: "€6 000", term: "€3 000" },
                                        { field: "Science", year: "€7 500", term: "€3 750" }
                                    ].map((row, i) => (
                                        <div key={i} className="p-4 space-y-2 bg-white">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Field of Study</span>
                                                <span className="font-bold text-black text-right">{row.field}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tuition Fee / Year</span>
                                                <span className="text-black">{row.year}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Fee / Term</span>
                                                <span className="text-black">{row.term}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Traditional Table */}
                                <table className="hidden md:table w-full text-left border-collapse">
                                    <thead className="bg-neutral-900 text-white">
                                        <tr>
                                            <th className="p-4 font-bold">Field of Study</th>
                                            <th className="p-4 font-bold">Tuition Fee / Year</th>
                                            <th className="p-4 font-bold">Fee / Term (Autumn/Spring)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 text-black">
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4 font-medium">Business</td>
                                            <td className="p-4">€4 000</td>
                                            <td className="p-4">€2 000</td>
                                        </tr>
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4">Arts and Architecture</td>
                                            <td className="p-4">€4 000</td>
                                            <td className="p-4">€2 000</td>
                                        </tr>
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4 font-medium">Technology & Engineering</td>
                                            <td className="p-4">€6 000</td>
                                            <td className="p-4">€3 000</td>
                                        </tr>
                                        <tr><td colSpan={3} className="p-0 border-t border-neutral-300"></td></tr>
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4 font-medium">Science</td>
                                            <td className="p-4">€7 500</td>
                                            <td className="p-4">€3 750</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Early Payment Discount */}
                            <div className="bg-white border-2 border-neutral-100 rounded-2xl p-6 md:p-12 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="bg-black text-white p-2 rounded-full mt-1">
                                        <CreditCard size={24} weight="regular" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-3">Early Payment Discount</h4>
                                        <p className="text-black mb-4">
                                            New Bachelor’s students may receive a <strong>25% discount</strong> on their first academic year’s tuition if they:
                                        </p>
                                        <ul className="space-y-2 mb-6 text-sm text-black">
                                            <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1.5"></div> Accept their admission offer as instructed</li>
                                            <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1.5"></div> Pay tuition by the deadline (usually within 21 days of offer)</li>
                                        </ul>

                                        <div className="bg-neutral-100 p-6 md:p-12 pl-6 md:pl-16 rounded-xl shadow-sm">
                                            <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-black">Discounted Fees (1st Year Only)</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Business</span>
                                                    <span className="font-bold">€3 000</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Arts and Architecture</span>
                                                    <span className="font-bold">€3 000</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Technology & Engineering</span>
                                                    <span className="font-bold">€4 500</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Science</span>
                                                    <span className="font-bold">€5 625</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Master's Fees */}
                        <section id="master-fees" className="scroll-mt-32">
                            <h3 className="text-2xl font-bold mb-6 text-black">Master’s Programmes</h3>
                            <p className="text-black mb-6 font-medium">Right to study starting on or after 1 August 2026</p>

                            <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                {/* Mobile View: Stacked Cards */}
                                <div className="md:hidden divide-y divide-neutral-200 bg-white">
                                    {[
                                        { field: "Business", year: "€6 000", term: "€3 000" },
                                        { field: "Arts and Architecture", year: "€6 000", term: "€3 000" },
                                        { field: "Technology & Engineering", year: "€6 000", term: "€3 000" },
                                        { field: "Science", year: "€9 500", term: "€4 750" }
                                    ].map((row, i) => (
                                        <div key={i} className="p-4 space-y-2 bg-white">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Field of Study</span>
                                                <span className="font-bold text-black text-right">{row.field}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tuition Fee / Year</span>
                                                <span className="text-black">{row.year}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Fee / Term</span>
                                                <span className="text-black">{row.term}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Traditional Table */}
                                <table className="hidden md:table w-full text-left border-collapse">
                                    <thead className="bg-neutral-900 text-white">
                                        <tr>
                                            <th className="p-4 font-bold">Field of Study</th>
                                            <th className="p-4 font-bold">Tuition Fee / Year</th>
                                            <th className="p-4 font-bold">Fee / Term</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 text-black">
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4 font-medium">Business</td>
                                            <td className="p-4">€6 000</td>
                                            <td className="p-4">€3 000</td>
                                        </tr>
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4">Arts and Architecture</td>
                                            <td className="p-4">€6 000</td>
                                            <td className="p-4">€3 000</td>
                                        </tr>
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4 font-medium">Technology & Engineering</td>
                                            <td className="p-4">€6 000</td>
                                            <td className="p-4">€3 000</td>
                                        </tr>
                                        <tr><td colSpan={3} className="p-0 border-t border-neutral-300"></td></tr>
                                        <tr className="hover:bg-neutral-50">
                                            <td className="p-4 font-medium">Science</td>
                                            <td className="p-4">€9 500</td>
                                            <td className="p-4">€4 750</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Early Payment Discount */}
                            <div className="bg-white border-2 border-neutral-100 rounded-2xl p-6 md:p-12 shadow-sm mt-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-black text-white p-2 rounded-full mt-1">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-3">Early Payment Discount</h4>
                                        <p className="text-black mb-4">
                                            New Master’s students may receive a <strong>25% discount</strong> on their first academic year’s tuition if they:
                                        </p>
                                        <ul className="space-y-2 mb-6 text-sm text-black">
                                            <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1.5"></div> Accept their admission offer as instructed</li>
                                            <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1.5"></div> Pay tuition by the deadline (usually within 21 days of offer)</li>
                                        </ul>

                                        <div className="bg-neutral-100 p-6 md:p-12 pl-6 md:pl-16 rounded-xl shadow-sm">
                                            <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-black">Discounted Fees (1st Year Only)</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Business</span>
                                                    <span className="font-bold">€4 500</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Arts and Architecture</span>
                                                    <span className="font-bold">€4 500</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Technology & Engineering</span>
                                                    <span className="font-bold">€4 500</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Science</span>
                                                    <span className="font-bold">€7 125</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Merit Scholarship - Relocated */}
                            <div id="merit-scholarship" className="scroll-mt-32 mt-12">
                                <h4 className="text-xl font-bold mb-6 text-black">Merit Scholarship</h4>
                                <div className="bg-white border border-black rounded-2xl p-5 md:p-12 shadow-sm mb-8 relative overflow-hidden text-black">
                                    <div className="absolute top-8 -right-12 w-[180px] bg-[#fd6402] text-black py-1.5 font-black uppercase tracking-tighter text-xs transform rotate-45 text-center shadow-sm z-10">
                                        50% Waiver
                                    </div>
                                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                                        <div className="bg-black text-white p-3 rounded-full mt-1 shrink-0">
                                            <GraduationCap size={28} weight="regular" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Continuing Merit Scholarship</h3>
                                            <p className="text-lg text-black mb-6 leading-relaxed">
                                                Sykli College rewards academic excellence. After the first year of study, international students can apply for a merit scholarship that covers <strong>50% of the tuition fee</strong> for the next academic year.
                                            </p>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-sm uppercase tracking-widest text-neutral-500">Academic Criteria</h4>
                                                    <ul className="space-y-3">
                                                        <li className="flex gap-3 items-start">
                                                            <div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div>
                                                            <span className="text-black">Complete at least <strong>55 ECTS credits</strong> per academic year</span>
                                                        </li>
                                                        <li className="flex gap-3 items-start">
                                                            <div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div>
                                                            <span className="text-black">Maintain a minimum weighted GPA of <strong>3.5 / 5.0</strong></span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-sm uppercase tracking-widest text-neutral-500">Application & Review</h4>
                                                    <p className="text-sm text-black leading-relaxed">
                                                        Scholarship eligibility is automatically reviewed every August. Students who meet the criteria will be notified before the Autumn semester tuition deadline.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="payment-methods" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                                How Do I Pay?
                            </h2>
                            <div className="space-y-8">
                                <div className="bg-neutral-50 p-6 md:p-12 rounded-2xl border border-neutral-200">
                                    <div className="flex items-center gap-x-3 gap-y-2 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Landmark size={28} weight="regular" className="text-black flex-shrink-0" />
                                            <h3 className="text-xl md:text-2xl font-bold whitespace-nowrap">Partnership with</h3>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/paygowire-logo-v2.png"
                                                alt="Paygowire Logo"
                                                width={110}
                                                height={28}
                                                className="h-6 md:h-7 w-auto object-contain md:mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-black">
                                        <p className="text-lg">
                                            SYKLI College has partnered with <strong>Paygowire</strong> to provide a secure and convenient method for paying tuition fees.
                                        </p>
                                        <p>
                                            Paying through Paygowire is simple, safe, and transparent.
                                        </p>
                                        <div className="bg-white p-6 md:p-12 border border-neutral-200 shadow-sm relative group overflow-hidden">
                                            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Detailed Payment Steps</h4>
                                            <ol className="space-y-3 list-decimal pl-5">
                                                <li>Access the Paygowire payment portal via your Sykli Applicant dashboard.</li>
                                                <li>Select your country of origin and the exact tuition amount.</li>
                                                <li>Choose your preferred payment method (bank transfer, credit card, etc.).</li>
                                                <li>Complete the payment and download your secure receipt.</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-neutral-50 p-6 pl-12 md:p-12 md:pl-20 rounded-2xl border border-neutral-200 border-l-4 border-l-black">
                                    <h3 className="text-xl font-bold mb-4">Important: Residence Permits & Deadlines</h3>
                                    <div className="space-y-4 text-black">
                                        <p className="text-sm leading-relaxed">
                                            If you are applying for a residence permit, but have not yet paid the tuition fee, please make sure you have sufficient funds to cover the tuition fee and living expenses in Finland according to the Finnish Migration Services instructions:{' '}
                                            <a
                                                href="https://migri.fi/en/residence-permit-application-for-studies"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold underline hover:text-neutral-700"
                                            >
                                                Finnish Migration Services (Migri)
                                            </a>.
                                        </p>
                                        <p className="text-sm font-bold">
                                            Please remember to start the process for obtaining a residence permit as soon as possible.
                                        </p>
                                        <p className="text-sm">
                                            The due date for the second academic year’s tuition fee payment is <strong>15th of September</strong>.
                                        </p>
                                        <p className="text-xs text-neutral-500 italic">
                                            If you have any questions about the tuition fee payment, please contact{' '}
                                            <a href="mailto:admissions@syklicollege.fi" className="underline font-bold text-black">
                                                admissions@syklicollege.fi
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-black text-white p-6 md:p-12 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <RefreshCw size={24} weight="bold" className="text-white" />
                                        <h3 className="text-xl font-bold">Payment Confirmation & Enrolment</h3>
                                    </div>
                                    <p className="text-white/90 leading-relaxed">
                                        Tuition fees must be fully paid and received by SYKLI College before a student can enrol as an attending student.
                                        <strong> Enrolment cannot be completed until payment has been confirmed.</strong>
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Timing */}
                        <section id="timing" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6 text-black pb-10 pl-2">Tuition Fee Payment Schedule</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-neutral-50 p-6 md:p-12 rounded-2xl border border-neutral-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar size={24} weight="regular" className="text-black" />
                                        <h3 className="text-xl font-bold">First Academic Year</h3>
                                    </div>
                                    <p className="text-black mb-4">
                                        After accepting the admission offer as binding, students may proceed with tuition fee payment.
                                        The tuition fee for the first academic year <strong>must be paid in a single instalment</strong>, covering the full academic year.
                                        Payment in multiple instalments is not permitted for first-year enrolment.
                                    </p>
                                </div>
                                <div className="bg-neutral-50 p-6 md:p-12 rounded-2xl border border-neutral-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar size={24} className="text-black" />
                                        <h3 className="text-xl font-bold">After the First Year</h3>
                                    </div>
                                    <p className="text-black mb-4">
                                        Students are strongly encouraged to pay the full tuition fee in one instalment during the annual enrolment period.
                                        Alternatively, tuition fees may be paid in two instalments (autumn term and spring term).
                                        <em> Note: choosing this option requires enrolling as non-attending for the unpaid term.</em>
                                    </p>
                                    <div className="mt-4 p-4 bg-neutral-100 rounded-lg border border-neutral-200 text-sm text-black">
                                        <strong>Important:</strong> Non-attending status may affect matters such as visa or residence permit conditions.
                                    </div>
                                </div>
                            </div>
                            <p className="mt-8 text-black italic text-center">
                                For further details on enrolment and payment procedures, students are advised to consult the official <strong>SYKLI College enrolment guidelines</strong>.
                            </p>
                        </section>

                        {/* Additional Fees & Student Benefits */}
                        <section id="additional-fees" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                                Additional Fees & Student Benefits
                            </h2>
                            <div className="bg-white border border-neutral-200 rounded-3xl p-8 md:p-16 space-y-16">
                                {/* Financial & Living Costs */}
                                <div className="max-w-4xl">
                                    <h3 className="text-2xl font-bold mb-6">Financial Requirements & Living Costs</h3>
                                    <p className="text-neutral-600 leading-relaxed mb-8 text-lg">
                                        Besides tuition fees, make sure that you have sufficient financial means for your living costs such as rent, personal expenses, transportation costs, meals, insurance, etc. Please also remember that an income requirement by the Finnish Immigration Service may apply to you.
                                    </p>
                                    <div className="p-8 pl-14 md:pl-20 bg-neutral-50 rounded-2xl border-l-4 border-l-black">
                                        <p className="font-bold text-black italic">
                                            SYKLI College has a housing quota especially for tuition fee-liable international degree students moving to Finland.
                                        </p>
                                    </div>
                                </div>

                                {/* Included in Tuition */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-neutral-50 rounded-3xl">
                                        <h3 className="text-xl font-bold mb-4">What's Included?</h3>
                                        <p className="text-neutral-600 mb-6">
                                            The tuition fee includes teaching and access to the newest learning facilities. The services provided to students by the College are free.
                                        </p>
                                        <ul className="grid grid-cols-1 gap-3">
                                            {[
                                                "Library access",
                                                "Student Services",
                                                "Career Services",
                                                "Exchange Services",
                                                "Study support"
                                            ].map((item, i) => (
                                                <li key={i} className="flex gap-2 items-center text-sm font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-8 bg-black text-white rounded-3xl">
                                        <h3 className="text-xl font-bold mb-4">HYY Student Union</h3>
                                        <p className="text-white/80 text-sm leading-relaxed mb-6">
                                            The tuition fee includes the compulsory Student Union (HYY) membership. HYY provides substantial benefits, advocacy work and events throughout the year.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">
                                                Significant meal discounts (Unicafe)
                                            </div>
                                            <div className="p-3 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">
                                                Public transport reductions
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Healthcare & Insurance */}
                                <div className="pt-16">
                                    <h3 className="text-2xl font-bold mb-6">Healthcare & Insurance</h3>
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <p className="text-neutral-600 leading-relaxed">
                                                Please note that you need to pay Finnish Student Health Service fee directly to <strong>Kela</strong> according to their instructions.
                                            </p>
                                            <div className="p-8 pl-14 md:pl-20 bg-black text-white rounded-2xl border-l-4 border-l-neutral-700">
                                                <p className="text-sm text-white/90 leading-relaxed">
                                                    <strong>Important:</strong> Remember to check that you have valid health insurance. The FSHS only provides basic healthcare and does not cover extensive medical operations or emergency services.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="font-bold text-lg mb-2">Is orientation mandatory?</h4>
                                                <p className="text-sm text-neutral-600 leading-relaxed">
                                                    Yes, it provides essential info for starting your studies. All students are expected to attend the sessions during the first week.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-2">Can I bring my family?</h4>
                                                <p className="text-sm text-neutral-600 leading-relaxed">
                                                    Yes, family members can apply for residence permits based on family ties. However, the student permit applicant must demonstrate sufficient financial resources for the entire family's stay.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Refunds */}
                        <section id="refunds" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                                Refund Policy
                            </h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                        <RefreshCw size={20} weight="bold" /> Full Refund Cases
                                    </h3>
                                    <ul className="grid md:grid-cols-2 gap-4">
                                        {[
                                            "Conditional offer cancelled (conditions not met)",
                                            "Renounce study right during enrolment",
                                            "Residence permit denied",
                                            "Residence status becomes exempt (e.g. permanent)",
                                            "Programme cancellation by College"
                                        ].map((item, i) => (
                                            <li key={i} className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 text-sm flex gap-3 items-start">
                                                <div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1.5"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-neutral-50 p-6 md:p-10 rounded-xl border border-neutral-200">
                                    <h3 className="font-bold text-lg mb-2">Refund Application</h3>
                                    <p className="text-black mb-4">
                                        To request a refund, contact the College’s tuition fee team. You must submit the request by the relevant deadline.
                                    </p>
                                    <div className="text-sm text-black">
                                        <strong>Note:</strong> Refunds normally exclude service and bank charges. For full details, please visit our <Link href="/refund-withdrawal-policy/" className="underline font-bold">Refund & Withdrawal Policy</Link>.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section id="faq" className="scroll-mt-32 pt-16">
                            <h2 className="text-[28px] md:text-3xl font-bold mb-8 text-black pl-2">
                                Frequently Asked Questions
                            </h2>
                            <div className="bg-white rounded-3xl overflow-hidden">
                                <TuitionFAQ />
                            </div>
                        </section>

                        {/* Contact */}
                        <section id="contact" className="scroll-mt-32 bg-black text-white p-6 md:p-12 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-4">Contact and Support</h2>
                            <p className="text-white mb-6">
                                If you have questions about payment processes, deadlines, or refunds, please contact the Tuition Fee Office.
                            </p>
                            <a href="mailto:tuition@syklicollege.fi" className="inline-block bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
                                Contact Tuition Office
                            </a>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}


import { CheckCircle, ArrowRight, FileText, Calendar, GraduationCap, Globe, Clock } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'How to Apply | Kestora College',
    description: 'Step-by-step guide to applying to Kestora College. Deadlines, requirements, and admission procedures.',
};

export default function ApplicationProcessPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="relative bg-neutral-900 text-white h-auto min-h-[400px] lg:h-[400px]">
                <Image
                    src="/images/admissions/how_to_apply_hero.png"
                    alt="Application Process"
                    fill
                    priority
                    className="object-cover opacity-60"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-0 left-0 w-full pt-32 pb-8 px-4 md:pt-48 md:pb-16 z-10">
                    <div className="container mx-auto">
                        <h1 className="text-5xl font-bold mb-6">How to Apply</h1>
                        <p className="text-xl max-w-2xl text-neutral-300 leading-relaxed">
                            Follow our step-by-step guide to ensure a smooth application process for your studies at Kestora College.
                        </p>
                        <p className="mt-4 text-lg max-w-2xl text-neutral-400 leading-relaxed">
                            Learn more about <Link href="/" className="underline text-white font-medium hover:text-neutral-300 hover:no-underline transition-colors">Kestora College Helsinki</Link>, our independent higher education institution in Finland.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-20">

                    {/* Section: Application Steps */}
                    <section id="steps">
                        <h2 className="text-3xl font-bold mb-12 border-b border-black pb-10 pl-2">Application Steps</h2>
                        <div className="space-y-16">

                            {/* Step 01 */}
                            <div className="flex gap-8 group">
                                <div className="text-5xl font-bold text-neutral-200 group-hover:text-black transition-colors">01</div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold">Prepare in Advance</h3>
                                    <ul className="space-y-3 text-neutral-700">
                                        <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Check programme-specific eligibility</li>
                                        <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Prepare official documents and translations</li>
                                        <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Schedule language tests (TOEFL/IELTS) and GMAT/GRE if required</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 02 */}
                            <div className="flex gap-8 group">
                                <div className="text-5xl font-bold text-neutral-200 group-hover:text-black transition-colors">02</div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold">Fill in the Online Application</h3>
                                    <p className="font-bold">Application period: 1 Dec 2025 – 31 March 2026</p>
                                    <ul className="space-y-3 text-neutral-700">
                                        <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Only one form per applicant</li>
                                        <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Can include two programmes ranked by preference</li>
                                        <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Edit application until closing date</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 03 */}
                            <div className="flex gap-8 group">
                                <div className="text-5xl font-bold text-neutral-200 group-hover:text-black transition-colors">03</div>
                                <div className="space-y-4 w-full max-w-xl">
                                    <h3 className="text-2xl font-bold">Application Fee</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-6 bg-neutral-900 text-white rounded-lg">
                                            <div className="font-bold opacity-80 text-sm uppercase tracking-wider mb-2">Non-EU/EEA/Swiss</div>
                                            <div className="text-2xl font-bold">Free</div>
                                        </div>
                                        <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-lg">
                                            <div className="font-bold text-neutral-500 text-sm uppercase tracking-wider mb-2">EU/EEA/Swiss</div>
                                            <div className="text-2xl font-bold">Free</div>
                                        </div>
                                    </div>
                                    <p className="text-neutral-500 text-sm">No payment required to submit your application.</p>
                                </div>
                            </div>

                            {/* Step 04 */}
                            <div className="flex gap-8 group">
                                <div className="text-5xl font-bold text-neutral-200 group-hover:text-black transition-colors">04</div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold">Upload Required Documents</h3>
                                    <p className="font-bold">Deadline: 7 April 2026 at 15:00 (UTC+2)</p>
                                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-neutral-700">
                                        <li className="flex gap-3 items-center"><FileText size={18} /> Bachelor’s degree & transcripts</li>
                                        <li className="flex gap-3 items-center"><FileText size={18} /> Proof of English proficiency (optional)</li>
                                        <li className="flex gap-3 items-center"><FileText size={18} /> Passport or official ID</li>
                                        <li className="flex gap-3 items-center"><FileText size={18} /> CV, Motivation Letter</li>
                                        <li className="flex gap-3 items-center"><FileText size={18} /> Portfolio (if required)</li>
                                        <li className="flex gap-3 items-center text-neutral-600"><FileText size={18} strokeWidth={1.5} /> GMAT/GRE (if required)</li>
                                    </ul>
                                    <p className="text-sm text-neutral-500 italic">File format: PDF only, named appropriately (e.g., CV-Lastname-Firstname.pdf)</p>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Section: Required Documents Explained */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8">Required Documents Explained</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-10 bg-neutral-50 border border-neutral-100 rounded-xl">
                                <h4 className="font-bold mb-3 text-lg">Certified Educational Documents</h4>
                                <p className="text-sm text-neutral-600 leading-relaxed">Must be submitted after admission decision by 13 May or 14 August 2026.</p>
                            </div>
                            <div className="p-10 bg-neutral-50 border border-neutral-100 rounded-xl">
                                <h4 className="font-bold mb-3 text-lg">Translations</h4>
                                <p className="text-sm text-neutral-600 leading-relaxed">Non-English/Finnish/Swedish documents require official translations.</p>
                            </div>
                            <div className="p-6 bg-neutral-50 border border-neutral-100 rounded-xl">
                                <h4 className="font-bold mb-3 text-lg">Passport/ID</h4>
                                <p className="text-sm text-neutral-600 leading-relaxed">Color PDF of the personal information page.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Specific Requirements Checklist */}
                    <section>
                        <div className="rounded-2xl p-10 md:p-12 bg-neutral-50">
                            <h3 className="font-bold text-2xl mb-8">Specific Requirements Checklist</h3>
                            <ul className="space-y-6">
                                <li className="flex flex-col md:flex-row gap-4">
                                    <div className="font-bold w-48 text-lg">Basic Docs</div>
                                    <div className="text-neutral-600 flex-1">Motivation letter, CV / Resume, Certificates of work experience.</div>
                                </li>
                                <li className="flex flex-col md:flex-row gap-4">
                                    <div className="font-bold w-48 text-lg">Language</div>
                                    <div className="text-neutral-600 flex-1">English language proficiency is mandatory if english is not your official language. Acceptable tests: IELTS, TOEFL, or equivalent. Must be valid and submitted by deadline, or English Grade C or above.</div>
                                </li>
                                <li className="flex flex-col md:flex-row gap-4">
                                    <div className="font-bold w-48 text-lg">Tests</div>
                                    <div className="text-neutral-600 flex-1">GMAT/GRE required for certain Business and Economics programmes.</div>
                                </li>
                                <li className="flex flex-col md:flex-row gap-4">
                                    <div className="font-bold w-48 text-lg">Portfolio</div>
                                    <div className="text-neutral-600 flex-1">Required for Art & Design programmes.</div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Evaluation & Decisions, Waiting List, After */}
                    <section className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Evaluation & Decisions</h3>
                            <p className="text-neutral-700 mb-8 leading-relaxed">
                                Only complete applications are evaluated based on programme-specific criteria. Admission results will be published on <strong>15 May 2026</strong>.
                            </p>

                            <h3 className="text-2xl font-bold mb-4">Waiting List Procedure</h3>
                            <p className="text-neutral-700 leading-relaxed">
                                Places on the waiting list may be offered until <strong>26 June 2026</strong>.
                            </p>
                        </div>
                        <div className="bg-neutral-50 p-12 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-6">
                                After Being Admitted
                            </h3>
                            <ul className="space-y-4 text-neutral-700">
                                <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Accept the offer by the stated deadline (5 June 2026).</li>
                                <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Submit certified documents (19 June or 21 August 2026).</li>
                                <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Pay tuition fees (if applicable).</li>
                                <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-black mt-2"></div> Complete enrolment and orientation.</li>
                            </ul>
                        </div>
                    </section>

                    {/* NEW SECTION: Ready to Apply */}
                    <section className="bg-black text-white p-6 md:p-12 rounded-3xl text-center space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                            <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
                                Join the next generation of global leaders at Kestora College. Create your portal account to begin your official application.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/portal/account/register"
                                className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 justify-center"
                            >
                                Create Portal Account <ArrowRight size={20} weight="bold" />
                            </Link>
                            <Link
                                href="/portal/account/login"
                                className="bg-transparent border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold hover:bg-white/10 transition-colors inline-block"
                            >
                                Existing Student? Log In
                            </Link>
                        </div>
                        <p className="text-neutral-500 text-xs italic">
                            Already have an account? Your progress will be saved automatically as you complete each step.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import Image from 'next/image';
import { CaretLeft, Calendar, FileText, CheckCircle, GraduationCap, Globe, Clock, ArrowRight, User, Trophy as Award } from '@phosphor-icons/react/dist/ssr';
import TableOfContents from '@/components/course/TableOfContents';
import AdmissionsCTA from '@/components/admissions/AdmissionsCTA';
import MasterFAQ from '@/components/admissions/MasterFAQ';


export const metadata = {
    title: 'Apply to Master’s Programmes | Kestora University',
    description: 'Application guide for Master’s programmes at Kestora University. Deadlines, eligibility, and steps for 2026 admission.',
};

const tocSections = [
    { id: 'schedule', title: 'Admissions Schedule', content: '' },
    { id: 'study-options', title: 'Study Options', content: '' },
    { id: 'scholarships', title: 'Scholarships & Tuition Fees', content: '' },
    { id: 'eligibility', title: 'General Eligibility', content: '' },
    { id: 'field-reqs', title: 'Field-Specific Reqs', content: '' },
    { id: 'incomplete', title: 'Incomplete Degree', content: '' },
    { id: 'steps', title: 'Application Steps', content: '' },
    { id: 'documents', title: 'Required Documents', content: '' },
    { id: 'language', title: 'Language Requirements', content: '' },
    { id: 'gmat', title: 'GMAT/GRE', content: '' },
    { id: 'decisions', title: 'Decisions', content: '' },
    { id: 'after', title: 'After Admission', content: '' },
    { id: 'faq', title: 'FAQ', content: '' },
];



export default function MasterAdmissionsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION (Split Style) */}
            <section className="bg-[#1c1c1c] text-white overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-12 h-auto min-h-[500px] md:pt-48 lg:h-[650px] lg:py-0 relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight pt-8">
                            Apply to Master’s Programmes
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-xl leading-relaxed">
                            Comprehensive guide for applicants to two-year Master’s programmes taught in English.
                            Admission period: <strong>1 Dec 2025 – 31 March 2026</strong>.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="#steps"
                                className="inline-block border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                            >
                                How to Apply
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-8 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl overflow-hidden">
                            <Image
                                src="/images/admissions/master_hero_refined.jpg"
                                alt="Master's Application"
                                fill
                                priority
                                className="object-cover opacity-90"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-12 left-12">
                                <p className="text-sm font-mono uppercase tracking-widest text-white/70 mb-2">Admissions</p>
                                <p className="text-2xl font-bold">Master’s 2026 Intake</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <Link href="/admissions" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-8 transition-colors group">
                    <CaretLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> Back to Admissions
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="lg:sticky lg:top-24">
                            <TableOfContents sections={tocSections} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-8 md:space-y-20">

                        {/* 1. Admissions Schedule */}
                         <section id="schedule" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                                 1. Admissions Schedule (Updated)
                             </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {/* PHASE 1: APPLICATION */}
                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-black shadow-sm transition-all group hover:shadow-md">
                                     <div className="flex items-center gap-3 mb-6">
                                         <div className="w-10 h-10 bg-gray-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">01</div>
                                         <div>
                                             <h3 className="font-bold uppercase tracking-widest text-xs text-gray-600">Application Phase</h3>
                                             <p className="text-lg font-bold">Submit Your Interest</p>
                                         </div>
                                     </div>
                                     <div className="space-y-6 flex-grow text-gray-700">
                                         <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-400 before:rounded-full">
                                             <span className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">1 Dec 2025</span>
                                             <p className="font-medium text-sm">Application period opens at 09:00 UTC+2</p>
                                         </div>
                                         <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-400 before:rounded-full">
                                             <span className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">31 March 2026</span>
                                             <p className="font-bold text-sm">Application closes at 15:00 UTC+2</p>
                                         </div>
                                         <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-400 before:rounded-full">
                                             <span className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">7 April 2026</span>
                                             <p className="font-bold text-sm">Final deadline to upload all documents (15:00 UTC+2)</p>
                                         </div>
                                     </div>
                                 </div>

                                 {/* PHASE 2: EVALUATION */}
                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-black shadow-sm transition-all group hover:shadow-md">
                                     <div className="flex items-center gap-3 mb-6">
                                         <div className="w-10 h-10 bg-gray-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">02</div>
                                         <div>
                                             <h3 className="font-bold uppercase tracking-widest text-xs text-gray-600">Evaluation Phase</h3>
                                             <p className="text-lg font-bold">Academic Review</p>
                                         </div>
                                     </div>
                                     <div className="space-y-6 flex-grow text-gray-700">
                                         <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-400 before:rounded-full">
                                             <span className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Jan – Mar 2026</span>
                                             <p className="font-medium text-sm leading-relaxed">Applications are carefully evaluated by the admissions committee and faculty.</p>
                                         </div>
                                     </div>
                                 </div>

                                 {/* PHASE 3: RESULTS */}
                                 <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-3xl p-8 flex flex-col h-full shadow-lg transform md:scale-[1.02] relative z-10">
                                     <div className="flex items-center gap-3 mb-6">
                                         <div className="w-10 h-10 bg-white text-gray-700 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">03</div>
                                         <div>
                                             <h3 className="font-bold uppercase tracking-widest text-xs text-gray-100">Results Phase</h3>
                                             <p className="text-lg font-bold">Selection Decisions</p>
                                         </div>
                                     </div>
                                     <div className="space-y-6 flex-grow">
                                         <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-white before:rounded-full">
                                             <span className="block text-xs font-bold uppercase tracking-wider text-gray-100 mb-1">Within 1 Week</span>
                                             <p className="font-black text-xl tracking-tight">Admission results published</p>
                                         </div>
                                         <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-white/50 before:rounded-full">
                                             <span className="block text-xs font-bold uppercase tracking-wider text-gray-100 mb-1">Until 26 June 2026</span>
                                             <p className="font-medium text-sm">Waiting list admissions end</p>
                                         </div>
                                     </div>
                                 </div>

                                 {/* PHASE 4: ENROLLMENT */}
                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-black shadow-sm transition-all group hover:shadow-md">
                                     <div className="flex items-center gap-3 mb-6">
                                         <div className="w-10 h-10 bg-gray-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">04</div>
                                         <div>
                                             <h3 className="font-bold uppercase tracking-widest text-xs text-gray-600">Enrollment Phase</h3>
                                             <p className="text-lg font-bold">Journey Begins</p>
                                         </div>
                                     </div>
                                     <div className="space-y-4 flex-grow">
                                         <div className="grid grid-cols-1 gap-4">
                                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm text-gray-900">
                                                 <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">5 June 2026</span>
                                                 <p className="text-xs font-bold">Deadline to accept place</p>
                                             </div>
                                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm text-gray-900">
                                                 <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">19 June / 21 Aug</span>
                                                 <p className="text-xs font-bold">Submit certified documents</p>
                                             </div>
                                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm text-gray-900">
                                                 <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">Aug – Sep</span>
                                                 <p className="text-xs font-black uppercase text-gray-500">Studies Start</p>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        </section>

                         {/* 2. Study Options */}
                         <section id="study-options" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">2. Study Options</h2>
                             <p className="text-lg text-gray-700 mb-6">
                                 Kestora University offers Master’s programmes in several fields. Applicants may apply to a maximum of <strong>two programmes</strong> per application.
                             </p>
                             <div className="grid md:grid-cols-3 gap-6">
                                 <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-xl mb-2 text-gray-800">Business & Economics</h3>
                                     <p className="text-sm text-gray-700 leading-relaxed">MSc in Accounting & Finance, Strategic Management, etc.</p>
                                 </div>
                                 <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-xl mb-2 text-gray-800">Art & Design</h3>
                                     <p className="text-sm text-gray-700 leading-relaxed">MA in Design, Architecture, and Visual Arts</p>
                                 </div>
                                 <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-xl mb-2 text-gray-800">Technology & Engineering</h3>
                                     <p className="text-sm text-gray-700 leading-relaxed">MSc in Engineering, Computer Science, Data Analytics</p>
                                 </div>
                             </div>
                         </section>

                         {/* 3. Scholarships & Tuition Fees */}
                         <section id="scholarships" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                                 3. Scholarships and Tuition Fees
                             </h2>
                             <div className="grid md:grid-cols-2 gap-12 items-start">
                                 <div className="space-y-6">
                                     <p className="text-lg text-gray-700 leading-relaxed">
                                         At Kestora University, we believe in rewarding academic excellence and supporting students through various financial aid options.
                                         Our scholarship programme is designed to help international talent thrive in Finland.
                                     </p>
                                     <ul className="space-y-4">
                                         <li className="flex gap-4 items-start">
                                             <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                                             <div>
                                                 <strong className="block text-black">Merit-Based Scholarships</strong>
                                                 <span className="text-gray-700 text-sm">Awarded to top-performing applicants based on previous academic records.</span>
                                             </div>
                                         </li>
                                         <li className="flex gap-4 items-start">
                                             <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                                             <div>
                                                 <strong className="block text-black">Performance Waivers</strong>
                                                 <span className="text-gray-700 text-sm">Maintain a 3.5 GPA and 55 ECTS/year for a 50% waiver from the 2nd year onwards.</span>
                                             </div>
                                         </li>
                                     </ul>
                                     <Link href="/admissions/tuition" className="inline-flex items-center gap-2 text-gray-600 font-bold hover:text-gray-800 transition-colors">
                                         See detailed tuition info <ArrowRight size={16} weight="bold" />
                                     </Link>
                                 </div>

                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-black p-12 pl-16 rounded-3xl shadow-sm">
                                     <h3 className="font-bold text-sm mb-6 uppercase tracking-wider text-gray-800">Discounted Fees (1st Year Only)</h3>
                                     <div className="space-y-4">
                                         <div className="flex justify-between border-b border-gray-100 pb-2">
                                             <span className="text-gray-900">Business</span>
                                             <span className="font-bold text-black">€4 500</span>
                                         </div>
                                         <div className="flex justify-between border-b border-gray-100 pb-2">
                                             <span className="text-gray-900">Arts and Architecture</span>
                                             <span className="font-bold text-black">€4 500</span>
                                         </div>
                                         <div className="flex justify-between border-b border-gray-100 pb-2">
                                             <span className="text-gray-900">Technology & Engineering</span>
                                             <span className="font-bold text-black">€4 500</span>
                                         </div>
                                         <div className="flex justify-between">
                                             <span className="text-gray-900">Science</span>
                                             <span className="font-bold text-black">€7 125</span>
                                         </div>
                                     </div>
                                     <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl text-xs text-gray-800 italic shadow-sm">
                                         * Early Payment Discount (25%) applies to the first year tuition fee when paid within 7 days.
                                     </div>
                                 </div>
                             </div>
                         </section>

                         {/* 4. General Eligibility */}
                         <section id="eligibility" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">4. General Eligibility Criteria</h2>
                             <div className="bg-black text-white p-12 rounded-3xl shadow-xl">
                                 <ul className="space-y-4 text-lg">
                                     <li className="flex gap-4 items-start">
                                         <GraduationCap className="mt-1 shrink-0 text-gray-300" size={24} weight="regular" />
                                         <span>Hold a Bachelor’s degree (180 ECTS) or equivalent.</span>
                                     </li>
                                     <li className="flex gap-4 items-start">
                                         <Globe className="mt-1 shrink-0 text-gray-300" size={24} weight="regular" />
                                         <span>Degree must enable eligibility for Master’s study in the awarding country.</span>
                                     </li>
                                     <li className="flex gap-4 items-start">
                                         <FileText className="mt-1 shrink-0 text-gray-300" size={24} weight="regular" />
                                         <span>Only long-cycle degrees are considered in place of a Bachelor’s (e.g., certain professional degrees).</span>
                                     </li>
                                 </ul>
                                 <div className="mt-8 pt-6 border-t border-white/20 text-gray-200 text-sm">
                                     <strong className="text-white">Important:</strong> Previous Master’s degrees alone do not qualify you for admission.
                                 </div>
                             </div>
                         </section>

                         {/* 5. Field-Specific Requirements */}
                         <section id="field-reqs" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">5. Field-Specific Requirements</h2>
                             <div className="space-y-6">
                                 <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-lg mb-2 text-gray-800">Art and Design</h3>
                                     <p className="text-gray-700">Applicants without a formal Bachelor’s degree may apply if they have equivalent skills, proven through portfolios, work experience, or other studies.</p>
                                 </div>
                                 <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-lg mb-2 text-gray-800">Business and Economics</h3>
                                     <p className="text-gray-700">Some programmes require GMAT or GRE scores.</p>
                                 </div>
                                 <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-lg mb-2 text-gray-800">Technology/Engineering</h3>
                                     <p className="text-gray-700">Some may require relevant coursework or skills in mathematics, programming, or design.</p>
                                 </div>
                                 <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl text-black shadow-sm transition-colors">
                                     <h3 className="font-bold text-lg mb-2 text-gray-800">Science</h3>
                                     <p className="text-gray-700">Requires a relevant Bachelor’s degree in natural sciences, physics, chemistry, or environmental science.</p>
                                 </div>
                             </div>
                         </section>

                         {/* 6. Incomplete Degree */}
                         <section id="incomplete" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">6. Applying with an Incomplete Degree</h2>
                             <p className="text-gray-700 mb-4">
                                 You may apply before your Bachelor’s degree is complete if you will graduate by <strong>31 July 2026</strong>.
                             </p>
                             <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                 <li>Admission is conditional upon submission of certified final degree documents by <strong>14 August 2026</strong>.</li>
                                 <li>Failure to submit by the deadline will cancel your study right.</li>
                             </ul>
                         </section>

                         {/* 7. Application Steps */}
                         <section id="steps" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                                 7. Application Steps
                             </h2>
                             <div className="space-y-8">
                                 <div className="flex gap-6">
                                     <div className="text-5xl font-bold text-gray-200">01</div>
                                     <div>
                                         <h3 className="text-xl font-bold mb-4 text-black">Prepare in Advance</h3>
                                         <ul className="space-y-2 text-gray-700 text-sm">
                                             <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-gray-500 mt-1.5"></div> Check programme-specific eligibility</li>
                                             <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-gray-500 mt-1.5"></div> Prepare official documents and translations</li>
                                             <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-gray-500 mt-1.5"></div> Schedule language tests (TOEFL/IELTS) and GMAT/GRE if required</li>
                                         </ul>
                                     </div>
                                 </div>
                                 <div className="flex gap-6">
                                     <div className="text-5xl font-bold text-gray-200">02</div>
                                     <div>
                                         <h3 className="text-xl font-bold mb-4 text-black">Fill in the Online Application</h3>
                                         <p className="mb-2 font-medium text-gray-700">Application period: 1 Dec 2025 – 31 March 2026</p>
                                         <ul className="space-y-2 text-gray-700 text-sm">
                                             <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-gray-500 mt-1.5"></div> Only one form per applicant</li>
                                             <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-gray-500 mt-1.5"></div> Can include two programmes ranked by preference</li>
                                             <li className="flex gap-3 items-start"><div className="min-w-[6px] h-[6px] rounded-full bg-gray-500 mt-1.5"></div> Edit application until closing date</li>
                                         </ul>
                                     </div>
                                 </div>
                                 <div className="flex gap-6">
                                     <div className="text-5xl font-bold text-gray-200">03</div>
                                     <div>
                                         <h3 className="text-xl font-bold mb-4 text-black">Application Fee</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                             <div className="p-6 bg-black text-white rounded-3xl shadow-md">
                                                 <div className="font-bold text-gray-300">Non-EU/EEA/Swiss</div>
                                                 <div className="text-2xl font-bold mt-1">Free</div>
                                             </div>
                                             <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-black rounded-3xl shadow-sm">
                                                 <div className="font-bold text-gray-600">EU/EEA/Swiss</div>
                                                 <div className="text-2xl font-bold mt-1">Free</div>
                                             </div>
                                         </div>
                                         <p className="text-sm text-gray-600">No payment required to submit your application.</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-6">
                                     <div className="text-5xl font-bold text-gray-200">04</div>
                                     <div>
                                         <h3 className="text-xl font-bold mb-4 text-black">Upload Required Documents</h3>
                                         <p className="mb-4 font-bold text-gray-800">Deadline: 7 April 2026 at 15:00 (UTC+2)</p>
                                         <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                                             <li className="flex gap-2 items-center"><FileText size={16} weight="regular" className="text-gray-500" /> Bachelor’s degree & transcripts</li>
                                             <li className="flex gap-2 items-center"><FileText size={16} weight="regular" className="text-gray-500" /> Proof of English proficiency (optional)</li>
                                             <li className="flex gap-2 items-center"><FileText size={16} weight="regular" className="text-gray-500" /> International passport only</li>
                                             <li className="flex gap-2 items-center"><FileText size={16} weight="regular" className="text-gray-500" /> CV, Motivation Letter</li>
                                             <li className="flex gap-2 items-center"><FileText size={16} weight="regular" className="text-gray-500" /> Portfolio (if required)</li>
                                             <li className="flex gap-2 items-center"><FileText size={16} weight="regular" className="text-gray-500" /> GMAT/GRE (if required)</li>
                                         </ul>
                                         <p className="text-xs text-gray-500">File format: PDF only, named appropriately (e.g., CV-Lastname-Firstname.pdf)</p>
                                     </div>
                                 </div>
                             </div>
                         </section>

                        {/* CTA Section */}
                        <AdmissionsCTA />

                         {/* 8. Required Documents Detail */}
                         <section id="documents" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">8. Required Documents Explained</h2>
                             <div className="grid gap-6 md:grid-cols-2">
                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl text-black shadow-sm">
                                     <h4 className="font-bold mb-2 text-gray-800">Certified Educational Documents</h4>
                                     <p className="text-sm text-gray-700">Must be submitted after admission decision by 13 May or 14 August 2026.</p>
                                 </div>
                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl text-black shadow-sm">
                                     <h4 className="font-bold mb-2 text-gray-800">Translations</h4>
                                     <p className="text-sm text-gray-700">Non-English/Finnish/Swedish documents require official translations.</p>
                                 </div>
                                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl text-black shadow-sm">
                                     <h4 className="font-bold mb-2 text-gray-800">Passport/ID</h4>
                                     <p className="text-sm text-gray-700">Color PDF of the personal information page.</p>
                                 </div>
                             </div>
                         </section>

                         {/* 9. Language Requirements */}
                         <section id="language" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">9. Language Requirements</h2>
                             <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-black rounded-3xl p-12 shadow-sm">
                                 <h3 className="font-bold text-xl mb-6 text-gray-800">Language Proficiency Details</h3>
                                 <div className="space-y-4">
                                     <p className="text-gray-700 leading-relaxed">
                                         English language proficiency is mandatory for all Master’s programmes taught in English. You must demonstrate your skills through an accepted language test or previous studies.
                                     </p>
                                     <ul className="space-y-4 pt-4">
                                         <li className="flex items-start gap-4 pl-1">
                                             <div className="font-bold min-w-[120px] text-gray-800">Tests</div>
                                             <div className="text-gray-700 text-sm">Acceptable tests: IELTS Academic, TOEFL iBT, PTE Academic, or C1 Advanced/C2 Proficiency.</div>
                                         </li>
                                         <li className="flex items-start gap-4 pl-1">
                                             <div className="font-bold min-w-[120px] text-gray-800">Exemptions</div>
                                             <div className="text-gray-700 text-sm">Applicants who have completed a degree in English in an EU/EEA country, Australia, Canada, New Zealand, or the USA may be exempt.</div>
                                         </li>
                                     </ul>
                                 </div>
                             </div>
                         </section>

                         {/* 10. GMAT/GRE */}
                         <section id="gmat" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">10. GMAT and GRE Requirements</h2>
                             <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl text-black shadow-sm">
                                 <p className="text-gray-700 mb-6 font-medium">
                                     Certain programmes in <strong>Business and Economics</strong> require a GMAT (Classic or Focus Edition) or GRE General Test score.
                                 </p>
                                 <ul className="space-y-4">
                                     <li className="flex gap-4 items-center">
                                         <CheckCircle className="text-gray-600" size={24} weight="fill" />
                                         <span className="text-black font-bold">Minimum Focus Edition score: 555</span>
                                     </li>
                                     <li className="flex gap-4 items-center">
                                         <CheckCircle className="text-gray-600" size={24} weight="fill" />
                                         <span className="text-black font-bold">GRE General Test equivalent accepted</span>
                                     </li>
                                 </ul>
                                 <p className="mt-8 text-sm text-gray-600 italic">
                                     * Scores must be sent directly by the testing organization to Kestora University.
                                 </p>
                             </div>
                         </section>

                         {/* 11. Evaluation & Decisions */}
                         <section id="decisions" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">11. Evaluation & Decisions</h2>
                             <p className="text-gray-700 mb-6 font-medium">
                                 Only complete applications are evaluated based on programme-specific criteria.
                                 Decision results will be published <strong className="text-black">within less than a week of submitting application</strong>.
                             </p>
                             <div className="bg-black text-white p-8 rounded-3xl shadow-lg flex items-center gap-6">
                                 <Clock className="shrink-0 text-gray-400" size={32} weight="regular" />
                                 <div>
                                     <div className="font-bold text-lg mb-1">Waiting List Procedure</div>
                                     <div className="text-gray-300 text-sm">Places on the waiting list may be offered until 26 June 2026. Keep an eye on your email.</div>
                                 </div>
                             </div>
                         </section>

                         {/* 12. After Being Admitted */}
                         <section id="after" className="scroll-mt-32 bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl text-black shadow-sm">
                             <h2 className="text-3xl font-bold mb-6 text-gray-900">12. After Being Admitted</h2>
                             <ol className="space-y-6 list-decimal pl-5 font-bold text-black text-lg mb-8">
                                 <li>Accept the offer by the stated deadline (5 June 2026).</li>
                                 <li>Submit certified documents (19 June or 21 August 2026).</li>
                                 <li>Pay tuition fees (if applicable).</li>
                                 <li>Complete enrolment and orientation.</li>
                             </ol>
                             <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
                                 <h4 className="font-bold mb-2 flex items-center gap-2 text-black"><Globe size={24} className="text-gray-500" /> International Students</h4>
                                 <p className="text-black text-sm mb-6 leading-relaxed">
                                     Moving to Finland requires planning. Read our comprehensive guide on residence permits, housing, and arrival.
                                 </p>
                                 <Link href="/student-guide/international" className="inline-flex items-center gap-2 font-bold text-gray-600 hover:text-gray-800 transition-colors uppercase tracking-wider text-sm">
                                     Open International Student Guide <ArrowRight size={16} weight="bold" />
                                 </Link>
                             </div>
                         </section>

                         {/* 13. FAQ */}
                         <section id="faq" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-6 text-black">13. Frequently Asked Questions</h2>
                             <MasterFAQ />
                         </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

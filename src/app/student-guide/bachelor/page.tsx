'use client';

import { ArrowLeft, Calendar, CheckCircle, FileText, Info, MapPin, CreditCard } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import TableOfContents from '@/components/course/TableOfContents';

export default function BachelorsGuidePage() {
    const sections = [
        { id: 'accept', title: '1. Accept Admission', content: '' },
        { id: 'tuition', title: '2. Tuition & Scholarships', content: '' },
        { id: 'residence', title: '3. Residence Permit', content: '' },
        { id: 'enrolment', title: '4. Enrolment', content: '' },
        { id: 'it-account', title: '5. IT Account', content: '' },
        { id: 'healthcare', title: '6. Healthcare & Fees', content: '' },
        { id: 'benefits', title: '7. Student Card', content: '' },
        { id: 'orientation', title: '8. Orientation', content: '' },
        { id: 'planning', title: '9. Course Registration', content: '' },
        { id: 'housing', title: '10. Housing & Aid', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-neutral-900 text-white pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-[#fd6402] text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                            New Students
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-8">Bachelor’s Students Guide</h1>
                        <p className="text-xl text-neutral-300 leading-relaxed">
                            Essential information for students admitted to Bachelor’s programmes taught in English.
                            Read carefully to ensure a smooth start to your studies.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <Link
                    href="/student-guide"
                    className="inline-flex items-center text-neutral-500 hover:text-black mb-8 transition-colors"
                >
                    <ArrowLeft size={20} weight="bold" className="mr-2" /> Back to Student Guide
                </Link>
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4 hidden lg:block h-fit sticky top-24">
                        <TableOfContents sections={sections} />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4 space-y-8 md:space-y-16">

                        {/* Intro Box */}
                        <div className="bg-neutral-50 border border-neutral-200 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                Welcome to Kestora College!
                            </h2>
                            <p className="text-neutral-700 mb-4">
                                This guide covers the critical steps from accepting your offer to arriving on campus.
                                Follow the deadlines closely to secure your study place.
                            </p>
                        </div>

                        {/* 1. Accept Admission */}
                        <section id="accept" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <h2 className="text-3xl font-bold pt-1">Accept Your Admission Offer</h2>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl mb-6">
                                <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-2">
                                    Deadline
                                </h3>
                                <p className="font-medium">24 July 2026 at 15:00 (UTC +3)</p>
                                <p className="text-sm text-neutral-600 mt-1">Accept by this date or lose your offer.</p>
                            </div>

                            <div className="prose max-w-none text-neutral-700">
                                <h3 className="font-bold text-lg mb-2">How to Accept</h3>
                                <ul className="list-disc pl-5 mb-6 space-y-2">
                                    <li>Use the personal link sent via email or log in to the national admissions portal.</li>
                                    <li>Follow instructions in your admission letter.</li>
                                </ul>

                                <div className="bg-neutral-50 p-6 rounded-xl">
                                    <h4 className="font-bold mb-3">Waitlist & Multiple Offers</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <CheckCircle size={16} weight="bold" className="text-neutral-400 mt-1" />
                                            <span>You can accept only <strong>one</strong> degree study place per term.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle size={16} weight="bold" className="text-neutral-400 mt-1" />
                                            <span>You may accept a lower-ranked offer conditionally while waiting for a higher preference.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle size={16} weight="bold" className="text-neutral-400 mt-1" />
                                            <span>If a higher-ranked place opens, your acceptance transfers automatically.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. Tuition */}
                        <section id="tuition" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <h2 className="text-3xl font-bold pt-1">Tuition Fees & Scholarships</h2>
                            </div>

                            <div className="bg-white border border-neutral-200 rounded-xl p-8 mb-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">General Rules</h3>
                                        <p className="text-neutral-600">Non-EU/EEA students typically pay tuition. Fees are due after acceptance and before enrolment.</p>
                                    </div>
                                </div>
                                <div className="border-t border-neutral-100 pt-4 mt-4">
                                    <h4 className="font-bold text-[#fd6402] mb-2">Early Payment Discount (25%)</h4>
                                    <p className="text-sm text-neutral-600 mb-2">
                                        New Bachelor’s students may receive a <strong>25% reduction</strong> on the first year’s fee if paid by the deadline (typically within 21 days of acceptance).
                                    </p>
                                    <p className="text-xs text-neutral-500">Check your admission email for specific dates.</p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Residence Permit */}
                        <section id="residence" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <h2 className="text-3xl font-bold pt-1">Residence Permit</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-neutral-50 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">Non-EU/EEA</h4>
                                    <p className="text-sm text-neutral-600">Apply for a student residence permit immediately. The process takes time.</p>
                                </div>
                                <div className="bg-neutral-50 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">EU/EEA</h4>
                                    <p className="text-sm text-neutral-600">Register right of residence at a local authority within 3 months of arrival.</p>
                                </div>
                                <div className="bg-neutral-50 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">Nordic</h4>
                                    <p className="text-sm text-neutral-600">Register with the Population Info System upon arrival for a personal ID code.</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Enrolment */}
                        <section id="enrolment" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                                <h2 className="text-3xl font-bold pt-1">Enrol for the Academic Year</h2>
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-xl p-8">
                                <h3 className="font-bold text-lg mb-4">Deadline: 14 August 2026 (Recommended)</h3>
                                <p className="text-neutral-600 mb-6">
                                    You must enrol as attending or non-attending to keep your study right.
                                    Final deadline is 11 September 2026.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-neutral-50 p-4 rounded-lg">
                                        <h4 className="font-bold mb-1">Attending</h4>
                                        <p className="text-sm text-neutral-600">Start studies, get student number, register for courses.</p>
                                    </div>
                                    <div className="bg-neutral-50 p-4 rounded-lg">
                                        <h4 className="font-bold mb-1">Non-Attending</h4>
                                        <p className="text-sm text-neutral-600">Only for military service, parental leave, or medical reasons (requires documentation).</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. IT Account */}
                        <section id="it-account" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                                <h2 className="text-3xl font-bold pt-1">Activate IT Account</h2>
                            </div>
                            <p className="text-neutral-700 mb-4">
                                After enrolling, you will receive an email to activate your Kestora College IT account.
                                This gives you access to email, learning platforms, and registration systems.
                            </p>
                        </section>

                        {/* 6. Healthcare */}
                        <section id="healthcare" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">6</div>
                                <h2 className="text-3xl font-bold pt-1">Student Healthcare (FSHS)</h2>
                            </div>
                            <p className="text-neutral-700 mb-4">
                                All attending degree students (if eligible) must pay the healthcare fee to <a href="https://www.kela.fi/in-english" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition-colors">Kela</a> for each term.
                                This covers student health services.
                            </p>
                            <p className="text-sm text-neutral-500">EU students should obtain a European Health Insurance Card (EHIC) before arrival.</p>
                        </section>

                        {/* 7. Student Card */}
                        <section id="benefits" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">7</div>
                                <h2 className="text-3xl font-bold pt-1">Student Card & Benefits</h2>
                            </div>
                            <p className="text-neutral-700 mb-4">
                                Once enrolled as attending, you can get an electronic student card for discounts on public transport (trains, buses) and student restaurants.
                            </p>
                        </section>

                        {/* 8. Orientation */}
                        <section id="orientation" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">8</div>
                                <h2 className="text-3xl font-bold pt-1">Orientation & Start</h2>
                            </div>
                            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                                <h3 className="font-bold text-lg mb-2">Orientation Week</h3>
                                <p className="text-neutral-600 mb-4">Usually held in August/September. Helps you meet tutors, learn systems, and settle in.</p>
                                <ul className="space-y-2 text-sm text-neutral-600">
                                    <li>• Check platforms for <strong>Pre-Orientation Modules</strong>.</li>
                                    <li>• Connect with your assigned <strong>Peer Tutor</strong>.</li>
                                    <li>• Join student life events and webinars before arrival.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 9. Course Registration */}
                        <section id="planning" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">9</div>
                                <h2 className="text-3xl font-bold pt-1">Course Registration</h2>
                            </div>
                            <p className="text-neutral-700 mb-4">
                                Once enrolled, use your IT account to build a study plan and register for courses.
                                Contact academic advisors if you need help structuring your degree path.
                            </p>
                        </section>

                        {/* 10. Housing & Aid */}
                        <section id="housing" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">10</div>
                                <h2 className="text-3xl font-bold pt-1">Housing & Financial Aid</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-2">Housing</h3>
                                    <p className="text-sm text-neutral-600">Apply immediately. Kestora College does not own housing; arrange through private providers.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">Financial Aid</h3>
                                    <p className="text-sm text-neutral-600">Check eligibility for Finnish student aid early and apply through <a href="https://www.kela.fi/in-english" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition-colors">Kela</a>.</p>
                                </div>
                            </div>
                        </section>

                        <div className="mt-12 pt-8 border-t border-neutral-200 text-sm text-neutral-500">
                            <p>Content adapted from official admissions guide. Check your email regularly for updates.</p>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

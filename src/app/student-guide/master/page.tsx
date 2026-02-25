'use client';

import { ArrowLeft, Calendar, CheckCircle, FileText, Info, MapPin } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import TableOfContents from '@/components/course/TableOfContents';

export default function MastersGuidePage() {
    const sections = [
        { id: 'accept', title: '1. Accept Admission', content: '' },
        { id: 'documents', title: '2. Submit Documents', content: '' },
        { id: 'tuition', title: '3. Tuition & Scholarships', content: '' },
        { id: 'residence', title: '4. Residence Permit', content: '' },
        { id: 'enrolment', title: '6. Enrolment', content: '' },
        { id: 'housing', title: '7. Housing', content: '' },
        { id: 'arrival', title: '8. Arrival & Orientation', content: '' },
        { id: 'it-account', title: '9. IT Account', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-neutral-900 text-white pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-white text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
                            New Students
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-8">Master’s Students Guide</h1>
                        <p className="text-xl text-neutral-300 leading-relaxed">
                            Essential steps and instructions for newly admitted Master’s students at SYKLI College.
                            Follow this guide to ensure a smooth start to your studies in the academic year 2026–2027.
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
                        <div className="bg-neutral-100 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                Congratulations on Your Admission!
                            </h2>
                            <p className="text-neutral-700 mb-4">
                                Once your admission is confirmed, your school’s Learning Services team will be your main point of contact.
                                Detailed contact info is in your admission email.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <Link href="/student-guide/international" className="text-sm font-bold underline hover:text-black">
                                    International Students Info →
                                </Link>
                                <Link href="/student-guide/arrival" className="text-sm font-bold underline hover:text-black">
                                    Arrival Guide →
                                </Link>
                            </div>
                        </div>

                        {/* 1. Accept Admission */}
                        <section id="accept" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <h2 className="text-3xl font-bold pt-1">Accept Your Admission Offer</h2>
                            </div>

                            <div className="bg-neutral-100 p-6 rounded-xl mb-6">
                                <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-2">
                                    Deadline
                                </h3>
                                <p className="font-medium">5 June 2026 at 15:00 (UTC +3)</p>
                            </div>

                            <div className="prose max-w-none text-neutral-700">
                                <h3 className="font-bold text-lg mb-2">How to Accept</h3>
                                <ul className="list-disc pl-5 mb-6 space-y-2">
                                    <li>Log in to the online study application service.</li>
                                    <li>Follow the instructions sent with your admission letter.</li>
                                    <li>If you encounter technical issues, contact Student Services immediately.</li>
                                </ul>

                                <div className="bg-neutral-100 p-6 rounded-xl">
                                    <h4 className="font-bold mb-3">Important Conditions</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <CheckCircle size={16} weight="bold" className="text-neutral-400 mt-1" />
                                            <span>Your acceptance is <strong>binding</strong>. Once accepted, strictly no cancellations.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle size={16} weight="bold" className="text-neutral-400 mt-1" />
                                            <span>If declining, inform the system immediately to free the spot for others.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle size={16} weight="bold" className="text-neutral-400 mt-1" />
                                            <span>You can accept only <strong>one</strong> higher education study place in Finland per term.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. Documents */}
                        <section id="documents" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <h2 className="text-3xl font-bold pt-1">Submit Certified Documents</h2>
                            </div>

                            <p className="mb-6 text-neutral-700">
                                Most applicants must submit officially certified (attested) copies of their Bachelor’s degree certificate and transcripts.
                                Official translations are required if documents are not in English, Finnish, or Swedish.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="p-5 rounded-xl">
                                    <span className="block text-sm text-neutral-500 mb-1">For decisions published 15 May</span>
                                    <strong className="block text-lg">19 June 2026</strong>
                                    <span className="text-sm text-neutral-500">at 15:00 (UTC +3)</span>
                                </div>
                                <div className="p-5 rounded-xl">
                                    <span className="block text-sm text-neutral-500 mb-1">For decisions after 15 May</span>
                                    <strong className="block text-lg">21 August 2026</strong>
                                    <span className="text-sm text-neutral-500">at 15:00 (UTC +3)</span>
                                </div>
                            </div>
                        </section>

                        {/* 3. Tuition */}
                        <section id="tuition" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <h2 className="text-3xl font-bold pt-1">Tuition & Scholarships</h2>
                            </div>
                            <div className="prose max-w-none text-neutral-700">
                                <p className="mb-4">
                                    Non-EU/EEA citizens are generally required to pay tuition fees.
                                    <strong> You are strongly encouraged to pay by 14 August 2026.</strong>
                                </p>
                                <p className="mb-6">
                                    If you have a <strong>SYKLI College Excellence Scholarship</strong>, you must accept the terms before the scholarship is valid.
                                    Failure to accept in time may result in forfeiting the scholarship.
                                </p>
                            </div>
                        </section>

                        {/* 4. Residence Permit */}
                        <section id="residence" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                                <h2 className="text-3xl font-bold pt-1">Residence Permit & Registration</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-neutral-100 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">Non-EU/EEA Citizens</h4>
                                    <p className="text-sm text-neutral-600">Apply for a student residence permit immediately. Schedule a visit to a Finnish mission promptly.</p>
                                </div>
                                <div className="bg-neutral-100 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">EU/EEA Citizens</h4>
                                    <p className="text-sm text-neutral-600">Register your right of residence at the Finnish Immigration Service within 3 months of arrival.</p>
                                </div>
                                <div className="bg-neutral-100 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">Nordic Citizens</h4>
                                    <p className="text-sm text-neutral-600">Register personal data in the Finnish Population Information System upon arrival.</p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Incomplete Degree (Simple Text) */}
                        <section className="scroll-mt-32 pl-6 py-2">
                            <h3 className="font-bold text-xl mb-2">5. Submit Degree Certificate if Incomplete</h3>
                            <p className="text-neutral-700">
                                Conditionally admitted students must submit their final certified degree certificate by <strong>21 August 2026</strong>.
                                Failure to graduate by 31 July 2026 leads to cancellation of the study place.
                            </p>
                        </section>

                        {/* 6. Enrolment */}
                        <section id="enrolment" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">6</div>
                                <h2 className="text-3xl font-bold pt-1">Enrol for the Academic Year</h2>
                            </div>
                            <div className="bg-neutral-100 rounded-xl p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-2">Enrolment Period</h3>
                                        <p className="text-neutral-600">Opens 18 May 2026</p>
                                        <p className="font-bold text-black">Recommended deadline: 14 August 2026</p>
                                    </div>
                                    <div className="flex-1 pl-8">
                                        <h3 className="font-bold text-lg mb-2">Status Options</h3>
                                        <ul className="space-y-1 text-sm text-neutral-600">
                                            <li>• <strong>Attending:</strong> Starting studies immediately</li>
                                            <li>• <strong>Non-attending:</strong> Deferring for approved reasons (e.g. military service)</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-500 italic">Enroll through the national student information service.</p>
                            </div>
                        </section>

                        {/* 7. Housing */}
                        <section id="housing" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">7</div>
                                <h2 className="text-3xl font-bold pt-1">Apply for Student Housing</h2>
                            </div>
                            <p className="text-neutral-700 mb-4">
                                Apply as soon as you accept your study place. Queue times can be long.
                                You can apply up to 4 months before your movie-in date.
                            </p>
                        </section>

                        {/* 8. Arrival */}
                        <section id="arrival" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">8</div>
                                <h2 className="text-3xl font-bold pt-1">Plan Your Arrival</h2>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                Courses begin in late August. Plan to arrive before orientation activities start.
                                Pre-orientation modules are available online in July/August.
                            </p>
                        </section>

                        {/* 9. IT Account */}
                        <section id="it-account" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">9</div>
                                <h2 className="text-3xl font-bold pt-1">Activate IT Account & Benefits</h2>
                            </div>
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="bg-neutral-100 p-4 rounded-lg flex gap-3">
                                    <FileText className="text-black" weight="regular" />
                                    <div>
                                        <span className="font-bold block text-sm">SYKLI IT Account</span>
                                        <span className="text-xs text-neutral-500">Email, Moodle, Course Registration</span>
                                    </div>
                                </li>
                                <li className="bg-neutral-100 p-4 rounded-lg flex gap-3">
                                    <CheckCircle className="text-black" weight="bold" />
                                    <div>
                                        <span className="font-bold block text-sm">Student Benefits</span>
                                        <span className="text-xs text-neutral-500">Student Card, Healthcare (FSHS), Transport</span>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <div className="mt-12 pt-8 text-sm text-neutral-500">
                            <p>Content adapted from official admissions and student guidance information.</p>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

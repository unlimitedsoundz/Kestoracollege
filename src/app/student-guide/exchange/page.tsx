'use client';

import { ArrowLeft, Calendar, CheckCircle, FileText, Info, MapPin, Globe, BookOpen, Heart, Question as HelpCircle } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import TableOfContents from '@/components/course/TableOfContents';

export default function ExchangeStudentsPage() {
    const sections = [
        { id: 'intro', title: 'Welcome', content: '' },
        { id: 'orientation', title: '1. Orientation', content: '' },
        { id: 'courses', title: '2. Course Selection', content: '' },
        { id: 'registration', title: '3. Registration', content: '' },
        { id: 'housing', title: '4. Housing & Arrival', content: '' },
        { id: 'living', title: '5. Student Life', content: '' },
        { id: 'checklist', title: 'Departure Checklist', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-neutral-900 text-white pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-white text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
                            Exchange Students
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-8">Exchange Students Guide</h1>
                        <p className="text-xl text-neutral-300 leading-relaxed">
                            Everything you need to know for your exchange semester or year at SYKLI College.
                            We look forward to welcoming you to our vibrant international community!
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

                        {/* Welcome */}
                        <section id="intro" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Welcome to SYKLI College!</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Completing an exchange at SYKLI College is a unique opportunity to experience Finnish education,
                                culture, and student life. This guide will help you navigate the practical steps of your exchange.
                            </p>
                            <div className="mt-8 grid md:grid-cols-2 gap-6">
                                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <Globe size={18} weight="regular" className="text-black" /> International Office
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        Our exchange coordinators are here to support you with learning agreements,
                                        official signatures, and general advice.
                                    </p>
                                </div>
                                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <Heart size={18} weight="regular" className="text-black" /> Student Tutors
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        Every exchange student is assigned a local "buddy" or peer tutor to help you
                                        settle in and meet new friends.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 1. Orientation */}
                        <section id="orientation" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <h2 className="text-3xl font-bold pt-1">Orientation Week</h2>
                            </div>
                            <div className="prose max-w-none text-neutral-700">
                                <p className="mb-4 font-bold">Orientation is mandatory for all incoming exchange students.</p>
                                <p className="mb-6">
                                    Orientation week usually takes place during the last week of August (for Autumn semester)
                                    and first week of January (for Spring semester).
                                </p>
                                <div className="bg-neutral-50 border border-neutral-100 p-6 rounded-xl">
                                    <h4 className="font-bold text-neutral-900 mb-2">What happens during Orientation?</h4>
                                    <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                                        <li className="flex gap-2"><CheckCircle size={16} weight="bold" className="text-black mt-1" /> Campus tours</li>
                                        <li className="flex gap-2"><CheckCircle size={16} weight="bold" className="text-black mt-1" /> IT system training</li>
                                        <li className="flex gap-2"><CheckCircle size={16} weight="bold" className="text-black mt-1" /> Course registration help</li>
                                        <li className="flex gap-2"><CheckCircle size={16} weight="bold" className="text-black mt-1" /> Social events & parties</li>
                                        <li className="flex gap-2"><CheckCircle size={16} weight="bold" className="text-black mt-1" /> Survival Finnish session</li>
                                        <li className="flex gap-2"><CheckCircle size={16} weight="bold" className="text-black mt-1" /> Meet your tutors</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. Course Selection */}
                        <section id="courses" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <h2 className="text-3xl font-bold pt-1">Course Selection</h2>
                            </div>
                            <div className="space-y-6">
                                <p className="text-neutral-700">
                                    As an exchange student, you are primarily expected to take courses from the department
                                    that nominates you. However, interdisciplinary study is often possible.
                                </p>
                                <div className="border border-neutral-200 rounded-xl p-8">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <BookOpen size={20} weight="regular" /> Learning Agreement (LA)
                                    </h3>
                                    <ul className="space-y-4 text-neutral-600 text-sm">
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0"></div>
                                            <span><strong>Initial LA:</strong> Should be signed by your home university and SYKLI before arrival.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0"></div>
                                            <span><strong>Changes to LA:</strong> If courses are full or cancelled, you can update your LA during the first 2 weeks of the semester.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0"></div>
                                            <span><strong>Credits:</strong> Most courses are 5 ECTS. A full-time workload is 30 ECTS per semester.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3. Registration */}
                        <section id="registration" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <h2 className="text-3xl font-bold pt-1">Registration & Enrollment</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-neutral-50 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">Academic Enrollment</h4>
                                    <p className="text-sm text-neutral-600">
                                        Once your IT account is active, you must enroll for the semester as "Attending".
                                        This enables your study right and access to the course catalog.
                                    </p>
                                </div>
                                <div className="bg-neutral-50 p-6 rounded-xl">
                                    <h4 className="font-bold mb-2">Individual Course Registration</h4>
                                    <p className="text-sm text-neutral-600">
                                        Registering for the semester is NOT the same as registering for courses.
                                        You must sign up for each course separately in the student portal.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Housing */}
                        <section id="housing" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                                <h2 className="text-3xl font-bold pt-1">Housing & Arrival</h2>
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-xl p-8 mb-6">
                                <h3 className="font-bold text-lg mb-2">Student Housing</h3>
                                <p className="text-neutral-600 mb-4">
                                    Accommodation in Finland is highly sought after. Apply for housing through local student housing foundations (HOAS/AYY)
                                    as soon as you receive your acceptance letter.
                                </p>
                                <div className="bg-neutral-50 p-4 rounded-lg flex gap-3 text-sm">
                                    <Info className="text-neutral-400 shrink-0" size={18} weight="regular" />
                                    <p>SYKLI College does not provide on-campus housing directly, but we assist with the application process.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold mb-2 flex items-center gap-2"><MapPin size={16} weight="regular" /> Travel to Campus</h4>
                                    <p className="text-sm text-neutral-600">
                                        The closest airport is Helsinki-Vantaa (HEL). From there, you can take a commuter train or shuttle to the campus area.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2 flex items-center gap-2"><Calendar size={16} weight="regular" /> When to Arrive?</h4>
                                    <p className="text-sm text-neutral-600">
                                        We recommend arriving 2-3 days before Orientation Week to move into your apartment and settle in.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Student Life */}
                        <section id="living" className="scroll-mt-32">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                                <h2 className="text-3xl font-bold pt-1">Student Life & Benefits</h2>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                Finland offers an incredible student experience. As an exchange student, you are eligible for many
                                of the same benefits as degree students.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-5 border border-neutral-100 rounded-xl">
                                    <h4 className="font-bold text-sm mb-2">Student Card</h4>
                                    <p className="text-xs text-neutral-500">Access massive discounts on trains, buses, and campus meals (€2.95 per lunch!).</p>
                                </div>
                                <div className="p-5 border border-neutral-100 rounded-xl">
                                    <h4 className="font-bold text-sm mb-2">Student Union</h4>
                                    <p className="text-xs text-neutral-500">Join clubs, attend the grand annual balls, and participate in "sitsit" (traditional dinner parties).</p>
                                </div>
                                <div className="p-5 border border-neutral-100 rounded-xl">
                                    <h4 className="font-bold text-sm mb-2">Sauna Culture</h4>
                                    <p className="text-xs text-neutral-500">Most student housing buildings have shared saunas. It's the best way to relax and socialize!</p>
                                </div>
                            </div>
                        </section>

                        {/* Checklist */}
                        <section id="checklist" className="scroll-mt-32 bg-neutral-50 p-10 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6">Departure Checklist</h2>
                            <p className="text-neutral-600 mb-8 font-medium">Before you leave your home country, make sure you have:</p>
                            <ul className="space-y-3">
                                {[
                                    'Valid Passport / ID card',
                                    'Acceptance Letter from SYKLI College',
                                    'Signed Learning Agreement',
                                    'Health Insurance (EHIC for EU, private for non-EU)',
                                    'Housing contract and first month\'s rent receipt',
                                    'Warm clothing (if arriving for Autumn/Winter!)',
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-center text-neutral-700">
                                        <div className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center shrink-0">
                                            {/* empty box */}
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-8 border-t border-neutral-200">
                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <HelpCircle size={20} weight="regular" />
                                    <p>Questions? Contact <span className="underline cursor-pointer">exchange@syklicollege.fi</span></p>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

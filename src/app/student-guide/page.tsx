'use client';

import {
    BookOpen, GraduationCap, Heart,
    ArrowRight, CaretRight
} from "@phosphor-icons/react/dist/ssr";
import TableOfContents from '@/components/course/TableOfContents';
import Link from 'next/link';
import Image from 'next/image';

export default function StudentGuidePage() {
    const sections = [
        {
            id: 'programmes',
            title: 'Degree Programmes',
            content: '',
            items: [
                { title: "Bachelor's Degree", href: "/admissions/bachelor" },
                { title: "Master's Degree", href: "/admissions/master" },
            ]
        },
        {
            id: 'minors',
            title: 'Minors & Combinations',
            content: '',
            items: [
                { title: "What is a Minor?", href: "#minors" },
                { title: "Benefits", href: "#minors" },
            ]
        },
        {
            id: 'courses',
            title: 'Courses & Registration',
            content: '',
            items: [
                { title: "Course Structure", href: "#courses" },
                { title: "Registration", href: "#courses" },
            ]
        },
        { id: 'language', title: 'Language Studies', content: '' },
        {
            id: 'calendar',
            title: 'Academic Calendar',
            content: '',
            items: [
                { title: "Autumn Term", href: "#calendar" },
                { title: "Spring Term", href: "#calendar" },
            ]
        },
        {
            id: 'support',
            title: 'Support Services',
            content: '',
            items: [
                { title: "Academic Guidance", href: "#support" },
                { title: "Learning Support", href: "#support" },
                { title: "Wellbeing", href: "#support" },
            ]
        },
        { id: 'new-students', title: 'For New Students', content: '' },
        {
            id: 'student-types',
            title: 'Student Categories',
            content: '',
            items: [
                { title: "Bachelor's Students", href: "/student-guide/bachelor" },
                { title: "Master's Students", href: "/student-guide/master" },
                { title: "International Students", href: "/student-guide/international" },
                { title: "Exchange Students", href: "/student-guide/exchange" },
                { title: "Arrival Guide", href: "/student-guide/arrival" },
            ]
        },
        { id: 'digital', title: 'Digital Systems', content: '' },
        { id: 'community', title: 'Community & Life', content: '' },
        {
            id: 'contact',
            title: 'Contact & Guidance',
            content: '',
            items: [
                { title: "Student Services", href: "#contact" },
                { title: "Peer Tutors", href: "#contact" },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-neutral-900 text-white pt-32 pb-16 md:pt-48 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/student-guide-hero.png"
                        alt="Background"
                        fill
                        priority
                        className="object-cover opacity-60"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight pt-8">
                            Student Guide
                        </h1>
                        <p className="text-xl text-neutral-300 leading-relaxed max-w-2xl">
                            Your comprehensive resource for navigating studies, academic structure, support services, and daily life at Kestora College.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4 hidden lg:block h-fit sticky top-24">
                        <TableOfContents sections={sections} />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4 space-y-12 md:space-y-20">

                        {/* Intro */}
                        <div className="prose max-w-none text-lg text-neutral-600">
                            <p className="lead font-medium text-neutral-900 border-l-4 border-[#fd6402] pl-6">
                                Whether you are a new student, continuing your degree, or joining from abroad, this guide explains how studies are organised and how support is provided throughout your academic journey.
                            </p>
                        </div>

                        {/* Degree Programmes */}
                        <section id="programmes" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                Degree Programmes at Kestora College
                            </h2>
                            <p className="text-lg text-neutral-700 mb-8">
                                Kestora College offers Bachelor’s and Master’s degree programmes taught in English across business, economics, management, finance, information systems, entrepreneurship, and interdisciplinary fields.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {[
                                    { title: "Bachelor’s Degree", href: "/admissions/bachelor", image: "/images/guide/bachelor_group.png" },
                                    { title: "Master’s Degree", href: "/admissions/master", image: "/images/student-guide-hero.png" }
                                ].map((item) => (
                                    <Link key={item.title} href={item.href} className="group bg-neutral-100 rounded-2xl overflow-hidden block">
                                        <div className="h-48 bg-neutral-100 relative overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600">
                                                {item.title.includes("Bachelor")
                                                    ? "Structured curriculum focused on core knowledge and skills."
                                                    : "Advanced studies focusing on specialized expertise and research-oriented development."}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="bg-neutral-100 p-8 rounded-2xl">
                                <h3 className="font-bold text-lg mb-4">Curriculum Structure</h3>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        "Core compulsory courses", "Elective courses",
                                        "Minor studies", "Language and communication studies",
                                        "Final thesis or capstone project"
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3">
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Minors */}
                        <section id="minors" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Minors and Study Combinations</h2>
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-3">What is a Minor?</h3>
                                    <p className="text-neutral-700 mb-6">
                                        A minor is a coherent set of courses, typically ranging from 20 to 30 ECTS credits, completed alongside a major degree. It allows students to deepen expertise in a specific area or broaden knowledge beyond their main field of study.
                                    </p>
                                    <h3 className="text-xl font-bold mb-3">Choosing a Minor</h3>
                                    <ul className="space-y-2 mb-6 text-neutral-700">
                                        <li className="flex gap-2"><ArrowRight size={18} weight="bold" className="mt-1 flex-shrink-0 text-neutral-400" /> Within their own school</li>
                                        <li className="flex gap-2"><ArrowRight size={18} weight="bold" className="mt-1 flex-shrink-0 text-neutral-400" /> From other schools at Kestora College</li>
                                        <li className="flex gap-2"><ArrowRight size={18} weight="bold" className="mt-1 flex-shrink-0 text-neutral-400" /> From interdisciplinary or entrepreneurship offerings</li>
                                    </ul>
                                </div>
                                <div className="flex-1 bg-[#fd6402] text-white p-8 rounded-2xl">
                                    <h3 className="font-bold text-xl mb-4 text-black">Benefits of Minors</h3>
                                    <ul className="space-y-4">
                                        {[
                                            "Strengthen employability",
                                            "Support career specialisation",
                                            "Enable interdisciplinary competence",
                                            "Prepare for advanced studies"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Courses */}
                        <section id="courses" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Courses and Course Registration</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="rounded-2xl p-6">
                                    <h3 className="font-bold text-xl mb-3">Course Structure</h3>
                                    <p className="text-neutral-600 mb-4">Courses are assigned ECTS credits based on workload. Format includes:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Lectures', 'Seminars', 'Projects', 'Case Studies', 'Exams'].map(tag => (
                                            <span key={tag} className="bg-neutral-100 px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="border border-neutral-200 rounded-2xl p-6">
                                    <h3 className="font-bold text-xl mb-3">Registration</h3>
                                    <p className="text-neutral-600 mb-4">Register via the digital study system during published periods.</p>
                                    <ul className="text-sm space-y-2 text-neutral-500">
                                        <li>• Check participant limits</li>
                                        <li>• Verify prerequisites</li>
                                        <li>• Review selection criteria</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 bg-neutral-100 p-6 rounded-2xl">
                                <h4 className="font-bold mb-2">Other Study Options</h4>
                                <p className="text-neutral-600">
                                    In addition to degree courses, students may complete Entrepreneurship and startup courses, Interdisciplinary project courses, Open university studies, or Exchange student courses.
                                </p>
                            </div>
                        </section>

                        {/* Language */}
                        <section id="language" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                Language and Communication
                            </h2>
                            <p className="text-lg text-neutral-700 mb-6">
                                Language studies support academic success, professional skills, and international competence.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    "Academic communication", "Intercultural communication",
                                    "Finnish language", "Swedish language"
                                ].map(lang => (
                                    <div key={lang} className="bg-neutral-100 p-4 rounded-xl text-center font-bold text-neutral-800">
                                        {lang}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Calendar */}
                        <section id="calendar" className="scroll-mt-32">
                            <div className="bg-black text-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-16">
                                <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-white">
                                    Academic Calendar
                                </h2>
                                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                                    <div className="md:w-1/3 md:border-r border-neutral-800 md:pr-8">
                                        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#fd6402]">The Academic Year</h3>
                                        <div className="space-y-6 md:space-y-8">
                                            <div>
                                                <h4 className="font-bold text-white mb-1 md:mb-2 text-base md:text-lg">Autumn Term</h4>
                                                <p className="text-sm md:text-base text-neutral-400">September — December</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1 md:mb-2 text-base md:text-lg">Spring Term</h4>
                                                <p className="text-sm md:text-base text-neutral-400">January — May</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-2/3">
                                        <h4 className="font-bold text-lg md:text-xl mb-4 md:mb-6 text-white">Teaching Periods & Dates</h4>
                                        <p className="text-sm md:text-base text-neutral-400 mb-6 md:mb-8 md:text-lg">Each term consists of multiple teaching periods. Courses may run intensively or throughout the semester.</p>
                                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                                            <div className="bg-neutral-800 p-4 md:p-6 rounded-xl md:rounded-2xl">
                                                <span className="block font-bold mb-1 md:mb-2 text-white text-base md:text-lg">Teaching Periods</span>
                                                <span className="text-xs md:text-sm text-neutral-500">Scheduled sessions</span>
                                            </div>
                                            <div className="bg-neutral-800 p-4 md:p-6 rounded-xl md:rounded-2xl">
                                                <span className="block font-bold mb-1 md:mb-2 text-white text-base md:text-lg">Exam Periods</span>
                                                <span className="text-xs md:text-sm text-neutral-500">Assessment weeks</span>
                                            </div>
                                            <div className="bg-neutral-800 p-4 md:p-6 rounded-xl md:rounded-2xl">
                                                <span className="block font-bold mb-1 md:mb-2 text-white text-base md:text-lg">Registration</span>
                                                <span className="text-xs md:text-sm text-neutral-500">Sign-up deadlines</span>
                                            </div>
                                            <div className="bg-neutral-800 p-4 md:p-6 rounded-xl md:rounded-2xl">
                                                <span className="block font-bold mb-1 md:mb-2 text-white text-base md:text-lg">Breaks</span>
                                                <span className="text-xs md:text-sm text-neutral-500">Winter & Summer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Support */}
                        <section id="support" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Study Support Services</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'Academic Guidance',
                                        desc: 'Programme level advising and personal study plans.',
                                        icon: GraduationCap,
                                        img: '/images/guide/academic_advising.png'
                                    },
                                    {
                                        title: 'Learning Support',
                                        desc: 'Workshops, writing support, and study skills.',
                                        icon: BookOpen,
                                        img: '/images/admissions/online_learning.png'
                                    },
                                    {
                                        title: 'Wellbeing',
                                        desc: 'Health services, accessibility, and counseling.',
                                        icon: Heart,
                                        img: '/images/admissions/student_life_events.png'
                                    }
                                ].map((item) => (
                                    <div key={item.title} className="bg-neutral-100 rounded-2xl overflow-hidden group">
                                        <div className="h-48 bg-neutral-100 relative overflow-hidden">
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                            <p className="text-neutral-600 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* New Students */}
                        <section id="new-students" className="scroll-mt-32">
                            <div className="bg-black text-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-16">
                                <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12">Information for New Students</h2>
                                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#fd6402]">Orientation Programme</h3>
                                        <p className="text-sm md:text-base text-neutral-300 mb-6 md:mb-8 md:text-lg">
                                            New students receive structured onboarding before studies begin, ensuring a smooth transition into university life.
                                        </p>
                                        <ul className="space-y-3 md:space-y-4">
                                            {[
                                                "Degree programme introductions",
                                                "Digital systems training",
                                                "Course registration guidance",
                                                "Campus services overview"
                                            ].map(item => (
                                                <li key={item} className="flex items-center gap-3 md:gap-4 bg-neutral-900 p-3 md:p-4 rounded-xl border border-neutral-800">
                                                    <div className="bg-neutral-800 p-1 md:p-1.5 rounded-full text-white"><CaretRight size={16} weight="bold" /></div>
                                                    <span className="font-bold text-sm md:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-black p-6 md:p-10 rounded-2xl md:rounded-[2rem] border border-neutral-800 shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-lg md:text-2xl mb-4 md:mb-6 text-white px-1">Getting Started Checklist</h3>
                                            <ul className="space-y-3 md:space-y-5 text-neutral-300">
                                                <li className="flex gap-3 md:gap-4 items-center text-sm md:text-lg"><div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#fd6402] rounded-full" /> Confirm study rights</li>
                                                <li className="flex gap-3 md:gap-4 items-center text-sm md:text-lg"><div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#fd6402] rounded-full" /> Activate student email</li>
                                                <li className="flex gap-3 md:gap-4 items-center text-sm md:text-lg"><div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#fd6402] rounded-full" /> Access learning platforms</li>
                                                <li className="flex gap-3 md:gap-4 items-center text-sm md:text-lg"><div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#fd6402] rounded-full" /> Get student ID card</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Student Categories / Breakdown */}
                        <section id="student-types" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Student Categories</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: "International Students",
                                        href: "/student-guide/international",
                                        desc: "Support Services, residence permits, and integration into Finnish society.",
                                        image: "/images/guide/international_arrival.jpg"
                                    },
                                    {
                                        title: "Exchange Students",
                                        href: "/student-guide/exchange",
                                        desc: "Orientation, course selection, and cultural adaptation for short-term studies.",
                                        image: "/images/guide/exchange_winter.jpg"
                                    }
                                ].map((item) => (
                                    <Link key={item.title} href={item.href} className="block rounded-2xl overflow-hidden group">
                                        <div className="h-56 bg-neutral-100 relative overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-8 bg-neutral-100">
                                            <h3 className="text-xl font-bold mb-3 text-neutral-900">{item.title}</h3>
                                            <p className="text-sm mb-4 text-neutral-600">{item.desc}</p>
                                            <div className="flex items-center gap-2 font-bold text-sm underline text-neutral-900">
                                                Read More <CaretRight size={14} weight="bold" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Contact */}
                        <section id="contact" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Contact and Guidance</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-neutral-100 p-8 rounded-2xl">
                                    <h3 className="font-bold text-xl mb-2">Student Services</h3>
                                    <p className="text-neutral-600 mb-4">Reach out to programme coordinators, academic advisors, and the international support team.</p>
                                    <Link href="/contact" className="text-sm font-bold underline hover:text-[#fd6402] transition-colors">Contact Support →</Link>
                                </div>
                                <div className="bg-neutral-100 p-8 rounded-2xl">
                                    <h3 className="font-bold text-xl mb-2">Peer Tutors</h3>
                                    <p className="text-neutral-600 mb-4">Connect with senior students for advice on student life and settling in.</p>
                                    <Link href="/contact" className="text-sm font-bold underline hover:text-[#fd6402] transition-colors">Find a Tutor →</Link>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

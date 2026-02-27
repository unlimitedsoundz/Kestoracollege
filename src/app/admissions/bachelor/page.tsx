
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Globe, Users, BookOpen, Briefcase, GraduationCap, Calendar, MapPin } from '@phosphor-icons/react/dist/ssr';

import TableOfContents from '@/components/course/TableOfContents';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

export const metadata = {
    title: 'Bachelor\'s Admissions | Kestora College',
    description: 'Apply to Bachelor\'s Programmes in English at Kestora College. Information on benefits, progression, scholarships, and admissions.',
    alternates: {
        canonical: 'https://www.kestora.fi/admissions/bachelor',
        languages: {
            'en': 'https://www.kestora.fi/admissions/bachelor',
            'fi': 'https://www.kestora.fi/admissions/bachelor-fi',
        },
    },
};

const tocSections = [
    { id: 'benefits', title: 'How You Benefit', content: '' },
    { id: 'progression', title: 'Bachelor\'s to Master\'s', content: '' },
    { id: 'scholarships', title: 'Scholarships & Tuition Fees', content: '' },
    { id: 'admissions', title: 'Admission Info', content: '' },
    { id: 'events', title: 'Fairs & Events', content: '' },
    { id: 'more', title: 'Learn More', content: '' },
];

export default function BachelorAdmissionsPage() {
    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Admissions', item: '/admissions' },
                { name: 'Bachelor\'s Admissions', item: '/admissions/bachelor' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "EducationalOccupationalProgram",
                "name": "Bachelor's Degree Programmes",
                "description": "Information on Bachelor's degree programmes taught in English at Kestora College.",
                "provider": {
                    "@type": "CollegeOrUniversity",
                    "name": "Kestora College",
                    "url": "https://www.kestora.fi"
                },
                "educationalLevel": "Bachelor",
                "offers": {
                    "@type": "Offer",
                    "category": "Bachelor's Programmes"
                }
            }} />
            {/* 1. HERO SECTION (Split Style) */}
            <section className="bg-neutral-900 text-white overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-12 h-auto min-h-[500px] md:pt-48 lg:h-[600px] lg:py-0 relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
                        <p className="text-amber-500 font-bold tracking-widest uppercase">Admissions</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            Apply to Bachelor's Programmes in English
                        </h1>
                        <p className="text-lg text-neutral-300 max-w-xl leading-relaxed">
                            Start your journey at Kestora College and gain the skills, international perspective, and network to succeed globally.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/admissions/application-process" className="bg-[#fd6402] text-black px-8 py-4 font-bold hover:bg-white transition-all inline-flex items-center gap-2 shadow-xl">
                                Start Application <ArrowRight size={20} weight="bold" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-8 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl overflow-hidden">
                            <Image
                                src="/images/admissions/hero.jpg"
                                alt="Bachelor's Students"
                                fill
                                priority
                                className="object-cover opacity-90"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar / Table of Contents */}
                    <div className="lg:col-span-3">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <TableOfContents sections={tocSections} />

                            <div className="bg-black text-white p-10 pl-16 rounded-none border-l-4 border-[#fd6402]">
                                <h3 className="font-bold text-lg mb-2 text-white">Admissions Office</h3>
                                <p className="text-sm text-neutral-300 mb-4">Questions? We are here to help.</p>
                                <Link href="/contact" className="text-sm font-bold underline text-[#fd6402] hover:text-white transition-colors">Contact Us</Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8 md:space-y-24">

                        {/* How You Benefit */}
                        <section id="benefits" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black">
                                How You Benefit from Our Programmes
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6 text-lg text-neutral-600">
                                    <ul className="space-y-4 list-disc pl-5">
                                        <li>
                                            <strong>High-Quality Education:</strong> Theory and practice in Accounting, Finance, Economics, Management, Marketing, and IS.
                                        </li>
                                        <li>
                                            <strong>International Perspective:</strong> Courses taught actively in English for global careers.
                                        </li>
                                        <li>
                                            <strong>Hands-On Experience:</strong> Real-world case studies, simulations, and internships.
                                        </li>
                                        <li>
                                            <strong>Personalized Support:</strong> Small class sizes and close interaction with faculty.
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-100 rounded-2xl h-80 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                                        <Image src="/images/admissions/benefits.jpg" alt="Benefits of studying at Kestora" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* From Bachelor's to Master's */}
                        <section id="progression" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black">
                                From Bachelor's to Master's
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
                                <div className="bg-neutral-100 rounded-2xl h-80 overflow-hidden relative order-last md:order-first">
                                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                                        <Image src="/images/admissions/progression.jpg" alt="Path to Master's" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                </div>
                                <div className="space-y-6 text-lg text-neutral-600">
                                    <p>Completing a Bachelor’s degree at Kestora College opens up seamless progression paths:</p>
                                    <ul className="space-y-3">
                                        <li><strong>Internal Continuation:</strong> Direct path to Kestora Master’s programmes.</li>
                                        <li><strong>Specialised Tracks:</strong> Focus on Accounting, Economics, or Management.</li>
                                        <li><strong>International Opportunities:</strong> Apply to top partner universities worldwide.</li>
                                        <li><strong>Research Integration:</strong> Bachelor theses as stepping stones for advanced research.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>

            {/* YELLOW QUOTE BANNER */}
            <div className="w-full bg-[#fd6402] text-neutral-900 py-16 my-12">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h3 className="text-2xl md:text-3xl leading-tight mb-6">
                        "We empower students with the analytical skills and global mindset needed for complex financial decision-making."
                    </h3>
                    <p className="text-sm font-semibold uppercase tracking-wider opacity-80">— Dean of Admissions</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-3"></div> {/* Spacer to align with previous grid if needed, or just center content from here. Let's keep distinct layout. */}

                    <div className="lg:col-span-12 space-y-24">
                        {/* Scholarships */}
                        <section id="scholarships" className="scroll-mt-32 grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <h2 className="text-3xl font-bold mb-6 text-black">
                                    Scholarships and Tuition Fees
                                </h2>
                                <div className="space-y-4 text-lg text-neutral-600">
                                    <div className="p-8 pl-16 bg-neutral-50 border-l-4 border-black rounded-r-lg">
                                        <strong>Tuition Fee:</strong> Included in degree tuition for full-time BSc students.
                                    </div>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li><strong>Merit-Based:</strong> For exceptional academic records.</li>
                                        <li><strong>Need-Based:</strong> Financial assistance for eligible students.</li>
                                        <li><strong>International:</strong> Merit and need-based support for global talent.</li>
                                    </ul>
                                    <Link href="/admissions/tuition" className="text-black font-bold hover:underline inline-block mt-2">See detailed scholarship info →</Link>
                                </div>
                            </div>
                            <div className="w-full lg:h-full order-1 md:order-2 relative h-[250px] md:h-full">
                                <Image
                                    src="/images/admissions/scholarships.jpg"
                                    alt="Scholarships"
                                    fill
                                    className="object-cover rounded-2xl shadow-lg border border-neutral-100"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </section>

                        {/* Admissions Info */}
                        <section id="admissions" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black">
                                Information on Student Admissions
                            </h2>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="bg-white p-8 rounded-2xl border border-neutral-100">
                                    <h3 className="text-xl font-bold mb-6 text-black">Eligibility</h3>
                                    <ul className="space-y-3 text-neutral-700 list-disc pl-5">
                                        <li>High school diploma or equivalent</li>
                                        <li>Proficiency in English (IELTS/TOEFL)</li>
                                        <li>Strong mathematics & relevant records</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-neutral-100">
                                    <h3 className="text-xl font-bold mb-6 text-black border-b border-black pb-10 pl-2">Selection Criteria</h3>
                                    <ul className="space-y-3 text-neutral-700 list-disc pl-5">
                                        <li>Academic excellence</li>
                                        <li>Motivation & Personal Statement</li>
                                        <li>Leadership & Extracurriculars</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Fairs & Events */}
                        <section id="events" className="scroll-mt-32 bg-black text-white p-12 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6 text-white">
                                        Fairs and Events
                                    </h2>
                                    <ul className="space-y-4 text-neutral-300">
                                        <li><strong>Open Days:</strong> Explore campus and meet faculty.</li>
                                        <li><strong>Virtual Info Sessions:</strong> Online webinars on applications.</li>
                                        <li><strong>Education Fairs:</strong> Meet us in your city.</li>
                                    </ul>
                                    <div className="mt-8">
                                        <Link href="/news" className="bg-[#fd6402] text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors inline-block">See Upcoming Events</Link>
                                    </div>
                                </div>
                                <div className="w-full relative h-[250px] md:h-80 mt-8 md:mt-0">
                                    <Image
                                        src="/images/admissions/events.jpg"
                                        alt="Fairs and Events"
                                        fill
                                        className="rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Learn More */}
                        {/* Learn More */}
                        <section id="more" className="scroll-mt-32 text-center max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-8">Learn More About Studying at Kestora</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-left">
                                <Link href="/student-life#facilities" className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group block">
                                    <h4 className="font-bold mb-1">Modern Campus</h4>
                                    <p className="text-xs text-neutral-500">State-of-the-art facilities</p>
                                </Link>
                                <Link href="/student-life#services" className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group block">
                                    <h4 className="font-bold mb-1">Support</h4>
                                    <p className="text-xs text-neutral-500">Advisors & Counseling</p>
                                </Link>
                                <Link href="/student-life#organizations" className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group block">
                                    <h4 className="font-bold mb-1">Community</h4>
                                    <p className="text-xs text-neutral-500">Global network</p>
                                </Link>
                                <Link href="/collaboration" className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group block">
                                    <h4 className="font-bold mb-1">Careers</h4>
                                    <p className="text-xs text-neutral-500">Internships & Mentoring</p>
                                </Link>
                                <Link href="/student-life" className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group block">
                                    <h4 className="font-bold mb-1">Student Life</h4>
                                    <p className="text-xs text-neutral-500">Clubs & Sports</p>
                                </Link>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}

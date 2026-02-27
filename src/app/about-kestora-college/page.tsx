import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Calendar } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';

export const metadata = {
    title: 'About Kestora College — Our Story, Mission & Helsinki Campus',
    description: 'Kestora College is an independent higher education institution in Helsinki, Finland, offering English-taught Bachelor’s and Master’s degree programmes focused on engineering, technology, business, science, and the arts.',
};

import DynamicNewsSection from "@/components/news/DynamicNewsSection";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

export default async function AboutPage() {


    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'About Kestora College', item: '/about-kestora-college' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "About Kestora College",
                "url": "https://kestora.fi/about-kestora-college",
                "mainEntity": {
                    "@type": "EducationalOrganization",
                    "name": "Kestora College Helsinki",
                    "description": "Kestora College is an independent higher education institution in Helsinki, Finland, offering English-taught Bachelor's and Master's degree programmes.",
                    "url": "https://kestora.fi"
                }
            }} />

            {/* 1. HERO SECTION (Yellow Background) */}
            <section className="bg-[#f3e600] text-black">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-4 h-auto min-h-[600px] md:pt-48 lg:h-[600px] lg:py-0 relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-2 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            About Kestora College
                        </h1>
                        <p className="text-[21px] text-neutral-800 max-w-xl leading-relaxed">
                            Learn about Kestora College, an independent higher education institution based in Helsinki, Finland, focused on sustainability, innovation, and practical learning. Kestora College brings together academic knowledge and real-world application to prepare students for global careers.
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-4 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="h-full">
                            <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl">
                                <Image
                                    src="/images/about-hero.jpg"
                                    alt="Kestora College – Helsinki Campus main building"
                                    fill
                                    priority
                                    className="object-cover opacity-90"
                                    sizes="(max-width: 1024px) 368px, 50vw"
                                />
                                <div className="absolute inset-0 bg-neutral-800 -z-10 flex items-center justify-center text-neutral-500 font-bold tracking-widest uppercase">
                                    About Hero Image
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">

                {/* Content Sections: Philosophy, Mission & Approach */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 mb-24">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Our Philosophy</h2>
                            <p className="text-lg text-neutral-800 leading-relaxed">
                                Kestora College is inspired by the Nordic tradition of Sivistys — a holistic approach to education that combines personal development, critical thinking, and social responsibility.
                            </p>
                            <p className="text-lg text-neutral-800 leading-relaxed mt-4">
                                We believe that meaningful learning happens where theory meets practice. Our educational approach emphasizes applied learning, project-based collaboration, and real-world problem solving. From the beginning of their studies, students engage with practical challenges, multidisciplinary thinking, and internationally oriented learning environments.
                            </p>
                            <p className="text-lg text-neutral-800 leading-relaxed mt-4">
                                Our programmes are designed to support independent thinking, innovation, and lifelong learning in a rapidly changing world.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
                            <p className="text-lg text-neutral-800 leading-relaxed mb-6">
                                Our mission is to empower future professionals with the skills, knowledge, and ethical awareness needed to contribute responsibly to society and the global economy.
                            </p>
                            <p className="text-md font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wider">As an independent higher education institution, Kestora College provides:</p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "English-taught Bachelor’s and Master’s level studies",
                                    "Multidisciplinary academic pathways",
                                    "Practice-oriented learning models",
                                    "An international student community in Helsinki"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-neutral-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#f3e600] mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-lg text-neutral-800 leading-relaxed">
                                We aim to equip students with competencies that support sustainable development, innovation, and professional growth across diverse fields and industries.
                            </p>
                        </div>
                    </div>

                    <div className="mb-24">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold mb-8">Our Academic Approach</h2>
                            <p className="text-lg text-neutral-800 leading-relaxed mb-6">
                                Kestora College promotes:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-6 mb-8">
                                {[
                                    "Learning through real-world projects",
                                    "Collaboration with external partners and industry networks",
                                    "Multidisciplinary study opportunities",
                                    "A balance between academic foundations and applied skills"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 p-4 bg-neutral-50 border border-neutral-100">
                                        <span className="text-[#f3e600] font-bold text-xl leading-none">/</span>
                                        <span className="text-neutral-800 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-lg text-neutral-800 leading-relaxed">
                                Our campus in Helsinki offers a supportive environment where students, educators, and partners collaborate to explore contemporary challenges and future-oriented solutions.
                            </p>
                        </div>
                    </div>

                    {/* Specialized Campuses */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Specialized Campuses</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-black">
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Arts & Design</h3>
                                <p className="text-neutral-600 mb-6">Preparing students for international careers in the creative industries, from digital design to contemporary architecture.</p>
                                <Link href="/schools/arts" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Business</h3>
                                <p className="text-neutral-600 mb-6">Empowering future leaders with English-taught programmes in international management, finance, and entrepreneurship.</p>
                                <Link href="/schools/business" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Technology</h3>
                                <p className="text-neutral-600 mb-6">Specializing in the development of smart infrastructure, automation, and industrial engineering solutions.</p>
                                <Link href="/schools/technology" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Science</h3>
                                <p className="text-neutral-600 mb-6">Focusing on applied scientific research, data-driven innovation, and the development of transformative materials.</p>
                                <Link href="/schools/science" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>



            {/* Key Figures - Yellow Background Redesign - Full Width */}
            <div className="py-24 bg-[#f3e600] text-black w-full">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center max-w-5xl mx-auto">
                        <div className="space-y-3">
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">4.5k</div>
                            <div className="text-sm font-bold uppercase tracking-[0.2em] text-black/60">Students</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">350</div>
                            <div className="text-sm font-bold uppercase tracking-[0.2em] text-black/60">Faculty</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">60+</div>
                            <div className="text-sm font-bold uppercase tracking-[0.2em] text-black/60">Countries</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-24">

                {/* Partnerships Section */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold">Industry & Research Partnerships</h2>
                            <p className="text-lg text-neutral-800 leading-relaxed">
                                We don't just study the future; we build it. Kestora College maintains strategic partnerships with over 200 global companies and research institutions. Our students have direct access to internships, joint research projects, and innovation labs that bridge the gap between academic theory and market-ready solutions.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <div className="text-xl font-bold mb-1">Global Network</div>
                                    <p className="text-sm text-neutral-500">Member of the World Federation of Sustainability Colleges.</p>
                                </div>
                                <div>
                                    <div className="text-xl font-bold mb-1">Employment Rate</div>
                                    <p className="text-sm text-neutral-500">92% of graduates find relevant employment within 6 months.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { src: "/images/about/yoga-class.jpg", alt: "Students practicing yoga in the Wellness Center", credit: "Tuuli Rantanen" },
                                { src: "/images/about/art-gallery.jpg", alt: "Student artwork displayed in the campus gallery", credit: "Oskar Heikkilä" },
                                { src: "/images/about/communal-kitchen.jpg", alt: "Students cooking together in the communal kitchen", credit: "Maija Lehtinen" },
                                { src: "/images/about/student-collab.jpg", alt: "Students working together in a collaborative study space", credit: "Juha Koivisto" },
                            ].map((img, index) => (
                                <div key={index}>
                                    <div className="bg-neutral-100 aspect-square w-full rounded-none relative overflow-hidden">
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* News & Events Section (Dynamic) */}
                <section className="mb-32">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-3xl font-bold">Latest from Kestora</h2>
                        <Link href="/news" className="text-sm font-bold border-b border-black pb-1 hover:text-neutral-600 transition-colors">
                            View All News
                        </Link>
                    </div>

                    <DynamicNewsSection limit={3} />
                </section>
            </div>
        </div >
    );
}

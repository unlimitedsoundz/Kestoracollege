import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Calendar } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';

export const metadata = {
    title: 'About Kestora University — Our Story, Mission & Helsinki Campus',
    description: 'Kestora University is an independent higher education institution in Helsinki, Finland, offering English-taught Bachelor’s and Master’s degree programmes focused on engineering, technology, business, science, and the arts.',
};

import DynamicNewsSection from "@/components/news/DynamicNewsSection";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

export default async function AboutPage() {


    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'About Kestora University', item: '/about-kestora-university' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "About Kestora University",
                "url": "https://kestora.online/about-kestora-university",
                "mainEntity": {
                    "@type": "EducationalOrganization",
                    "name": "Kestora University Helsinki",
                    "description": "Kestora University is an independent higher education institution in Helsinki, Finland, offering English-taught Bachelor's and Master's degree programmes.",
                    "url": "https://kestora.online"
                }
            }} />

            {/* 1. HERO SECTION (Black and White) */}
            <section className="bg-white text-black overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-4 h-auto min-h-[600px] md:pt-48 lg:h-[600px] lg:py-0 relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-2 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8 text-black">
                            About Kestora University
                        </h1>
                        <p className="text-[21px] text-neutral-800 max-w-xl leading-relaxed mt-6">
                            Learn about Kestora University, an independent higher education institution based in Helsinki, Finland, focused on sustainability, innovation, and practical learning. Kestora University brings together academic knowledge and real-world application to prepare students for global careers.
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-4 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="h-full">
                            <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden">
                                <Image
                                    src="/images/campus-welcome-v2.png"
                                    alt="Kestora University – Helsinki Campus main building"
                                    fill
                                    priority
                                    className="object-cover opacity-90"
                                    sizes="(max-width: 1024px) 368px, 50vw"
                                />
                                <div className="absolute inset-0 bg-neutral-900/10 mix-blend-multiply"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">

                {/* Content Sections: Philosophy, Mission & Approach */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 mb-24">
                        <div className="bg-gray-100 p-12 rounded-3xl shadow-sm text-black">
                            <h2 className="text-3xl font-bold mb-8 text-black">Our Philosophy</h2>
                            <p className="text-lg text-gray-800 leading-relaxed">
                                Kestora University is inspired by the Nordic tradition of Sivistys — a holistic approach to education that combines personal development, critical thinking, and social responsibility.
                            </p>
                            <p className="text-lg text-gray-800 leading-relaxed mt-4">
                                We believe that meaningful learning happens where theory meets practice. Our educational approach emphasizes applied learning, project-based collaboration, and real-world problem solving. From the beginning of their studies, students engage with practical challenges, multidisciplinary thinking, and internationally oriented learning environments.
                            </p>
                            <p className="text-lg text-gray-800 leading-relaxed mt-4">
                                Our programmes are designed to support independent thinking, innovation, and lifelong learning in a rapidly changing world.
                            </p>
                        </div>
                        <div className="bg-gray-100 p-12 rounded-3xl shadow-sm text-black">
                            <h2 className="text-3xl font-bold mb-8 text-black">Our Mission</h2>
                            <p className="text-lg text-gray-800 leading-relaxed mb-6">
                                Our mission is to empower future professionals with the skills, knowledge, and ethical awareness needed to contribute responsibly to society and the global economy.
                            </p>
                            <p className="text-md font-bold text-black mb-4 text-sm uppercase tracking-wider">As an independent higher education institution, Kestora University provides:</p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "English-taught Bachelor’s and Master’s level studies",
                                    "Multidisciplinary academic pathways",
                                    "Practice-oriented learning models",
                                    "An international student community in Helsinki"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-lg text-gray-800 leading-relaxed">
                                We aim to equip students with competencies that support sustainable development, innovation, and professional growth across diverse fields and industries.
                            </p>
                        </div>
                    </div>

                    <div className="mb-24">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-8 text-black">Our Academic Approach</h2>
                            <p className="text-lg text-gray-800 leading-relaxed mb-10">
                                Kestora University promotes:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-6 mb-12 text-left">
                                {[
                                    { text: "Learning through real-world projects" },
                                    { text: "Collaboration with external partners and industry networks" },
                                    { text: "Multidisciplinary study opportunities" },
                                    { text: "A balance between academic foundations and applied skills" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-6 p-8 bg-gray-100 rounded-3xl shadow-lg transform hover:-translate-y-1 transition-transform">
                                        <div className={`w-12 h-12 rounded-2xl bg-black flex items-center justify-center shrink-0 shadow-inner`}>
                                            <span className="text-white font-bold text-xl leading-none">/</span>
                                        </div>
                                        <span className="text-black font-bold text-lg">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-lg text-gray-800 leading-relaxed bg-gray-100 p-8 rounded-3xl">
                                Our campus in Helsinki offers a supportive environment where students, educators, and partners collaborate to explore contemporary challenges and future-oriented solutions.
                            </p>
                        </div>
                    </div>

                    {/* Specialized Campuses */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-12 text-center text-black">Our Specialized Campuses</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-100 p-10 rounded-3xl shadow-md flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 text-black">School of Arts & Design</h3>
                                    <p className="text-gray-800 mb-8 leading-relaxed">Preparing students for international careers in the creative industries, from digital design to contemporary architecture.</p>
                                </div>
                                <Link href="/schools/arts" className="text-sm font-bold flex items-center gap-2 text-black hover:text-gray-600 transition-colors uppercase tracking-wider">Explore Campus <ArrowRight size={16} weight="bold" /></Link>
                            </div>
                            <div className="bg-gray-100 p-10 rounded-3xl shadow-md flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 text-black">School of Business</h3>
                                    <p className="text-gray-800 mb-8 leading-relaxed">Empowering future leaders with English-taught programmes in international management, finance, and entrepreneurship.</p>
                                </div>
                                <Link href="/schools/business" className="text-sm font-bold flex items-center gap-2 text-black hover:text-gray-600 transition-colors uppercase tracking-wider">Explore Campus <ArrowRight size={16} weight="bold" /></Link>
                            </div>
                            <div className="bg-gray-100 p-10 rounded-3xl shadow-md flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 text-black">School of Technology</h3>
                                    <p className="text-gray-800 mb-8 leading-relaxed">Specializing in the development of smart infrastructure, automation, and industrial engineering solutions.</p>
                                </div>
                                <Link href="/schools/technology" className="text-sm font-bold flex items-center gap-2 text-black hover:text-gray-600 transition-colors uppercase tracking-wider">Explore Campus <ArrowRight size={16} weight="bold" /></Link>
                            </div>
                            <div className="bg-gray-100 p-10 rounded-3xl shadow-md flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 text-black">School of Science</h3>
                                    <p className="text-gray-800 mb-8 leading-relaxed">Focusing on applied scientific research, data-driven innovation, and the development of transformative materials.</p>
                                </div>
                                <Link href="/schools/science" className="text-sm font-bold flex items-center gap-2 text-black hover:text-gray-600 transition-colors uppercase tracking-wider">Explore Campus <ArrowRight size={16} weight="bold" /></Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>



            {/* Key Figures - Black and White */}
            <div className="py-24 bg-black text-white w-full">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center max-w-5xl mx-auto">
                        <div className="space-y-3">
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">2.4k</div>
                            <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Students</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">250</div>
                            <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Faculty</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">60+</div>
                            <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Countries</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-24">

                {/* Partnerships Section */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8 bg-gray-100 p-12 rounded-3xl shadow-sm text-black">
                            <h2 className="text-3xl font-bold text-black mb-6">Industry & Research Partnerships</h2>
                            <p className="text-lg text-gray-800 leading-relaxed">
                                We don't just study the future; we build it. Kestora University maintains strategic partnerships with over 200 global companies and research institutions. Our students have direct access to internships, joint research projects, and innovation labs that bridge the gap between academic theory and market-ready solutions.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-300 mt-8">
                                <div>
                                    <div className="text-xl font-bold mb-2 text-black">Global Network</div>
                                    <p className="text-sm text-gray-700 leading-relaxed">Member of the World Federation of Sustainability Universitys.</p>
                                </div>
                                <div>
                                    <div className="text-xl font-bold mb-2 text-black">Employment Rate</div>
                                    <p className="text-sm text-gray-700 leading-relaxed">92% of graduates find relevant employment within 6 months.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { src: "/images/about/yoga-class.png", alt: "Students practicing yoga in the Wellness Center", credit: "Tuuli Rantanen" },
                                { src: "/images/about/art-gallery.jpg", alt: "Student artwork displayed in the campus gallery", credit: "Oskar Heikkilä" },
                                { src: "/images/about/communal-kitchen.jpg", alt: "Students cooking together in the communal kitchen", credit: "Maija Lehtinen" },
                                { src: "/images/about/student-collab.jpg", alt: "Students working together in a collaborative study space", credit: "Juha Koivisto" },
                            ].map((img, index) => (
                                <div key={index} className="relative group rounded-3xl overflow-hidden shadow-lg h-64 md:h-auto md:aspect-square">
                                    <div className="absolute inset-0 bg-black opacity-20 mix-blend-multiply group-hover:opacity-5 transition-opacity z-10 duration-500"></div>
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
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

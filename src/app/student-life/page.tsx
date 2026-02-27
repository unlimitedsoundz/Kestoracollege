
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Train, Building, BookOpen, Books as Library, House as Home, Users, Coffee, Compass, Info, CaretRight as ChevronRight, GraduationCap } from "@phosphor-icons/react";
import TableOfContents from '@/components/course/TableOfContents';

export default function StudentLifePage() {
    const sections = [
        { id: 'location', title: 'Location & Setting', content: '' },
        { id: 'accessibility', title: 'Accessibility', content: '' },
        { id: 'architecture', title: 'Campus Architecture', content: '' },
        { id: 'facilities', title: 'Academic Facilities', content: '' },
        { id: 'library', title: 'Library & Centres', content: '' },
        { id: 'housing', title: 'Housing & Daily Living', content: '' },
        { id: 'organizations', title: 'Student Organisations', content: '' },
        { id: 'sports', title: 'Sports & Activities', content: '' },
        { id: 'services', title: 'Services & Amenities', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Offset Style */}
            <section className="bg-[#F5F5DC] text-black">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-4 md:pt-48 lg:py-0 h-auto min-h-[600px] lg:h-[600px] relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-2 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
                        <div className="inline-flex items-center gap-2 text-black font-bold tracking-wider uppercase">
                            <GraduationCap size={16} weight="bold" /> Campus Experience
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            Student Life at Kestora
                        </h1>
                        <p className="text-[21px] text-neutral-800 max-w-xl leading-relaxed">
                            Experience a supportive and vibrant campus environment. From coastal landscapes to modern academic facilities, discover how our community thrives in the heart of Helsinki.
                        </p>
                    </div>

                    {/* Right Image Container */}
                    <div className="lg:w-1/2 h-full w-full relative mt-8 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl">
                            <Image
                                src="/images/student_life_hero.jpg"
                                alt="Student Life at Kestora"
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 368px, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar TOC */}
                    <aside className="lg:w-1/4 hidden lg:block h-fit sticky top-8">
                        <TableOfContents sections={sections} />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4 space-y-8 md:space-y-24">

                        {/* Location */}
                        <section id="location" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Campus Location and Setting</h2>
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Left: Text Content */}
                                <div className="space-y-6">
                                    <p className="text-lg text-neutral-700 leading-relaxed">
                                        The Kestora College campus is located in the Helsinki metropolitan area and forms a compact academic district where teaching facilities, student services, housing, and leisure areas are closely integrated. The campus is surrounded by coastal landscapes and protected green areas, offering a unique balance between urban infrastructure and natural surroundings.
                                    </p>
                                </div>

                                {/* Right: Square Image */}
                                <div>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
                                        <Image
                                            src="/images/news/helsinki_study_hero_1771086748710.png"
                                            alt="Kestora College campus location and setting"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Accessibility */}
                        <section id="accessibility" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Accessibility and Transport Connections</h2>
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Left: Square Image */}
                                <div>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
                                        <Image
                                            src="/images/student-life/accessibility.jpg"
                                            alt="Public transport connections at Kestora College"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>

                                {/* Right: Text Content */}
                                <div className="space-y-6">
                                    <p className="text-lg text-neutral-700 leading-relaxed">
                                        The campus is directly connected to public transport networks. A dedicated metro station, multiple bus routes, and tram connections provide fast access to central Helsinki and surrounding areas. Travel between campus and the city centre typically takes less than twenty minutes.
                                    </p>
                                    <p className="text-lg text-neutral-700 leading-relaxed">
                                        Cycling infrastructure is well developed, with marked bike paths and secure bicycle parking available throughout the campus area.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Architecture */}
                        <section id="architecture" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Campus Architecture and Built Environment</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                                The campus features a mix of historically significant buildings and modern academic facilities. Architectural planning emphasizes openness, shared spaces, and interaction between disciplines. Teaching buildings, research facilities, libraries, and student hubs are designed to support collaboration, independent study, and project based learning.
                            </p>
                        </section>

                        {/* Academic Facilities */}
                        <section id="facilities" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Academic Facilities and Learning Spaces</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                                Students at Kestora College have access to a wide range of learning environments designed to support collaboration and innovation.
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {[
                                    { title: "Labs & Workshops", image: "/images/student-life/labs.jpg", credit: "Elina Mäkinen" },
                                    { title: "Collaborative Studios", image: "/images/student-life/studios.jpg", credit: "Mikael Ström" },
                                    { title: "Quiet Study Zones", image: "/images/student-life/quiet.jpg", credit: "Johanna Virtanen" }
                                ].map((item) => (
                                    <div key={item.title} className="group cursor-pointer">
                                        <div className="bg-neutral-100 h-48 rounded-2xl mb-4 overflow-hidden relative">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                                                    <span className="font-bold uppercase tracking-widest text-sm text-center px-4">Image: {item.title}</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    </div>
                                ))}
                            </div>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {["Individual self study areas", "Group work rooms", "Technical workshops", "Creative design spaces"].map((item) => (
                                    <li key={item} className="bg-neutral-100 px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-sm text-neutral-700">
                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Library */}
                        <section id="library" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Library and Learning Centres</h2>
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Left: Text Content */}
                                <div className="space-y-6">
                                    <p className="text-lg text-neutral-700 leading-relaxed">
                                        The central Learning Centre combines library services, digital resources, quiet reading zones, collaborative areas, and café services in a single location. It serves as a primary academic hub for students across all fields of study.
                                    </p>
                                    <p className="text-lg text-neutral-700 leading-relaxed">
                                        A dedicated student and event venue located at the heart of campus provides space for academic events, exhibitions, lectures, and student gatherings.
                                    </p>
                                </div>

                                {/* Right: Square Image */}
                                <div>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
                                        <Image
                                            src="/images/student-life/library.jpg"
                                            alt="Kestora College Learning Centre"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Housing */}
                        <section id="housing" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Student Housing and Daily Living</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                                Living on or near campus makes combining studies and leisure efficient. Choose from various housing options to suit your needs.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div className="bg-neutral-100 p-10 rounded-2xl">
                                    <div className="h-48 bg-neutral-100 rounded-xl mb-6 relative overflow-hidden group">
                                        <Image
                                            src="/images/student-life/apartments.jpg"
                                            alt="Shared Apartments"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Shared Apartments</h3>
                                    <p className="text-neutral-600 mb-4 text-sm">Private room with shared kitchen and bathroom facilities. Affordable and social options for students.</p>
                                    <span className="inline-block bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md">From ~300€/month</span>
                                </div>
                                <div className="bg-neutral-100 p-10 rounded-2xl">
                                    <div className="h-48 bg-neutral-100 rounded-xl mb-6 relative overflow-hidden group">
                                        <Image
                                            src="/images/student-life/studio-apartments.jpg"
                                            alt="Studio Apartments"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Studio Apartments</h3>
                                    <p className="text-neutral-600 mb-4 text-sm">private apartments with own kitchen and bathroom. Ideal for students who prefer more independence.</p>
                                    <span className="inline-block bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md">From ~450€/month</span>
                                </div>
                            </div>
                        </section>

                        {/* Organizations */}
                        <section id="organizations" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Student Organisations</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                                Student life is organised through a wide range of associations. Find your community in academic clubs, sports teams, or cultural societies.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="relative h-64 bg-neutral-900 rounded-2xl overflow-hidden flex items-end p-8 cursor-pointer group">
                                    <Image
                                        src="/images/student-life/student-union.jpg"
                                        alt="Student Union"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                    <div className="relative z-10 text-white">
                                        <h3 className="text-2xl font-bold mb-2">Student Union</h3>
                                        <p className="text-sm text-neutral-300">The heart of student advocacy and events.</p>
                                    </div>
                                </div>
                                <div className="relative h-64 bg-neutral-900 rounded-2xl overflow-hidden flex items-end p-8 cursor-pointer group">
                                    <Image
                                        src="/images/student-life/subject-clubs.jpg"
                                        alt="Subject Clubs"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                    <div className="relative z-10 text-white">
                                        <h3 className="text-2xl font-bold mb-2">Subject Clubs</h3>
                                        <p className="text-sm text-neutral-300">Networking and events for your specific field.</p>
                                    </div>
                                </div>
                            </div>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {["Academic networking", "Cultural events", "Sports teams", "Debate & hobbies"].map((item) => (
                                    <li key={item} className="bg-neutral-50 px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-sm text-neutral-700">
                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Sports */}
                        <section id="sports" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Sports Facilities and Outdoor Activities</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                                The campus area offers access to both indoor and outdoor sports facilities. Students can use gyms, sports halls, and fitness centres, as well as outdoor exercise areas, running paths, and coastal trails.
                            </p>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                The surrounding natural environment supports year round outdoor activities, including walking, cycling, and seasonal sports.
                            </p>
                        </section>

                        {/* Services */}
                        <section id="services" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Campus Services and Amenities</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                                Everything you need for daily life is integrated into the campus layout.
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        name: "Restaurants & Cafés",
                                        desc: "Opiskelija Cafe & Catering",
                                        image: "/images/student-cafe.png",
                                        credit: "Katri Salonen"
                                    },
                                    {
                                        name: "Retail Stores",
                                        desc: "Campus supplies and books",
                                        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
                                        credit: "Olli Järvinen"
                                    },
                                    {
                                        name: "Health Services",
                                        desc: "Medical and mental support",
                                        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
                                        credit: "Riikka Lind"
                                    },
                                    {
                                        name: "Student Support",
                                        desc: "Career and academic guidance",
                                        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
                                        credit: "Pekka Hämäläinen"
                                    }
                                ].map(item => (
                                    <div key={item.name} className="bg-neutral-100 rounded-2xl overflow-hidden group transition-all">
                                        <div className="h-32 relative bg-neutral-100 overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-8 text-center">
                                            <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                                            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Future Growth */}
                        <section id="future" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Campus Development and Future Growth</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                                Kestora College continues to develop its campus infrastructure to support modern teaching methods, sustainability goals, and student wellbeing. New buildings and renovated facilities focus on energy efficiency, accessibility, and flexible learning environments.
                            </p>
                        </section>


                        {/* Summary */}
                        <section id="summary" className="scroll-mt-32 bg-neutral-100 p-12 border-l-4 border-yellow-500">
                            <h2 className="text-2xl font-bold mb-4">Campus Experience Summary</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Studying at Kestora College means being part of an integrated academic environment where teaching, research, student life, and daily living coexist within a single campus district. The combination of strong infrastructure, accessible services, active student community, and natural surroundings supports both academic success and personal wellbeing.
                            </p>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

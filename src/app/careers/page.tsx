'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Briefcase, Globe, Leaf } from '@phosphor-icons/react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

const positions = [
    {
        title: 'University Lecturer, Engineering & Sustainability',
        type: 'Full-time',
        location: 'Helsinki Campus',
        description: 'Leading research and teaching in a multi-disciplinary environment spanning engineering, science, and technology.'
    },
    {
        title: 'Admissions Coordinator',
        type: 'Part-time',
        location: 'Remote / Helsinki',
        description: 'Supporting international students through their application journey at Kestora College.'
    },
    {
        title: 'IT Support Specialist',
        type: 'Full-time',
        location: 'Helsinki Campus',
        description: 'Managing campus infrastructure and supporting our digital learning environment.'
    }
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Careers', item: '/careers' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Careers at Kestora College",
                "description": "Explore job opportunities at Kestora College in Helsinki.",
                "url": "https://kestora.online/careers"
            }} />

            {positions.map((pos, index) => (
                <SchemaLD key={`schema-${index}`} data={{
                    "@context": "https://schema.org",
                    "@type": "JobPosting",
                    "title": pos.title,
                    "description": pos.description,
                    "datePosted": "2026-02-22",
                    "validThrough": "2026-12-31",
                    "employmentType": pos.type === "Full-time" ? "FULL_TIME" : "PART_TIME",
                    "hiringOrganization": {
                        "@type": "CollegeOrUniversity",
                        "name": "Kestora College",
                        "sameAs": "https://kestora.online",
                        "logo": "https://kestora.online/logo-kestora.png"
                    },
                    "jobLocation": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Pohjoisesplanadi 51",
                            "addressLocality": "Helsinki",
                            "postalCode": "00150",
                            "addressCountry": "FI"
                        }
                    }
                }} />
            ))}

            {/* Hero Section */}
            <section className="bg-white pt-32 pb-16 border-b border-neutral-100">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-8xl font-bold text-black tracking-tighter mb-12 uppercase">
                        Work at <br className="hidden md:block" /> Kestora College
                    </h1>

                    <div className="relative h-[400px] md:h-[500px] w-full mb-12 overflow-hidden bg-neutral-100">
                        <Image
                            src="/images/admissions/campus_welcome.jpg"
                            alt="Kestora College Campus"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none"></div>
                    </div>

                    <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto font-medium leading-relaxed">
                        Shape the future of higher education in Finland. We're looking for innovators, educators, and leaders to join our world-class faculty and staff.
                    </p>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-8 tracking-tight">Institutional Culture</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                            Kestora College is an independent higher education institution in Helsinki, Finland, offering English-taught Bachelor’s and Master’s degree programmes focused on engineering, technology, business, science, and the arts.
                        </p>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-black text-white p-2 rounded">
                                    <Globe size={24} weight="bold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Multi-Disciplinary Excellence</h3>
                                    <p className="text-neutral-500">A higher education institution focused on arts, science, business, and engineering.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-black text-white p-2 rounded">
                                    <Globe size={24} weight="bold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">International Focus</h3>
                                    <p className="text-neutral-500">A diverse community of students and faculty from over 40 countries.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[500px] bg-neutral-100 p-8 flex flex-col justify-center">
                        <div className="border-[12px] border-black p-8 h-full flex flex-col justify-center relative">
                            <blockquote className="text-2xl font-bold leading-tight mb-4">
                                "Working here means being part of a team that doesn't just teach the future; we build it."
                            </blockquote>
                            <cite className="text-neutral-500 not-italic font-bold uppercase tracking-widest text-sm">— Dr. Anna Virtanen, Rector</cite>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-neutral-200 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Postings */}
            <section className="py-24 bg-neutral-50 border-y border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight">Open Positions</h2>
                            <p className="text-neutral-500 mt-2">Find your next role at Kestora College.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {positions.map((pos, index) => (
                            <div key={index} className="bg-white border border-neutral-200 p-8 hover:border-black transition-colors group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-neutral-100 rounded group-hover:bg-black group-hover:text-white transition-colors">
                                        <Briefcase size={24} weight="bold" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest bg-neutral-100 px-3 py-1 rounded">
                                        {pos.type}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 group-hover:underline">
                                    {pos.title}
                                </h3>
                                <p className="text-neutral-500 text-sm mb-6 flex-grow">
                                    {pos.description}
                                </p>
                                <div className="flex items-center text-sm font-bold gap-2">
                                    <span className="text-neutral-400">{pos.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-black text-white overflow-hidden relative">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Ready to apply?</h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
                        If you don't see a position that fits your profile but believe you'd be a great addition to the team, send us an open application.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        <a
                            href="mailto:careers@kestora.online"
                            className="px-10 py-5 bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-colors flex items-center gap-3"
                        >
                            Send your CV <ArrowRight size={20} weight="bold" />
                        </a>
                        <p className="text-neutral-500 font-mono text-sm">
                            careers@kestora.online
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

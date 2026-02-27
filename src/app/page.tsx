import Link from "next/link";
import * as React from "react";
import Image from "next/image"; // Added next/image
import { Button } from "@/components/ui/Button";
import { ArrowRight, CaretRight as ChevronRight, CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";
import { createStaticClient } from "@/lib/supabase/static";
import { formatToDDMMYYYY } from '@/utils/date';


import DynamicNewsSection from "@/components/news/DynamicNewsSection";

export default async function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">

      {/* 1. HERO SECTION (Dark Grey Split) */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-4 h-auto min-h-[600px] md:pt-48 lg:h-[600px] lg:py-0 relative mb-12">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-2 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8 lg:pt-24">
              Kestora College – English-Taught Bachelor’s & Master’s Degrees in Finland
            </h1>
            <p className="text-[21px] text-white max-w-xl leading-relaxed my-4">
              Kestora College is an independent higher education institution based in Helsinki, Finland, offering internationally focused Bachelor’s and Master’s degree programmes taught in English for students from around the world.
            </p>
            <div className="space-y-3 pt-2">
              <Link href="/admissions" className="flex items-center gap-2 text-[18px] font-bold underline hover:opacity-70 group">
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" /> Start your application
              </Link>
            </div>

            {/* Removed Carousel Controls */}
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 h-full w-full relative mt-4 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
            <div className="h-full">
              <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl overflow-hidden">
                <Image
                  src="/images/home-hero-new.png"
                  alt="Student studying at Kestora College campus in Finland"
                  fill
                  priority
                  className="object-cover opacity-90"
                  sizes="(max-width: 1024px) 368px, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCHOOLS GRID */}
      <section className="py-8 md:py-24 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Discover the four campuses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Arts */}
          <Link href="/schools/arts" className="group flex bg-neutral-100 hover:bg-neutral-200 transition-colors h-[82px] md:h-[160px] overflow-hidden shadow-none">
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center md:justify-between">
              <h3 className="text-xl font-bold group-hover:underline leading-tight">School of Arts & Design</h3>
              <p className="hidden md:block text-sm text-neutral-600">Fusing creative excellence with modern design and professional practice.</p>
            </div>
            <div className="w-1/3 relative">
              <Image src="/images/school-arts.png" alt="Arts" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </Link>

          {/* Card 2: Business */}
          <Link href="/schools/business" className="group flex bg-neutral-100 hover:bg-neutral-200 transition-colors h-[82px] md:h-[160px] overflow-hidden shadow-none">
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center md:justify-between">
              <h3 className="text-xl font-bold group-hover:underline leading-tight">School of Business</h3>
              <p className="hidden md:block text-sm text-neutral-600">Developing innovative leaders for global markets and digital entrepreneurship.</p>
            </div>
            <div className="w-1/3 relative">
              <Image src="/images/school-business.png" alt="Business" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </Link>

          {/* Card 3: Technology */}
          <Link href="/schools/technology" className="group flex bg-neutral-100 hover:bg-neutral-200 transition-colors h-[82px] md:h-[160px] overflow-hidden shadow-none">
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center md:justify-between">
              <h3 className="text-xl font-bold group-hover:underline leading-tight">School of Technology</h3>
              <p className="hidden md:block text-sm text-neutral-600">Pioneering advanced engineering and smart-city technical solutions.</p>
            </div>
            <div className="w-1/3 relative">
              <Image src="/images/school-technology.png" alt="Technology" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </Link>

          {/* Card 4: Science */}
          <Link href="/schools/science" className="group flex bg-neutral-100 hover:bg-neutral-200 transition-colors h-[82px] md:h-[160px] overflow-hidden shadow-none">
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center md:justify-between">
              <h3 className="text-xl font-bold group-hover:underline leading-tight">School of Science</h3>
              <p className="hidden md:block text-sm text-neutral-600">Advancing applied research and innovation for a changing global landscape.</p>
            </div>
            <div className="w-1/3 relative">
              <Image src="/images/school-science.png" alt="Science" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. SPOTLIGHT SECTION (Vibrant) */}
      <section className="pb-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[28px] font-bold mb-4">Limelight</h2>
            <p className="text-[21px] font-bold text-black max-w-xl">The news page has more current news.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3 border border-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 group"
            >
              See all Kestora College news
              <ArrowRight size={18} weight="bold" className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="min-h-[400px]">
          <DynamicNewsSection limit={9} />
        </div>

        {/* Mobile View All Button - visible only on small screens */}
        <div className="flex md:hidden mt-10 justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 border border-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 group w-full justify-center text-center"
          >
            See all Kestora College news
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. CAMPUS SECTION */}
      <section className="py-8 md:py-24 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-2xl">
              <Image
                src="/images/campus-welcome.png"
                alt="Kestora campus"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-[28px] font-bold">Welcome to our campus!</h2>
            <p className="text-lg text-neutral-600">
              Are you hosting a group or organizing a visit? Contact our admissions team to arrange a tour or discover how to maximize your time on the Kestora campus.
            </p>
            <p className="text-lg text-neutral-600">
              Kestora College welcomes prospective Bachelor’s and Master’s degree students to learn more about studying in Finland through guided visits and virtual consultations.
            </p>
          </div>
        </div>



      </section>

      {/* 5. BLACK FOOTER BAR */}
      <section className="bg-black text-white py-8 md:py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Study at Kestora College in Helsinki, Finland
            </h2>
            <p className="text-white/50 text-sm mt-4">
              An independent higher education institution offering English-taught Bachelor's and Master's degree programmes focused on engineering, technology, business, science, and the arts.
            </p>
          </div>

          <div className="space-y-4 md:space-y-2 w-full md:w-auto">
            {[
              { label: "Study at Kestora", href: "/studies" },
              { label: "Open positions", href: "/careers" },
              { label: "Contact us", href: "/contact" }
            ].map((link) => (
              <Link key={link.label} href={link.href} className="flex justify-between md:justify-start items-center gap-8 py-2 md:py-0 border-b border-white/20 md:border-none group">
                <span className="font-bold text-lg group-hover:underline">{link.label}</span>
                <ArrowRight size={20} weight="bold" className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

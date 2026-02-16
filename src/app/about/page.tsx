import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Calendar } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';

export const metadata = {
    title: 'About SYKLI College — Our Story, Mission & Helsinki Campus',
    description: 'Learn about SYKLI College, a higher education institution in Helsinki, Finland dedicated to sustainability, innovation, and practical excellence. Discover our mission, values, and campus.',
};

export default async function AboutPage() {
    const supabase = await createClient();

    // Fetch most recent news (limit 3)
    const { data: news } = await supabase
        .from('News')
        .select('*')
        .eq('published', true)
        .order('publishDate', { ascending: false })
        .limit(3);

    // Fetch upcoming events (limit 3)
    const { data: events } = await supabase
        .from('Event')
        .select('*')
        .eq('published', true)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(3);

    // Combine and sort by date (newest first for news, soonest first for events is tricky to combine strictly by "date" if they mean different things, 
    // but usually "Latest" implies chronological descending. However, for upcoming events, they are in the future.
    // Let's just create a pool and take the top 3 items to fill the current 3 slots.
    // Or, as per user request "all news and event cards linked to database" - implies filling the existing 3 slots or maybe more?
    // User said "add news and events cards section". The previous design had 3 cards.
    // Let's just map all valid items we found (up to 6 total if we take 3 of each? or just top 3 total?).
    // The previous static section had 3 cards.
    // I will display up to 3 cards total to match the layout.

    const validEvents = (events || []).map(e => ({ ...e, type: 'event', sortDate: e.date }));
    const validNews = (news || []).map(n => ({ ...n, type: 'news', sortDate: n.publishDate }));

    // Interleave them or just show them? Let's just show up to 3 items combined.
    const allItems = [...validEvents, ...validNews]
        .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()) // Newest first generic sort
        .slice(0, 3);


    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION (Yellow Background) */}
            <section className="bg-[#f3e600] text-black">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-4 h-auto min-h-[600px] md:pt-48 lg:h-[600px] lg:py-0 relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-2 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            About Sykli College
                        </h1>
                        <p className="text-[21px] text-neutral-800 max-w-xl leading-relaxed">
                            Sykli&apos;s work impacts our daily lives more than we realize. That&apos;s why we all have a reason to support our mission.
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-4 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="h-full">
                            <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl">
                                <Image
                                    src="/images/about-hero.jpg"
                                    alt="SYKLI College Helsinki campus main building"
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

                {/* Merged Mission & History Section */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 mb-24">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Our Philosophy</h2>
                            <p className="text-lg text-neutral-800 leading-relaxed">
                                Sykli College is built on the Nordic tradition of Sivistys—a holistic concept of education that integrates individual growth with social responsibility. We believe that true learning happens at the intersection of theory and practice. Our pedagogical approach emphasizes "learning by doing," where students solve real-world sustainability challenges in collaboration with industry partners from day one.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
                            <p className="text-lg text-neutral-800 leading-relaxed">
                                To empower the next generation of leaders with the skills, knowledge, and ethical framework needed to build a regenerative future. Sykli has evolved into a premier college of higher education. Today, we continue to lead by example, serving as a living laboratory for circular economy and sustainable urban planning.
                            </p>
                        </div>
                    </div>

                    {/* Specialized Campuses */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Specialized Campuses</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-black">
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Arts & Design</h3>
                                <p className="text-neutral-600 mb-6">Focusing on ecological responsibility in the creative industries, from sustainable fashion to regenerative architecture.</p>
                                <Link href="/schools/arts" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Business</h3>
                                <p className="text-neutral-600 mb-6">Developing leaders for the green economy, specializing in circular business models and impact investing.</p>
                                <Link href="/schools/business" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Technology</h3>
                                <p className="text-neutral-600 mb-6">Pioneering sustainable infrastructure, renewable energy systems, and smart-city hardware solutions.</p>
                                <Link href="/schools/technology" className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore Campus <ArrowRight size={14} weight="bold" /></Link>
                            </div>
                            <div className="bg-neutral-50 p-10 border border-neutral-100 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4">School of Science</h3>
                                <p className="text-neutral-600 mb-6">Advancing fundamental research in biodiversity, climate science, and transformative materials for a sustainable future.</p>
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
                                We don't just study the future; we build it. Sykli College maintains strategic partnerships with over 200 global companies and research institutions. Our students have direct access to internships, joint research projects, and innovation labs that bridge the gap between academic theory and market-ready solutions.
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
                        <h2 className="text-3xl font-bold">Latest from Sykli</h2>
                        <Link href="/news" className="text-sm font-bold border-b border-black pb-1 hover:text-neutral-600 transition-colors">
                            View All News
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {allItems.map((item: any) => {
                            const isEvent = item.type === 'event';
                            const href = isEvent ? `/events/${item.slug}` : `/news/${item.slug}`;
                            const dateLabel = formatToDDMMYYYY(item.sortDate);
                            const label = isEvent ? 'Event' : 'News';
                            const fallbackImage = "/images/admissions/events.jpg"; // Use a general fallback

                            return (
                                <Link href={href} key={item.id} className="group cursor-pointer block">
                                    <div className="aspect-[4/3] bg-neutral-200 mb-4 overflow-hidden relative">
                                        <Image
                                            src={item.imageUrl || fallbackImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        {isEvent && (
                                            <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 flex items-center gap-1 uppercase">
                                                <Calendar size={12} weight="bold" /> Upcoming
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wide">
                                        {label} • {dateLabel}{isEvent && item.location && <span className="ml-2">• <MapPin size={10} weight="bold" className="inline" /> {item.location}</span>}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:underline leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-neutral-600 text-sm line-clamp-2">
                                        {item.excerpt || item.content}
                                    </p>
                                </Link>
                            )
                        })}

                        {/* Fallback if no content found */}
                        {allItems.length === 0 && (
                            <div className="col-span-3 text-center py-12 text-neutral-500 italic">
                                No recent news or upcoming events found.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div >
    );
}

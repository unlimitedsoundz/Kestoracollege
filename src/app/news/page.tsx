
import Link from 'next/link';
import Image from 'next/image';
import { News, Event } from '@/types/database';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'News & Events | Sykli College',
    description: 'The latest news, announcements, and upcoming events from Sykli College.',
};

import { createStaticClient } from '@/lib/supabase/static';

export default async function NewsPage() {
    const supabase = createStaticClient();

    // Fetch news
    const { data: newsData, error: newsError } = await supabase
        .from('News')
        .select('*')
        .eq('published', true)
        .order('publishDate', { ascending: false });

    // Fetch events
    const { data: eventsData, error: eventsError } = await supabase
        .from('Event')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });

    if (newsError || eventsError) {
        console.error('Error fetching news or events:', newsError || eventsError);
        return <div>Error loading content.</div>;
    }

    // Static editorial articles (not in DB)
    const staticArticles = [
        {
            id: 'static-why-study-finland',
            title: 'Why Study in Finland? 10 Reasons International Students Choose Helsinki',
            slug: 'why-study-in-finland',
            excerpt: 'Finland has become one of Europe\'s most attractive study destinations. From world-class education to a thriving tech scene, discover why students are flocking to Helsinki.',
            imageUrl: '/images/news/helsinki-study-hero.png',
            publishDate: '2026-02-14',
            type: 'news',
            sortDate: '2026-02-14',
            published: true,
        },
    ];

    // Combine and sort: news by publishDate, events by date
    // For a combined feed, we sort by the most relevant date
    const items = [
        ...staticArticles,
        ...(newsData || []).map(n => ({ ...n, type: 'news', sortDate: n.publishDate })),
        ...(eventsData || []).map(e => ({ ...e, type: 'event', sortDate: e.date }))
    ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    return (
        <div className="min-h-screen bg-white pt-32 pb-8 md:pt-48 md:pb-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-12 text-neutral-900 pt-8">News & Events</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item: any) => {
                        const isEvent = item.type === 'event';
                        const href = isEvent ? `/news/events/${item.slug}` : `/news/${item.slug}`;
                        const displayDate = formatToDDMMYYYY(item.sortDate);
                        const fallbackImage = "/images/admissions/events.jpg";

                        return (
                            <Link
                                href={href}
                                key={item.id}
                                className="flex flex-col bg-neutral-100 overflow-hidden group hover:bg-neutral-200 transition-colors"
                            >
                                <div className="aspect-[16/9] relative overflow-hidden bg-neutral-200">
                                    <Image
                                        src={item.imageUrl || fallbackImage}
                                        alt={item.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${isEvent ? 'bg-amber-500 text-black' : 'bg-black text-white'}`}>
                                            {isEvent ? 'Event' : 'News'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                                        {isEvent ? <Calendar size={12} weight="bold" className="text-amber-600" /> : null}
                                        <span>{displayDate}</span>
                                        {isEvent && item.location && (
                                            <>
                                                <span className="text-neutral-300">|</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} weight="bold" /> {item.location}</span>
                                            </>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold mb-3 text-neutral-900 group-hover:underline leading-tight">
                                        {item.title}
                                    </h2>

                                    <p className="text-neutral-600 text-sm line-clamp-3 mb-6 flex-1">
                                        {item.excerpt || item.content?.replace(/[#*`]/g, '').slice(0, 150)}...
                                    </p>

                                    <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-wider text-black">
                                        Read more <ArrowRight size={14} weight="bold" className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}


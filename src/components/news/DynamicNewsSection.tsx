'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin } from "@phosphor-icons/react";

interface DynamicNewsSectionProps {
    limit?: number;
    showExcerpt?: boolean;
}

export default function DynamicNewsSection({ limit = 9, showExcerpt = true }: DynamicNewsSectionProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            const supabase = createClient();

            // Fetch news
            const { data: newsData } = await supabase
                .from('News')
                .select('*')
                .eq('published', true)
                .order('publishDate', { ascending: false })
                .limit(limit);

            // Fetch events
            const { data: eventsData } = await supabase
                .from('Event')
                .select('*')
                .eq('published', true)
                .order('date', { ascending: true })
                .limit(limit);

            // Combine and sort
            const combined = [
                ...(newsData || []).map((n: any) => ({ ...n, type: 'news', sortDate: n.publishDate })),
                ...(eventsData || []).map((e: any) => ({ ...e, type: 'event', sortDate: e.date }))
            ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
                .slice(0, limit);

            setItems(combined);
            setLoading(false);
        }

        fetchContent();
    }, [limit]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col h-full bg-neutral-100 min-h-[400px]">
                        <div className="aspect-video bg-neutral-200 mb-4" />
                        <div className="p-5 space-y-4">
                            <div className="h-6 bg-neutral-200 w-3/4" />
                            <div className="h-4 bg-neutral-200 w-full" />
                            <div className="h-4 bg-neutral-200 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return <div className="text-center py-12 text-neutral-500 italic">No recent news or upcoming events found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {items.map((item) => {
                const isEvent = item.type === 'event';
                const href = isEvent ? `/news/events/${item.slug}` : `/news/${item.slug}`;
                const dateLabel = formatToDDMMYYYY(item.sortDate);
                const label = isEvent ? 'Event' : 'News';
                const fallbackImage = "/images/admissions/events.jpg";

                return (
                    <Link key={item.id} href={href} className="group flex flex-col h-full bg-neutral-100 shadow-none">
                        <div className="aspect-video bg-neutral-200 overflow-hidden mb-4 relative">
                            <Image
                                src={item.imageUrl || fallbackImage}
                                alt={item.title}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-4 left-4">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${isEvent ? 'bg-amber-500 text-black' : 'bg-black text-white'}`}>
                                    {label}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col p-5">
                            <h3 className="text-xl font-bold mb-2 group-hover:underline leading-tight">{item.title}</h3>
                            {showExcerpt && (
                                <p className="text-[18px] text-black line-clamp-3 mb-4 flex-1">
                                    {item.excerpt || item.content?.replace(/[#*`]/g, '')}
                                </p>
                            )}
                            <div className="mt-auto pt-3 flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    {isEvent && <Calendar size={12} weight="bold" className="text-amber-600" />}
                                    {dateLabel} {isEvent && item.location ? `| ${item.location}` : ''}
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

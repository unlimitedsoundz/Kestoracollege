'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, Clock, Tag, CaretLeft as ChevronLeft } from "@phosphor-icons/react";

interface EventDetailClientProps {
    initialEvent: Event;
}

export default function EventDetailClient({ initialEvent }: EventDetailClientProps) {
    const [currentEvent, setEvent] = useState<Event>(initialEvent);

    useEffect(() => {
        async function fetchLatest() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('Event')
                .select('*')
                .eq('id', initialEvent.id)
                .single();

            if (data && !error) {
                if (data.updatedAt !== initialEvent.updatedAt || data.content !== initialEvent.content) {
                    setEvent(data as Event);
                }
            }
        }
        fetchLatest();
    }, [initialEvent.id, initialEvent.updatedAt, initialEvent.content]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            <div className="min-h-[600px] relative overflow-hidden bg-neutral-900 pt-40 md:pt-56 pb-16">
                {currentEvent.imageUrl && (
                    <Image
                        src={currentEvent.imageUrl}
                        alt={currentEvent.title}
                        fill
                        priority
                        unoptimized
                        className="object-cover opacity-60"
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />
                <div className="relative container mx-auto px-4 text-white max-w-5xl h-full flex flex-col justify-end">

                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-widest">
                            {currentEvent.category || 'Event'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight pt-8">{currentEvent.title}</h1>

                    <div className="flex flex-wrap gap-8 items-center text-neutral-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Calendar size={20} weight="regular" className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-white opacity-70">Date</p>
                                <p className="font-bold text-white">{formatToDDMMYYYY(currentEvent.date)}</p>
                            </div>
                        </div>

                        {currentEvent.location && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <MapPin size={20} weight="regular" className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-white opacity-70">Location</p>
                                    <p className="font-bold text-white">{currentEvent.location}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Clock size={20} weight="regular" className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-white opacity-70">Time</p>
                                <p className="font-bold text-white">
                                    {new Date(currentEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <ChevronLeft size={16} weight="bold" /> Back to News & Events
                </Link>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="md:col-span-2 prose prose-lg prose-neutral">
                        <div className="whitespace-pre-wrap text-neutral-800 leading-relaxed text-lg">
                            {currentEvent.content}
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="md:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-neutral-900 text-white p-8 rounded-2xl shadow-xl">
                                <h3 className="font-bold text-xl mb-4 text-white">Interested?</h3>
                                <p className="text-neutral-400 text-sm mb-6">
                                    Join us for this exciting event at SYKLI College. No registration required unless specified.
                                </p>
                                <button className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                                    Add to Calendar
                                </button>
                            </div>

                            <div className="p-8 border border-neutral-200 rounded-2xl">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <Tag size={18} weight="regular" /> Related Info
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/contact" className="hover:underline">Contact Campus Office</Link></li>
                                    <li><Link href="/admissions" className="hover:underline">Admissions Information</Link></li>
                                    <li><Link href="/student-life" className="hover:underline">Student Activities</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

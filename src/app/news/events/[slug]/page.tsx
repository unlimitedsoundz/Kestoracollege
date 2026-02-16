
import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/database';
import { notFound } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, Clock, Tag, CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: events } = await supabase.from('Event').select('slug');
    return events?.map(({ slug }) => ({ slug })) || [];
}

interface Props {
    params: {
        slug: string;
    };
}

export default async function EventDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: eventItem, error } = await supabase
        .from('Event')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !eventItem) {
        if (error?.code !== 'PGRST116') console.error('Error fetching event:', error);
        notFound();
    }

    const item = eventItem as Event;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: item.title,
        startDate: item.date, // ISO 8601 format expected
        endDate: item.date, // Assuming single day event if no end date
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
            '@type': 'Place',
            name: item.location || 'SYKLI College',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Malmin kauppatie 8',
                addressLocality: 'Helsinki',
                postalCode: '00700',
                addressCountry: 'FI'
            }
        },
        image: item.imageUrl ? [item.imageUrl] : undefined,
        description: item.content?.substring(0, 160) || `Join us for ${item.title} at SYKLI College.`,
        organizer: {
            '@type': 'EducationalOrganization',
            name: 'SYKLI College',
            url: 'https://www.sykli.fi'
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero Image */}
            <div className="min-h-[600px] relative overflow-hidden bg-neutral-900 pt-40 md:pt-56 pb-16">
                {item.imageUrl && (
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
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
                            {item.category || 'Event'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight pt-8">{item.title}</h1>

                    <div className="flex flex-wrap gap-8 items-center text-neutral-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Calendar size={20} weight="regular" className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-white opacity-70">Date</p>
                                <p className="font-bold text-white">{formatToDDMMYYYY(item.date)}</p>
                            </div>
                        </div>

                        {item.location && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <MapPin size={20} weight="regular" className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-white opacity-70">Location</p>
                                    <p className="font-bold text-white">{item.location}</p>
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
                                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <ChevronLeft size={16} /> Back to News & Events
                </Link>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="md:col-span-2 prose prose-lg prose-neutral">
                        <div className="whitespace-pre-wrap text-neutral-800 leading-relaxed text-lg">
                            {item.content}
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="md:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-neutral-900 text-white p-8 rounded-2xl shadow-xl">
                                <h3 className="font-bold text-xl mb-4 text-white">Interested?</h3>
                                <p className="text-neutral-400 text-sm mb-6">
                                    Join us for this exciting event at Sykli College. No registration required unless specified.
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

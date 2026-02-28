
import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/database';
import { notFound } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, Clock, Tag, CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";
import EventDetailClient from '@/components/news/EventDetailClient';

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
        startDate: item.date,
        endDate: item.date,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
            '@type': 'Place',
            name: item.location || 'Kestora College – Helsinki Campus',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Pohjoisesplanadi 51',
                addressLocality: 'Helsinki',
                postalCode: '00150',
                addressRegion: 'Uusimaa',
                addressCountry: 'FI'
            }
        },
        image: item.imageUrl ? [item.imageUrl] : undefined,
        description: item.content?.substring(0, 160) || `Join us for ${item.title} at Kestora College.`,
        organizer: {
            '@type': 'EducationalOrganization',
            name: 'Kestora College',
            url: 'https://kestora.online'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EventDetailClient initialEvent={item} />
        </>
    );
}

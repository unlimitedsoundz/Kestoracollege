
import Link from 'next/link';
import Image from 'next/image';
import { News, Event } from '@/types/database';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'News & Events | SYKLI College',
    description: 'The latest news, announcements, and upcoming events from SYKLI College.',
};

import { createStaticClient } from '@/lib/supabase/static';

import NewsList from '@/components/news/NewsList';

export default async function NewsPage() {

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

    return (
        <div className="min-h-screen bg-white pt-32 pb-8 md:pt-48 md:pb-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-12 text-neutral-900 pt-8">News & Events</h1>
                <NewsList staticArticles={staticArticles} />
            </div>
        </div >
    );
}


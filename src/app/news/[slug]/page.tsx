
import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types/database';
import { notFound } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import NewsDetailClient from '@/components/news/NewsDetailClient';

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: news } = await supabase.from('News').select('slug');
    return news?.map(({ slug }) => ({ slug })) || [];
}

interface Props {
    params: {
        slug: string;
    };
}

export default async function NewsArticlePage({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: newsItem, error } = await supabase
        .from('News')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !newsItem) {
        if (error?.code !== 'PGRST116') console.error('Error fetching news:', error);
        notFound();
    }

    const item = newsItem as News;

    return <NewsDetailClient initialNews={item} />;
}

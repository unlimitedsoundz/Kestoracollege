'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import Link from 'next/link';
import NewsForm from './NewsForm';
import { useState, useEffect, use } from 'react';

export default function NewsEditorPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const isNew = id === 'new';
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchNews = async () => {
            if (isNew) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await supabase.from('News').select('*').eq('id', id).single();
                setItem(data);
            } catch (error) {
                console.error("Error fetching news item:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id, isNew]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/admin/news" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to News
                </Link>
                <h1 className="text-3xl font-bold uppercase tracking-tight text-neutral-900">{isNew ? 'New Article' : 'Edit Article'}</h1>
            </div>

            <NewsForm id={id} isNew={isNew} newsItem={item} />
        </div>
    );
}

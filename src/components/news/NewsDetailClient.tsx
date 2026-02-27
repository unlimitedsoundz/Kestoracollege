'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { CaretLeft } from "@phosphor-icons/react";

interface NewsDetailClientProps {
    initialNews: News;
}

export default function NewsDetailClient({ initialNews }: NewsDetailClientProps) {
    const [currentNews, setNews] = useState<News>(initialNews);

    useEffect(() => {
        async function fetchLatest() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('News')
                .select('*')
                .eq('id', initialNews.id)
                .single();

            if (data && !error) {
                if (data.content !== initialNews.content || data.title !== initialNews.title) {
                    setNews(data as News);
                }
            }
        }
        fetchLatest();
    }, [initialNews.id, initialNews.content]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            <div className="h-[50vh] min-h-[400px] relative overflow-hidden bg-neutral-900">
                {currentNews.imageUrl && (
                    <Image
                        src={currentNews.imageUrl}
                        alt={currentNews.title}
                        fill
                        priority
                        unoptimized
                        className="object-cover opacity-60"
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl">

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pt-8">{currentNews.title}</h1>
                    <p className="text-neutral-300 text-lg">{formatToDDMMYYYY(currentNews.publishDate)}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-3xl">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to News
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
                <div className="prose prose-lg prose-emerald mx-auto">
                    <p className="lead text-xl text-neutral-600 font-medium mb-8">
                        {currentNews.excerpt}
                    </p>
                    <div className="whitespace-pre-wrap text-neutral-800">
                        {currentNews.content}
                    </div>
                </div>

                {/* Content Image */}
                <div className="my-12">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                        <Image
                            src="/images/news/helsinki-study-hero.png"
                            alt="International students at Kestora College campus in Helsinki"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 700px"
                        />
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">Kestora College | Photo by Markus Aalborg</p>
                </div>

                {/* Related Links */}
                <div className="mt-16 pt-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-6">Related Links</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: "How to Apply", href: "/admissions/application-process", desc: "Step-by-step application guide." },
                            { title: "Explore Programmes", href: "/studies", desc: "Browse all degree programmes." },
                            { title: "International Students", href: "/student-guide/international", desc: "Visa, housing, and arrival info." },
                        ].map(link => (
                            <Link key={link.href} href={link.href} className="bg-neutral-50 p-5 rounded-xl hover:bg-neutral-100 transition-colors group">
                                <h4 className="font-bold text-neutral-900 mb-1 group-hover:underline text-sm">{link.title}</h4>
                                <p className="text-xs text-neutral-500">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { createClient } from '@/utils/supabase/client';
import { News } from '@/types/database';
import { Trash, PencilSimple as Edit, CircleNotch as Loader2 } from "@phosphor-icons/react";
import Link from 'next/link';
import { formatToDDMMYYYY } from '@/utils/date';
import { useState, useEffect } from 'react';

export default function AdminNewsPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchNews = async () => {
        try {
            const { data } = await supabase
                .from('News')
                .select('*')
                .order('publishDate', { ascending: false });
            setNews(data || []);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const { error } = await supabase.from('News').delete().eq('id', id);
            if (error) throw error;
            setNews(news.filter(n => n.id !== id));
        } catch (error: any) {
            alert("Error deleting news: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Manage News</h1>
                <Link href="/admin/news/edit" className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-colors">
                    + New Article
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-semibold text-neutral-600">Title</th>
                            <th className="p-4 font-semibold text-neutral-600">Published</th>
                            <th className="p-4 font-semibold text-neutral-600 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {news.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50 group">
                                <td className="p-4 font-medium text-neutral-900">{item.title}</td>
                                <td className="p-4 text-neutral-600">{formatToDDMMYYYY(item.publishDate)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/news/edit?id=${item.id}`} className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50" title="Edit">
                                            <Edit size={16} weight="bold" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 border border-neutral-200 rounded-lg hover:bg-red-50 text-red-600"
                                            title="Delete"
                                        >
                                            <Trash size={16} weight="bold" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

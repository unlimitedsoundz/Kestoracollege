'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import Link from 'next/link';
import EventForm from '../EventForm';
import { useState, useEffect, use } from 'react';

export default function EventEditorPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const isNew = id === 'new';
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            if (isNew) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await supabase.from('Event').select('*').eq('id', id).single();
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                <Link href="/admin/events" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to Events
                </Link>
                <h1 className="text-3xl font-bold uppercase tracking-tight text-neutral-900">{isNew ? 'Create New Event' : 'Edit Event'}</h1>
            </div>

            <EventForm id={id} isNew={isNew} eventItem={event} />
        </div>
    );
}

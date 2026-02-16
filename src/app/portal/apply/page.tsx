'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import CourseSelector from './CourseSelector';

export default function ApplyPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Auth Check (Client-side)
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    console.log('[ApplyPage] No active session, redirecting to login');
                    router.push('/portal/account/login?redirect=/portal/apply');
                    return;
                }

                // 2. Fetch all courses
                const { data, error } = await supabase
                    .from('Course')
                    .select(`
                        *,
                        school:School(name, slug)
                    `)
                    .order('title');

                if (error) throw error;
                setCourses(data || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-xl font-black uppercase tracking-tight mb-1 text-neutral-900 leading-none">Select a Programme</h1>
            <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-2xl">
                Choose the programme you wish to apply for. Multiple active applications are permitted.
                Ensure you meet the minimum entry requirements listed in the programme details.
            </p>

            <CourseSelector initialCourses={courses} />
        </div>
    );
}

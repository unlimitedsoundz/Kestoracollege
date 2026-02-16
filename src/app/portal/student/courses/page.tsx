'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import RegistrationClient from './RegistrationClient';

export default function CourseRegistrationPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        student: any;
        window: any;
        modules: any[];
        initialEnrollments: any[];
    } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchRegistrationData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserEmail = sbUser?.email;
                let currentUserId = sbUser?.id;

                // 2. Secondary Auth Check (LocalStorage Fallback)
                if (!sbUser) {
                    const savedUser = localStorage.getItem('sykli_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserEmail = localProfile.email;
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserEmail) {
                    router.push('/portal/account/login');
                    return;
                }

                // Fetch Student SIS record
                const { data: student } = await supabase
                    .from('students')
                    .select('*, program:Course(*), user:profiles(*)')
                    .eq('user_id', currentUserId || '')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (!student) {
                    router.push('/portal/dashboard');
                    return;
                }

                // 2. Fetch Active Window & Semester
                const { data: regWindow } = await supabase
                    .from('registration_windows')
                    .select('*, semester:semesters(*)')
                    .eq('status', 'OPEN')
                    .order('open_at', { ascending: false })
                    .limit(1)
                    .single();

                // 3. Fetch Subjects available for this student's program
                const { data: subjects } = await supabase
                    .from('Subject')
                    .select('*')
                    .eq('courseId', student.program_id)
                    .order('code', { ascending: true });

                // 4. Fetch Student's current enrollments for this semester
                const { data: enrollments } = await supabase
                    .from('module_enrollments')
                    .select('*, subject:Subject(*)')
                    .eq('student_id', student.id)
                    .eq('semester_id', regWindow?.semester_id)
                    .eq('status', 'REGISTERED');

                // Map subjects and enrollments to match RegistrationClient's expected "module" structure
                const mappedModules = (subjects || []).map(s => ({
                    id: s.id,
                    code: s.code,
                    title: s.name,
                    credits: s.creditUnits,
                    description: `Curriculum subject for ${student.program?.title || 'your program'}.`,
                    capacity: 100, // Placeholder
                    instructor: 'Department Faculty', // Placeholder 
                    academic_level: student.program?.degreeLevel || 'Bachelor'
                }));

                const mappedEnrollments = (enrollments || []).map(e => ({
                    ...e,
                    module_id: e.subject_id, // Client expects module_id
                    module: e.subject ? {
                        id: e.subject.id,
                        title: e.subject.name,
                        credits: e.subject.creditUnits
                    } : null
                }));

                setData({
                    student,
                    window: regWindow,
                    modules: mappedModules,
                    initialEnrollments: mappedEnrollments
                });
            } catch (err) {
                console.error('CRITICAL: Fetching registration data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrationData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-neutral-50/50 p-2 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4">
                    <Link
                        href="/portal/student"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                </div>
                <RegistrationClient
                    student={data.student}
                    window={data.window}
                    modules={data.modules}
                    initialEnrollments={data.initialEnrollments}
                />
            </div>
        </div>
    );
}

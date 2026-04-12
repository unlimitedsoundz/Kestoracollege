'use client';

import { useState } from 'react';
import { Course } from '@/types/database';
import { ArrowRight, BookOpen, Lightning as Zap } from "@phosphor-icons/react/dist/ssr";
import { getTuitionFee, calculateDiscountedFee, mapSchoolToTuitionField } from '@/utils/tuition';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface CourseSelectorProps {
    initialCourses: (Course & { school: { name: string, slug: string } | null })[];
}

export default function CourseSelector({ initialCourses }: CourseSelectorProps) {
    const [filter, setFilter] = useState<'ALL' | 'BACHELOR' | 'MASTER'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSelectProgramme = async (courseId: string) => {
        setIsSubmitting(courseId);
        try {
            // 1. Get current user & credentials
            const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

            console.log('[CourseSelector] Auth Check:', {
                hasUser: !!currentUser,
                userId: currentUser?.id,
                error: authError
            });

            if (authError || !currentUser) {
                console.error('[CourseSelector] Auth failed:', authError);
                alert(`Session validation failed: ${authError?.message || 'No active session'}`);
                // router.push('/portal/account/login?redirect=/portal/apply'); // Temporarily disable auto-redirect to see the alert
                return;
            }

            let studentId = (currentUser as any)?.user_metadata?.student_id;
            let dob = (currentUser as any)?.user_metadata?.date_of_birth;

            // Fallback: If we have a user but metadata is missing, fetch from profiles
            if (!studentId || !dob) {
                console.log('Metadata missing, fetching profile fallback...');
                const { data: dbProfile } = await supabase
                    .from('profiles')
                    .select('student_id, date_of_birth')
                    .eq('id', currentUser.id)
                    .single();

                if (dbProfile) {
                    studentId = dbProfile.student_id;
                    dob = dbProfile.date_of_birth;
                    console.log('Profile fallback successful');
                }
            }

            // Proceed without DOB/Student ID blockers as requested
            console.log('Proceeding to application creation...', {
                userId: currentUser.id,
                courseId,
                hasStudentId: !!studentId,
                hasDob: !!dob
            });

            console.log('Calling Secure Application Creation RPC...', {
                userId: currentUser.id,
                courseId,
                studentId
            });

            // 2. Call the Secure RPC (Bypasses RLS with local validation)
            const { data, error: rpcError } = await supabase.rpc('create_application_v2', {
                p_user_id: currentUser.id,
                p_course_id: courseId,
                p_student_id: studentId || null,
                p_dob: dob || null
            });

            if (rpcError) {
                console.error('RPC Execution Error:', rpcError);
                throw rpcError;
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            router.push(`/portal/application?id=${data.id}`);
        } catch (error: any) {
            console.error('Detailed Application Creation Error:', {
                message: error.message,
                code: error.code,
                details: error.details,
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
            alert(`Failed to create application: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(null);
        }
    };

    const filteredCourses = initialCourses.filter(course => {
        const matchesFilter = filter === 'ALL' || course.degreeLevel === filter;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.school?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-neutral-50 p-6 rounded-sm border border-neutral-100">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Filter by Level</span>
                    <div className="flex gap-2">
                        {(['ALL', 'BACHELOR', 'MASTER'] as const).map((level) => (
                            <button
                                key={level}
                                onClick={() => setFilter(level)}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all ${filter === level
                                    ? 'bg-transparent text-neutral-900 border-neutral-900 shadow-sm'
                                    : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400'
                                    }`}
                            >
                                {level === 'ALL' ? 'All Degrees' : level === 'BACHELOR' ? 'Bachelors' : 'Masters'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-64">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Search Programme</span>
                    <input
                        type="text"
                        placeholder="NAME OR DEPARTMENT..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-neutral-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-neutral-900 transition-colors w-full"
                    />
                </div>
            </div>

            {/* Course List */}
            <div className="grid gap-4">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white p-6 rounded-sm border border-neutral-100 flex flex-col md:flex-row gap-8 transition-all hover:border-neutral-300 group">
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold uppercase tracking-tight text-neutral-900 leading-none group-hover:text-primary transition-colors">{course.title}</h3>
                                    <p className="text-[10px] text-neutral-600 font-semibold uppercase tracking-widest leading-none">{course.school?.name}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border transition-colors ${course.degreeLevel === 'MASTER'
                                    ? 'border-neutral-900 text-neutral-900'
                                    : 'border-neutral-300 text-neutral-600'
                                    }`}>
                                    {course.degreeLevel === 'MASTER' ? 'Masters' : 'Bachelors'}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-700 font-medium mb-6 line-clamp-2 leading-relaxed uppercase tracking-tight italic">
                                {course.description || "Advancing knowledge and innovation through world-class research and education."}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                                    <BookOpen size={14} weight="regular" className="text-neutral-400" />
                                    {course.duration}
                                    {course.programType && (
                                        <span className="ml-2 px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-500 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                            {course.programType}
                                        </span>
                                    )}
                                </span>
                                {(() => {
                                    const baseFee = getTuitionFee(
                                        course.degreeLevel,
                                        mapSchoolToTuitionField((course as any).school?.slug || 'technology')
                                    );
                                    const discountedFee = calculateDiscountedFee(baseFee);

                                    return (
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-neutral-100 text-neutral-900 font-bold text-[10px] uppercase tracking-widest">
                                                €{baseFee} <span className="text-[9px] text-neutral-500 font-medium lowercase">/ year</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 text-primary rounded-sm font-bold text-[10px] uppercase tracking-widest border border-primary/20 bg-primary/5">
                                                <Zap size={12} weight="fill" className="text-primary" />
                                                €{discountedFee} Early Rate
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center min-w-[160px]">
                            <button
                                onClick={() => handleSelectProgramme(course.id)}
                                disabled={isSubmitting !== null}
                                className="w-full bg-transparent border border-neutral-900 text-neutral-900 font-bold text-[10px] uppercase tracking-widest py-4 rounded-sm hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                            >
                                {isSubmitting === course.id ? 'Processing...' : 'Select Programme'}
                                {isSubmitting !== course.id && <ArrowRight size={14} weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </div>
                ))}

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20 text-[10px] font-bold uppercase tracking-widest text-neutral-600 border border-neutral-100 rounded-sm italic bg-neutral-50">
                        {searchQuery || filter !== 'ALL'
                            ? `No ${filter !== 'ALL' ? filter.toLowerCase() : ''} programmes match your search.`
                            : "No academic programmes currently available for application."}
                    </div>
                )}
            </div>
        </div>
    );
}

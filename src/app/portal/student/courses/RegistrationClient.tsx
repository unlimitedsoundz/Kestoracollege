
'use client';

import { useState, useTransition, useEffect } from 'react';
import { registerForModule, dropModule } from '@/app/portal/registration-actions';
import {
    BookOpen,
    Calendar,
    CheckCircle,
    WarningCircle as AlertCircle,
    MagnifyingGlass as Search,
    Plus,
    Trash,
    Clock,
    User,
    GraduationCap
} from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface RegistrationClientProps {
    student: any;
    window: any;
    modules: any[];
    initialEnrollments: any[];
    onRefresh: () => Promise<void>;
}

export default function RegistrationClient({
    student,
    window,
    modules,
    initialEnrollments,
    onRefresh
}: RegistrationClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalCredits = initialEnrollments.reduce((sum, e) => sum + (e.module?.credits || 0), 0);
    const MAX_CREDITS = 35;
    const creditProgress = (totalCredits / MAX_CREDITS) * 100;

    const filteredModules = modules.filter(m =>
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isEnrolled = (moduleId: string) =>
        initialEnrollments.some(e => e.module_id === moduleId && e.status === 'REGISTERED');

    const handleRegister = async (moduleId: string) => {
        setError(null);
        startTransition(async () => {
            const result = await registerForModule(moduleId);
            if (!result.success) {
                setError(result.error || 'Registration failed');
            } else {
                await onRefresh();
            }
        });
    };

    const handleDrop = async (moduleId: string) => {
        const enrollment = initialEnrollments.find(e => e.module_id === moduleId);
        if (!enrollment) return;

        if (!confirm('Are you sure you want to drop this module? Academic rules may apply.')) return;

        setError(null);
        startTransition(async () => {
            const result = await dropModule(enrollment.id);
            if (!result.success) {
                setError(result.error);
            } else {
                await onRefresh();
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-1 leading-none">
                        <GraduationCap size={14} weight="bold" />
                        Academic Systems • Course Registration
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 mb-1 leading-none">Course Enrollment</h1>
                    <p className="text-neutral-500 font-medium">
                        {window?.semester?.name || 'Academic Term'} • Registration Window:
                        <span className={window?.status === 'OPEN' ? 'text-primary ml-1' : 'text-amber-600 ml-1'}>
                            {window?.status || 'Closed'}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Student</p>
                        <p className="font-bold text-neutral-900">{student.user?.first_name} {student.user?.last_name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{student.user?.student_id || student.student_id}</p>
                    </div>
                    <UserAvatar
                        src={student.user?.avatar_url}
                        firstName={student.user?.first_name}
                        email={student.user?.email}
                        size="md"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <div className="text-sm font-medium">{error}</div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Credit Counter */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Study Load</h2>

                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-black text-neutral-900">{totalCredits}</span>
                            <span className="text-sm font-bold text-neutral-400">/ {MAX_CREDITS} ECTS</span>
                        </div>

                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden mb-4">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${creditProgress > 90 ? 'bg-red-500' : creditProgress > 70 ? 'bg-amber-500' : 'bg-primary'
                                    }`}
                                style={{ width: `${Math.min(creditProgress, 100)}%` }}
                            />
                        </div>

                        <ul className="space-y-4 pt-4 border-t border-neutral-50">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Registered Courses</span>
                                <span className="font-bold">{initialEnrollments.length}</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Status</span>
                                <span className="text-primary font-bold flex items-center gap-1">
                                    <CheckCircle size={14} weight="bold" /> Active
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-black text-white p-5 rounded-xl shadow-xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Clock size={20} weight="bold" className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest opacity-70">Window Ends</p>
                                <p className="font-bold text-white">
                                    {window ? (isMounted ? formatToDDMMYYYY(window.close_at) : '...') : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-white leading-relaxed">
                            Registration window is open. You can add or drop subjects freely until the deadline.
                        </p>
                    </div>
                </div>

                {/* Right Column: Module List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by code or title..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Modules Grid */}
                    <div className="space-y-4">
                        {filteredModules.map(module => {
                            const enrolled = isEnrolled(module.id);

                            return (
                                <div
                                    key={module.id}
                                    className={`bg-white border p-5 rounded-xl transition-all group flex flex-col md:flex-row gap-4 ${enrolled
                                        ? 'border-primary/30 bg-primary/5 shadow-sm'
                                        : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
                                                {module.code}
                                            </span>
                                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">
                                                {module.credits} ECTS
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black mb-1">
                                            {module.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                                            {module.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-400">
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} /> {module.instructor}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <BookOpen size={14} /> {module.academic_level}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[#fd6402]/80">
                                                <AlertCircle size={14} /> Prereq: {module.prerequisites || 'None'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end gap-4 min-w-[120px]">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Availability</p>
                                            <p className="text-xs font-bold text-neutral-900">
                                                {module.capacity} Seats Total
                                            </p>
                                        </div>

                                        {enrolled ? (
                                            <button
                                                onClick={() => handleDrop(module.id)}
                                                disabled={isPending}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all disabled:opacity-50"
                                            >
                                                <Trash size={14} weight="bold" /> Drop
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRegister(module.id)}
                                                disabled={isPending || window?.status !== 'OPEN'}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                                            >
                                                <Plus size={14} weight="bold" /> Register
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredModules.length === 0 && (
                            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                                <Search className="mx-auto text-neutral-300 mb-4" size={48} />
                                <p className="text-neutral-500 font-medium">No subjects found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

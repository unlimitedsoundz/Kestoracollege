'use client';

import { createClient } from '@/utils/supabase/client';
import {
    BookOpen,
    Newspaper,
    Users,
    Calendar,
    GraduationCap,
    Clock,
    ArrowRight,
    Buildings as SchoolIcon,
    FileText,
    House as Home,
    CircleNotch as Loader2
} from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/UserAvatar';

export default function AdminPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [pendingApps, setPendingApps] = useState<any[]>([]);
    const [appsCount, setAppsCount] = useState(0);
    const [statusCounts, setStatusCounts] = useState({
        SUBMITTED: 0,
        UNDER_REVIEW: 0,
        ADMITTED: 0,
        REJECTED: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            try {
                // Fetch aggregates
                const [
                    { count: courseCount },
                    { count: newsCount },
                    { count: eventCount },
                    { count: subjectCount },
                    { count: facultyCount },
                    { count: departmentCount },
                    { data: apps, count: totalApps },
                    { count: housingAppsCount },
                    { count: registrarCount }
                ] = await Promise.all([
                    supabase.from('Course').select('*', { count: 'exact', head: true }),
                    supabase.from('News').select('*', { count: 'exact', head: true }),
                    supabase.from('Event').select('*', { count: 'exact', head: true }),
                    supabase.from('Subject').select('*', { count: 'exact', head: true }),
                    supabase.from('Faculty').select('*', { count: 'exact', head: true }),
                    supabase.from('Department').select('*', { count: 'exact', head: true }),
                    supabase.from('applications')
                        .select('*, course:Course(title), user:profiles(first_name, last_name, email, avatar_url)', { count: 'exact' })
                        .neq('status', 'DRAFT')
                        .order('submitted_at', { ascending: false })
                        .limit(5),
                    supabase.from('housing_applications').select('*', { count: 'exact', head: true }),
                    supabase.from('registration_windows').select('*', { count: 'exact', head: true })
                ]);

                // Application Status Breakdown
                const { data: allApps } = await supabase.from('applications').select('status');

                setAppsCount(totalApps || 0);
                setPendingApps(apps || []);
                setStatusCounts({
                    SUBMITTED: allApps?.filter(s => s.status === 'SUBMITTED').length || 0,
                    UNDER_REVIEW: allApps?.filter(s => s.status === 'UNDER_REVIEW' || s.status === 'DOCS_REQUIRED').length || 0,
                    ADMITTED: allApps?.filter(s => s.status === 'ADMITTED' || s.status === 'OFFER_ACCEPTED').length || 0,
                    REJECTED: allApps?.filter(s => s.status === 'REJECTED' || s.status === 'OFFER_DECLINED').length || 0,
                });

                setStats([
                    { label: 'Courses', count: courseCount, icon: BookOpen, color: 'bg-blue-500', href: '/admin/courses' },
                    { label: 'News Stories', count: newsCount, icon: Newspaper, color: 'bg-neutral-800', href: '/admin/news' },
                    { label: 'Campus Events', count: eventCount, icon: Calendar, color: 'bg-purple-500', href: '/admin/events' },
                    { label: 'Applications', count: totalApps, icon: FileText, color: 'bg-amber-500', href: '/admin/admissions' },
                    { label: 'Housing Applications', count: housingAppsCount, icon: Home, color: 'bg-teal-500', href: '/admin/housing' },
                    { label: 'Faculty Members', count: facultyCount, icon: Users, color: 'bg-neutral-900', href: '/admin/faculty' },
                    { label: 'Academic Departments', count: departmentCount, icon: SchoolIcon, color: 'bg-emerald-600', href: '/admin/departments' },
                    { label: 'Registrar Windows', count: registrarCount, icon: FileText, color: 'bg-indigo-600', href: '/admin/registrar' },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">System Overview</h1>
                <p className="text-neutral-500 mt-2">Welcome back. Here's what's happening at SYKLI College.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-black transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
                                <stat.icon size={24} weight="bold" />
                            </div>
                            <span className="text-2xl font-black text-neutral-900">{stat.count || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{stat.label}</span>
                            <ArrowRight size={14} weight="bold" className="text-neutral-300 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock size={20} weight="bold" className="text-amber-500" /> Recent Applications
                        </h2>
                        <Link href="/admin/admissions" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
                            View All →
                        </Link>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50 border-b border-neutral-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Student</th>
                                        <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Applied For</th>
                                        <th className="p-4 text-xs font-bold text-neutral-400 uppercase text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {pendingApps && pendingApps.length > 0 ? (
                                        (pendingApps as any[]).map((a) => (
                                            <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar src={a.user?.avatar_url} firstName={a.user?.first_name} email={a.user?.email} size="sm" isLoggedIn={true} />
                                                        <div>
                                                            <div className="font-bold text-neutral-900 leading-none mb-1">
                                                                {a.user?.first_name} {a.user?.last_name || a.user?.email?.split('@')[0]}
                                                            </div>
                                                            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">{a.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-neutral-600">{a.course?.title}</td>
                                                <td className="p-4 text-right">
                                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase tracking-tight">
                                                        {a.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-neutral-400">No recent applications</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Status Breakdown Card */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Admissions Pipeline</h2>
                    <div className="bg-neutral-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                        <Users className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" weight="fill" />

                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="text-4xl font-black mb-1">{appsCount || 0}</div>
                                <div className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Total Applications</div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-blue-400" /> Submitted
                                    </div>
                                    <div className="font-bold">{statusCounts.SUBMITTED}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" /> Under Review
                                    </div>
                                    <div className="font-bold">{statusCounts.UNDER_REVIEW}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" /> Admitted
                                    </div>
                                    <div className="font-bold">{statusCounts.ADMITTED}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-red-400" /> Rejected
                                    </div>
                                    <div className="font-bold">{statusCounts.REJECTED}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/admin/admissions" className="block p-4 bg-white border border-neutral-200 rounded-2xl text-center font-bold text-sm hover:bg-neutral-50 transition-colors">
                        Manage All Admissions
                    </Link>
                </div>
            </div>
        </div>
    );
}

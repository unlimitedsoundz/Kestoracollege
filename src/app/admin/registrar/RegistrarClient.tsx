
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    ShieldCheck,
    Calendar,
    Gear as Settings,
    Users,
    ArrowRight,
    WarningCircle as AlertCircle,
    CheckCircle,
    Clock,
    Funnel as Filter,
    Pulse as Activity,
    Trash,
    CaretLeft as ChevronLeft,
    CaretRight as ChevronRight,
    CaretDoubleLeft as ChevronsLeft,
    CaretDoubleRight as ChevronsRight,
    CreditCard
} from "@phosphor-icons/react/dist/ssr";

interface RegistrarClientProps {
    semesters: any[];
    windows: any[];
    moduleStats: any[];
    provisionalGrades: any[];
    students: any[];
    buildings: any[];
    sessions: any[];
    auditLogs: any[];
    tuitionPayments?: any[];
}

export default function RegistrarClient({
    semesters,
    windows,
    moduleStats,
    provisionalGrades,
    students,
    buildings,
    sessions,
    auditLogs,
    tuitionPayments = []
}: RegistrarClientProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'windows' | 'enrollments' | 'grades' | 'students' | 'calendar' | 'housing' | 'audit' | 'timetable' | 'tuition'>('windows');
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleSearchTerm, setModuleSearchTerm] = useState('');
    const [enrollmentPage, setEnrollmentPage] = useState(1);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [editingSession, setEditingSession] = useState<any>(null);
    const [sessionFormData, setSessionFormData] = useState({
        module_id: '',
        semester_id: '',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        location_type: 'CAMPUS' as 'CAMPUS' | 'ONLINE',
        location_detail: ''
    });
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setEnrollmentPage(1);
    }, [moduleSearchTerm]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleStatusUpdate = async (windowId: string, status: any) => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('registration_windows')
                .update({ status })
                .eq('id', windowId);
            if (error) throw error;
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalizeGrade = async (enrollmentId: string) => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('module_enrollments')
                .update({
                    grade_status: 'FINAL',
                    finalized_at: new Date().toISOString()
                })
                .eq('id', enrollmentId);
            if (error) throw error;
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStudentStatus = async (studentId: string, status: string) => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('students')
                .update({ enrollment_status: status })
                .eq('id', studentId);
            if (error) throw error;
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSemesterStatus = async (semesterId: string, status: string) => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('semesters')
                .update({ status })
                .eq('id', semesterId);
            if (error) throw error;
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSession = async () => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            if (editingSession) {
                const { error } = await supabase
                    .from('class_sessions')
                    .update(sessionFormData)
                    .eq('id', editingSession.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('class_sessions')
                    .insert(sessionFormData);
                if (error) throw error;
            }
            setShowSessionModal(false);
            setEditingSession(null);
            setSessionFormData({
                module_id: '',
                semester_id: '',
                day_of_week: 1,
                start_time: '09:00',
                end_time: '11:00',
                location_type: 'CAMPUS',
                location_detail: ''
            });
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSession = async (id: string) => {
        if (!confirm('Are you sure you want to delete this session?')) return;
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('class_sessions')
                .delete()
                .eq('id', id);
            if (error) throw error;
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.institutional_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'windows', label: 'Windows', icon: Clock },
        { id: 'enrollments', label: 'Modules', icon: Activity },
        { id: 'grades', label: 'Grades', icon: ShieldCheck },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'calendar', label: 'Semester', icon: Calendar },
        { id: 'tuition', label: 'Tuition', icon: CreditCard },
        { id: 'timetable', label: 'Schedule', icon: Calendar },
        { id: 'housing', label: 'Housing', icon: Settings },
        { id: 'audit', label: 'Logs', icon: AlertCircle },
    ] as const;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
                        <ShieldCheck size={32} weight="bold" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                            Office of the Registrar
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-900">Academic Administration</h1>
                    </div>
                </div>

                <div className="flex flex-wrap bg-neutral-100 p-1 rounded-xl overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            <tab.icon size={14} weight={activeTab === tab.id ? "bold" : "regular"} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'windows' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">Registration Windows</h2>
                        </div>
                        <div className="space-y-4">
                            {windows.length === 0 ? (
                                <div className="bg-white border border-neutral-200 p-12 rounded-2xl text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                    No registration windows configured.
                                </div>
                            ) : (
                                windows.map(window => (
                                    <div key={window.id} className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:border-neutral-300 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                                                    {window.semester?.name}
                                                </p>
                                                <h3 className="text-lg font-bold text-neutral-900">Course Selection Period</h3>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${window.status === 'OPEN' ? 'bg-blue-100 text-primary' : 'bg-neutral-100 text-neutral-500'}`}>
                                                {window.status}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-6 border-t border-neutral-50">
                                            <button
                                                onClick={() => handleStatusUpdate(window.id, 'OPEN')}
                                                disabled={isLoading || window.status === 'OPEN'}
                                                className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                                            >
                                                Open
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(window.id, 'CLOSED')}
                                                disabled={isLoading || window.status === 'CLOSED'}
                                                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                <Activity size={16} weight="bold" /> Load Overview
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-3xl font-black mb-1">{provisionalGrades.length}</p>
                                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Pending Approvals</p>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-2xl font-black mb-1">{students.length}</p>
                                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Enrolled Students</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'enrollments' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold">Module Enrollment Oversight</h2>
                        <div className="relative">
                            <Filter size={14} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                key="module-filter"
                                type="text"
                                placeholder="Filter modules..."
                                value={moduleSearchTerm}
                                onChange={(e) => setModuleSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/20">
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Current / Capacity</th>
                                    <th className="px-6 py-4">Students</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {(() => {
                                    const filteredModules = moduleStats
                                        .filter(stat =>
                                            stat.code.toLowerCase().includes(moduleSearchTerm.toLowerCase()) ||
                                            stat.title.toLowerCase().includes(moduleSearchTerm.toLowerCase())
                                        );

                                    const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
                                    const paginatedModules = filteredModules.slice(
                                        (enrollmentPage - 1) * ITEMS_PER_PAGE,
                                        enrollmentPage * ITEMS_PER_PAGE
                                    );

                                    return (
                                        <>
                                            {paginatedModules.map(stat => {
                                                const registeredStudents = (stat.module_enrollments as any[])?.filter((e) => e.status === 'REGISTERED') || [];
                                                const registeredCount = registeredStudents.length;

                                                return (
                                                    <tr key={stat.id} className="hover:bg-neutral-50/50 transition-all text-sm group">
                                                        <td className="px-6 py-4 font-mono font-bold text-xs text-neutral-500">{stat.code}</td>
                                                        <td className="px-6 py-4 font-bold text-neutral-900">{stat.title}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-bold ${registeredCount >= stat.capacity ? 'text-red-600' : 'text-neutral-900'}`}>
                                                                    {registeredCount}
                                                                </span>
                                                                <span className="text-neutral-400 mx-1">/</span>
                                                                <span className="text-neutral-500">{stat.capacity}</span>
                                                                {registeredCount >= stat.capacity && (
                                                                    <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">FULL</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex -space-x-2 overflow-hidden">
                                                                {(registeredStudents as any[]).slice(0, 3).map((e) => (
                                                                    <div key={e.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-600" title={`${e.student?.user?.first_name} ${e.student?.user?.last_name}`}>
                                                                        {e.student?.user?.first_name?.[0]}{e.student?.user?.last_name?.[0]}
                                                                    </div>
                                                                ))}
                                                                {registeredCount > 3 && (
                                                                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-neutral-100 flex items-center justify-center text-[8px] font-bold text-neutral-400">
                                                                        +{registeredCount - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all">
                                                                <Settings size={16} weight="bold" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredModules.length > ITEMS_PER_PAGE && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-4 border-t border-neutral-100">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-neutral-400 font-medium">
                                                                Page {enrollmentPage} of {totalPages}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setEnrollmentPage(1)}
                                                                    disabled={enrollmentPage === 1}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronsLeft size={16} weight="bold" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEnrollmentPage(prev => Math.max(1, prev - 1))}
                                                                    disabled={enrollmentPage === 1}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronLeft size={16} weight="bold" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEnrollmentPage(prev => Math.min(totalPages, prev + 1))}
                                                                    disabled={enrollmentPage === totalPages}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronRight size={16} weight="bold" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEnrollmentPage(totalPages)}
                                                                    disabled={enrollmentPage === totalPages}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronsRight size={16} weight="bold" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'grades' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-neutral-900">Provisional Grades Approval</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                {provisionalGrades.length} Pending
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/20">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Instructor Grade</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {provisionalGrades.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No provisional grades awaiting approval.
                                        </td>
                                    </tr>
                                ) : (
                                    provisionalGrades.map((grade) => (
                                        <tr key={grade.id} className="hover:bg-neutral-50/50 transition-all text-sm group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900">{grade.student?.student_id}</div>
                                                <div className="text-[10px] text-neutral-500 uppercase font-medium">{grade.student?.user?.first_name} {grade.student?.user?.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-bold text-xs text-neutral-500">{grade.module?.code}</div>
                                                <div className="font-bold text-neutral-900 truncate max-w-[200px]">{grade.module?.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-black text-neutral-900">{grade.grade}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleFinalizeGrade(grade.id)}
                                                    disabled={isLoading}
                                                    className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                                                >
                                                    <ShieldCheck size={14} weight="bold" /> Approve & Seal
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'students' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-neutral-900">Student Registry</h2>
                        <div className="relative w-full md:w-64">
                            <Filter size={14} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                key="student-search"
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/20">
                                    <th className="px-6 py-4">Student ID / Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Housing</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-neutral-50/50 transition-all text-sm group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900">{student.student_id}</div>
                                                <div className="text-[10px] text-neutral-500 uppercase font-medium">{student.user?.first_name} {student.user?.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-neutral-500">
                                                {student.institutional_email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {(() => {
                                                    const activeHousing = (student.housing_assignments as any[])?.find((a) => a.status === 'ACTIVE' || a.status === 'ASSIGNED');
                                                    if (activeHousing) {
                                                        return (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-neutral-900">{activeHousing.room?.building?.name}</span>
                                                                <span className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter">Room {activeHousing.room?.room_number}</span>
                                                            </div>
                                                        );
                                                    }
                                                    return <span className="text-neutral-300 text-[10px] font-bold uppercase tracking-widest">Unassigned</span>;
                                                })()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${student.enrollment_status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {student.enrollment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStudentStatus(student.id, student.enrollment_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                                        disabled={isLoading}
                                                        className={`p-2 rounded-lg transition-all ${student.enrollment_status === 'ACTIVE' ? 'text-red-400 hover:bg-red-50' : 'text-emerald-400 hover:bg-emerald-50'}`}
                                                    >
                                                        <ShieldCheck size={16} weight="bold" />
                                                    </button>
                                                    <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all">
                                                        <ArrowRight size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'calendar' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                            <h2 className="text-lg font-bold text-neutral-900">Academic Semesters</h2>
                        </div>
                        <div className="divide-y divide-neutral-50">
                            {semesters.map(semester => (
                                <div key={semester.id} className="p-6 flex items-center justify-between hover:bg-neutral-50/50 transition-all">
                                    <div>
                                        <h3 className="font-bold text-neutral-900">{semester.name}</h3>
                                        <p className="text-xs text-neutral-500">
                                            {new Date(semester.start_date).toLocaleDateString()} - {new Date(semester.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${semester.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : semester.status === 'COMPLETED' ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {semester.status}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateSemesterStatus(semester.id, semester.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE')}
                                            disabled={isLoading}
                                            className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                                        >
                                            <Settings size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'tuition' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 leading-none">Tuition Payment Log</h2>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Audit trail for all student financial transactions</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total: {tuitionPayments.length}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-100">
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Student</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Reference</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Method</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {tuitionPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No payment records found.
                                        </td>
                                    </tr>
                                ) : (
                                    tuitionPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-neutral-50/50 transition-all">
                                            <td className="p-4 text-xs font-mono text-neutral-400">
                                                {new Date(payment.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-neutral-900 text-sm">
                                                    {payment.offer?.application?.user?.first_name} {payment.offer?.application?.user?.last_name}
                                                </div>
                                                <div className="text-[10px] text-neutral-400 font-medium">#{payment.offer?.application?.application_number}</div>
                                            </td>
                                            <td className="p-4 text-xs font-mono text-neutral-600">
                                                {payment.transaction_reference || 'N/A'}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-neutral-900">
                                                €{payment.amount?.toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-100 px-2 py-1 rounded">
                                                    {payment.payment_method?.replace('_', ' ') || 'BANK_TRANSFER'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${payment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                    payment.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {payment.status === 'COMPLETED' ? <CheckCircle size={10} weight="bold" /> : <Clock size={10} weight="bold" />} {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'timetable' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold">Class Timetable</h2>
                        <button
                            onClick={() => {
                                setEditingSession(null);
                                setSessionFormData({
                                    module_id: '',
                                    semester_id: '',
                                    day_of_week: 1,
                                    start_time: '09:00',
                                    end_time: '11:00',
                                    location_type: 'CAMPUS',
                                    location_detail: ''
                                });
                                setShowSessionModal(true);
                            }}
                            className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                        >
                            <Calendar size={14} weight="bold" /> Add Session
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-100">
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                    <th className="px-6 py-4">Day</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 text-sm">
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No class sessions scheduled.
                                        </td>
                                    </tr>
                                ) : (
                                    sessions.map(session => (
                                        <tr key={session.id} className="hover:bg-neutral-50/50 transition-all">
                                            <td className="px-6 py-4 font-bold text-neutral-900">
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][session.day_of_week - 1]}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-neutral-600 font-medium">
                                                    <Clock size={12} weight="bold" /> {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900">{session.module?.title}</div>
                                                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{session.module?.code}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${session.location_type === 'CAMPUS' ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {session.location_type}
                                                </span>
                                                <p className="text-[10px] text-neutral-400 font-medium mt-1 truncate max-w-[150px]">{session.location_detail}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 text-neutral-400">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSession(session);
                                                            setSessionFormData({
                                                                module_id: session.module_id,
                                                                semester_id: session.semester_id,
                                                                day_of_week: session.day_of_week,
                                                                start_time: session.start_time.slice(0, 5),
                                                                end_time: session.end_time.slice(0, 5),
                                                                location_type: session.location_type,
                                                                location_detail: session.location_detail || ''
                                                            });
                                                            setShowSessionModal(true);
                                                        }}
                                                        className="p-1 hover:text-black hover:bg-neutral-100 rounded"
                                                    >
                                                        <Settings size={14} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSession(session.id)}
                                                        className="p-1 hover:text-red-600 hover:bg-neutral-100 rounded"
                                                    >
                                                        <Trash size={14} weight="bold" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'housing' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.length === 0 ? (
                        <div className="col-span-full bg-white border border-neutral-200 p-12 rounded-2xl text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                            No housing buildings registered.
                        </div>
                    ) : (
                        buildings.map(building => {
                            const totalRooms = building.housing_rooms?.[0]?.count || 0;
                            return (
                                <div key={building.id} className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:border-black transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all">
                                            <Settings size={24} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Rooms</p>
                                            <p className="text-xl font-black text-neutral-900">{totalRooms}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{building.name}</h3>
                                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">{building.campus_location}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                        <h2 className="text-lg font-bold text-neutral-900">System Audit Logs</h2>
                    </div>
                    <div className="divide-y divide-neutral-50">
                        {auditLogs.length === 0 ? (
                            <div className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                No audit logs found.
                            </div>
                        ) : (
                            auditLogs.map((log) => (
                                <div key={log.id} className="p-6 hover:bg-neutral-50/50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${log.action === 'INSERT' ? 'bg-emerald-100 text-emerald-700' : log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {log.action}
                                            </span>
                                            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-tight">{log.entity_table}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-400 truncate font-mono">ID: {log.entity_id}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

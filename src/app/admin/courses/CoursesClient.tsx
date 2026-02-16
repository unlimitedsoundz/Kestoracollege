
'use client';

import { useState } from 'react';
import { deleteCourse } from '../actions';
import { Trash, PencilSimple as Edit, MagnifyingGlass as Search, CaretLeft as ChevronLeft, CaretRight as ChevronRight, CaretDoubleLeft as ChevronsLeft, CaretDoubleRight as ChevronsRight, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import { Course } from '@/types/database';

interface CoursesClientProps {
    courses: any[];
}

export default function CoursesClient({ courses }: CoursesClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredCourses = (courses as any[]).filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.degreeLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.school?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="pt-12 pl-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Manage Courses</h1>
                    <p className="text-neutral-500 mt-1 text-sm uppercase font-bold tracking-widest">Academic Curricula & Programs</p>
                </div>
                <Link href="/admin/courses/edit" className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-colors">
                    + New Course
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search courses by title, degree, or school..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                        Total Programs: {filteredCourses.length}
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-semibold text-neutral-600">Title</th>
                            <th className="p-4 font-semibold text-neutral-600">Degree</th>
                            <th className="p-4 font-semibold text-neutral-600">School</th>
                            <th className="p-4 font-semibold text-neutral-600 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {paginatedCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-neutral-50 group">
                                <td className="p-4 font-medium text-neutral-900">{course.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${course.degreeLevel === 'MASTER'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {course.degreeLevel}
                                    </span>
                                </td>
                                <td className="p-4 text-neutral-600">{course.school?.name}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/courses/edit?id=${course.id}`} className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50" title="Edit">
                                            <Edit size={16} weight="bold" />
                                        </Link>
                                        <form action={async () => {
                                            await deleteCourse(course.id);
                                        }}>
                                            <button className="p-2 border border-neutral-200 rounded-lg hover:bg-red-50 text-red-600" title="Delete">
                                                <Trash size={16} weight="bold" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCourses.length === 0 && (
                    <div className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest flex flex-col items-center">
                        <GraduationCap className="mb-4 text-neutral-200" size={48} weight="regular" />
                        No courses found.
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredCourses.length > ITEMS_PER_PAGE && (
                    <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/20">
                        <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                            >
                                <ChevronsLeft size={16} weight="bold" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                            >
                                <ChevronLeft size={16} weight="bold" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                            >
                                <ChevronRight size={16} weight="bold" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                            >
                                <ChevronsRight size={16} weight="bold" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

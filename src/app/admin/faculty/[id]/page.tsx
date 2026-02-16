'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import Link from 'next/link';
import FacultyForm from './FacultyForm';
import { useState, useEffect, use } from 'react';

export default function FacultyEditorPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const isNew = id === 'new';
    const [facultyMember, setFacultyMember] = useState<any>(null);
    const [schools, setSchools] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: schoolsData } = await supabase.from('School').select('id, name');
                const { data: deptsData } = await supabase.from('Department').select('id, name, schoolId');

                setSchools(schoolsData || []);
                setDepartments(deptsData || []);

                if (!isNew) {
                    const { data: facultyData } = await supabase.from('Faculty').select('*').eq('id', id).single();
                    setFacultyMember(facultyData);
                }
            } catch (error) {
                console.error("Error fetching faculty editor data:", error);
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
        <div className="max-w-4xl mx-auto pb-24 pt-12 pl-12 animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/admin/faculty" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to Faculty
                </Link>
                <h1 className="text-3xl font-bold uppercase tracking-tight text-neutral-900">{isNew ? 'Create New Member' : 'Edit Faculty Member'}</h1>
            </div>

            <FacultyForm
                id={id}
                isNew={isNew}
                facultyMember={facultyMember}
                schools={schools}
                departments={departments}
            />
        </div>
    );
}

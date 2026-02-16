import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash } from "@phosphor-icons/react";

export default function DeleteStudentBtn({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this student record? This will also remove all their registrations.')) {
            return;
        }

        setIsDeleting(true);
        const supabase = createClient();

        try {
            // 1. Delete associated module enrollments first (SIS integrity)
            const { error: enrollmentError } = await supabase
                .from('module_enrollments')
                .delete()
                .eq('student_id', id);

            if (enrollmentError) throw new Error(`Failed to clear enrollments: ${enrollmentError.message}`);

            // 2. Delete the student record from SIS
            const { error } = await supabase
                .from('students')
                .delete()
                .eq('id', id);

            if (error) throw error;

            router.refresh();
        } catch (error: any) {
            console.error('Delete Student Error:', error);
            alert(`Failed to delete student: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-neutral-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
            title="Delete Student"
        >
            <Trash size={14} weight="bold" />
        </button>
    );
}

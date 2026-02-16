'use server';

import { createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Enrolls a student officially after tuition payment.
 */
export async function enrollStudent(applicationId: string) {
    const supabase = await createAdminClient();

    try {
        console.log('Enrollment: Starting for application', applicationId);

        // 1. Fetch application and related data
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                user:profiles!user_id(*),
                course:Course(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            console.error('Enrollment: Application not found', appError);
            return { success: false, error: 'Application not found' };
        }

        const user = application.user;
        const currentYear = new Date().getFullYear();

        // 2. Generate Student ID (if not exists)
        // Format: SYK-YEAR-RANDOM (4 digits)
        const studentId = `SYK-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Generate Institutional Email
        const institutionalEmail = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@syklicollege.fi`;

        // 4. Create Student Record
        const { data: student, error: studentError } = await supabase
            .from('students')
            .upsert({
                user_id: user.id,
                student_id: studentId,
                application_id: application.id,
                program_id: application.course_id,
                institutional_email: institutionalEmail,
                personal_email: user.email,
                enrollment_status: 'ACTIVE',
                start_date: new Date().toISOString(),
                expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString()
            }, {
                onConflict: 'application_id'
            })
            .select()
            .single();

        if (studentError) {
            console.error('Enrollment: Failed to create student record', studentError);
            return { success: false, error: 'Failed to create student record' };
        }

        // 5. Update Application Status
        const { error: updateError } = await supabase
            .from('applications')
            .update({ status: 'ENROLLED' })
            .eq('id', applicationId);

        if (updateError) {
            console.warn('Enrollment: Success but failed to update application status', updateError);
        }

        // 6. Update User Profile Role
        await supabase
            .from('profiles')
            .update({ role: 'STUDENT', student_id: studentId })
            .eq('id', user.id);

        console.log('Enrollment: Success for', user.email);

        revalidatePath('/admin/students');
        return { success: true, studentId };

    } catch (e: any) {
        console.error('Enrollment: Unexpected error', e);
        return { success: false, error: e.message };
    }
}

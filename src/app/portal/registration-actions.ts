
import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from '@/utils/supabase/admin';
import { syncEnrollmentToLms } from './lms-actions';

/**
 * Register a student for a specific curriculum subject
 */
export async function registerForModule(subjectId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user: actor } } = await supabase.auth.getUser();
    if (!actor) throw new Error('Unauthorized');

    try {
        // 1. Fetch Student Data
        const { data: student, error: studentError } = await adminClient
            .from('students')
            .select(`id, enrollment_status, user_id, program_id`)
            .eq('user_id', actor.id)
            .single();

        if (studentError || !student) throw new Error('Student record not found');
        if (student.enrollment_status !== 'ACTIVE') throw new Error('Only active students can register for courses.');

        // 2. Fetch Subject & Window
        const { data: subjectData, error: subjectError } = await adminClient
            .from('Subject')
            .select('*')
            .eq('id', subjectId)
            .single();

        if (subjectError || !subjectData) throw new Error('Subject not found');

        // Security check: Ensure subject belongs to student's program
        if (subjectData.courseId !== student.program_id) {
            throw new Error('This subject is not part of your enrolled program.');
        }

        const { data: window, error: windowError } = await adminClient
            .from('registration_windows')
            .select('*, semesters(*)')
            .eq('status', 'OPEN')
            .order('open_at', { ascending: false })
            .limit(1)
            .single();

        if (windowError || !window) throw new Error('Registration window is currently closed.');

        // 3. Capacity Check (Simulated, as Subject doesn't have capacity field in seed)
        // For subjects, we might assume a default capacity or use a separate table.
        // For now, let's assume 100 if not specified (Subject doesn't have capacity in schema)

        // 4. Credit Limit Check
        const { data: existingEnrollments } = await adminClient
            .from('module_enrollments')
            .select('subject_id')
            .eq('student_id', student.id)
            .eq('semester_id', window.semester_id)
            .eq('status', 'REGISTERED');

        // Fetch credits for existing subject enrollments
        let currentCredits = 0;
        if (existingEnrollments && existingEnrollments.length > 0) {
            const subjectIds = existingEnrollments.map(e => e.subject_id).filter(Boolean);
            const { data: subjects } = await adminClient
                .from('Subject')
                .select('creditUnits')
                .in('id', subjectIds);

            currentCredits = (subjects || []).reduce((sum, s) => sum + (s.creditUnits || 0), 0);
        }

        const MAX_CREDITS = 35;

        if (currentCredits + subjectData.creditUnits > MAX_CREDITS) {
            throw new Error(`Credit limit exceeded. Maximum per semester is ${MAX_CREDITS} ECTS.`);
        }

        // 5. Execute Enrollment
        const { error: insertError } = await adminClient
            .from('module_enrollments')
            .upsert({
                student_id: student.id,
                subject_id: subjectId,
                semester_id: window.semester_id,
                status: 'REGISTERED',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'student_id, subject_id, semester_id'
            });

        if (insertError) throw insertError;

        // 6. Audit Logging
        await adminClient.from('audit_logs').insert({
            action: 'SUBJECT_REGISTRATION',
            entity_table: 'module_enrollments',
            entity_id: subjectId,
            actor_id: actor.id,
            metadata: {
                subject_code: subjectData.code,
                semester: window.semesters.name,
                credits: subjectData.creditUnits
            }
        });

        // 7. LMS Course Sync
        try {
            await syncEnrollmentToLms(student.id, subjectId, window.semester_id);
        } catch (lmsSyncError) {
            console.error('LMS Course Sync failed:', lmsSyncError);
        }
        return { success: true, message: `Successfully registered for ${subjectData.code}` };

    } catch (error: any) {
        console.error('Registration Error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Drop a module before the deadline
 */
export async function dropModule(enrollmentId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user: actor } } = await supabase.auth.getUser();
    if (!actor) throw new Error('Unauthorized');

    try {
        const { data: enrollment, error: fetchError } = await adminClient
            .from('module_enrollments')
            .select('*')
            .eq('id', enrollmentId)
            .single();

        if (fetchError || !enrollment) throw new Error('Enrollment not found');

        const { data: window, error: windowError } = await adminClient
            .from('registration_windows')
            .select('*')
            .eq('semester_id', enrollment.semester_id)
            .eq('status', 'OPEN')
            .single();

        if (windowError || !window) {
            throw new Error('Registration window is currently closed for this term.');
        }

        const deadline = new Date(window.add_drop_deadline);
        if (new Date() > deadline) {
            throw new Error('The add/drop deadline has passed.');
        }

        const { error: updateError } = await adminClient
            .from('module_enrollments')
            .update({ status: 'DROPPED', updated_at: new Date().toISOString() })
            .eq('id', enrollmentId);

        if (updateError) throw updateError;

        await adminClient.from('audit_logs').insert({
            action: 'MODULE_DROPPED',
            entity_table: 'module_enrollments',
            entity_id: enrollmentId,
            actor_id: actor.id
        });
        return { success: true };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

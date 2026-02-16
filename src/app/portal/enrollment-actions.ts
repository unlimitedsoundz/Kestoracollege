
import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from '@/utils/supabase/admin';
import { provisionLmsAccount } from './lms-actions';
import { provisionItMaterials } from './it-actions';

export async function confirmEnrollment(applicationId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current session (Actor)
    const { data: { user: actor } } = await supabase.auth.getUser();

    if (!actor) {
        throw new Error('Unauthorized');
    }

    try {
        // 1. Fetch Application & Offer Details
        const { data: application, error: appError } = await adminClient
            .from('applications')
            .select(`
                *,
                user:profiles(*),
                course:Course(*),
                offer:admission_offers!inner(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            console.error('App fetch error:', appError);
            throw new Error('Application not found');
        }

        // 2. Validate State
        const offer = application.offer[0];
        const { data: payment } = await adminClient
            .from('tuition_payments')
            .select('*')
            .eq('offer_id', offer.id)
            .eq('status', 'COMPLETED')
            .single();

        if (application.status === 'ENROLLED') {
            return { success: true, message: 'Student is already enrolled.' };
        }

        // Only allow enrollment if payment is submitted or offer accepted (manual override)
        if (application.status !== 'PAYMENT_SUBMITTED' && application.status !== 'OFFER_ACCEPTED') {
            throw new Error(`Invalid application status for enrollment: ${application.status}`);
        }

        // 2b. Check if already enrolled (Idempotency)
        const { data: existingStudent } = await adminClient
            .from('students')
            .select('student_id')
            .eq('application_id', applicationId)
            .single();

        if (existingStudent) {
            if (application.status !== 'ENROLLED') {
                await adminClient.from('applications').update({ status: 'ENROLLED' }).eq('id', applicationId);
            }
            return { success: true, studentId: existingStudent.student_id, message: 'Student was already enrolled.' };
        }

        // 3. Generate Student Identity
        const studentId = `SYK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const studentUser = application.user;

        if (!studentUser) {
            throw new Error('Applicant profile not found');
        }

        const firstName = studentUser.first_name || 'Student';
        const lastName = studentUser.last_name || 'Sykli';
        let institutionalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@syklicollege.fi`.replace(/\s/g, '');
        let emailCounter = 0;

        while (true) {
            const { data: emailConflict } = await adminClient
                .from('students')
                .select('id')
                .eq('institutional_email', institutionalEmail)
                .single();

            if (!emailConflict) break;

            emailCounter++;
            institutionalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailCounter}@syklicollege.fi`.replace(/\s/g, '');
        }

        // 4. Create Student Record (SIS Handover)
        const { error: studentError, data: newStudent } = await adminClient
            .from('students')
            .insert({
                user_id: application.user_id,
                student_id: studentId,
                application_id: applicationId,
                program_id: application.course_id,
                enrollment_status: 'ACTIVE',
                institutional_email: institutionalEmail,
                personal_email: studentUser.email,
                start_date: new Date().toISOString(),
                expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
            })
            .select()
            .single();

        if (studentError) {
            console.error('SIS Creation Failed:', studentError);
            throw new Error(`Failed to create student record: ${studentError.message}`);
        }

        // 5. Lock Admissions
        const { error: updateError } = await adminClient
            .from('applications')
            .update({ status: 'ENROLLED' })
            .eq('id', applicationId);

        if (updateError) throw updateError;

        // 6. Audit Logging
        await adminClient.from('audit_logs').insert({
            action: 'ENROLLMENT_CONFIRMED',
            entity_table: 'students',
            entity_id: studentId,
            actor_id: actor.id,
            metadata: {
                previous_status: application.status,
                trigger: 'TUITION_PAYMENT_VERIFIED',
                payment_ref: payment?.transaction_reference,
                actor_role: actor.id === application.user_id ? 'APPLICANT' : 'ADMIN'
            }
        });

        // 7. LMS Provisioning
        try {
            await provisionLmsAccount(newStudent.id, institutionalEmail);
        } catch (lmsError) {
            console.error('LMS Provisioning deferred:', lmsError);
        }

        // 8. IT Materials Provisioning (auto-provision all configured assets)
        try {
            await provisionItMaterials(newStudent.id);
        } catch (itError) {
            console.error('IT Materials provisioning deferred:', itError);
        }
        return { success: true, studentId };

    } catch (error: any) {
        console.error('Enrollment Error:', error);
        return { success: false, error: error.message || 'Enrollment failed.' };
    }
}

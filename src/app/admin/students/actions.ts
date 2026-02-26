import { createAdminClient } from '@/utils/supabase/admin';
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

        // 2. Student ID Handling
        // Use existing student_id from profile if available, otherwise generate
        let studentId = user.student_id;
        if (!studentId) {
            studentId = `SK${currentYear}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // 3. Generate Unique Institutional Email
        let institutionalEmail = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@syklicollege.fi`;

        // Sanitize (remove spaces, etc.)
        institutionalEmail = institutionalEmail.replace(/\s+/g, '');

        // Check if email already exists in students table
        const { data: existingEmail } = await supabase
            .from('students')
            .select('institutional_email')
            .eq('institutional_email', institutionalEmail)
            .maybeSingle();

        if (existingEmail) {
            // Append a random number if conflict
            institutionalEmail = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}${Math.floor(Math.random() * 100)}@syklicollege.fi`.replace(/\s+/g, '');
        }

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
            return { success: false, error: `Failed to create student record: ${studentError.message}` };
        }


        // 5. Update Application Status & Document Flags
        const { error: updateError } = await supabase
            .from('applications')
            .update({
                status: 'ENROLLED',
                admission_letter_generated: true,
                receipt_generated: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (updateError) {
            console.warn('Enrollment: Success but failed to update application status', updateError);
        }

        // 6. Update User Profile Role
        await supabase
            .from('profiles')
            .update({ role: 'STUDENT', student_id: studentId })
            .eq('id', user.id);

        // 7. Verify Payment Record (Atomic Update)
        const { data: offer } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .maybeSingle();

        if (offer) {
            await supabase
                .from('tuition_payments')
                .update({ status: 'verified' })
                .eq('offer_id', offer.id)
                .eq('status', 'PENDING_VERIFICATION');
        }

        // 8. Trigger Post-Enrollment Actions (Docs & Email)
        try {
            const { generateAndStoreAdmissionLetter, generateAndStoreReceipt } = await import('../admissions/pdf-actions');
            await generateAndStoreAdmissionLetter(applicationId);
            await generateAndStoreReceipt(applicationId);

            // Welcome Email and other notifications are now handled by database 
            // triggers on 'applications' and 'tuition_payments' status changes.
        } catch (postError) {
            console.error('Enrollment: Post-action error', postError);
        }

        console.log('Enrollment: Success for', user.email);
        return { success: true, studentId };

    } catch (e: any) {
        console.error('Enrollment: Unexpected error', e);
        return { success: false, error: e.message };
    }
}

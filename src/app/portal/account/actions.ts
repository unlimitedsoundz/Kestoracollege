'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginWithStudentId(studentId: string, dateOfBirth: string) {
    const adminClient = await createAdminClient();
    const cleanStudentId = (studentId || '').trim().toUpperCase();

    // 1. Verify credentials against profiles (Using admin client to bypass RLS)
    const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('email, date_of_birth')
        .eq('student_id', cleanStudentId)
        .maybeSingle();

    if (profileError) {
        console.error('[LOGIN] Profile lookup error:', profileError);
        return { error: 'Authentication service error. Please try again.' };
    }

    if (!profile) {
        console.log(`[LOGIN] Student ID not found: ${cleanStudentId}`);
        return { error: 'Invalid Student ID or Date of Birth. Please check your credentials.' };
    }

    // Compare DOB (Standardize to string in case DB returns Date object)
    const dbDob = profile.date_of_birth ? String(profile.date_of_birth) : null;
    if (dbDob !== dateOfBirth) {
        console.log(`[LOGIN] DOB mismatch for ${cleanStudentId}: DB=${dbDob}, Input=${dateOfBirth}`);
        return { error: 'Invalid Student ID or Date of Birth. Please check your credentials.' };
    }

    // 2. Use Admin API to generate a magic link (OTP)
    const { data: adminData, error: adminError } = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: profile.email,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal`
        }
    });

    if (adminError || !adminData?.properties?.hashed_token) {
        console.error('[LOGIN] Admin link generation error:', adminError);
        return { error: 'Authentication failed. Please contact support.' };
    }

    // 3. Verify the OTP on the server to set session cookies
    const supabase = await createClient();
    const { error: verifyError, data: sessionData } = await supabase.auth.verifyOtp({
        token_hash: adminData.properties.hashed_token,
        type: 'magiclink'
    });

    if (verifyError) {
        console.error('[LOGIN] Verify OTP error:', verifyError);
        return { error: 'Session verification failed. Please try again.' };
    }

    console.log('[LOGIN] OTP Verified Successfully. Session User:', sessionData.user?.id);
    console.log('[LOGIN] Session created:', !!sessionData.session);

    // Return session to client for explicit setting
    return { success: true, session: sessionData.session };
}

export async function adminLoginWithEmail(email: string, dateOfBirth: string) {
    const supabase = await createClient();

    // 1. Verify credentials against profiles (must be ADMIN)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('email', email.toLowerCase())
        .eq('date_of_birth', dateOfBirth)
        .eq('role', 'ADMIN')
        .single();

    if (profileError || !profile) {
        return { error: 'Invalid Email or Date of Birth, or you do not have administrative access.' };
    }

    // 2. Use Admin API to generate a magic link (OTP)
    const adminClient = await createAdminClient();
    const { data: adminData, error: adminError } = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: profile.email,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal`
        }
    });

    if (adminError || !adminData?.properties?.hashed_token) {
        console.error('Admin link generation error:', adminError);
        return { error: 'Authentication failed. Please contact support.' };
    }

    // 3. Verify the OTP on the server to set session cookies
    const { error: verifyError } = await (await createClient()).auth.verifyOtp({
        token_hash: adminData.properties.hashed_token,
        type: 'magiclink'
    });

    if (verifyError) {
        console.error('Verify OTP error:', verifyError);
        return { error: 'Session verification failed. Please try again.' };
    }

    return { success: true };
}

export async function getStudentIdByEmail(email: string) {
    const supabase = await createClient();

    // We might need to wait a tiny bit for the Auth trigger to finish
    // However, usually it's fast enough.
    const { data, error } = await supabase
        .from('profiles')
        .select('student_id')
        .eq('email', email)
        .single();

    if (error || !data) return { error: 'Could not retrieve Student ID. Please check your email for the login link.' };
    return { studentId: data.student_id };
}

// Helper to create admin client (using service role)
async function createAdminClient() {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}

export async function registerApplicant(formData: {
    firstName: string;
    lastName: string;
    country: string;
    email: string;
    dateOfBirth: string;
}) {
    const adminClient = await createAdminClient();

    // 1. Create user with Admin API (auto-confirmed)
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
        email: formData.email,
        email_confirm: true,
        user_metadata: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            country_of_residence: formData.country,
            date_of_birth: formData.dateOfBirth,
            role: 'APPLICANT'
        }
    });

    if (userError) {
        console.error('Admin user creation error:', userError);
        return { error: userError.message };
    }

    // 2. Generate magic link for immediate session verification
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: formData.email,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/dashboard`
        }
    });

    if (linkError || !linkData?.properties?.hashed_token) {
        return {
            success: true,
            message: 'Account created! Please sign in using your Student ID and Date of Birth.'
        };
    }

    // 3. Verify OTP on the server to sign the user in immediately
    const { error: verifyError } = await (await createClient()).auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: 'magiclink'
    });

    if (verifyError) {
        return {
            success: true,
            message: 'Account created! Please sign in manually using your Student ID.'
        };
    }

    // 4. Fetch the generated Student ID for the UI
    const { data: profile } = await (await createClient())
        .from('profiles')
        .select('student_id, id')
        .eq('email', formData.email)
        .single();

    if (profile?.student_id) {
        // 5. Update User Metadata with Student ID for faster client-side access
        await adminClient.auth.admin.updateUserById(profile.id, {
            user_metadata: {
                ...userData.user?.user_metadata,
                student_id: profile.student_id,
                date_of_birth: formData.dateOfBirth
            }
        });

        // 6. Send Welcome Email
        const { sendEmail } = await import('@/lib/email');
        const WelcomeEmail = (await import('@/emails/WelcomeEmail')).default;

        await sendEmail({
            to: formData.email,
            subject: 'Welcome to SYKLI College!',
            react: WelcomeEmail({
                firstName: formData.firstName,
                studentId: profile.student_id
            })
        });
    }

    return {
        success: true,
        studentId: profile?.student_id
    };
}

export async function registerAdmin(formData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
}) {
    const adminClient = await createAdminClient();

    // 1. Create user with Admin API (auto-confirmed)
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
        email: formData.email,
        email_confirm: true,
        user_metadata: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            date_of_birth: formData.dateOfBirth,
            role: 'ADMIN' // Explicitly setting ADMIN role
        }
    });

    if (userError) {
        console.error('Admin user creation error:', userError);
        return { error: userError.message };
    }

    return {
        success: true,
        message: 'Admin account created successfully! You can now sign in.'
    };
}

export async function updateAvatarUrl(url: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('profiles')
        .update({
            avatar_url: url,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating avatar URL:', error);
        throw new Error('Failed to update profile picture');
    }

    revalidatePath('/portal/account');
    return { success: true };
}

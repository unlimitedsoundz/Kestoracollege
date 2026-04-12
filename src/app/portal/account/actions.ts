import { createClient } from '@/utils/supabase/client';


export async function signInWithEmailAndPassword(email: string, password: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
    });

    if (error) {
        console.error('[AUTH] Login error:', error);
        return { error: error.message };
    }

    return { success: true, user: data.user };
}

export async function registerApplicant(formData: {
    firstName: string;
    lastName: string;
    country: string;
    email: string;
    dateOfBirth: string;
    password: string;
}) {
    const supabase = createClient();

    // 1. Create user with standard signUp
    const { data: userData, error: userError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
            data: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                country_of_residence: formData.country,
                date_of_birth: formData.dateOfBirth,
                role: 'APPLICANT'
            },
            emailRedirectTo: `${window.location.origin}/portal/dashboard`
        }
    });

    if (userError) {
        console.error('User creation error:', userError);
        return { error: userError.message };
    }

    // 2. Fetch the generated Student ID for the UI
    if (userData.user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('student_id')
            .eq('email', formData.email)
            .single();

        return {
            success: true,
            studentId: profile?.student_id
        };
    }

    return {
        success: true,
        message: 'Account created! Please check your email for verification.'
    };
}

export async function registerAdmin(formData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    password: string;
}) {
    const supabase = createClient();

    const { error: userError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
            data: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                date_of_birth: formData.dateOfBirth,
                role: 'ADMIN'
            }
        }
    });

    if (userError) {
        console.error('Admin user creation error:', userError);
        return { error: userError.message };
    }

    return {
        success: true,
        message: 'Admin account created successfully! Please check your email for verification.'
    };
}

export async function updateAvatarUrl(url: string) {
    const supabase = createClient();
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

    return { success: true };
}

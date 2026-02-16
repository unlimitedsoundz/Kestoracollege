
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function PortalIndexPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/portal/account/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role === 'STUDENT') {
        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (student) {
            redirect('/portal/student');
        }
    }

    if (profile?.role === 'ADMIN') {
        redirect('/admin');
    }

    redirect('/portal/dashboard');
}

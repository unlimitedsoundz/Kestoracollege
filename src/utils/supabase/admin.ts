
import { createBrowserClient } from '@supabase/ssr';

// For static export, admin operations rely on RLS policies in Supabase.
// The service role key is NOT available client-side.
export function createAdminClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

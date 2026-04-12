import { createBrowserClient } from '@supabase/ssr'

// For static export, we use the browser client instead of server client.
// This means auth is handled entirely client-side via Supabase's JS SDK.
export async function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export async function createAdminClient() {
    // In static export mode, admin operations use the anon key.
    // Sensitive admin operations should be handled via Supabase RLS policies
    // or Edge Functions instead.
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

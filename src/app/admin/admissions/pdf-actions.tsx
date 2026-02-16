// PDF generation actions - stubbed for static export
// These functions require server-side Node.js capabilities (fs, path, @react-pdf/renderer)
// and cannot run in a static export. They are kept as stubs to maintain API compatibility.

import { createAdminClient } from '@/utils/supabase/admin';

export async function generateAndStoreOfferLetter(applicationId: string) {
    console.warn('[PDF Actions] generateAndStoreOfferLetter is not available in static export mode.');
    return { success: false, error: 'PDF generation requires server-side rendering and is not available in static export mode.' };
}

export async function generateAndStoreAdmissionLetter(applicationId: string) {
    console.warn('[PDF Actions] generateAndStoreAdmissionLetter is not available in static export mode.');
    return { success: false, error: 'PDF generation requires server-side rendering and is not available in static export mode.' };
}

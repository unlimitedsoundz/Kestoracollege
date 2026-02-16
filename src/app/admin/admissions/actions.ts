import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from '@/utils/supabase/admin';
import { ApplicationStatus } from '@/types/database';

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('applications')
        .update({
            status,
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    if (error) {
        console.error('Error updating application status:', error);
        throw new Error('Failed to update status');
    }

    // TRIGGER LOGIC: Automatically generate Letter of Offer on approval
    if (status === 'ADMITTED') {
        try {
            const { generateAndStoreOfferLetter } = await import('./pdf-actions');
            await generateAndStoreOfferLetter(applicationId);
        } catch (pdfError) {
            console.error('Failed to generate automated offer letter:', pdfError);
        }
    }

    // TRIGGER LOGIC: Automatically generate Admission Letter on enrollment
    if (status === 'ENROLLED') {
        try {
            const { generateAndStoreAdmissionLetter } = await import('./pdf-actions');
            await generateAndStoreAdmissionLetter(applicationId);
        } catch (pdfError) {
            console.error('Failed to generate automated admission letter:', pdfError);
        }
    }


    return { success: true };
}

export async function deleteApplication(applicationId: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

    if (error) {
        console.error('Error deleting application:', error);
        throw new Error('Failed to delete application');
    }
    return { success: true };
}

export async function updateInternalNotes(applicationId: string, notes: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('applications')
        .update({
            internal_notes: notes,
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    if (error) {
        console.error('Error updating internal notes:', error);
        throw new Error('Failed to update notes');
    }
    return { success: true };
}

export async function createAdmissionOffer(applicationId: string, tuitionFee: number, deadline: string, offerType: 'DEPOSIT' | 'FULL_TUITION' = 'DEPOSIT', discountAmount: number = 0) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('admission_offers')
        .insert({
            application_id: applicationId,
            tuition_fee: tuitionFee,
            payment_deadline: deadline,
            offer_type: offerType,
            discount_amount: discountAmount,
            status: 'PENDING'
        });

    if (error) {
        console.error('Error creating offer:', error);
        throw new Error('Failed to create offer');
    }

    // Trigger PDF Generation & Email
    try {
        const { generateAndStoreOfferLetter } = await import('./pdf-actions');
        await generateAndStoreOfferLetter(applicationId);
    } catch (pdfError) {
        console.error('Failed to generate offer letter after manual creation:', pdfError);
        // We don't throw here to avoid rolling back the offer creation, but we log the error.
    }


    return { success: true };
}

export async function regenerateOfferLetter(applicationId: string) {
    try {
        const { generateAndStoreOfferLetter } = await import('./pdf-actions');
        const result = (await generateAndStoreOfferLetter(applicationId)) as any;
        if (result && result.error) throw new Error(result.error);
        return { success: true };
    } catch (error: any) {
        console.error('Action Error: regenerateOfferLetter:', error);
        return { success: false, error: error.message || 'Failed to regenerate offer letter' };
    }
}

export async function generateAdmissionLetterAction(applicationId: string) {
    try {
        const { generateAndStoreAdmissionLetter } = await import('./pdf-actions');
        const result = (await generateAndStoreAdmissionLetter(applicationId)) as any;
        if (result && result.error) throw new Error(result.error);
        return { success: true, url: result?.url };
    } catch (error: any) {
        console.error('Action Error: generateAdmissionLetterAction:', error);
        return { success: false, error: error.message || 'Failed to generate admission letter' };
    }
}

import { createClient } from "@/utils/supabase/client";
import { PaymentMethod } from "@/types/database";

export async function generateHousingInvoice(
    studentId: string,
    applicationId: string | null,
    items: { description: string; type: string; amount: number; quantity?: number }[]
) {
    const supabase = createClient();

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.amount * (item.quantity || 1)), 0);
    const referenceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from('housing_invoices')
        .insert({
            student_id: studentId,
            application_id: applicationId || null,
            reference_number: referenceNumber,
            total_amount: totalAmount,
            status: 'PENDING',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days due
            currency: 'EUR'
        })
        .select()
        .single();

    if (invoiceError) throw new Error(`Failed to create invoice: ${invoiceError.message}`);

    // Create Invoice Items
    const invoiceItems = items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        item_type: item.type,
        amount: item.amount,
        quantity: item.quantity || 1
    }));

    const { error: itemsError } = await supabase
        .from('housing_invoice_items')
        .insert(invoiceItems);

    if (itemsError) throw new Error(`Failed to create invoice items: ${itemsError.message}`);

    return invoice;
}

export async function initiatePayment(
    invoiceId: string,
    method: PaymentMethod,
    country: string
): Promise<{ success: boolean; paymentUrl?: string; transactionId?: string; error?: string }> {
    try {
        const supabase = createClient();

        // Auth Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        // Get Invoice
        const { data: invoice } = await supabase
            .from('housing_invoices')
            .select('*, student:students(id)')
            .eq('id', invoiceId)
            .single();

        if (!invoice) return { success: false, error: 'Invoice not found' };

        // Mock PayGoWire Interaction
        const payGoWireTxId = `PGW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const mockPaymentUrl = `https://paygowire.mock/pay/${payGoWireTxId}?amount=${invoice.total_amount}&currency=${invoice.currency}`;

        // Create Payment Record
        const { error: paymentError } = await supabase
            .from('housing_payments')
            .insert({
                invoice_id: invoiceId,
                student_id: invoice.student_id, // Use string ID from invoice
                amount: invoice.total_amount - (invoice.paid_amount || 0), // Paying remaining balance
                currency: invoice.currency,
                status: 'PENDING',
                payment_method: method,
                billing_country: country,
                paygowire_transaction_id: payGoWireTxId,
                paygowire_payment_url: mockPaymentUrl
            });

        if (paymentError) {
            console.error('Payment creation error:', paymentError);
            return { success: false, error: 'Failed to initiate payment transaction' };
        }

        return { success: true, paymentUrl: mockPaymentUrl, transactionId: payGoWireTxId };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function verifyPayment(
    transactionId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    try {
        // 1. Find the pending payment
        const { data: payment } = await supabase
            .from('housing_payments')
            .select('*, invoice:housing_invoices(*)')
            .eq('paygowire_transaction_id', transactionId)
            .single();

        if (!payment) return { success: false, error: 'Payment transaction not found' };
        if (payment.status === 'COMPLETED') return { success: true }; // Already processed

        // 2. Update Payment Status (Trigger will update Invoice)
        const { error: updateError } = await supabase
            .from('housing_payments')
            .update({
                status: 'COMPLETED',
                paid_at: new Date().toISOString()
            })
            .eq('id', payment.id);

        if (updateError) throw updateError;

        // 3. Update Invoice Status manually if needed (or rely on DB triggers/RLS)
        const { data: updatedInvoice } = await supabase
            .from('housing_invoices')
            .select('*')
            .eq('id', payment.invoice_id)
            .single();

        if (updatedInvoice) {
            const newPaid = (updatedInvoice.paid_amount || 0) + payment.amount;
            const isPaid = newPaid >= updatedInvoice.total_amount;

            await supabase.from('housing_invoices')
                .update({
                    paid_amount: newPaid,
                    status: isPaid ? 'PAID' : 'PARTIALLY_PAID'
                })
                .eq('id', payment.invoice_id);

            if (isPaid && updatedInvoice.application_id) {
                await supabase.from('housing_applications')
                    .update({ status: 'APPROVED' })
                    .eq('id', updatedInvoice.application_id);
            }
        }

        return { success: true };

    } catch (err: any) {
        console.error('Verify payment error:', err);
        return { success: false, error: err.message };
    }
}

export async function batchGenerateInvoices(month: number, year: number) {
    const supabase = createClient();

    // 1. Admin restricted check (RLS will handle actual write permission, but good to check role)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 2. Find all active assignments
    const { data: assignments } = await supabase
        .from('housing_assignments')
        .select('*, room:housing_rooms(*)')
        .eq('status', 'ASSIGNED');

    if (!assignments) return { success: true, count: 0 };

    let count = 0;
    for (const assignment of assignments) {
        // Check if invoice already exists for this month/year for this student
        const refPrefix = `RENT-${year}-${month.toString().padStart(2, '0')}`;
        const { data: existing } = await supabase
            .from('housing_invoices')
            .select('id')
            .eq('student_id', assignment.student_id)
            .ilike('reference_number', `${refPrefix}%`)
            .single();

        if (existing) continue;

        // Generate monthly rent invoice
        await generateHousingInvoice(
            assignment.student_id,
            assignment.application_id,
            [
                {
                    description: `Monthly Rent - ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month - 1))} ${year}`,
                    type: 'MONTHLY_RENT',
                    amount: assignment.room?.monthly_rate || 600
                }
            ]
        );
        count++;
    }

    return { success: true, count };
}

export async function reconcilePayment(paymentId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('housing_payments')
        .update({
            status: 'COMPLETED',
            paid_at: new Date().toISOString(),
            metadata: { reconciled_by: user.id, reconciled_at: new Date().toISOString() }
        })
        .eq('id', paymentId);

    if (error) throw error;
    return { success: true };
}

export async function searchStudents(query: string) {
    const supabase = createClient();

    const { data: students, error } = await supabase
        .from('students')
        .select('*, user:profiles(*)')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,student_id.ilike.%${query}%`, { foreignTable: 'profiles' })
        .limit(10);

    if (error) throw error;
    return students;
}

export async function verifyHousingPaymentManually(invoiceId: string, amount: number, method: PaymentMethod = 'BANK_TRANSFER', reference?: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 2. Fetch Invoice
    const { data: invoice } = await supabase
        .from('housing_invoices')
        .select('*, student:students(*, user:profiles(*))')
        .eq('id', invoiceId)
        .single();

    if (!invoice) throw new Error('Invoice not found');

    // 3. Create Manual Payment Record
    const { data: payment, error: paymentError } = await supabase
        .from('housing_payments')
        .insert({
            invoice_id: invoiceId,
            student_id: invoice.student_id,
            amount,
            currency: invoice.currency,
            status: 'COMPLETED',
            payment_method: method,
            billing_country: 'Manual Verification',
            paid_at: new Date().toISOString(),
            metadata: {
                verified_by: user.id,
                manual_reference: reference || 'Manual Admin Action'
            }
        })
        .select()
        .single();

    if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);

    // 4. Update Invoice Status
    const newPaidAmount = (invoice.paid_amount || 0) + amount;
    const isFullyPaid = newPaidAmount >= invoice.total_amount;

    await supabase
        .from('housing_invoices')
        .update({
            paid_amount: newPaidAmount,
            status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
            updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

    // 5. Update Application if Fully Paid
    if (isFullyPaid && invoice.application_id) {
        await supabase
            .from('housing_applications')
            .update({ status: 'APPROVED' })
            .eq('id', invoice.application_id);
    }

    return { success: true };
}

export async function initiateManualPayment(
    invoiceId: string,
    file: File
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        // 1. Upload File
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${invoiceId}_${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('housing_payments')
            .upload(fileName, file);

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // 2. Get Invoice Details
        const { data: invoice } = await supabase
            .from('housing_invoices')
            .select('student_id, total_amount, paid_amount, currency')
            .eq('id', invoiceId)
            .single();

        if (!invoice) throw new Error('Invoice not found');

        // 3. Create Payment Record
        const { error: paymentError } = await supabase
            .from('housing_payments')
            .insert({
                invoice_id: invoiceId,
                student_id: invoice.student_id,
                amount: invoice.total_amount - (invoice.paid_amount || 0),
                currency: invoice.currency,
                status: 'PENDING',
                payment_method: 'BANK_TRANSFER',
                billing_country: 'Manual Upload',
                metadata: {
                    proof_path: uploadData.path,
                    original_name: file.name
                }
            });

        if (paymentError) throw paymentError;

        return { success: true };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

'use client';

import { createClient } from '@/utils/supabase/client';
import { CreditCard, Envelope, FileText, CheckCircle, Clock, CircleNotch as Loader2 } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { pushInvoice } from '../actions';

export default function AdminInvoicesPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [customFee, setCustomFee] = useState<Record<string, number>>({});
    const [customInvoiceType, setCustomInvoiceType] = useState<Record<string, string>>({});
    
    // Default global fees reference, we could fetch from DB but keeping simple for now
    // A production scenario would fetch these from tuition_rates table
    const defaultFees: Record<string, number> = {
        'CERTIFICATE': 1200,
        'DIPLOMA': 2100,
        'ADVANCED_DIPLOMA': 3000,
        'BSc': 4500,
        'PG_DIPLOMA': 3500,
        'MASTERS': 5000,
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const supabase = createClient();
            
            // Get all applications that have received an offer
            const { data, error } = await supabase
                .from('applications')
                .select(`
                    id,
                    personal_info,
                    status,
                    program:Course(title, duration),
                    offer:admission_offers(
                        id,
                        tuition_fee,
                        invoice_type,
                        invoice_pushed,
                        invoice_sent_at
                    )
                `)
                .in('status', ['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED']);

            if (error) {
                console.error("Error fetching applications:", error);
                return;
            }

            // Filter for only those with an offer, mapping fee values
            const formattedApps = data?.filter(app => app.offer && (Array.isArray(app.offer) ? app.offer.length > 0 : !!app.offer)).map(app => {
                const offer = Array.isArray(app.offer) ? app.offer[0] : app.offer;
                const program = (Array.isArray(app.program) ? app.program[0] : app.program) as any;
                const title = (program?.title || '').toUpperCase();
                let defaultFee = 2100;
                if (title.includes('CERTIFICATE')) defaultFee = defaultFees['CERTIFICATE'];
                else if (title.includes('ADVANCED') || title.includes('HIGHER')) defaultFee = defaultFees['ADVANCED_DIPLOMA'];
                else if (title.includes('DIPLOMA')) defaultFee = defaultFees['DIPLOMA'];
                else if (title.includes('BACHELOR') || title.includes('BSC')) defaultFee = defaultFees['BSc'];
                else if (title.includes('MASTER') || title.includes('MSC')) defaultFee = defaultFees['MASTERS'];
                else if (title.includes('POSTGRADUATE') || title.includes('PG')) defaultFee = defaultFees['PG_DIPLOMA'];
                
                return {
                    ...app,
                    offer,
                    program, // override with single object
                    defaultFee
                };
            }) || [];
            
            setApplications(formattedApps);
        } catch (error) {
            console.error("Error in fetchApplications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleFeeChange = (appId: string, val: string) => {
        setCustomFee(prev => ({
            ...prev,
            [appId]: parseInt(val) || 0
        }));
    };

    const handleInvoiceTypeChange = (appId: string, val: string) => {
        setCustomInvoiceType(prev => ({
            ...prev,
            [appId]: val
        }));
    };

    const handlePushInvoice = async (appId: string, currentFee: number) => {
        const feeToPush = customFee[appId] !== undefined ? customFee[appId] : currentFee;
        const invoiceType = customInvoiceType[appId] || 'TUITION_DEPOSIT';
        
        if (!confirm(`Are you sure you want to push a ${invoiceType.replace(/_/g, ' ')} invoice of $${feeToPush} to this student?`)) return;

        try {
            setActionLoading(appId);
            const result = await pushInvoice(appId, feeToPush, invoiceType);
            if (result.success) {
                alert("Invoice successfully pushed!");
                fetchApplications(); // Refresh list
            }
        } catch (error: any) {
            alert(`Failed to push invoice: ${error.message || 'Unknown error'}`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Manage Invoices</h1>
                    <p className="text-neutral-500 text-sm mt-1">Review student offers and push custom tuition invoices.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Applicant</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Program</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Status</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Tuition Fee ($)</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-neutral-400 text-sm">
                                    No accepted offers pending invoices found.
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => {
                                const isPushed = app.offer.invoice_pushed;
                                const isEnrolledOrPaid = ['PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'].includes(app.status);
                                const feeValue = customFee[app.id] !== undefined ? customFee[app.id] : (app.offer.tuition_fee || app.defaultFee);
                                
                                return (
                                <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-neutral-900 text-sm">
                                            {app.personal_info?.firstName} {app.personal_info?.lastName}
                                        </div>
                                        <div className="text-xs text-neutral-500">{app.personal_info?.email}</div>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-neutral-600">
                                        {app.program?.title}
                                    </td>
                                    <td className="p-4">
                                        {isEnrolledOrPaid ? (
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                <CheckCircle size={10} weight="bold" /> Paid / Enrolled
                                            </span>
                                        ) : isPushed ? (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                <Envelope size={10} weight="bold" /> Invoice Sent
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                <Clock size={10} weight="bold" /> Pending Invoice
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            className="border border-neutral-300 rounded px-2 py-1 text-xs w-full mb-2 disabled:opacity-50"
                                            value={customInvoiceType[app.id] || app.offer.invoice_type || 'TUITION_DEPOSIT'}
                                            onChange={(e) => handleInvoiceTypeChange(app.id, e.target.value)}
                                            disabled={isEnrolledOrPaid || actionLoading === app.id}
                                        >
                                            <option value="TUITION_DEPOSIT">Tuition Deposit</option>
                                            <option value="FIRST_YEAR_TUITION">First Year Tuition</option>
                                            <option value="FULL_PROGRAM_TUITION">Full Program Tuition</option>
                                        </select>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-neutral-900">$</span>
                                            <input 
                                                type="number" 
                                                className="border border-neutral-300 rounded px-2 py-1 w-24 text-sm disabled:opacity-50"
                                                value={feeValue}
                                                onChange={(e) => handleFeeChange(app.id, e.target.value)}
                                                disabled={isEnrolledOrPaid || actionLoading === app.id}
                                            />
                                        </div>
                                        {isPushed && app.offer.invoice_sent_at && (
                                            <div className="text-[10px] text-neutral-400 mt-1">
                                                Sent: {new Date(app.offer.invoice_sent_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handlePushInvoice(app.id, app.defaultFee)}
                                            disabled={actionLoading === app.id || isEnrolledOrPaid}
                                            className={`px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ml-auto ${
                                                isEnrolledOrPaid 
                                                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                                    : isPushed 
                                                        ? 'bg-neutral-900 text-white hover:bg-neutral-700'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            } ${actionLoading === app.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {actionLoading === app.id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <FileText size={12} weight="bold" />
                                            )}
                                            {isEnrolledOrPaid ? 'Settled' : (isPushed ? 'Resend / Update' : 'Push Invoice')}
                                        </button>
                                    </td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

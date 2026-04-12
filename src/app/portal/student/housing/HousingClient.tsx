'use client';

import React, { useState } from 'react';
import { House as Home, Bed, CurrencyEur as DollarSign, CheckCircle, Clock, Warning as AlertTriangle, Calendar, Building as Building2, CreditCard, CaretRight as ChevronRight } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import { HousingApplication, HousingAssignment, HousingDeposit, HousingBuilding, Semester, HousingInvoice, PaymentMethod } from '@/types/database';
import { submitHousingApplication } from '@/services/housing';
import { initiatePayment, verifyPayment } from '@/services/payment';
import PayGoWireCheckout from '../../application/payment/PayGoWireCheckout';

interface HousingDashboardClientProps {
    student: any;
    application: (HousingApplication & { deposit?: HousingDeposit }) | null;
    assignment: (HousingAssignment & { room: any, building: any }) | null;
    buildings: HousingBuilding[];
    semesters: Semester[];
    invoices: HousingInvoice[];
}

const COUNTRIES = ['Finland', 'United States', 'United Kingdom', 'Germany', 'France', 'China', 'India', 'Nigeria', 'Other'];

export default function HousingDashboardClient({ student, application, assignment, buildings, semesters, invoices }: HousingDashboardClientProps) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Payment State
    const [selectedInvoice, setSelectedInvoice] = useState<HousingInvoice | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
    const [billingCountry, setBillingCountry] = useState('');
    const [paying, setPaying] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [checkoutAmount, setCheckoutAmount] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await submitHousingApplication({
                semesterId: formData.get('semester') as string,
                preferredBuildingId: formData.get('building') as string || null,
                moveInDate: formData.get('moveInDate') as string,
                moveOutDate: formData.get('moveOutDate') as string,
                notes: formData.get('notes') as string
            });

            if (result.success) {
                setSuccess(true);
                setShowForm(false);
                // Reload after a short delay to show success message
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setError(result.error || 'Application failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedInvoice || !billingCountry) return;

        if (paymentMethod === 'BANK_TRANSFER') {
            setCheckoutAmount(selectedInvoice.total_amount - (selectedInvoice.paid_amount || 0));
            setShowCheckout(true);
            return;
        }

        setPaying(true);
        try {
            const result = await initiatePayment(selectedInvoice.id, paymentMethod, billingCountry);
            if (result.success && result.paymentUrl) {
                // For other methods, we might redirect or show different UI
                alert(`Redirecting to ${paymentMethod} Gateway...`);
                await verifyPayment(result.transactionId!);
                window.location.reload();
            } else {
                alert('Payment failed: ' + result.error);
            }
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setPaying(false);
            setSelectedInvoice(null);
        }
    };

    const handlePayGoWireComplete = async (details: any) => {
        if (!selectedInvoice) return;
        setPaying(true);
        try {
            const result = await initiatePayment(selectedInvoice.id, 'BANK_TRANSFER', details.country || 'Finland');
            if (result.success && result.transactionId) {
                // Here we verify the transaction
                await verifyPayment(result.transactionId);
                setSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                alert('Payment failed: ' + result.error);
                setPaying(false);
            }
        } catch (err: any) {
            alert('Error: ' + err.message);
            setPaying(false);
        }
    };

    // Find pending invoice (e.g., Deposit)
    const pendingInvoice = invoices.find(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-0.5 leading-none">Housing & Accommodation</h1>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Campus Residences
                </p>
            </div>

            {/* PAYMENT ALERT / INVOICE SECTION */}
            {pendingInvoice && (
                <div className="bg-blue-50 border-2 border-blue-500 p-5 rounded-sm shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-black uppercase text-blue-900 mb-2">Payment Required</h3>
                            <p className="text-sm font-medium text-blue-800 mb-4">
                                You have a pending invoice: <strong>{pendingInvoice.reference_number}</strong>
                            </p>
                            <div className="text-2xl font-black text-blue-900 mb-4">
                                €{(pendingInvoice.total_amount - (pendingInvoice.paid_amount || 0)).toFixed(2)}
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedInvoice(pendingInvoice);
                                    setCheckoutAmount(pendingInvoice.total_amount - (pendingInvoice.paid_amount || 0));
                                    setShowCheckout(true);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-blue-700"
                            >
                                Pay Now <ChevronRight size={14} weight="bold" className="inline ml-1" />
                            </button>
                        </div>
                        <CreditCard className="text-blue-400" size={48} weight="regular" />
                    </div>
                </div>
            )}

            {showCheckout && selectedInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm relative">
                        <button
                            onClick={() => setShowCheckout(false)}
                            className="absolute right-6 top-6 z-10 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
                        >
                            ✕
                        </button>
                        <div className="p-6 md:p-10">
                            <PayGoWireCheckout
                                amount={checkoutAmount}
                                currency="EUR"
                                onPaymentComplete={handlePayGoWireComplete}
                                isProcessing={paying}
                                paymentReference={selectedInvoice.reference_number}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Current Status Card */}
            {assignment ? (
                <div className="bg-white border-2 border-black p-6 rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black uppercase">Room Assignment</h2>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">Active</p>
                        </div>
                        <CheckCircle className="text-green-500" size={32} weight="bold" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Building</p>
                            <p className="font-bold text-lg">{assignment.room?.building?.name}</p>
                            <p className="text-xs text-neutral-500">{assignment.room?.building?.campus_location}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Room</p>
                            <p className="font-bold text-lg">{assignment.room?.room_number}</p>
                            {assignment.room?.amenities && assignment.room.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {assignment.room.amenities.map((amenity: string, idx: number) => (
                                        <span key={idx} className="text-[9px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-bold uppercase">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Status</p>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                                {assignment.status}
                            </span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Lease Duration</p>
                            <p className="text-sm font-medium">{formatToDDMMYYYY(assignment.start_date)} - {formatToDDMMYYYY(assignment.end_date)}</p>
                        </div>
                        {/* PDF Generation disabled for static export stability */}
                        {/* <button className="px-4 py-2 bg-neutral-100 border-2 border-neutral-200 text-[10px] font-black uppercase tracking-widest rounded-sm text-neutral-400 cursor-not-allowed">
                            Download Lease PDF (Coming Soon)
                            </button> */}
                    </div>
                </div>
            ) : application ? (
                <div className="bg-white border-2 border-amber-500 p-6 rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black uppercase">Application Pending</h2>
                            <p className="text-[10px] font-bold text-amber-600 uppercase mt-1">{application.status}</p>
                        </div>
                        <Clock className="text-amber-500" size={32} weight="bold" />
                    </div>

                    <p className="text-sm text-neutral-600 mb-4">
                        Your housing application is currently under review.
                    </p>

                    {/* Show Deposit Status based on invoices if exist, purely visual fallback */}
                </div>
            ) : (
                <>
                    {!showForm ? (
                        <div className="bg-neutral-50 border-2 border-neutral-200 p-6 rounded-sm">
                            <div className="flex items-start gap-4 mb-6">
                                <AlertTriangle className="text-neutral-400" size={32} weight="bold" />
                                <div>
                                    <h2 className="text-xl font-black uppercase mb-2">No Housing Application</h2>
                                    <p className="text-sm text-neutral-600">
                                        You have not yet submitted a housing application for this semester. Click the button below to begin.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowForm(true)}
                                className="px-5 py-2.5 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                            >
                                <Home size={14} weight="bold" className="inline mr-2" /> Apply for Housing
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-black p-6 rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl font-black uppercase mb-6">Housing Application Form</h2>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>📋 Application Process:</strong> Select your preferred semester and building below.
                                    After submission, you will receive an invoice for the <strong>First Month Deposit</strong>.
                                    <br className="mb-1" />Room assignment will be finalized once the deposit is paid.
                                </p>
                            </div>

                            {success && (
                                <div className="bg-green-50 border-2 border-green-500 p-4 rounded-sm mb-6">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="text-green-600" size={20} weight="bold" />
                                        <p className="text-sm font-bold text-green-800">Application submitted! Generating invoice...</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-sm mb-6">
                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                                        Semester *
                                    </label>
                                    <select
                                        name="semester"
                                        required
                                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-sm focus:border-black focus:outline-none"
                                    >
                                        <option value="">Select Semester</option>
                                        {semesters.map(sem => (
                                            <option key={sem.id} value={sem.id}>{sem.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                                        Preferred Building
                                    </label>
                                    <select
                                        name="building"
                                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-sm focus:border-black focus:outline-none"
                                    >
                                        <option value="">No Preference</option>
                                        {buildings.map(building => (
                                            <option key={building.id} value={building.id}>
                                                {building.name} - {building.campus_location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                                            Move-In Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="moveInDate"
                                            required
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-sm focus:border-black focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                                            Move-Out Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="moveOutDate"
                                            required
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-sm focus:border-black focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-sm focus:border-black focus:outline-none"
                                        placeholder="Any special requirements or preferences..."
                                    />
                                </div>

                                <div className="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-sm">
                                    <input type="checkbox" required id="refundPolicyAgree" className="mt-0.5" />
                                    <label htmlFor="refundPolicyAgree" className="text-[10px] text-neutral-600 leading-tight">
                                        I adhere to the <a href="/refund-withdrawal-policy" target="_blank" className="underline font-bold text-black">Refund & Withdrawal Policy</a> and understand the terms regarding deposit forfeiture and lease cancellation.
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 border-2 border-neutral-200 rounded-sm text-[10px] font-black uppercase tracking-widest hover:border-black transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

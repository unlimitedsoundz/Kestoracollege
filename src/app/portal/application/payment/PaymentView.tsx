'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, FileText } from "@phosphor-icons/react/dist/ssr";
import { createClient } from '@/utils/supabase/client';
import { invokeEdgeFunction } from '@/utils/supabase/invoke';
import PayGoWireCheckout from './PayGoWireCheckout';
import { calculateDiscountedFee, EARLY_PAYMENT_DISCOUNT_PERCENT, getProgramYears, isWithinEarlyPaymentWindow } from '@/utils/tuition';
import Image from 'next/image';

export default function TuitionPaymentPage({ admissionOffer, application }: {
    params: { id: string },
    admissionOffer: any,
    application: any
}) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentType, setPaymentType] = useState<'deposit' | 'first_year'>('deposit');
    const DEPOSIT_PERCENT = 50;

    const isEarly = isWithinEarlyPaymentWindow(admissionOffer.created_at);
    const baseFee = admissionOffer.tuition_fee; // Already the discounted fee from the offer
    const storedDiscount = admissionOffer.discount_amount || 0; // Discount already applied by admin
    const maxYears = getProgramYears(application.course?.duration || '2 years');

    // baseFee is already after early-payment discount, so do NOT apply discount again
    // storedDiscount is for display only (showing how much was saved)
    const displayOriginalFee = baseFee + storedDiscount; // Reconstruct original for display
    const discount = isEarly ? storedDiscount : 0;
    // If early window expired, charge the original fee (before discount); otherwise use the discounted baseFee
    const perYearFee = isEarly ? baseFee : displayOriginalFee;

    // The tuition deposit is strictly 50% of the ORIGINAL tuition fee, regardless of any early payment discount.
    // The early payment discount only reduces the remaining balance/total first-year fee.
    const depositAmount = Math.round(displayOriginalFee * DEPOSIT_PERCENT / 100);
    const finalAmount = paymentType === 'deposit' ? depositAmount : perYearFee;

    const handlePaymentComplete = async (details: {
        method: string;
        country: string;
        currency: string;
        fxMetadata: any;
    }) => {
        console.log('PaymentView: handlePaymentComplete called', details);
        setIsProcessing(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data, error: functionError } = await invokeEdgeFunction('process-tuition-payment', {
                body: {
                    offerId: admissionOffer.id,
                    applicationId: application.id,
                    amount: finalAmount,
                    details: {
                        method: details.method,
                        country: details.country,
                        currency: details.currency,
                        fxMetadata: details.fxMetadata
                    }
                }
            });

            if (functionError) {
                console.error('PaymentView: Edge function call failed', functionError);
                throw new Error(functionError.message || 'Failed to process payment');
            }

            const result = data;
            console.log('PaymentView: Result from edge function', result);

            if (!result.success) {
                console.error('PaymentView: Processing failed', result.error);
                throw new Error(result.error);
            }

            // Success!!
            console.log('PaymentView: Success! Reinforcing application status update...');

            // Extra safety: Update application status directly from client to ensure DB is in sync
            // before redirecting, just in case edge function update had any replication lag or issue.
            await supabase
                .from('applications')
                .update({
                    status: 'PAYMENT_SUBMITTED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', application.id);

            console.log('PaymentView: Status reinforced. Redirecting to dashboard...');
            // Force full page reload to ensure all states (DB, Cache, UI) are completely fresh
            window.location.href = '/portal/dashboard';
        } catch (e: any) {
            console.error('Payment Error (Caught in View):', e);
            setError(e.message || 'Payment failed');
            setIsProcessing(false);
        }
    };

    if (application.status === 'ENROLLED' || application.status === 'PAYMENT_SUBMITTED') {
        const isEnrolled = application.status === 'ENROLLED';
        return (
            <div className="max-w-md mx-auto mt-6 md:mt-12 bg-white border border-neutral-200 p-6 md:p-12 rounded-sm text-center shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 text-black rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={40} weight="bold" />
                </div>
                <h2 className="text-2xl font-normal text-black mb-4 uppercase tracking-tighter">
                    {isEnrolled ? 'Tuition Paid Successfully' : 'Payment Verification Pending'}
                </h2>
                <p className="text-sm text-black mb-8 max-w-[280px] mx-auto leading-relaxed">
                    {isEnrolled
                        ? <>Your enrollment is now confirmed. Welcome to <span className="font-semibold text-black">Kestora College</span>.</>
                        : <>Your payment has been recorded and is currently under review. <span className="font-semibold text-black">Access to student services is paused</span> until our finance team verifies the transaction.</>
                    }
                </p>
                <div className="flex flex-col gap-3">
                    {isEnrolled && (
                        <button
                            onClick={() => router.push(`/portal/application/receipt?id=${application.id}`)}
                            className="w-full bg-black text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all hover:bg-neutral-800 shadow-lg shadow-black/5"
                        >
                            View Receipt
                        </button>
                    )}
                    <button
                        onClick={() => router.push('/portal/dashboard')}
                        className={`w-full px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${isEnrolled ? 'bg-white text-black border border-neutral-200 hover:bg-neutral-50' : 'bg-black text-white hover:bg-neutral-800 shadow-lg shadow-black/5'}`}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-6 md:py-12 md:px-4 font-rubik text-black">
            <div className="mb-6 md:mb-12 text-center md:text-left bg-neutral-50 md:bg-transparent -mx-4 md:mx-0 p-6 md:p-0 border-y md:border-none border-neutral-100">
                <div className="mb-4 flex justify-center md:justify-start">
                    <Image
                        src="/images/paygowire-logo-v2.png"
                        alt="Paygowire Logo"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                </div>
                <h1 className="text-[20px] md:text-[24px] font-normal uppercase tracking-tighter text-black leading-tight md:leading-none">Tuition Payment via PAYGOWIRE</h1>
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mt-4">
                    <p className="text-sm text-black font-normal uppercase tracking-widest">
                        Official SIS Gateway
                    </p>
                    <div className="hidden md:block h-px w-8 bg-neutral-200" />
                    <div className="flex items-center gap-2 opacity-100 transition-all">
                        <span className="text-sm text-black font-normal uppercase tracking-widest">Via Paygowire Gateway</span>
                    </div>
                </div>
            </div>

            {/* Payment Options */}
            <div className="mb-12 px-2 md:px-0">
                <h2 className="text-sm font-bold mb-4 uppercase tracking-widest text-black">Select Payment Option</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <button
                        onClick={() => setPaymentType('deposit')}
                        className={`p-5 md:p-6 border-2 text-left transition-all rounded-sm ${paymentType === 'deposit' ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                    >
                        <div className="font-bold text-base md:text-lg mb-1 uppercase tracking-tight">Tuition Deposit</div>
                        <p className="text-[11px] md:text-sm text-black leading-relaxed">Pay the tuition deposit to secure your place and begin enrollment.</p>
                    </button>
                    <button
                        onClick={() => setPaymentType('first_year')}
                        className={`p-5 md:p-6 border-2 text-left transition-all rounded-sm ${paymentType === 'first_year' ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                    >
                        <div className="font-bold text-base md:text-lg mb-1 uppercase tracking-tight">Pay First Year</div>
                        <p className="text-[11px] md:text-sm text-black leading-relaxed">Pay the full first year tuition fee via PayGoWire.</p>
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                {/* Invoice / Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border md:border-neutral-100 p-4 md:p-8 -mx-4 md:mx-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 border-b border-neutral-100 pb-8 overflow-hidden">
                            <div>
                                <div className="text-[10px] font-normal text-black uppercase tracking-widest mb-1">Student Details</div>
                                <div className="font-bold text-black uppercase tracking-tight">{application.personal_info?.firstName} {application.personal_info?.lastName}</div>
                                <div className="text-sm text-black mt-1">{application.contact_details?.email}</div>
                            </div>
                            <div className="sm:text-right">
                                <div className="text-[10px] font-normal text-black uppercase tracking-widest mb-1">Payment Reference</div>
                                <div className="font-mono text-sm text-black bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-100 inline-block sm:block break-all">
                                    {(() => {
                                        let hash = 0;
                                        const str = admissionOffer.id;
                                        for (let i = 0; i < str.length; i++) {
                                            hash = ((hash << 5) - hash) + str.charCodeAt(i);
                                            hash |= 0;
                                        }
                                        const positiveHash = Math.abs(hash);
                                        return positiveHash.toString().padEnd(13, '0').slice(0, 13);
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-black font-normal uppercase tracking-wider">{paymentType === 'deposit' ? 'Tuition Deposit' : 'First Year Tuition'}</span>
                                <span className="font-medium text-black text-right">€ {(paymentType === 'deposit' ? depositAmount : displayOriginalFee).toLocaleString()}</span>
                            </div>
                            {isEarly && paymentType === 'first_year' && (
                                <div className="flex justify-between items-center text-sm text-black font-normal py-1">
                                    <span className="uppercase tracking-wider">Early Bird Discount ({EARLY_PAYMENT_DISCOUNT_PERCENT}%)</span>
                                    <span className="font-medium whitespace-nowrap">- € {discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-black font-normal uppercase tracking-wider">Services Fee</span>
                                <span className="font-medium text-black">€ 0.00</span>
                            </div>
                            <div className="flex justify-between pt-6 border-t border-neutral-100 font-normal text-lg text-black">
                                <span>TOTAL</span>
                                <span className="font-bold">€ {finalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Logic */}
                <div className="lg:col-span-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-normal uppercase tracking-widest border border-red-100 flex items-center gap-3">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">!</div>
                            {error}
                        </div>
                    )}

                    <PayGoWireCheckout
                        amount={finalAmount}
                        currency="EUR"
                        onPaymentComplete={handlePaymentComplete}
                        isProcessing={isProcessing}
                        paymentReference={(() => {
                            let hash = 0;
                            const str = admissionOffer.id;
                            for (let i = 0; i < str.length; i++) {
                                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                                hash |= 0;
                            }
                            const positiveHash = Math.abs(hash);
                            return positiveHash.toString().padEnd(13, '0').slice(0, 13);
                        })()}
                    />
                </div>
            </div>
        </div>
    );
}

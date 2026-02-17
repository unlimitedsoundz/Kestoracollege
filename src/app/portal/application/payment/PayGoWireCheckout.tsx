'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    MagnifyingGlass as Search,
    Globe,
    CaretRight as ArrowRight,
    Building as Building2,
    Wallet,
    CaretLeft as ArrowLeft,
    ShieldCheck,
    Info,
    CheckCircle as CheckCircle2,
    Calendar,
    Clock,
    CreditCard,
    Copy,
} from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import { countries } from '@/utils/countries';

interface PayGoWireCheckoutProps {
    amount: number;
    currency: string;
    onPaymentComplete: (details: {
        method: string;
        country: string;
        currency: string;
        fxMetadata: any;
    }) => Promise<void>;
    isProcessing: boolean;
    paymentReference?: string;
}

type Step = 'COUNTRY' | 'METHOD' | 'FX' | 'CONFIRM' | 'BANK_INSTRUCTIONS';

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    type: 'CARD' | 'BANK' | 'WALLET' | 'OTHER';
    icon: any;
    processingTime: string;
}

const CopyButton = ({ text, label }: { text: string, label: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            // Fallback for non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[#00A651] hover:text-[#008c44] transition-colors text-[10px] uppercase font-bold tracking-widest bg-[#00A651]/5 hover:bg-[#00A651]/10 px-2 py-1 rounded-sm"
            title={`Copy ${label}`}
        >
            {copied ? (
                <>
                    <CheckCircle2 size={12} weight="bold" />
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <Copy size={12} weight="bold" />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
};

export default function PayGoWireCheckout({
    amount,
    currency: defaultCurrency,
    onPaymentComplete,
    isProcessing,
    paymentReference
}: PayGoWireCheckoutProps) {
    const [step, setStep] = useState<Step>('COUNTRY');
    const [loadingStep, setLoadingStep] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    const handleStepChange = (nextStep: Step) => {
        setLoadingStep(step);
        setTimeout(() => {
            setStep(nextStep);
            setLoadingStep(null);
        }, 800);
    };

    const filteredCountries = useMemo(() => {
        return countries
            .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery]);

    // Dynamic Payment Methods Logic
    const getMethodsForCountry = (country: string): PaymentMethod[] => {
        const methods: PaymentMethod[] = [];

        const BankIcon = (props: any) => (
            <div className={props.className} style={{ width: props.size || 20, height: props.size || 20, position: 'relative' }}>
                <Image
                    src="/images/bank-icon.png"
                    alt="Bank"
                    fill
                    className="object-contain"
                />
            </div>
        );

        if (country === 'India') {
            methods.unshift({ id: 'upi', name: 'UPI', description: 'GPay, PhonePe, Paytm', type: 'WALLET', icon: Wallet, processingTime: '10-30 minutes' });
            methods.push({ id: 'in_bank', name: 'Net Banking', description: 'Direct transfer from Indian banks', type: 'BANK', icon: BankIcon, processingTime: '1-2 business days' });
        } else if (country === 'Finland' || country === 'France' || country === 'Germany') {
            methods.push({ id: 'sepa', name: 'SEPA Transfer', description: 'Direct Euro bank transfer', type: 'BANK', icon: BankIcon, processingTime: '1 business day' });
            if (country === 'Finland') methods.push({ id: 'nordea', name: 'Nordea Online', description: 'Local Finnish bank login', type: 'BANK', icon: BankIcon, processingTime: 'Instant' });
        } else if (country === 'Nigeria') {
            methods.unshift({ id: 'ng_bank', name: 'Bank Transfer', description: 'Pay via local NGN routing', type: 'BANK', icon: BankIcon, processingTime: '2-4 hours' });
        } else if (country === 'United States') {
            methods.push({ id: 'ach', name: 'ACH Direct Debit', description: 'Low fee US bank pull', type: 'BANK', icon: BankIcon, processingTime: '3-5 business days' });
        } else {
            methods.push({ id: 'wire', name: 'International Wire', description: 'SWIFT / SWIFT-gpi transfer', type: 'BANK', icon: BankIcon, processingTime: '3-5 business days' });
        }

        // Add Credit Card for all countries EXCEPT Nigeria
        if (country !== 'Nigeria') {
            methods.unshift({
                id: 'credit_card',
                name: 'Credit / Debit Card',
                description: 'Visa, Mastercard, AMEX',
                type: 'CARD',
                icon: CreditCard,
                processingTime: 'Instant'
            });
        }

        return methods;
    };

    const countryMethods = useMemo(() => {
        return selectedCountry ? getMethodsForCountry(selectedCountry) : [];
    }, [selectedCountry]);

    // FX Data Logic (Mocked)
    const fxData = useMemo(() => {
        if (!selectedCountry) return null;

        let rate = 1.0;
        let localCurrency = defaultCurrency;

        if (selectedCountry === 'India') { rate = 89.42; localCurrency = 'INR'; }
        else if (selectedCountry === 'Nigeria') { rate = 1620.50; localCurrency = 'NGN'; }
        else if (selectedCountry === 'United States') { rate = 1.08; localCurrency = 'USD'; }
        else if (['France', 'Germany', 'Finland'].includes(selectedCountry)) { rate = 1.0; localCurrency = 'EUR'; }

        return {
            localAmount: (amount * rate).toFixed(2),
            localCurrency,
            rate,
            fee: (amount * 0.015).toFixed(2) // 1.5% simulated fee
        };
    }, [selectedCountry, amount, defaultCurrency]);

    const handleConfirmPayment = async () => {
        if (!selectedCountry || !selectedMethod || !fxData) return;

        await onPaymentComplete({
            method: selectedMethod.id,
            country: selectedCountry,
            currency: fxData.localCurrency,
            fxMetadata: {
                rate: fxData.rate,
                originalAmount: amount,
                localAmount: fxData.localAmount,
                timestamp: new Date().toISOString()
            }
        });
    };

    // Calculate dynamic expiration (Tomorrow 22:59)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    expiryDate.setHours(22, 59, 0, 0);
    const expiryString = expiryDate.toISOString().slice(0, 16).replace('T', ' ');

    const progress = useMemo(() => {
        switch (step) {
            case 'COUNTRY': return 25;
            case 'METHOD': return 50;
            case 'FX': return 75;
            default: return 100;
        }
    }, [step]);

    return (
        <div className="bg-white border-y md:border border-neutral-200 rounded-none md:rounded-sm overflow-hidden max-w-none md:max-w-2xl -mx-4 md:mx-auto font-rubik">
            {/* Header Steps */}
            <div className="bg-neutral-50 border-b border-neutral-100 py-3 px-4 flex justify-between items-center overflow-x-auto no-scrollbar gap-4">
                {[
                    { id: 'COUNTRY', label: 'Country' },
                    { id: 'METHOD', label: 'Method' },
                    { id: 'FX', label: 'Review' },
                    { id: 'CONFIRM', label: 'Pay' }
                ].map((s, idx) => {
                    const isActive = step === s.id || (s.id === 'CONFIRM' && step === 'BANK_INSTRUCTIONS');
                    const isCompleted = progress > (idx + 1) * 25 || (idx === 3 && progress === 100);

                    return (
                        <div
                            key={s.id}
                            className={`flex items-center gap-1.5 whitespace-nowrap text-[10px] md:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-[#00A651]' : 'text-neutral-400'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] border ${isActive ? 'border-[#00A651] bg-[#00A651] text-white' : 'border-neutral-300'}`}>{idx + 1}</span>
                            <span className="hidden sm:inline">{s.label}</span>
                            {idx < 3 && <ArrowRight size={10} weight="bold" className="text-neutral-300 ml-1" />}
                        </div>
                    );
                })}
            </div>

            {/* Transaction Timeline */}
            {fxData && (
                <div className="bg-white px-4 py-3 border-b border-neutral-100 flex items-center justify-between text-[10px] md:text-xs font-rubik animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="flex flex-col">
                        <span className="text-neutral-400 uppercase tracking-widest mb-0.5">You send</span>
                        <span className="font-medium text-black text-sm md:text-base">
                            {fxData.localCurrency} {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex-grow flex items-center px-4 md:px-8">
                        <div className="flex-grow h-[1px] bg-neutral-200 relative">
                            <div className="absolute right-0 -top-[4px] w-2 h-2 border-t border-r border-neutral-300 rotate-45" />
                        </div>
                    </div>

                    <div className="flex flex-col text-right">
                        <span className="text-neutral-400 uppercase tracking-widest mb-0.5">SYKLI College receives</span>
                        <span className="font-medium text-[#00A651] text-sm md:text-base">
                            € {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="h-1 w-full bg-neutral-100 overflow-hidden">
                <div
                    className="h-full bg-[#00A651] transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(0,166,81,0.4)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-3 md:p-8">
                {/* ... existing checkout steps logic ... */}
                {step === 'COUNTRY' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Where are you paying from?</h2>
                            <p className="text-sm text-black font-medium">Explicit country selection is required for regulatory compliance.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-normal text-black uppercase tracking-widest block" htmlFor="country-select">Choose Country</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={18} />
                                <select
                                    id="country-select"
                                    className="w-full pl-12 pr-10 py-4 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A651]/10 focus:border-[#00A651] transition-all font-normal text-sm text-black appearance-none cursor-pointer"
                                    value={selectedCountry || ''}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                >
                                    <option value="" disabled>Select your payment origin...</option>
                                    {countries.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                                    <ArrowRight size={14} weight="bold" className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!selectedCountry || loadingStep === 'COUNTRY'}
                            onClick={() => handleStepChange('METHOD')}
                            className="w-full bg-[#00A651] text-white py-4 md:py-5 rounded-sm font-normal uppercase tracking-widest text-sm hover:bg-[#008c44] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingStep === 'COUNTRY' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue to Payment Methods
                                    <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 'METHOD' && (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => setStep('COUNTRY')}
                            className="flex items-center gap-2 text-black hover:text-black text-sm font-normal uppercase tracking-widest transition-colors mb-4"
                        >
                            <ArrowLeft size={14} weight="bold" /> Back to Country
                        </button>

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Choose Payment Method</h2>
                            <p className="text-sm text-black font-medium lowercase">Available rails for <span className="text-[#00A651] font-normal uppercase">{selectedCountry}</span></p>
                        </div>

                        <div className="space-y-3">
                            {countryMethods.map(method => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => {
                                            setSelectedMethod(method);
                                            handleStepChange('FX');
                                        }}
                                        className={`w-full flex items-center justify-between p-3 md:p-5 rounded-sm border-2 transition-all group ${selectedMethod?.id === method.id
                                            ? 'border-[#00A651] bg-blue-50/30'
                                            : 'border-neutral-100 hover:border-neutral-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-neutral-100 rounded-sm group-hover:bg-[#00A651]/10 transition-colors">
                                                <Icon size={20} className="text-black group-hover:text-[#00A651]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-normal text-black">{method.name}</p>
                                                <p className="text-sm text-black">{method.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-normal text-black uppercase tracking-widest flex items-center gap-1 justify-end">
                                                <div className="w-3">
                                                    {(loadingStep === 'METHOD' && selectedMethod?.id === method.id) && (
                                                        <div className="w-3 h-3 border-2 border-[#00A651]/30 border-t-[#00A651] rounded-full animate-spin" />
                                                    )}
                                                </div>
                                                <Clock size={12} weight="bold" /> {method.processingTime}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 'FX' && fxData && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => setStep('METHOD')}
                            className="flex items-center gap-2 text-black hover:text-black text-sm font-normal uppercase tracking-widest transition-colors"
                        >
                            <ArrowLeft size={14} weight="bold" /> Back to Methods
                        </button>

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Review Foreign Exchange</h2>
                            <p className="text-sm text-black font-medium">Locked FX rates for your payment corridor.</p>
                        </div>

                        <div className="space-y-6">

                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                <div>
                                    <p className="text-[10px] md:text-sm font-normal text-[#00A651] uppercase tracking-widest mb-1">Local Amount</p>
                                    <p className="text-2xl md:text-3xl font-normal">{fxData.localCurrency} {Number(fxData.localAmount).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] md:text-sm font-normal text-black uppercase tracking-widest mb-1">Settlement (EUR)</p>
                                    <p className="text-xl md:text-2xl font-normal">€ {amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-neutral-100 space-y-3">
                                <div className="flex justify-between text-xs md:text-sm font-medium">
                                    <span className="text-black">Execution Rate</span>
                                    <span className="text-[#00A651] font-normal">1 EUR = {fxData.rate} {fxData.localCurrency}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-normal pt-2 border-t border-neutral-100">
                                    <span>Total Payable</span>
                                    <span className="text-black">{fxData.localCurrency} {Number(fxData.localAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-100 border border-neutral-200 p-3 md:p-4 rounded-sm flex gap-3">
                            <Info size={16} className="text-black shrink-0" />
                            <p className="text-sm text-black leading-relaxed font-normal">
                                This FX rate is locked for the next 15 minutes. By proceeding, you confirm your intent to pay from <strong>{selectedCountry}</strong> using <strong>{selectedMethod?.name}</strong>.
                            </p>
                        </div>

                        <button
                            disabled={loadingStep === 'FX'}
                            onClick={() => handleStepChange('CONFIRM')}
                            className="w-full bg-[#00A651] text-white py-4 md:py-5 rounded-sm font-normal uppercase tracking-widest text-sm hover:bg-[#008c44] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loadingStep === 'FX' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Locking Rate...
                                </>
                            ) : (
                                <>
                                    Confirm FX & Proceed to Pay
                                    <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 'CONFIRM' && fxData && (
                    <div className="space-y-6 md:space-y-8 animate-in zoom-in duration-300 text-center">

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Final Confirmation</h2>
                            <p className="text-sm text-black font-medium">Ready to authorize the enterprise-grade transaction.</p>
                        </div>

                        <div className="bg-white border-2 border-dashed border-neutral-200 p-4 md:p-8 rounded-sm space-y-4">
                            <div className="flex justify-between text-sm font-normal uppercase tracking-widest text-black">
                                <span>Country of Origin</span>
                                <span className="text-black">{selectedCountry}</span>
                            </div>
                            <div className="flex justify-between text-sm font-normal uppercase tracking-widest text-black">
                                <span>Payment Channel</span>
                                <span className="text-black">{selectedMethod?.name}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (selectedCountry === 'Nigeria') {
                                    handleStepChange('BANK_INSTRUCTIONS');
                                } else {
                                    handleConfirmPayment();
                                }
                            }}
                            disabled={isProcessing || loadingStep === 'CONFIRM'}
                            className="w-full bg-[#00A651] text-white py-5 md:py-6 rounded-sm font-normal uppercase tracking-widest text-sm hover:bg-[#008c44] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {isProcessing || loadingStep === 'CONFIRM' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authorizing...
                                </>
                            ) : (
                                <>
                                    {selectedCountry === 'Nigeria'
                                        ? 'Complete Payment with FLUTTERWAVE'
                                        : `Complete Payment with PayGoWire (${fxData.localCurrency} ${Number(fxData.localAmount).toLocaleString()})`
                                    }
                                </>
                            )}
                        </button>

                        <div className="pt-4 flex flex-col gap-2">
                            <p className="text-sm text-black font-medium text-center mt-2 max-w-sm mx-auto leading-relaxed">
                                Your payment is protected by enterprise-grade AML and regulatory screening via the PayGoWire global network.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'BANK_INSTRUCTIONS' && fxData && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-roboto">
                        <div className="text-center space-y-4">
                            <h2 className="text-[18px] font-normal text-black leading-relaxed">
                                Transfer the exact amount including decimals, before <span className="font-medium text-[#00A651]">{expiryString}</span>
                            </h2>
                            <p className="text-sm text-black max-w-lg mx-auto">
                                To ensure your payment is processed automatically, please use the exact provided account details below.
                            </p>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-200 p-4 md:p-8 space-y-4 md:space-y-6 rounded-sm">
                            <div className="grid gap-6">
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 md:pb-4">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Amount</span>
                                    <div className="flex items-center gap-3">
                                        <CopyButton text={fxData.localAmount} label="Amount" />
                                        <span className="text-xl md:text-2xl text-black font-normal">{fxData.localCurrency} {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 md:pb-4">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Bank</span>
                                    <span className="text-xs md:text-sm text-black font-normal text-right">Sterling Bank PLC</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 md:pb-4">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Account Number</span>
                                    <div className="flex items-center gap-3">
                                        <CopyButton text="8523438395" label="Account Number" />
                                        <span className="text-lg md:text-xl text-black font-normal tracking-wider">8523438395</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 md:pb-4">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Beneficiary</span>
                                    <span className="text-xs md:text-sm text-black font-normal text-right">Flutterwave/SYKLI Educational Services</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 md:pb-4">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Reference</span>
                                    <span className="text-xs md:text-sm text-black font-normal">{paymentReference || '1774261321084'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Expiration Date</span>
                                    <span className="text-xs md:text-sm text-black font-normal text-right">{expiryString}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-sm flex gap-3 text-amber-800">
                            <Info size={18} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-normal">
                                <strong>No split payments are allowed.</strong> Please transfer the single lump sum of {fxData.localCurrency} {Number(fxData.localAmount).toLocaleString()}.
                            </p>
                        </div>

                        <div className="text-sm text-neutral-500 leading-relaxed bg-white border border-neutral-100 p-6 rounded-sm">
                            <p className="mb-4">
                                You have until <strong>{expiryString}</strong> to complete your payment via Online Bank Transfer.
                            </p>
                            <p>
                                We recommend making a NIBSS Instant Payment (NIP), offered by most banks, as other bank transfers can take longer to be received. To ensure your payment can be processed successfully, transfer the exact amount, otherwise your payment will be rejected. If the transaction is above the limit established by your bank for online transfers, reach out to your bank to increase your limit; if your bank is unable to raise your limit, create a new Payment Request for an amount that aligns with your bank's limits.
                            </p>
                        </div>

                        <button
                            onClick={handleConfirmPayment}
                            disabled={isProcessing}
                            className="w-full bg-[#00A651] text-white py-5 rounded-sm font-normal uppercase tracking-widest text-sm hover:bg-[#008c44] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Confirming Transfer...
                                </>
                            ) : (
                                'I have sent the transfer'
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Regulatory Info */}
            <div className="bg-neutral-50 border-t border-neutral-100 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/paygowire-logo-v2.png"
                        alt="PayGoWire"
                        width={100}
                        height={20}
                        className="h-5 w-auto object-contain"
                    />
                    <div>
                        <p className="text-sm text-black font-normal uppercase tracking-widest leading-none mt-0.5 border-l border-neutral-300 pl-2 ml-2">Global Education Rails</p>
                    </div>
                </div>
                <div className="flex gap-6 opacity-30">
                    <ShieldCheck size={16} weight="bold" />
                </div>
            </div>
        </div>
    );
}

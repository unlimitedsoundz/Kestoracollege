'use client';

import React, { useState } from 'react';
import { Trophy as Award, Info, Percent, CheckCircle as CheckCircle2 } from "@phosphor-icons/react/dist/ssr";
import { createAdmissionOffer } from './actions';
import {
    EARLY_PAYMENT_DISCOUNT_PERCENT,
    calculateDiscountedFee
} from '@/utils/tuition';

interface FinancialOfferFormProps {
    applicationId: string;
    baseTuition: number;
    programYears: number;
    onSuccess?: () => void;
}

export function FinancialOfferForm({ applicationId, baseTuition, programYears, onSuccess }: FinancialOfferFormProps) {
    const [offerType, setOfferType] = useState<'FIRST_YEAR' | 'FULL_PROGRAM'>('FIRST_YEAR');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Calculations
    const fullProgramBase = baseTuition * programYears;
    const currentBase = offerType === 'FULL_PROGRAM' ? fullProgramBase : baseTuition;
    const discountedFee = calculateDiscountedFee(currentBase);
    const discountAmount = currentBase - discountedFee;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const deadline = formData.get('deadline') as string;

        setIsSubmitting(true);
        try {
            const mappedOfferType = offerType === 'FULL_PROGRAM' ? 'FULL_TUITION' : 'DEPOSIT';
            await createAdmissionOffer(applicationId, discountedFee, deadline, mappedOfferType, discountAmount);
            setShowSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to issue financial offer');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="p-8 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={24} weight="bold" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest leading-none mb-2">Offer Issued</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase leading-relaxed">
                        Financial offer for €{discountedFee.toLocaleString()} has been generated and student notification triggered.
                    </p>
                </div>
                <button
                    onClick={() => setShowSuccess(false)}
                    className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:underline"
                >
                    Issue Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
                <button
                    type="button"
                    onClick={() => setOfferType('FIRST_YEAR')}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tight rounded-lg transition-all ${offerType === 'FIRST_YEAR' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                >
                    First Year Only
                </button>
                <button
                    type="button"
                    onClick={() => setOfferType('FULL_PROGRAM')}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tight rounded-lg transition-all ${offerType === 'FULL_PROGRAM' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                >
                    Full Programme
                </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-neutral-400">
                        {offerType === 'FULL_PROGRAM' ? `Full ${programYears} Years` : '1st Year Tuition'}
                    </span>
                    <div className="text-right">
                        <span className="text-xl font-black text-neutral-900 leading-none">€{discountedFee.toLocaleString()}</span>
                        <p className="text-[8px] font-bold text-neutral-400 uppercase mt-1">
                            Original: €{currentBase.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                        <Percent size={12} weight="bold" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-900 uppercase leading-none mb-0.5">Early Bird Discount Applied</p>
                        <p className="text-[8px] font-bold text-emerald-600 uppercase">Save €{discountAmount.toLocaleString()} ({EARLY_PAYMENT_DISCOUNT_PERCENT}%)</p>
                    </div>
                </div>

                {offerType === 'FIRST_YEAR' && programYears > 1 && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Info size={12} weight="bold" />
                        </div>
                        <p className="text-[8px] font-bold text-blue-700 uppercase leading-tight">
                            Covers initial year. Remaining {programYears - 1} years due at start of each term.
                        </p>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-[9px] font-black uppercase text-neutral-400 mb-1 leading-none">Payment Deadline</label>
                <input
                    name="deadline"
                    type="date"
                    required
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 transition-all shadow-inner"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Issuing...' : 'Issue Financial Offer'}
            </button>
        </form>
    );
}

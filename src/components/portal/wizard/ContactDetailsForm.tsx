'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Info, CaretRight as ChevronRight, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { updateApplicationStep } from '@/app/portal/actions';
import { useRouter } from 'next/navigation';
import { countries } from '@/utils/countries';

const contactDetailsSchema = z.object({
    email: z.string().email('Invalid email address'),
    phoneCode: z.string().min(1, 'Required'),
    phone: z.string().min(5, 'Phone number is required'),
    addressLine1: z.string().min(5, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().min(2, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
});

type ContactDetailsValues = z.infer<typeof contactDetailsSchema>;

interface Props {
    applicationId: string;
    initialData?: any;
    defaultEmail?: string;
    onUpdate?: () => Promise<void>;
}

export default function ContactDetailsForm({ applicationId, initialData, defaultEmail, onUpdate }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<ContactDetailsValues>({
        resolver: zodResolver(contactDetailsSchema),
        defaultValues: initialData || {
            email: defaultEmail || '',
            phoneCode: '+358',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            postalCode: '',
            country: 'Finland',
        }
    });

    const onSubmit = async (data: ContactDetailsValues) => {
        setIsSubmitting(true);
        try {
            await updateApplicationStep(applicationId, 'contact', data);
            if (onUpdate) await onUpdate();
            router.push(`?id=${applicationId}&step=4`);
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save progress. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-neutral-100 rounded-sm">
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Email Address</label>
                    <input
                        {...form.register('email')}
                        className="w-full px-3 py-1.5 bg-neutral-100/50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium text-[#2d2d2d]"
                        readOnly
                    />
                    {form.formState.errors.email && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Phone Number</label>
                    <div className="flex gap-2">
                        <select
                            {...form.register('phoneCode')}
                            className="w-1/3 px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                        >
                            {countries.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                                <option key={`${c.name}-${c.code}`} value={c.code}>
                                    {c.flag} {c.code}
                                </option>
                            ))}
                        </select>
                        <input
                            {...form.register('phone')}
                            className="w-2/3 px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                            placeholder="Phone number"
                        />
                    </div>
                    {(form.formState.errors.phone || form.formState.errors.phoneCode) && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">
                            {form.formState.errors.phone?.message || form.formState.errors.phoneCode?.message}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Address Line 1</label>
                    <input
                        {...form.register('addressLine1')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.addressLine1 && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.addressLine1.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">City</label>
                    <input
                        {...form.register('city')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.city && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.city.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Postal Code</label>
                    <input
                        {...form.register('postalCode')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.postalCode && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.postalCode.message}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Country</label>
                    <select
                        {...form.register('country')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    >
                        <option value="">Select Country</option>
                        {countries.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    {form.formState.errors.country && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.country.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                    <Link
                        href={`?id=${applicationId}&step=2`}
                        className="text-[#2d2d2d] hover:text-black font-semibold text-xs uppercase tracking-widest transition-colors"
                    >
                        Back
                    </Link>
                    <button
                        type="button"
                        onClick={async () => {
                            const data = form.getValues();
                            setIsSubmitting(true);
                            try {
                                await updateApplicationStep(applicationId, 'contact', data);
                                router.push('/portal/dashboard');
                            } catch (error) {
                                console.error('Failed to save:', error);
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        className="text-[#2d2d2d] hover:text-primary font-semibold text-xs uppercase tracking-widest transition-colors"
                    >
                        Save & Exit
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={16} weight="bold" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Continue
                            <ChevronRight size={16} weight="bold" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

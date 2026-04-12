'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CaretRight as ChevronRight, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { updateApplicationStep } from '@/app/portal/actions';
import { useRouter } from 'next/navigation';
import { nationalities } from '@/utils/nationalities';
import DateSelector from '@/components/ui/DateSelector';
import { Controller } from 'react-hook-form';

const personalInfoSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    nationality: z.string().min(2, 'Nationality is required'),
    passportNumber: z.string().min(5, 'Passport number is required'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

interface Props {
    applicationId: string;
    initialData?: any;
    onUpdate?: () => Promise<void>;
}

export default function PersonalInfoForm({ applicationId, initialData, onUpdate }: Props) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: initialData || {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: '',
            passportNumber: '',
            gender: undefined,
        }
    });

    const onSubmit = async (data: PersonalInfoValues) => {
        setIsSaving(true);
        try {
            await updateApplicationStep(applicationId, 'personal', data);
            if (onUpdate) await onUpdate(); // Refresh parent state
            router.push(`?id=${applicationId}&step=3`);
            router.refresh();
            // In a real wizard, we might navigate to next step or update local state
            // For now, refresh keeps us on same page but implementation plan says we switch components based on status.
            // Since we don't have step switching logic fully in page.tsx yet, this just saves.
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save progress. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-neutral-100 rounded-sm">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#2d2d2d] mb-1">First Name</label>
                    <input
                        {...form.register('firstName')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.firstName && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#2d2d2d] mb-1">Last Name</label>
                    <input
                        {...form.register('lastName')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.lastName && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                </div>

                <div>
                    <Controller
                        name="dateOfBirth"
                        control={form.control}
                        render={({ field }) => (
                            <DateSelector
                                label="Date of Birth"
                                name={field.name}
                                value={field.value}
                                required
                                onChange={(name, value) => field.onChange(value)}
                            />
                        )}
                    />
                    {form.formState.errors.dateOfBirth && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.dateOfBirth.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#2d2d2d] mb-1">Gender</label>
                    <select
                        {...form.register('gender')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {form.formState.errors.gender && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.gender.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#2d2d2d] mb-1">Nationality</label>
                    <select
                        {...form.register('nationality')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    >
                        <option value="">Select Nationality</option>
                        {nationalities.map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    {form.formState.errors.nationality && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.nationality.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#2d2d2d] mb-1">Passport Number</label>
                    <input
                        {...form.register('passportNumber')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.passportNumber && (
                        <p className="text-red-500 text-xs font-semibold uppercase mt-1">{form.formState.errors.passportNumber.message}</p>
                    )}
                </div>
            </div>

            <div className="bg-neutral-50/50 p-4 rounded-md border border-neutral-100 space-y-1">
                <button
                    type="button"
                    onClick={async () => {
                        const data = form.getValues();
                        setIsSaving(true);
                        try {
                            await updateApplicationStep(applicationId, 'personal', data);
                            router.push('/portal/dashboard');
                        } catch (error) {
                            console.error('Failed to save:', error);
                        } finally {
                            setIsSaving(false);
                        }
                    }}
                    className="text-[#2d2d2d] hover:text-primary font-semibold text-xs uppercase tracking-widest transition-colors"
                >
                    Save & Exit
                </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                <button
                    type="button"
                    onClick={async () => {
                        const data = form.getValues();
                        setIsSaving(true);
                        try {
                            await updateApplicationStep(applicationId, 'personal', data);
                            router.push('/portal/dashboard');
                        } catch (error) {
                            console.error('Failed to save:', error);
                        } finally {
                            setIsSaving(false);
                        }
                    }}
                    className="text-[#2d2d2d] hover:text-primary font-semibold text-xs uppercase tracking-widest transition-colors"
                >
                    Save & Exit
                </button>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {isSaving ? (
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

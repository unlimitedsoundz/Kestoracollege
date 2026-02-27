import { DegreeLevel } from '@/types/database';

export type TuitionField = 'BUSINESS' | 'ARTS' | 'TECHNOLOGY' | 'SCIENCE';

export const TUITION_FEES: Record<DegreeLevel, Record<TuitionField, number>> = {
    BACHELOR: {
        BUSINESS: 4000,
        ARTS: 4000,
        TECHNOLOGY: 6000,
        SCIENCE: 7500,
    },
    MASTER: {
        BUSINESS: 6000,
        ARTS: 6000,
        TECHNOLOGY: 6000,
        SCIENCE: 9500,
    }
};

export const EARLY_PAYMENT_DISCOUNT_PERCENT = 25;
export const EARLY_PAYMENT_WINDOW_DAYS = 21;

/**
 * Checks if the current date is within the early payment window (21 days)
 * from the offer creation date.
 */
export function isWithinEarlyPaymentWindow(offerCreatedAt: string): boolean {
    const offerDate = new Date(offerCreatedAt);
    const deadline = new Date(offerDate);
    deadline.setDate(deadline.getDate() + EARLY_PAYMENT_WINDOW_DAYS);
    return new Date() <= deadline;
}

/**
 * Validates and gets the tuition fee based on degree level and field.
 */
export function getTuitionFee(level: DegreeLevel, field: TuitionField): number {
    return TUITION_FEES[level][field];
}

/**
 * Calculates the fee after early payment discount.
 */
export function calculateDiscountedFee(totalFee: number): number {
    return Math.round(totalFee * (1 - EARLY_PAYMENT_DISCOUNT_PERCENT / 100));
}

/**
 * Gets total program years based on duration string.
 */
export function getProgramYears(duration: string): number {
    if (duration.toLowerCase().includes('2 years')) return 2;
    if (duration.toLowerCase().includes('3 years')) return 3;
    if (duration.toLowerCase().includes('4 years')) return 4;
    return 2; // Default
}

/**
 * Maps a School ID/Slug to a TuitionField.
 */
export function mapSchoolToTuitionField(schoolSlug: string): TuitionField {
    const slug = schoolSlug.toLowerCase();
    if (slug.includes('business')) return 'BUSINESS';
    if (slug.includes('arts') || slug.includes('design')) return 'ARTS';
    if (slug.includes('technology') || slug.includes('engineering')) return 'TECHNOLOGY';
    if (slug.includes('science')) return 'SCIENCE';
    return 'TECHNOLOGY'; // Default fallback
}

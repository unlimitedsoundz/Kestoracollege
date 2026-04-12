import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use — Kestora University',
    description: 'Terms and conditions governing the use of Kestora University digital platforms and services. Acceptable use, intellectual property, and liability.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use — Kestora College',
    description: 'Terms and conditions governing the use of Kestora College digital platforms and services. Acceptable use, intellectual property, and liability.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

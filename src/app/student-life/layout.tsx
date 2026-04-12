import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Life at Kestora University — Clubs, Culture & Campus Helsinki',
    description: 'Discover student life at Kestora University Helsinki. Student organisations, clubs, campus facilities, housing, and everything you need for an enriching university experience in Finland.',
};

export default function StudentLifeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

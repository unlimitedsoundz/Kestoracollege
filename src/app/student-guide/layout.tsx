import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Guide — Kestora University Finland | Campus Life & Academic Resources',
    description: 'Your complete guide to studying at Kestora University. Academic resources, campus services, housing, registration, and support for new and continuing students.',
};

export default function StudentGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

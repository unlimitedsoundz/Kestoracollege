import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Guide — Kestora College Finland | Campus Life & Academic Resources',
    description: 'Your complete guide to studying at Kestora College. Academic resources, campus services, housing, registration, and support for new and continuing students.',
};

export default function StudentGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

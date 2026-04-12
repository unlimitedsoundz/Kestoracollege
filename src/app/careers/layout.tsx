import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers | Kestora University',
    description: 'Join the Kestora University team. Explore our open positions and learn about our multi-disciplinary institutional culture in Helsinki, Finland.',
    alternates: {
        canonical: 'https://www.kestora.online/careers',
    },
};

export default function CareersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers | SYKLI College',
    description: 'Join the SYKLI College team. Explore our open positions and learn about our multi-disciplinary institutional culture in Helsinki, Finland.',
    alternates: {
        canonical: 'https://www.syklicollege.fi/careers',
    },
};

export default function CareersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

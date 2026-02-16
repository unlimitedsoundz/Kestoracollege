export async function generateStaticParams() {
    return [{ id: 'new' }];
}

import ClientPage from './ClientPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return <ClientPage params={params} />;
}

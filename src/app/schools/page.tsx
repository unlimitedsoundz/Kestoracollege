
import Link from 'next/link';
import Image from 'next/image';
import { School } from '@/types/database';

export const metadata = {
    title: 'Academic Schools — SYKLI College Finland | Arts, Business, Science, Technology',
    description: 'SYKLI College is organized into four schools: Arts & Architecture, Business, Science, and Technology. Explore departments, research, and degree programmes.',
};

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

import { createStaticClient } from '@/lib/supabase/static';

export default async function SchoolsPage() {
    const supabase = createStaticClient();
    const { data: schools, error } = await supabase
        .from('School')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching schools:', error);
        return <div>Error loading schools.</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Schools', item: '/schools' }
            ]} />
            {/* Hero Section */}

            <section className="bg-white text-neutral-900 relative overflow-hidden pt-32 pb-8 md:pt-48 md:pb-12">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl font-bold mb-6 tracking-tight pt-8">Our Schools</h1>
                    <p className="text-[21px] text-neutral-600 max-w-2xl leading-relaxed">
                        SYKLI College is organized into specialized schools, each driving innovation in sustainability, technology, and design through world-class research and education.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 md:py-24">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(schools as School[])?.map((school, index) => (
                        <Link
                            href={`/schools/${school.slug}`}
                            key={school.id}
                            className="group relative h-[450px] md:h-[500px] overflow-hidden rounded-3xl shadow-xl bg-neutral-900"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 bg-neutral-900">
                                {school.imageUrl ? (
                                    <Image
                                        src={school.imageUrl}
                                        alt={school.name}
                                        fill
                                        className="object-cover opacity-60"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority={index < 2}
                                    />
                                ) : (
                                    <div className="w-full h-full opacity-60 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                                )}
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                                    {school.name}
                                </h2>
                                <p className="text-neutral-300 line-clamp-3 mb-6 text-lg max-w-xl">
                                    {school.description}
                                </p>
                                <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-sm">
                                    Explore School <span className="text-[#f3e600]">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

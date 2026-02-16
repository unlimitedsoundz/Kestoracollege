
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Study at SYKLI College — Bachelor, Master & Lifelong Learning',
    description: 'Find your study path at SYKLI College. Explore our Bachelor\'s and Master\'s degree programmes, professional continuing education, and open studies.',
};

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export default function StudiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Studies', item: '/studies' }
            ]} />
            {/* Hero */}
            <section className="bg-black text-white pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Study at Sykli College
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl leading-relaxed mb-8">
                        From undergraduate degrees to executive education, we offer diverse paths for learners at every stage of their journey.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/admissions" className="bg-[#fd6402] text-black px-6 py-3 font-bold rounded hover:bg-[#e55a02] transition-colors">
                            Apply Now
                        </Link>
                        <Link href="#programmes" className="bg-white/10 text-white px-6 py-3 font-bold rounded hover:bg-white/20 transition-colors">
                            Explore Programmes
                        </Link>
                    </div>
                </div>
                {/* Abstract bg element */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neutral-800 to-transparent opacity-30 -skew-x-12 translate-x-1/4" />
            </section>

            <div id="programmes" className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Bachelor's */}
                    <div className="group relative bg-neutral-100 rounded-3xl overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0">
                            <Image
                                src="/images/admissions/bachelor_path.png"
                                alt="Diverse group of bachelor students studying together in a modern campus environment"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>
                        <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                            <h2 className="text-3xl font-bold mb-4">Bachelor's Degrees</h2>
                            <p className="text-neutral-200 mb-6 text-lg">
                                Build a strong foundation in sustainability, business, design, or technology. Our undergraduate programmes combine theory with real-world practice.
                            </p>
                            <Link href="/admissions/bachelor" className="inline-flex items-center gap-2 font-bold uppercase tracking-wider hover:gap-3 transition-all">
                                View Bachelor's Programmes <ArrowRight size={18} weight="bold" />
                            </Link>
                        </div>
                    </div>

                    {/* Master's */}
                    <div className="group relative bg-neutral-100 rounded-3xl overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0">
                            <Image
                                src="/images/admissions/master_hero_refined.jpg"
                                alt="Master students"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>
                        <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                            <h2 className="text-3xl font-bold mb-4">Master's Degrees</h2>
                            <p className="text-neutral-200 mb-6 text-lg">
                                Deepen your expertise and lead the change. Our graduate programmes are designed for professionals and ambitious researchers.
                            </p>
                            <Link href="/admissions/master" className="inline-flex items-center gap-2 font-bold uppercase tracking-wider hover:gap-3 transition-all">
                                View Master's Programmes <ArrowRight size={18} weight="bold" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Study Options */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold mb-12 text-center">More Ways to Learn</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Lifelong Learning", desc: "Short courses and professional development modules.", link: "/admissions#lifelong" },
                            { title: "Open University", desc: "Flexible studies open to everyone, regardless of background.", link: "/admissions#online-opportunities" },
                            { title: "Summer School", desc: "Intensive summer courses in Helsinki.", link: "/admissions#summer" }
                        ].map((item, i) => (
                            <Link href={item.link} key={i} className="bg-white border border-neutral-200 p-8 rounded-xl hover:shadow-lg transition-shadow group">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#fd6402] transition-colors">{item.title}</h3>
                                <p className="text-neutral-600 mb-4">{item.desc}</p>
                                <span className="font-bold text-sm flex items-center gap-2">Learn more <ArrowRight /></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

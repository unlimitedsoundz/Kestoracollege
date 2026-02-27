import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Alumni Network — Kestora College | Career, Community & Events',
    description: 'Join the Kestora College alumni network. Stay connected through events, mentoring, career development, and networking opportunities for graduates worldwide.',
};

export default function AlumniPage() {
    const benefits = [
        "Invitations to alumni events, seminars, and professional forums",
        "Career development resources and networking opportunities",
        "Continued access to academic research and institutional initiatives",
        "Opportunities to mentor students and recent graduates",
        "Updates on Kestora College programs, partnerships, and developments"
    ];

    return (
        <div className="min-h-screen bg-white font-sans leading-relaxed">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[600px] flex items-center bg-[#1a1a1a] overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
                    <Image
                        src="/images/1770770961793-019c4a2b-1d79-75c0-bd25-bf584b500a64.png"
                        alt="Kestora Alumni"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-6">
                            Kestora Global Community
                        </span>
                        <h1 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-8 leading-tight pt-12 md:pt-8 bg-clip-text">
                            Master&apos;s Alumni at Kestora College
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 font-light leading-relaxed mb-6 md:mb-10">
                            Empowering a global network of professionals committed to sustainable impact, leadership, and innovation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro Content */}
            <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <div className="prose prose-lg md:prose-xl text-neutral-600 max-w-none text-left">
                            <p className="mb-6 md:mb-8 text-xl md:text-2xl font-normal text-neutral-900 leading-relaxed">
                                The Master’s Alumni of Kestora College represent a growing global community of professionals who have completed advanced postgraduate studies at the institution.
                            </p>
                            <p className="mb-6 md:mb-8 text-base md:text-lg text-neutral-600 leading-relaxed font-light">
                                Our alumni are equipped with strong academic foundations, practical expertise, and a commitment to sustainable impact leadership and innovation. Graduates become lifelong members of the Kestora alumni community and continue to contribute to positive change across industries and societies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Pillars */}
            <section className="py-12 md:py-20 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                        {/* Pillar 1 */}
                        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-neutral-100 flex flex-col h-full">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-neutral-900 leading-tight">A Global Professional Network</h2>
                            <div className="text-neutral-600 space-y-4 flex-1">
                                <p className="text-base md:text-lg leading-relaxed font-light">
                                    Kestora College Master’s Alumni are active across multiple regions and sectors including sustainability, business, technology, education, design, and public policy. This international network strengthens professional collaboration, knowledge exchange, and cross-sector partnerships.
                                </p>
                                <p className="text-base md:text-lg leading-relaxed font-light">
                                    The global presence of our alumni reflects Kestora College’s focus on applied learning, responsible leadership, and real-world relevance.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-neutral-100 flex flex-col h-full">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-neutral-900 leading-tight">Continued Connection</h2>
                            <div className="text-neutral-600 space-y-4 flex-1">
                                <p className="text-base md:text-lg leading-relaxed font-light">
                                    At Kestora College, graduation marks the beginning of an ongoing relationship. Master’s Alumni remain connected through academic engagement, professional initiatives, and collaborative projects.
                                </p>
                                <p className="text-base md:text-lg leading-relaxed font-light">
                                    Alumni are encouraged to stay involved by contributing industry insights, participating in institutional activities, and supporting the academic and professional development of current students.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits List */}
            <section className="py-12 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-neutral-900">Alumni Benefits & Opportunities</h2>
                        <p className="text-neutral-600 text-base md:text-lg mb-8 md:mb-12 leading-relaxed">
                            Master’s Alumni of Kestora College have access to continued engagement opportunities that support lifelong growth and connection.
                        </p>
                        <ul className="space-y-4 md:space-y-6">
                            {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-base md:text-lg text-neutral-700 leading-relaxed font-light">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl flex flex-col items-start text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-neutral-900 leading-tight">Alumni Impact and Contribution</h2>
                        <div className="prose prose-base md:prose-lg text-neutral-600 mb-8 md:mb-12 max-w-none">
                            <p className="text-base md:text-lg leading-relaxed font-light text-neutral-600">
                                Kestora College Master’s Alumni play an important role in advancing the institution’s mission and global impact. Through leadership, professional practice, research collaboration, and community engagement, alumni help shape sustainable solutions and forward-thinking practices.
                            </p>
                            <p className="text-base md:text-lg leading-relaxed font-normal text-neutral-900">
                                The success of our alumni reflects the academic quality, applied focus, and values of Kestora College.
                            </p>
                        </div>

                        <div className="bg-black text-white p-8 md:p-12 rounded-2xl w-full text-left">
                            <h3 className="text-xl md:text-2xl font-bold mb-4">Stay Connected with Kestora Alumni</h3>
                            <p className="text-white/70 text-sm md:text-base mb-6 md:mb-8 max-w-2xl">
                                Master’s graduates are encouraged to remain active members of our alumni community. By staying connected, you strengthen professional networks and support future students.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-neutral-200 transition-colors group text-sm md:text-base">
                                Join the Network
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

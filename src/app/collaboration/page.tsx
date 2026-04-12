import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Handshake, Lightbulb, Buildings, Users } from '@phosphor-icons/react/dist/ssr';

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

export const metadata = {
    title: 'Collaboration & Partnerships | Kestora University',
    description: 'Partner with Kestora University for research, innovation, and education. Join our network of industry leaders driving systemic change.',
};

export default function CollaborationPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Collaboration', item: '/collaboration' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Collaboration & Partnerships at Kestora University",
                "url": "https://kestora.online/collaboration",
                "description": "Information on industry partnerships, collaborative research, and corporate training at Kestora University."
            }} />

            {/* HERO SECTION */}
            <section className="bg-neutral-900 text-white overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center pt-32 pb-24 min-h-[500px] relative text-center z-10">
                    <p className="text-[#fd6402] font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">Industry & Innovation</p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 max-w-4xl">
                        Partner with Kestora University
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed mb-10">
                        Join our network of global industry leaders, research institutions, and dynamic startups. Together, we bridge the gap between academic theory and market-ready solutions.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="#contact" className="bg-[#fd6402] text-black px-8 py-4 font-bold hover:bg-white transition-all inline-flex items-center gap-2 shadow-xl">
                            Partner with Us <ArrowRight size={20} weight="bold" />
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">

                {/* Why Partner with Us */}
                <section className="mb-32">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Partner with Us?</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Kestora University offers a dynamic ecosystem where organizations can access top-tier talent, engage agile R&D capabilities, and upskill their workforce.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Talent Pipeline",
                                icon: Users,
                                desc: "Recruit from our diverse pool of highly trained, globally-minded students through internships and direct hiring.",
                                color: "from-blue-500 to-indigo-600"
                            },
                            {
                                title: "Collaborative R&D",
                                icon: Lightbulb,
                                desc: "Leverage our state-of-the-art labs and multidisciplinary faculty to accelerate your innovation cycles.",
                                color: "from-[#fd6402] to-amber-500"
                            },
                            {
                                title: "Executive Education",
                                icon: Buildings,
                                desc: "Custom training and lifelong learning programmes designed to keep your workforce competitive.",
                                color: "from-purple-500 to-fuchsia-600"
                            }
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="bg-neutral-50 p-10 rounded-3xl hover:shadow-xl transition-shadow duration-300">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                                        <Icon size={28} weight="fill" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Engagement Models (Image + Text) */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Ways to Engage with the Kestora Community</h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Student Enterprise Projects", desc: "Sponsor a project and have teams of students solve your real-world business challenges under faculty supervision." },
                                    { title: "Guest Lectures & Workshops", desc: "Share industry insights, build your brand presence, and inspire the next generation of professionals." },
                                    { title: "Startup Incubation", desc: "Connect with the Kestora Entrepreneurship Hub to mentor or invest in early-stage student ventures." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 p-6 bg-white border border-neutral-100 shadow-sm rounded-2xl">
                                        <div className="mt-1">
                                            <Handshake size={24} className="text-[#fd6402]" weight="fill" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                            <p className="text-neutral-600">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/about/student-collab.jpg"
                                alt="Students and industry partners collaborating"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                                <p className="text-white text-xl font-medium leading-relaxed">
                                    "Our partnership with Kestora allows us to tap into fresh perspectives while tackling complex engineering challenges."<br />
                                    <span className="text-sm uppercase tracking-widest opacity-80 block mt-4 font-bold">— Tech Innovations Oy</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="scroll-mt-32">
                    <div className="bg-black text-white rounded-[3rem] p-8 md:p-16 lg:p-24 overflow-hidden relative">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fd6402] rounded-full mix-blend-screen filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Start the Conversation</h2>
                                <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-md">
                                    Whether you’re looking to recruit, research, or train, our Corporate Relations team is ready to design a tailored partnership model that meets your strategic goals.
                                </p>
                                <div className="space-y-2">
                                    <p className="font-bold text-xl">Corporate Relations Office</p>
                                    <a href="mailto:partnerships@kestora.online" className="text-[#fd6402] text-lg hover:text-white transition-colors underline">partnerships@kestora.online</a>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">First Name</label>
                                            <input type="text" className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-[#fd6402] transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Last Name</label>
                                            <input type="text" className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-[#fd6402] transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Organization</label>
                                        <input type="text" className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-[#fd6402] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Work Email</label>
                                        <input type="email" className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-[#fd6402] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Area of Interest</label>
                                        <select className="w-full bg-[#1a1a1a] border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:border-[#fd6402] transition-colors appearance-none">
                                            <option>Recruitment & Talent</option>
                                            <option>Joint Research & Development</option>
                                            <option>Executive Education</option>
                                            <option>Startup Incubation or Investment</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <button type="button" className="w-full bg-[#fd6402] text-black font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-white transition-colors mt-4">
                                        Request Partnership Info
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

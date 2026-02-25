import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Research at SYKLI College — Sustainability, Innovation & Technology',
    description: 'Explore research at SYKLI College. Funded projects in sustainability, clean technology, design, and social innovation. Publications, labs, and collaboration opportunities.',
};

export default function ResearchPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="relative h-auto min-h-[600px] md:pt-48 w-full bg-neutral-900 overflow-hidden pt-32 pb-32">
                <div className="absolute inset-0">
                    <Image
                        src="/images/research-hero.jpg"
                        alt="Researchers collaborating in a modern lab environment at SYKLI College"
                        fill
                        priority
                        className="object-cover opacity-60"
                        sizes="100vw"
                    />
                </div>
                <div className="absolute inset-0 bg-black/40" />
                <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                    <span className="text-white/80 font-bold tracking-wider text-sm md:text-base mb-4 uppercase">From Ideas to Impact</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white max-w-4xl leading-tight pt-8">
                        Research & Creative Exploration at SYKLI College
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-200 max-w-2xl font-light">
                        Where curiosity meets creation, connecting theory with hands on practice.
                    </p>
                </div>
            </div>

            {/* Intro Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="bg-black p-12 rounded-2xl border border-neutral-800 text-white">
                    <h2 className="text-3xl font-bold mb-6 text-white">Where Curiosity Meets Creation</h2>
                    <div className="prose prose-lg text-neutral-300 max-w-none">
                        <p className="mb-4">
                            At <strong>SYKLI College</strong>, research is not locked away in labs or journals it lives in studios, classrooms, communities, and real-world projects. We explore questions that matter now and ideas that shape what comes next, blending <strong>technology, design, business, science, and culture</strong> into a shared space of experimentation and discovery.
                        </p>
                        <p>
                            Our research culture welcomes both analytical thinkers and creative makers. Whether through data, design, systems, or stories, we believe knowledge grows stronger when disciplines cross paths.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why We Explore */}
            <div className="bg-white py-8 md:py-16 border-t border-neutral-100">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900">Why We Explore, Build, and Imagine</h2>
                        <ul className="space-y-4">
                            {[
                                "Turn curiosity into meaningful action",
                                "Connect theory with hands on practice",
                                "Support sustainable, ethical, and inclusive futures",
                                "Empower students and researchers to challenge norms and create alternatives"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-neutral-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2.5 flex-shrink-0" />
                                    <span className="text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-neutral-900 text-white p-10 rounded-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Core Values</h3>
                            <p className="text-neutral-300 mb-6 text-lg tracking-wide">
                                We value <strong>applied research</strong>, <strong>creative inquiry</strong>, and <strong>practice based exploration</strong> equally because innovation rarely comes from just one way of thinking.
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neutral-800 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>

            {/* Themes Grid */}
            <div className="bg-neutral-50 py-8 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-neutral-900">Research Focus Areas</h2>
                        <p className="text-xl text-neutral-500">Exploring the intersection of technology, humanity, and the environment.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Code, Culture & the Future",
                                desc: "Digitalisation beyond the screen examining how technology interacts with people, culture, ethics, and systems.",
                                tags: ["AI & Data", "Digital Platforms", "Human Tech Interaction", "Ethics"]
                            },
                            {
                                title: "Smarter Materials",
                                desc: "Rethinking materials and systems for sustainability, performance, and longevity.",
                                tags: ["Recyclable Materials", "Energy Efficiency", "Lifecycle Thinking", "Innovation"]
                            },
                            {
                                title: "Art, Media & Design",
                                desc: "Artistic exploration as a way of knowing, questioning, and communicating.",
                                tags: ["Practice based Research", "Visual Storytelling", "Social Inquiry", "Prototyping"]
                            },
                            {
                                title: "New Ways to Work",
                                desc: "Exploring how organisations can be more adaptive, ethical, and human centred.",
                                tags: ["Innovation", "Service Design", "Sustainable Models", "Leadership"]
                            },
                            {
                                title: "Powering Tomorrow",
                                desc: "Connecting engineering, systems analysis, and environmental responsibility.",
                                tags: ["Renewable Energy", "Smart Infrastructure", "Energy Mgmt", "Climate aware Design"]
                            },
                            {
                                title: "Designing Spaces",
                                desc: "How physical and digital spaces can be designed around real human needs.",
                                tags: ["Architecture", "Urban Systems", "Inclusive Design", "Spatial Interaction"]
                            },
                            {
                                title: "Better Living",
                                desc: "Research intersecting health, behaviour, and society.",
                                tags: ["Health Innovation", "Wellbeing Design", "Tech for Care", "Social Impact"]
                            }
                        ].map((theme, i) => (
                            <div key={i} className="bg-black p-8 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors group">
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">{theme.title}</h3>
                                <p className="text-neutral-300 mb-6 leading-relaxed">{theme.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {theme.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white text-black text-xs font-bold rounded uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How We Think */}
            <div className="py-8 md:py-24 bg-neutral-50 text-black border-y border-neutral-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-12">How We Think, Make, and Experiment</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: "Collaborative", text: "Crossing departments and disciplines" },
                            { title: "Hands on", text: "Grounded in making, testing, and iteration" },
                            { title: "Open minded", text: "Welcoming unconventional questions" },
                            { title: "Ethical", text: "Guided by integrity and responsibility" }
                        ].map((way, i) => (
                            <div key={i} className="p-6 bg-white border border-neutral-200 rounded-lg shadow-sm">
                                <h3 className="text-xl font-bold mb-2 text-black">{way.title}</h3>
                                <p className="text-neutral-600 text-sm">{way.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Outcomes & Ethics */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900">What Comes Out When Ideas Get Real</h2>
                        <ul className="space-y-3 mb-8">
                            {[
                                "Publications, reports, and policy insights",
                                "Prototypes, systems, and digital tools",
                                "Exhibitions, performances, and installations",
                                "Business concepts, services, and frameworks",
                                "Educational resources and community projects"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-neutral-700">
                                    <span className="text-neutral-300 font-bold">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="bg-neutral-100 p-6 rounded-lg">
                            <h3 className="font-bold text-neutral-900 mb-2">Impact matters</h3>
                            <p className="text-neutral-600">Not just academically, but socially, culturally, and environmentally. Our work helps shape futures that are thoughtful, creative, and sustainable.</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900">Doing the Right Thing</h2>
                        <p className="text-neutral-600 mb-6 text-lg leading-relaxed">
                            All research and creative activity at SYKLI College follows clear ethical guidelines and quality standards. Integrity, transparency, and accountability are central to how we work and collaborate.
                        </p>
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 mt-10">Where Disciplines Collide</h3>
                        <p className="text-neutral-600 mb-4">SYKLI College supports research through:</p>
                        <div className="grid grid-cols-2 gap-4">
                            {["Interdisciplinary labs", "Industry partnerships", "Collaboration platforms", "Global networks"].map((item) => (
                                <div key={item} className="bg-black p-4 rounded text-sm font-semibold text-white border border-neutral-800">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-neutral-100 py-8 md:py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6 text-neutral-900">Jump In, Try Things, Make Your Mark</h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
                        Students and staff are invited to actively engage in research. At SYKLI College, research is not just something you study <strong>it’s something you do</strong>.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/research/projects" className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-colors">
                            Explore Projects
                        </Link>
                        <Link href="/contact" className="bg-white text-neutral-900 border border-neutral-200 px-8 py-3 rounded-full font-bold hover:bg-neutral-50 transition-colors">
                            Contact Research Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

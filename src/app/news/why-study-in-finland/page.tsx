import Image from 'next/image';
import Link from 'next/link';
import { CaretLeft, GraduationCap, Globe, ShieldCheck, Lightbulb, Leaf, Briefcase, Buildings, Heart, MapTrifold, Certificate } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Why Study in Finland? 10 Reasons International Students Choose Helsinki | Kestora College',
    description: 'Discover why Finland is one of Europe\'s top study destinations. From world-class education to a thriving tech ecosystem, here are 10 reasons students choose Helsinki.',
    keywords: 'study in finland, why finland for international students, study in helsinki, finnish education, study abroad finland',
};

const reasons = [
    {
        icon: GraduationCap,
        title: "World-Class Education System",
        content: "Finland is globally respected for its high-quality education model. Universities emphasise research, innovation, and practical learning rather than rote memorisation. The Finnish education system consistently ranks among the best in the world, producing graduates who are critical thinkers and problem solvers."
    },
    {
        icon: Certificate,
        title: "Globally Recognised Degrees",
        content: "Finnish degrees are internationally accredited and respected by employers worldwide. Whether you plan to work in Europe, Africa, Asia, or North America, your qualification holds strong value. Kestora College degrees follow the European Bologna Process, ensuring seamless credit transfer and recognition."
    },
    {
        icon: Globe,
        title: "English-Taught Programmes",
        content: "You do not need to speak Finnish to study in Finland. Many bachelor's and master's programmes are delivered fully in English, especially in Helsinki. At Kestora College, all international degree programmes are taught entirely in English."
    },
    {
        icon: ShieldCheck,
        title: "Safe and Peaceful Environment",
        content: "Finland is consistently ranked as one of the safest countries in the world. Helsinki offers a calm, secure, and student-friendly environment where you can focus on your studies and personal growth without worry."
    },
    {
        icon: Lightbulb,
        title: "Innovation and Technology Hub",
        content: "Helsinki is a growing tech and startup ecosystem. Companies like Nokia originated in Finland, and the country continues to invest heavily in innovation and digital transformation. Students in business, IT, sustainability, and engineering benefit greatly from this ecosystem through internships, projects, and networking."
    },
    {
        icon: Leaf,
        title: "Strong Focus on Sustainability",
        content: "Finland is a global leader in environmental responsibility and sustainable development. Universities integrate sustainability into their curriculum and campus operations. At Kestora College, sustainability is woven into every programme across all four schools."
    },
    {
        icon: Briefcase,
        title: "Work Opportunities for Students",
        content: "International students are allowed to work part-time during their studies. After graduation, Finland offers pathways to stay and search for employment, including extended residence permits for job seekers."
    },
    {
        icon: Buildings,
        title: "Modern Learning Facilities",
        content: "Finnish universities provide advanced laboratories, digital libraries, collaborative spaces, and strong student support systems. Kestora College's campus features state-of-the-art facilities designed for hands-on, project-based learning."
    },
    {
        icon: Heart,
        title: "High Quality of Life",
        content: "Helsinki offers efficient public transport, clean air, modern housing, and access to nature. You can move from a lecture hall to a forest trail or seaside walk within minutes. Finland consistently ranks as one of the happiest countries in the world."
    },
    {
        icon: MapTrifold,
        title: "Gateway to Europe",
        content: "Finland is part of the European Union and the Schengen Area, making travel across Europe easier for students. Helsinki Airport connects you to major cities across Europe, Asia, and beyond with direct flights."
    }
];

export default function WhyStudyInFinlandPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="h-[55vh] min-h-[450px] relative overflow-hidden bg-neutral-900">
                <Image
                    src="/images/news/helsinki-study-hero.png"
                    alt="Aerial view of Helsinki, Finland with university campus and harbour"
                    fill
                    priority
                    className="object-cover opacity-50"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-black text-white">News</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">14.02.2026</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        Why Study in Finland? 10 Reasons International Students Choose Helsinki
                    </h1>
                    <p className="text-neutral-300 text-lg max-w-2xl">
                        Finland has become one of Europe&apos;s most attractive study destinations — and Helsinki, the capital city, is at the heart of it all.
                    </p>
                </div>
            </div>

            {/* Back nav */}
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to News
                </Link>
            </div>

            {/* Article body */}
            <div className="container mx-auto px-4 pb-16 md:pb-24 max-w-4xl">
                {/* Intro */}
                <div className="mb-12">
                    <p className="text-xl text-neutral-700 leading-relaxed">
                        Every year, thousands of international students choose Finland for their higher education. The combination of academic excellence, personal safety, career opportunities, and a high quality of life makes it a uniquely compelling destination. Here are <strong>10 powerful reasons</strong> why you should consider Helsinki for your studies.
                    </p>
                </div>

                {/* Content Image */}
                <div className="mb-12">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                        <Image
                            src="/images/news/helsinki-study-hero.png"
                            alt="International students at Kestora College campus in Helsinki"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">Kestora College | Photo by Markus Aalborg</p>
                </div>

                {/* Reasons */}
                <div className="space-y-10">
                    {reasons.map((reason, index) => {
                        const Icon = reason.icon;
                        return (
                            <div key={index} className="flex gap-6 items-start group">
                                {/* Number + Icon */}
                                <div className="flex-shrink-0 w-14 h-14 bg-neutral-900 text-white flex items-center justify-center rounded-xl font-bold text-lg relative">
                                    {index + 1}
                                </div>
                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2 text-neutral-900 flex items-center gap-3">
                                        <Icon size={22} weight="bold" className="text-neutral-400 hidden md:block" />
                                        {reason.title}
                                    </h2>
                                    <p className="text-neutral-600 leading-relaxed text-[17px]">
                                        {reason.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="my-16 border-t border-neutral-200" />

                {/* CTA Section */}
                <div className="bg-neutral-900 text-white p-8 md:p-12 rounded-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-neutral-300 text-lg mb-8 max-w-2xl">
                        Kestora College offers world-class English-taught programmes in Business, Technology, Science, and Arts &amp; Architecture. Applications for Autumn 2026 are now open.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/admissions" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
                            Apply Now
                        </Link>
                        <Link href="/studies" className="border border-neutral-600 text-white px-6 py-3 rounded-full font-bold hover:border-white transition-colors">
                            Explore Programmes
                        </Link>
                    </div>
                </div>

                {/* Related links */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Student Life at Kestora", href: "/student-life", desc: "Explore campus, housing, and activities." },
                        { title: "Tuition & Scholarships", href: "/admissions/tuition", desc: "Fees, discounts, and financial aid." },
                        { title: "International Students", href: "/student-guide/international", desc: "Visa, arrival, and settlement guide." },
                    ].map(link => (
                        <Link key={link.href} href={link.href} className="bg-neutral-50 p-6 rounded-xl hover:bg-neutral-100 transition-colors group">
                            <h3 className="font-bold text-neutral-900 mb-1 group-hover:underline">{link.title}</h3>
                            <p className="text-sm text-neutral-500">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

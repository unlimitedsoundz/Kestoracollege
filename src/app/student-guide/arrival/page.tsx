
import { CheckCircle, Globe, House as Home, Briefcase, MapPin, GraduationCap, ArrowRight, Info, Heart, Airplane, Car, UserCheck, Shield, Translate } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import Image from 'next/image';
import TableOfContents from '@/components/course/TableOfContents';

export const metadata = {
    title: 'Arrival Guide | SYKLI College',
    description: 'Prepare for your journey to SYKLI College. Enrolment, visa, housing, and settling in instructions.',
};

const tocSections = [
    { id: 'before-you-arrive', title: 'Before You Arrive', content: '' },
    { id: 'arriving', title: 'Arriving in the Country', content: '' },
    { id: 'starting', title: 'Starting at SYKLI', content: '' },
    { id: 'living', title: 'Living & Studying', content: '' },
    { id: 'welcome', title: 'Welcome Message', content: '' },
];

export default function ArrivalGuidePage() {
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Hero Section */}
            <div className="w-full h-[60vh] relative bg-neutral-900 overflow-hidden">
                <Image
                    src="/images/arrival-hero-v2.jpg"
                    alt="SYKLI College Students Arriving"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto">
                        <div className="flex items-center gap-3 mb-4 text-white/80">
                            <Airplane size={24} weight="regular" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em]">Student Arrival Guide</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter pt-8">
                            Welcome to SYKLI College
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed font-medium">
                            Starting your studies at SYKLI College is an exciting step. This guide helps you prepare, settle in, and feel confident.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24">
                            <TableOfContents sections={tocSections} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-32">

                        {/* Before You Arrive */}
                        <section id="before-you-arrive" className="scroll-mt-32">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl font-black mb-12 uppercase tracking-tight flex items-center gap-4">
                                    <span className="text-neutral-200">01</span>
                                    Before You Arrive
                                </h2>

                                <div className="space-y-8 md:space-y-16">
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                                                <UserCheck size={14} weight="bold" /> Enrolment
                                            </h3>
                                            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">Accept Your Offer</h4>
                                            <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                                Ensure you have accepted your admission offer, paid tuition fees, and completed enrolment as an attending student. Carry printed copies of your confirmations.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                                                <Shield size={14} weight="bold" /> Legal
                                            </h3>
                                            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">Visa & Permits</h4>
                                            <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                                International students (outside EU/EEA) should apply for a residence permit early. Ensure your passport is valid and carry your admission letter when travelling.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                                                <Home size={14} weight="bold" /> Housing
                                            </h3>
                                            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">Accommodation</h4>
                                            <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                                Secure housing before arrival. Confirm your move-in date, key collection, and transport route. We suggest arriving a few days early.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                                                <Briefcase size={14} weight="bold" /> Essentials
                                            </h3>
                                            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">What to Bring</h4>
                                            <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                                Bring your passport, residence permit, insurance, and enrolment documents. Pack items suitable for the local climate.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Arriving in the Country */}
                        <section id="arriving" className="scroll-mt-32">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl font-black mb-12 uppercase tracking-tight flex items-center gap-4">
                                    <span className="text-neutral-200">02</span>
                                    Arriving
                                </h2>

                                <div className="space-y-8">
                                    <div className="bg-neutral-50 p-8 rounded-sm">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                                            <Car size={14} weight="bold" /> Logistics
                                        </h3>
                                        <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">Airport & Transit</h4>
                                        <p className="text-neutral-700 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                            Use public transport based on instructions from your accommodation. Taxi services are available but expensive. Keep your address and directions ready.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="pl-6">
                                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight text-primary">First Days</h4>
                                            <p className="text-neutral-600 text-xs leading-relaxed uppercase tracking-tight font-medium">
                                                Move into your home, register with local authorities, and consider opening a bank account or getting a local SIM card.
                                            </p>
                                        </div>
                                        <div className="pl-6">
                                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">Locale</h4>
                                            <p className="text-neutral-600 text-xs leading-relaxed uppercase tracking-tight font-medium">
                                                Familiarise yourself with nearby public transport routes, grocery stores, and essential services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Starting at SYKLI College */}
                        <section id="starting" className="scroll-mt-32">
                            <div className="bg-black text-white p-12 rounded-sm space-y-8">
                                <h2 className="text-3xl font-black uppercase tracking-tight">Starting at SYKLI</h2>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Engagement</h4>
                                        <h5 className="text-xl font-bold mb-4 uppercase tracking-tight">Orientation Week</h5>
                                        <p className="text-neutral-400 text-xs leading-relaxed uppercase tracking-tight font-medium">
                                            Orientation sessions help you understand your programme, meet faculty and fellow students, and learn to navigate campus systems. Attendance is strongly encouraged.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Support</h4>
                                        <h5 className="text-xl font-bold mb-4 uppercase tracking-tight">Student Services</h5>
                                        <p className="text-neutral-400 text-xs leading-relaxed uppercase tracking-tight font-medium">
                                            Access academic advising, wellbeing services, career guidance, and international support. We encourage you to seek help whenever needed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Living & Studying */}
                        <section id="living" className="scroll-mt-32">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl font-black mb-12 uppercase tracking-tight flex items-center gap-4">
                                    <span className="text-neutral-200">03</span>
                                    Success
                                </h2>

                                <div className="space-y-8">
                                    <div className="pb-8">
                                        <h4 className="text-sm font-bold uppercase tracking-widest mb-3">Academic Life</h4>
                                        <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                            Attend classes regularly, use digital platforms, and manage your time between lectures, projects, and independent study.
                                        </p>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="text-sm font-bold uppercase tracking-widest mb-3">Health & Wellbeing</h4>
                                        <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                            Ensure you have valid health insurance and register with local health services. Take time to adjust to your new environment.
                                        </p>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Translate size={16} className="text-black" /> Learn the language
                                        </h4>
                                        <div className="space-y-4">
                                            <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                                You can get by in Finland with English only - especially in the capital region - as the Finnish people are among the best non-native English speakers in the world. However, learning the local language will make your stay more rewarding and improve your career options significantly.
                                            </p>
                                            <p className="text-neutral-600 text-xs leading-relaxed uppercase tracking-tight font-medium opacity-80">
                                                Finland is officially a bilingual country with Finnish (95%) and Swedish (5%). Finnish is part of the Finno-Ugric family of languages, and the structure and vocabulary are very different from the Indo-European languages. But it doesn't mean that it is difficult - it is merely different!
                                            </p>
                                            <div className="bg-neutral-50 p-6 rounded-sm italic">
                                                <p className="text-neutral-700 text-xs leading-relaxed uppercase tracking-tight font-medium">
                                                    For enrolled exchange, visiting and international degree students, SYKLI College offers free Finnish language courses. They are a fun way to learn the language and network with other students across the fields, and you get to know the culture as well.
                                                </p>
                                            </div>
                                            <p className="text-neutral-600 text-xs leading-relaxed uppercase tracking-tight font-medium">
                                                &quot;Kielibuusti&quot; is a project that develops solutions to support the Finnish and Swedish language skills of international talents. Check out their website, which provides practical, research-based models and tools for language learners, teachers, higher education institutions, and work communities. The materials are available for all, free of charge.
                                            </p>
                                            <a
                                                href="https://www.kielibuusti.fi"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black underline hover:opacity-70 transition-opacity"
                                            >
                                                Kielibuusti: language learning tips and materials <ArrowRight size={14} weight="bold" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="text-sm font-bold uppercase tracking-widest mb-3">Stay Connected</h4>
                                        <p className="text-neutral-600 text-sm leading-relaxed uppercase tracking-tight font-medium">
                                            Check your SYKLI email and student portal regularly for updates, schedules, and important announcements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Welcome Footer Message */}
                        <section id="welcome" className="scroll-mt-32 pt-20">
                            <div className="max-w-2xl">
                                <Heart className="text-primary mb-6" size={32} weight="fill" />
                                <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">We Are Glad You Are Here</h2>
                                <p className="text-lg text-neutral-700 leading-relaxed uppercase tracking-tight font-medium opacity-80 mb-8 italic">
                                    &quot;Arriving in a new place can feel overwhelming, but SYKLI College is here to support you from arrival through graduation. With preparation and curiosity, your experience will be both rewarding and memorable.&quot;
                                </p>
                                <div className="flex gap-4">
                                    <Link
                                        href="/student-guide"
                                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg"
                                    >
                                        Explore Student Guide <ArrowRight size={16} weight="bold" />
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

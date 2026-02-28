import Link from 'next/link';
import Image from 'next/image';
import { School, Department, Course } from '@/types/database';
import { notFound } from 'next/navigation';
import { ArrowRight, PencilSimple as Edit } from "@phosphor-icons/react/dist/ssr";
import FallbackImage from '@/components/ui/FallbackImage';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: school } = await supabase
        .from('School')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (!school) {
        return {
            title: 'School Not Found',
        };
    }

    return {
        title: `${school.name} — Kestora College | Research & Programmes`,
        description: school.description || `Explore the ${school.name} at Kestora College. Departments, research, and degree programmes.`,
    };
}

interface ExtendedDepartment extends Omit<Department, 'headOfDepartment'> {
    headOfDepartment: { name: string; role: string } | null;
}

interface ExtendedSchool extends School {
    departments: ExtendedDepartment[];
}

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

import { createStaticClient } from '@/lib/supabase/static';


export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: schools } = await supabase.from('School').select('slug');
    return schools?.map(({ slug }) => ({ slug })) || [];
}

export default async function SchoolDetails({ params }: Props) {
    const { slug } = await params;
    const supabase = createStaticClient();

    // Fetch school with departments and (optionally) top courses via filtering
    const { data: schoolData, error } = await supabase
        .from('School')
        .select(`
      *,
      departments:Department(*, headOfDepartment:Faculty!headOfDepartmentId(name, role))
    `)
        .eq('slug', slug)
        .single();

    if (error || !schoolData) {
        if (error?.code !== 'PGRST116') console.error('Error fetching school:', error);
        notFound();
    }

    const school = schoolData as unknown as ExtendedSchool;

    // Fetch latest/top courses for this school
    const { data: courses } = await supabase
        .from('Course')
        .select('*')
        .eq('schoolId', school.id)
        .limit(4);

    // Fetch Faculty for this school
    const { data: faculty } = await supabase
        .from('Faculty')
        .select('*')
        .eq('schoolId', school.id);

    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Schools', item: '/schools' },
                { name: school.name, item: `/schools/${school.slug}` }
            ]} />
            {/* Hero (Split Style from Home) */}

            <section className={`${slug === 'science' || slug === 'school-of-science' ? 'bg-blue-900' : (slug === 'technology' || slug === 'school-of-technology' ? 'bg-green-900' : 'bg-[#1c1c1c]')} text-white overflow-hidden`}>
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-40 pb-4 md:pt-56 lg:py-0 lg:h-[650px] relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            {school.name}
                        </h1>
                        <p className="text-lg text-neutral-300 max-w-xl leading-relaxed">
                            {school.description}
                        </p>
                        <div className="space-y-3 pt-2">
                            <Link href="/admissions" className="flex items-center gap-2 font-bold hover:underline group">
                                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" /> Apply now
                            </Link>
                            <Link href="/studies" className="flex items-center gap-2 font-bold hover:underline group">
                                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" /> Explore programs
                            </Link>
                        </div>

                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-8 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="h-full">
                            <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl overflow-hidden">
                                {school.imageUrl && (
                                    <Image
                                        src={school.imageUrl}
                                        alt={school.name}
                                        fill
                                        priority
                                        className="object-cover opacity-90"
                                        sizes="(max-width: 1024px) 368px, 50vw"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-16">

                {/* Departments Grid */}
                <section className="mb-20">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-4">Academic Departments</h2>
                        <p className="text-neutral-600 text-lg max-w-2xl">Organised into specialized departments driving innovation and research excellence.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {school.departments?.map((dept) => (
                            <Link
                                key={dept.id}
                                href={`/schools/${school.slug}/${dept.slug}`}
                                className="bg-white p-10 flex flex-col justify-between group hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-100 rounded-2xl"
                            >
                                <div>
                                    <div className="aspect-[3/2] bg-neutral-100 mb-3 overflow-hidden relative rounded-xl">
                                        <Image
                                            src={dept.imageUrl || `/images/placeholders/${dept.slug}.png`}
                                            alt={dept.name}
                                            fill
                                            className="object-cover opacity-80"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 transition-colors">
                                        Department of {dept.name.startsWith('Department of') ? dept.name.replace('Department of', '').trim() : dept.name}
                                    </h3>
                                    <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3 text-sm">
                                        {dept.description || 'Pushing the boundaries of knowledge through intensive research and world-class education.'}
                                    </p>
                                </div>
                                <div className="pt-6 pl-1 pb-1">
                                    <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1 tracking-widest">Head of Department</p>
                                    <p className="text-base font-bold">{dept.headOfDepartment?.name || 'To be appointed'}</p>
                                    <p className="text-xs text-neutral-500">{dept.headOfDepartment?.role || 'Department Administration'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Programs */}
                {courses && courses.length > 0 && (
                    <section>
                        <div className="flex justify-between items-end mb-10">
                            <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                                Featured Programs
                            </h2>
                            <Link href={`/studies?school=${school.id}`} className="text-neutral-500 hover:text-neutral-900 font-medium hidden md:block">
                                View All Programs →
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map(course => (
                                <Link href={`/studies/${course.slug}`} key={course.id} className="block group">
                                    <div className="bg-neutral-100 h-40 rounded-lg mb-4 overflow-hidden relative">
                                        <FallbackImage
                                            src={course.imageUrl || school.imageUrl || '/images/placeholders/design.png'}
                                            fallbackSrc={school.imageUrl || '/images/placeholders/design.png'}
                                            fill
                                            className="object-cover"
                                            alt={`Study ${course.title} at Kestora College`}
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />
                                        <span className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded text-neutral-800 z-10">
                                            {course.degreeLevel === "MASTER" ? "MSc" : "BSc"}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-blue-700 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-neutral-500">{course.duration}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}


                {/* Meet our people */}
                <section className="mb-20">
                    <div className="bg-neutral-900 text-white p-8 md:p-16 rounded-3xl overflow-hidden relative">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-bold mb-6">Research & Innovation</h2>
                            <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                                Research at the {school.name} is driven by a commitment to solving real-world challenges. We collaborate with industry partners and global networks to create sustainable impact.
                            </p>
                            <Link href="/research" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
                                Explore Research <ArrowRight size={18} weight="bold" />
                            </Link>
                        </div>
                        {/* Abstract BG Shape */}
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 bg-gradient-to-bl from-white/20 to-transparent"></div>
                    </div>
                </section>

                {/* Meet our people */}
                <section className="py-8 md:py-24 bg-neutral-50 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-4">Meet our people</h2>
                        <p className="text-black max-w-2xl">The visionaries and creative experts shaping the future at {school.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {faculty?.map((person) => (
                            <div key={person.id} className="bg-white border border-neutral-100 flex flex-col">
                                <div className="p-10 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-bold mb-0.5">{person.name}</h3>
                                        <p className="text-black text-[10px] font-bold uppercase tracking-wider mb-2">{person.role}</p>
                                        <p className="text-black text-xs line-clamp-2 mb-4">{person.bio}</p>
                                    </div>
                                    {person.email && (
                                        <div className="flex items-center justify-between py-3 border-t border-neutral-100 pl-1">
                                            <span className="text-[11px] text-black truncate">{person.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!faculty || faculty.length === 0) && (
                            <p className="text-neutral-500">No faculty members found for this school.</p>
                        )}
                    </div>
                </section>

            </div>

            {/* 5. COLLABORATION & LEADERSHIP */}
            <section className="py-8 md:py-24 bg-white text-black">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Collaboration */}
                        <div className="bg-black text-white p-12">
                            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                                Collaboration & Partnerships
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    "Industry Research Partners",
                                    "Innovation Accelerators",
                                    "International Exchange Networks",
                                    "Government & Policy Bodies",
                                    "Start-up Incubators"
                                ].map((item) => (
                                    <li key={item} className="flex items-center justify-between border-b border-white/10 pb-4 group cursor-default">
                                        <span className="text-lg text-neutral-300 group-hover:text-white transition-colors">{item}</span>
                                        <ArrowRight size={16} weight="bold" className="text-[#f3e600]" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Leadership */}
                        <div className="bg-black text-white p-12">
                            <h2 className="text-3xl font-bold mb-8">Leadership & Administration</h2>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#f3e600] mb-2">Dean of the School</p>
                                    <p className="text-2xl font-bold">{faculty?.find(f => f.role === 'Professor')?.name || 'To be appointed'}</p>
                                    <p className="text-neutral-400 text-sm">Dean, {school.name}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                                    <div>
                                        <p className="text-neutral-500 mb-2">Administrative</p>
                                        <ul className="space-y-1 text-neutral-300">
                                            {faculty?.filter(f => f.role === 'Professor').slice(1, 4).map((p) => (
                                                <li key={p.id}>{p.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 mb-2">Heads of Dept.</p>
                                        <ul className="space-y-1 text-neutral-300">
                                            {school.departments?.map((dept) => (
                                                <li key={dept.id}>{dept.name}: {dept.headOfDepartment?.name || 'TBA'}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. WHY & CONTACT */}
            <section className="py-8 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Why Section */}
                        <div className="bg-[#f3e600] p-16 text-black flex flex-col justify-center">
                            <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">Why {school.name}?</h2>
                            <div className="space-y-6">
                                {[
                                    "World-class faculty and research environment",
                                    "Close collaboration with leading industry partners",
                                    "State-of-the-art facilities and laboratories",
                                    "Focus on sustainability and real-world impact",
                                    "Global network and international opportunities"
                                ].map((point) => (
                                    <div key={point} className="flex gap-4 items-start">
                                        <p className="text-xl font-bold leading-tight">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col justify-center">
                            <h2 className="text-4xl font-bold mb-8 underline underline-offset-8">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-neutral-100 p-10 border border-black">
                                        <p className="font-bold text-lg">Kestora College – Helsinki Campus</p>
                                        <p className="font-medium text-neutral-800">Pohjoisesplanadi 51, 00150 Helsinki</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="font-medium">General: {school.slug}@kestora.online</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="font-medium">Admissions: {school.slug}.admissions@kestora.online</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="font-medium">Partnerships: {school.slug}.partners@kestora.online</span>
                                    </div>
                                </div>
                                <Link href="/contact" className="inline-flex items-center gap-2 font-bold group">
                                    Global Contact Directory <ArrowRight size={18} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FOOTER CALL TO ACTION */}
            <section className="bg-black text-white py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-2xl font-bold underline decoration-white/30">Discover what&apos;s possible at {school.name}.</p>
                    <Link href="/admissions" className="bg-[#f3e600] text-black px-10 py-4 font-bold hover:bg-white transition-colors">
                        View Application Guide
                    </Link>
                </div>
            </section>
        </div>
    );
}

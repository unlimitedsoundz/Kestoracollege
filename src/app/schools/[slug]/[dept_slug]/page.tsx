
import { createStaticClient } from '@/lib/supabase/static';
// Static export does not support revalidate = 0
import Link from 'next/link';
import Image from 'next/image';
import { Department, School, Faculty, Course } from '@/types/database';
import { notFound } from 'next/navigation';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: depts } = await supabase
        .from('Department')
        .select('slug, school:School!inner(slug)');

    if (!depts) return [];

    const params: { slug: string, dept_slug: string }[] = [];

    for (const d of depts as any[]) {
        if (Array.isArray(d.school)) {
            for (const s of d.school) {
                params.push({ slug: s.slug, dept_slug: d.slug });
            }
        } else if (d.school) {
            params.push({ slug: d.school.slug, dept_slug: d.slug });
        }
    }

    return params;
}

interface Props {
    params: Promise<{
        slug: string; // school slug
        dept_slug: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { dept_slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: dept } = await supabase
        .from('Department')
        .select('name, description, school:School(name)')
        .eq('slug', dept_slug)
        .single();

    return {
        title: dept ? `${dept.name} — ${(Array.isArray(dept.school) ? dept.school[0] : dept.school)?.name || 'School'} | Kestora College` : 'Department | Kestora College',
        description: dept?.description?.substring(0, 160) || `Learn about the ${dept?.name} at Kestora College. Research, faculty, and academic programs.`,
    };
}

export default async function DepartmentDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const { slug, dept_slug } = resolvedParams;
    const supabase = createStaticClient();

    // 1. Fetch Department by slug
    const { data: deptData, error } = await supabase
        .from('Department')
        .select(`
        *,
        school:School!inner(slug, name, id) 
    `)
        // Inner join ensures we only get if school slug also matches (if we filtered by it)
        // But standardized way: Filter by dept_slug, verify school slug match below or in query.
        // Simplifying: Just query dept by slug.
        .eq('slug', dept_slug)
        .single();

    if (error || !deptData) {
        if (error?.code !== 'PGRST116') console.error('Error fetching dept:', error);
        notFound();
    }

    const deptRaw = deptData as any;
    const school = Array.isArray(deptRaw.school) ? deptRaw.school[0] : deptRaw.school;

    if (!school || school.slug !== slug) {
        if (!school) console.error('School data missing for dept:', dept_slug);
        else if (school.slug !== slug) console.error(`Slug mismatch: expected ${slug}, got ${school.slug}`);
        notFound();
    }

    const dept = { ...deptRaw, school } as Department & { school: School };

    // 2. Fetch Related Faculty
    const { data: faculty } = await supabase
        .from('Faculty')
        .select('*')
        .eq('departmentId', dept.id);

    // 3. Fetch Related Courses
    const { data: courses } = await supabase
        .from('Course')
        .select('*')
        .eq('departmentId', dept.id);

    // Color Mapping
    const deptColors: Record<string, string> = {
        'accounting-business-law': '#2F4F4F',
        'applied-physics': '#4B0082',
        'automation-control': '#696969',
        'architecture': '#e31837',
        'art-media': '#C71585',
        'chemical-materials': '#4682B4',
        'civil-environmental': '#A0522D',
        'computer-science-digital': '#000080',
        'design': '#d94f00',
        'economics': '#4A4A4A',
        'electrical-electronics': '#191970',
        'energy-mechanical': '#b83b00',
        'film-tv': '#1a1a1a',
        'finance': '#2d3748',
        'info-service': '#6495ED',
        'management': '#800000',
        'marketing': '#663399',
        'physics-math': '#0000CD',
    };

    // Fallback logic: Try exact slug, then check if slug contains key words
    let heroColor = deptColors[dept.slug] || '#171717'; // Default neutral-900

    // If no direct match, try to fuzzy match for new depts not in list
    if (!deptColors[dept.slug]) {
        if (dept.slug.includes('engineering')) heroColor = '#4682B4';
        else if (dept.slug.includes('science')) heroColor = '#000080';
        else if (dept.slug.includes('arts')) heroColor = '#e31837';
        else if (dept.slug.includes('business')) heroColor = '#2F4F4F';
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION (Split Layout) */}
            <section style={{ backgroundColor: heroColor }} className="text-white overflow-hidden transition-colors duration-700">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-32 pb-4 md:pt-48 lg:py-0 lg:h-[650px] relative">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            {dept.name}
                        </h1>
                        <p className="text-xl text-white/90 max-w-xl leading-relaxed">
                            {dept.description || "Advancing knowledge and innovation through world-class research and education."}
                        </p>

                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative mt-8 lg:mt-0 lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800 shadow-2xl overflow-hidden">
                            {/* Image or Placeholder */}
                            {dept.imageUrl ? (
                                <Image
                                    src={dept.imageUrl}
                                    alt={dept.name}
                                    fill
                                    priority
                                    className="object-cover opacity-90"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    {/* Text Placeholder if no image */}
                                    {/* User requested 'image placeholder and no icons'. We can use a pattern or just a solid color with text. */}
                                    <div className="text-center z-10 p-8 border border-white/10 p-12">
                                        <span className="block text-6xl font-black text-white/10 mb-4 tracking-tighter">
                                            {dept.name.substring(0, 2).toUpperCase()}
                                        </span>
                                        <p className="text-white/40 uppercase tracking-[0.2em] text-sm">Department Image</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Back Navigation (Below Hero) */}
            <div className="container mx-auto px-4 py-6">
                <Link href={`/schools/${slug}`} className="inline-flex items-center gap-2 text-neutral-500 hover:text-black font-bold uppercase tracking-widest text-xs transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to {dept.school.name}
                </Link>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content: Study Programs */}
                <div className="lg:col-span-2">
                    <section id="programs" className="scroll-mt-32">
                        <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                            Study Programs
                        </h2>
                        <div className="space-y-4">
                            {courses?.map((course) => (
                                <Link
                                    href={`/studies/${course.slug}`}
                                    key={course.id}
                                    className="block p-8 rounded-lg border border-neutral-200 bg-white"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900 mb-1">{course.title}</h3>
                                            <p className="text-neutral-500 text-sm line-clamp-2">{course.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${course.degreeLevel === 'MASTER' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'}`}>
                                            {course.degreeLevel}
                                        </span>
                                    </div>
                                    <div className="flex gap-6 text-sm text-neutral-500 pl-1">
                                        <span>{course.duration}</span>
                                        <span>{course.language}</span>
                                    </div>
                                </Link>
                            ))}
                            {(!courses || courses.length === 0) && (
                                <p className="text-neutral-500">No courses currently listed for this department.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Faculty */}
                <aside className="lg:col-span-1">
                    <section id="faculty" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 pb-10 pl-2">
                            Faculty
                        </h2>
                        <div className="space-y-6">
                            {faculty?.map((member) => (
                                <div key={member.id} className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-neutral-900">{member.name}</h4>
                                        <p className="text-neutral-700 text-sm font-medium mb-1">{member.role}</p>
                                        <p className="text-xs text-neutral-500 line-clamp-2">{member.bio}</p>
                                        {member.email && (
                                            <a href={`mailto:${member.email}`} className="text-xs text-neutral-400 hover:text-blue-600 mt-1 block">
                                                {member.email}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!faculty || faculty.length === 0) && (
                                <p className="text-neutral-500">No faculty listings available.</p>
                            )}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

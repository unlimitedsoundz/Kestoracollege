import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import { Course, Subject, Faculty, School, Department } from '@/types/database';
import { notFound } from 'next/navigation';
import TableOfContents from '@/components/course/TableOfContents';
import { Clock, ChatTeardropText as MessageCircle, GraduationCap, CurrencyEur as Euro, ArrowLeft, CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: courses } = await supabase.from('Course').select('slug');
    return courses?.map(({ slug }) => ({ slug })) || [];
}

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: course } = await supabase
        .from('Course')
        .select('name, description, degreeType, ects')
        .eq('slug', slug)
        .single();

    if (!course) {
        return {
            title: 'Course Not Found',
        };
    }

    return {
        title: `${course.name} — ${course.degreeType} | SYKLI College`,
        description: course.description?.substring(0, 160) || `Study ${course.name} (${course.degreeType}, ${course.ects} ECTS) at SYKLI College.`,
    };
}

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export default async function CourseDetailPage({ params }: Props) {
    const { slug } = await params;

    const supabase = createStaticClient();

    // Fetch course with related data
    const { data: course, error } = await supabase
        .from('Course')
        .select(`
      *,
      school:School(*),
      department:Department(*),
      subjects:Subject(*)
    `)
        .eq('slug', slug)
        .single();

    if (error || !course) {
        if (error?.code !== 'PGRST116') { // not found error
            console.error('Error fetching course:', error);
        }
        notFound();
    }

    // Fetch faculty separately since they are linked to Department, not Course directly in our current schema partial
    // (Schema check: Faculty has departmentId. Course has departmentId.)
    let relatedFaculty: Faculty[] = [];
    if (course.departmentId) {
        const { data: facultyData } = await supabase
            .from('Faculty')
            .select('*')
            .eq('departmentId', course.departmentId)
            .limit(3);
        if (facultyData) relatedFaculty = facultyData;
    }

    const c = course as Course & { subjects: Subject[], school: School, department: Department };

    const schoolStyleMap: Record<string, { bg: string, text: string, accent: string }> = {
        'business': { bg: 'bg-indigo-950', text: 'text-white', accent: 'text-neutral-400' },
        'arts': { bg: 'bg-white', text: 'text-neutral-900', accent: 'text-neutral-500' },
        'technology': { bg: 'bg-emerald-950', text: 'text-white', accent: 'text-neutral-400' },
        'science': { bg: 'bg-cyan-950', text: 'text-white', accent: 'text-neutral-400' },
        'default': { bg: 'bg-neutral-900', text: 'text-white', accent: 'text-neutral-400' }
    };

    const style = schoolStyleMap[c.school?.slug || 'default'] || schoolStyleMap.default;
    const isLight = c.school?.slug === 'arts';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.name,
        description: course.description,
        provider: {
            '@type': 'EducationalOrganization',
            name: 'SYKLI College',
            sameAs: 'https://www.syklicollege.fi'
        },
        educationalCredentialAwarded: course.degreeType,
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'Blended',
            courseWorkload: `P${course.ects}M` // ISO 8601 duration format approximation
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Studies', item: '/studies' },
                { name: c.title, item: `/studies/${c.slug}` }
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header Section */}
            <div className={`${style.bg} ${style.text} relative overflow-hidden text-balance`}>
                {!isLight && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />}
                {isLight && <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.05),transparent)]" />}

                <div className="container mx-auto px-4 pt-32 pb-12 md:pt-48 relative z-10">

                    <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium">
                        <span className={`${isLight ? 'bg-neutral-100' : 'bg-neutral-800'} px-3 py-1 rounded-full`}>{c.degreeLevel}</span>
                        <span className={`${isLight ? 'bg-neutral-200' : 'bg-neutral-700'} px-3 py-1 rounded-full`}>{c.school?.name}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl pt-8">{c.title}</h1>
                    <div className={`flex flex-wrap gap-8 ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                        <div className="flex items-center gap-3">
                            <Clock className={style.accent} size={24} weight="regular" />
                            <div>
                                <p className={`text-xs uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Duration</p>
                                <p className="font-semibold">{c.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MessageCircle className={style.accent} size={24} weight="regular" />
                            <div>
                                <p className={`text-xs uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Language</p>
                                <p className="font-semibold">{c.language}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <GraduationCap className={style.accent} size={24} weight="regular" />
                            <div>
                                <p className={`text-xs uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Credits</p>
                                <p className="font-semibold">{c.credits || c.subjects?.reduce((acc, s) => acc + s.creditUnits, 0) || 0} ECTS</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Back Navigation */}
            <div className="container mx-auto px-4 py-6">
                <Link
                    href={c.school && c.department ? `/schools/${c.school.slug}/${c.department.slug}` : '/studies'}
                    className="text-neutral-500 hover:text-black text-sm font-bold tracking-wide uppercase inline-flex items-center gap-2"
                >
                    <ChevronLeft size={16} weight="bold" /> {c.department ? `Back to ${c.department.name}` : 'Back to Programs'}
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Sidebar (TOC + Requirements) - First on mobile */}
                <div className="lg:order-2 space-y-8">
                    {c.sections ? (
                        <TableOfContents sections={c.sections} />
                    ) : (
                        <div className="bg-neutral-100 p-6 lg:sticky lg:top-8 rounded-2xl">
                            {/* Default Sidebar Content */}
                            <h3 className="text-xl font-bold mb-6">Entry Requirements</h3>
                            <div className="space-y-4 text-sm text-neutral-600 mb-8">
                                <div className="flex gap-3">
                                    <span className="text-neutral-800 text-lg">✓</span>
                                    <p>{c.entryRequirements}</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-neutral-800 text-lg">✓</span>
                                    <p>Minimum Grade: <span className="font-semibold text-neutral-900">{c.minimumGrade || 'N/A'}</span></p>
                                </div>
                            </div>

                            <Link
                                href="/admissions"
                                className="block w-full bg-neutral-900 text-white text-center py-4 rounded-none font-bold hover:bg-neutral-800 transition-colors"
                            >
                                Apply Now
                            </Link>
                        </div>
                    )}

                    {relatedFaculty.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">Program Faculty</h3>
                            <div className="space-y-4">
                                {relatedFaculty.map(f => (
                                    <div key={f.id} className="flex items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-neutral-900 text-sm">{f.name}</p>
                                            <p className="text-xs text-neutral-500">{f.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content - Second on mobile, first on desktop */}
                <div className="lg:col-span-2 lg:order-1 space-y-8">
                    {c.sections ? (
                        /* Dynamic Sections Rendering */
                        <div className="space-y-8">
                            {c.sections.map((section: any) => (
                                <section key={section.id} id={section.id} className="scroll-mt-24">
                                    <h2 className="text-2xl font-bold mb-4 text-neutral-900 pb-10 pl-2">{section.title}</h2>
                                    <div
                                        className="prose prose-lg text-neutral-600 max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </section>
                            ))}
                        </div>
                    ) : (
                        /* Default Rendering */
                        <>
                            <section>
                                <h2 className="text-2xl font-bold mb-4 text-neutral-900 pb-10 pl-2">Program Overview</h2>
                                <div className="prose prose-lg text-neutral-600 max-w-none">
                                    <p>{c.description}</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-6 text-neutral-900 pb-10 pl-2">Curriculum</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-neutral-100 text-neutral-900 uppercase tracking-wider font-bold">
                                            <tr>
                                                {c.subjects?.[0]?.code && <th className="p-4 border-r-0">Code</th>}
                                                {c.subjects?.[0]?.area && <th className="p-4 border-r-0">Area</th>}
                                                <th className="p-4 border-r-0">Subject Name</th>
                                                <th className="p-4 border-r-0">ECTS</th>
                                                {c.subjects?.[0]?.eligibility && <th className="p-4">Eligibility</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-200">
                                            {c.subjects?.sort((a, b) => (a.code || a.name).localeCompare(b.code || b.name)).map((subject) => (
                                                <tr key={subject.id} className="hover:bg-neutral-100 transition-colors">
                                                    {subject.code && <td className="p-4 text-neutral-600 border-r border-neutral-100">{subject.code}</td>}
                                                    {subject.area && <td className="p-4 font-bold border-r border-neutral-100">{subject.area}</td>}
                                                    <td className="p-4 border-r border-neutral-100">
                                                        <div className="font-medium text-neutral-900">{subject.name}</div>
                                                        {subject.semester && !subject.area && <div className="text-xs text-neutral-500 mt-1">Semester {subject.semester}</div>}
                                                    </td>
                                                    <td className="p-4 border-r border-neutral-100">{subject.creditUnits}</td>
                                                    {subject.eligibility && <td className="p-4 text-neutral-500">{subject.eligibility}</td>}
                                                </tr>
                                            ))}
                                            {(!c.subjects || c.subjects.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="p-8 text-center text-neutral-500 italic">No subjects listed yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4 text-neutral-900 pb-10 pl-2">Career Prospects</h2>
                                <div className="bg-neutral-100 p-6 rounded-xl">
                                    <p className="text-neutral-900 font-medium mb-2">Potential Roles:</p>
                                    <p className="text-neutral-700">{c.careerPaths}</p>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

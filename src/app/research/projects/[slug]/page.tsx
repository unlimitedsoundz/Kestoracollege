
import { createStaticClient } from '@/lib/supabase/static';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from 'next';

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: projects } = await supabase.from('ResearchProject').select('slug');
    return projects?.map(({ slug }) => ({ slug })) || [];
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createStaticClient();
    const { data: project } = await supabase.from('ResearchProject').select('title, description').eq('slug', slug).single();

    if (!project) return { title: 'Project Not Found' };

    return {
        title: `${project.title} | SYKLI Research`,
        description: project.description
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = createStaticClient();
    const { data: project } = await supabase
        .from('ResearchProject')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!project) notFound();

    return (
        <article className="min-h-screen bg-white">
            {/* Hero / Header */}
            <div className="bg-neutral-900 text-white py-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">

                    <div className="mb-4">
                        <span className="bg-neutral-800 border border-neutral-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                            {project.fundingSource || 'Internal Project'}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl leading-tight pt-8">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-neutral-300">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">Lead:</span> {project.leadResearcher}
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Published: {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                {/* Background Image if available */}
                {project.imageUrl && (
                    <div className="absolute inset-0 z-0 select-none">
                        <img
                            src={project.imageUrl}
                            alt=""
                            className="w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply" />
                    </div>
                )}

                {/* Abstract bg element (fallback or extra texture) */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neutral-800 to-transparent opacity-30 pointer-events-none z-0" />
            </div>

            {/* Back Nav */}
            <div className="container mx-auto px-4 py-6">
                <Link href="/research/projects" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black font-bold uppercase tracking-widest text-xs transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to Projects
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <div className="prose prose-lg max-w-none text-neutral-800">
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {project.content}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

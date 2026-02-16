'use client';

import { createClient } from '@/utils/supabase/client';
import { notFound, useRouter } from 'next/navigation';
import { CaretLeft as ArrowLeft, FloppyDisk as Save, CircleNotch as Loader2 } from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect, use } from 'react';

export default function ResearchProjectEditor({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const isNew = id === 'new';
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchProject = async () => {
            if (isNew) {
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase.from('ResearchProject').select('*').eq('id', id).single();
                if (error || !data) {
                    console.error("Project not found");
                    return;
                }
                setProject(data);
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, isNew]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            leadResearcher: formData.get('leadResearcher') as string,
            fundingSource: formData.get('fundingSource') as string,
            description: formData.get('description') as string,
            content: formData.get('content') as string,
        };

        try {
            if (isNew) {
                const { error } = await supabase.from('ResearchProject').insert(data);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('ResearchProject').update(data).eq('id', id);
                if (error) throw error;
            }
            router.push('/admin/research/projects');
            router.refresh();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Error saving project");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (!isNew && !project) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <Link href="/admin/research/projects" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 transition-colors font-bold">
                <ArrowLeft size={18} weight="bold" /> Back to Projects
            </Link>

            <h1 className="text-3xl font-bold mb-8 uppercase tracking-tight text-neutral-900">
                {isNew ? 'New Research Project' : `Edit: ${project?.title}`}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            defaultValue={project?.title || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                            placeholder="e.g. Carbon Neutral Construction 2030"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            defaultValue={project?.slug || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-mono text-sm"
                            placeholder="e.g. carbon-neutral-2030"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Lead Researcher</label>
                        <input
                            type="text"
                            name="leadResearcher"
                            defaultValue={project?.leadResearcher || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                            placeholder="e.g. Dr. Sarah Mitchell"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Funding Source</label>
                        <input
                            type="text"
                            name="fundingSource"
                            defaultValue={project?.fundingSource || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                            placeholder="e.g. EU Horizon"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Short Description</label>
                    <textarea
                        name="description"
                        required
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all h-24 font-bold"
                        defaultValue={project?.description || ''}
                        placeholder="Brief summary shown on the listing page..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Full Content</label>
                    <textarea
                        name="content"
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all h-64 font-mono text-sm"
                        defaultValue={project?.content || ''}
                        placeholder="Markdown content or HTML..."
                    />
                    <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">HTML or Markdown supported.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Cover Image Link (URL)</label>
                    {project?.imageUrl && (
                        <div className="w-32 h-32 relative mb-2 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                            <img src={project.imageUrl} alt="Current" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <input
                        type="text"
                        name="imageUrl"
                        defaultValue={project?.imageUrl || ''}
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-mono text-xs"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-xl disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} weight="bold" /> : <Save size={18} weight="bold" />}
                        {isNew ? 'Create Project' : 'Update Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}

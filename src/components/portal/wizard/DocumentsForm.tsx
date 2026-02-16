'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { addApplicationDocument, deleteApplicationDocument, updateApplicationStep } from '@/app/portal/actions';
import { ApplicationDocument, DocumentType } from '@/types/database';
import { CaretRight as ChevronRight, CircleNotch as Loader2, UploadSimple as Upload, Trash, FileText, CheckCircle, WarningCircle as AlertCircle } from "@phosphor-icons/react";

interface Props {
    applicationId: string;
    existingDocuments: ApplicationDocument[];
    onUpdate?: () => Promise<void>;
}

const DOCUMENT_TYPES: { type: DocumentType; label: string; description: string; required: boolean }[] = [
    { type: 'PASSPORT', label: 'Passport / ID', description: 'Copy of your valid passport or national ID card.', required: true },
    { type: 'TRANSCRIPT', label: 'Academic Transcript', description: 'Official transcript from your previous institution.', required: true },
    { type: 'CERTIFICATE', label: 'Degree Certificate', description: 'Copy of your degree certificate or diploma.', required: true },
    { type: 'CV', label: 'Curriculum Vitae (CV)', description: 'Updated CV detailing your experience and education.', required: true },
    { type: 'MOTIVATION_LETTER', label: 'Motivation Letter / Statement of Purpose', description: 'A brief letter explaining why you chose this programme.', required: true },
    { type: 'LANGUAGE_CERT', label: 'English Proficiency', description: 'IELTS/TOEFL or equivalent (if applicable).', required: false },
];

export default function DocumentsForm({ applicationId, existingDocuments, onUpdate }: Props) {
    const [uploading, setUploading] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const requiredTypes = DOCUMENT_TYPES.filter(d => d.required).map(d => d.type);
    const uploadedTypes = existingDocuments.map(d => d.type);
    const allRequiredUploaded = requiredTypes.every(type => uploadedTypes.includes(type));

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple validation
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large. Max 5MB.');
            return;
        }

        setUploading(type);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${applicationId}/${type}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('application-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Use public URL since we made it easier, in production we might use signed URLs
            const { data: { publicUrl } } = supabase.storage
                .from('application-documents')
                .getPublicUrl(filePath);

            await addApplicationDocument(applicationId, type, publicUrl, file.name);

            if (onUpdate) await onUpdate();
            // Trigger parent refresh to update progress
            router.refresh();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(null);
        }
    };

    const handleDelete = async (docId: string, url: string) => {
        setDeleting(docId);
        try {
            // Extract storage path from public URL
            const path = url.split('application-documents/').pop();
            if (!path) throw new Error('Invalid file URL');

            await deleteApplicationDocument(applicationId, docId, path);
            if (onUpdate) await onUpdate();
            router.refresh();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {DOCUMENT_TYPES.map((docType) => {
                    const doc = existingDocuments.find(d => d.type === docType.type);
                    const isUploading = uploading === docType.type;

                    return (
                        <div key={docType.type} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white gap-4 rounded-sm border border-neutral-100">
                            <div className="flex-1 text-left">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                                    {docType.label} {docType.required && <span className="text-red-500">*</span>}
                                    {doc && <CheckCircle className="text-primary" size={14} weight="bold" />}
                                </h3>
                                <p className="text-[10px] text-[#2d2d2d] font-medium uppercase tracking-tight">{docType.description}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {doc ? (
                                    <div className="flex items-center gap-2 border border-primary/20 p-2 px-3 rounded-sm">
                                        <FileText size={14} weight="regular" className="text-primary" />
                                        <span className="text-xs font-medium truncate max-w-[120px] text-primary">{doc.name}</span>
                                        <button
                                            onClick={() => handleDelete(doc.id, doc.url)}
                                            disabled={!!deleting}
                                            className="text-[#2d2d2d] hover:text-red-500 transition-colors p-1"
                                        >
                                            {deleting === doc.id ? <Loader2 className="animate-spin" size={14} weight="bold" /> : <Trash size={14} weight="regular" />}
                                        </button>
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer border border-primary text-primary px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {isUploading ? <Loader2 className="animate-spin" size={14} weight="bold" /> : <Upload size={14} weight="bold" />}
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, docType.type)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!allRequiredUploaded && (
                <div className="border border-amber-200 rounded-sm p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={16} weight="bold" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-amber-900 leading-none">Requirements missing</p>
                        <p className="text-xs text-amber-700/80 font-medium mt-1 leading-tight">Please upload all mandatory documents marked with * to proceed.</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                    <Link
                        href={`?id=${applicationId}&step=5`}
                        className="text-[#2d2d2d] hover:text-primary font-semibold text-xs uppercase tracking-widest transition-colors"
                    >
                        Back
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.push('/portal/dashboard')}
                        className="text-[#2d2d2d] hover:text-primary font-semibold text-xs uppercase tracking-widest transition-colors"
                    >
                        Save & Exit
                    </button>
                </div>

                <button
                    onClick={async () => {
                        setIsSaving(true);
                        router.push(`?id=${applicationId}&step=7`);
                        setIsSaving(false);
                    }}
                    disabled={!allRequiredUploaded || isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-[#00A651] text-white px-8 py-4 rounded-sm text-xs font-semibold uppercase tracking-widest hover:bg-[#008c44] transition-all disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="animate-spin" size={16} weight="bold" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Continue
                            <ChevronRight size={16} weight="bold" />
                        </>
                    )}
                </button>
            </div>
        </div >
    );
}

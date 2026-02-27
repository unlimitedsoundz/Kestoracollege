
import { CheckCircle, X } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Entry Requirements — Kestora College | GPA, English Proficiency & Documents',
    description: 'Admissions requirements for Kestora College. GPA thresholds, English proficiency (IELTS/TOEFL), required documents, and eligibility criteria for international applicants.',
};

export default function RequirementsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-20">
                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 block">Admissions</span>
                <h1 className="text-5xl font-bold mb-12">Entry Requirements</h1>

                <div className="grid md:grid-cols-2 gap-16">
                    <section>
                        <h2 className="text-3xl font-bold mb-10 border-b border-black pb-10 pl-2">Bachelor's Degrees</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full border border-black flex items-center justify-center flex-shrink-0"><CheckCircle size={14} weight="bold" /></div>
                                <div>
                                    <h4 className="font-bold">Upper Secondary Education</h4>
                                    <p className="text-neutral-600 text-sm">Certificate of Matriculation or equivalent foreign qualification.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full border border-black flex items-center justify-center flex-shrink-0"><CheckCircle size={14} weight="bold" /></div>
                                <div>
                                    <h4 className="font-bold">English Proficiency</h4>
                                    <p className="text-neutral-600 text-sm">IELTS 6.0, TOEFL iBT 60, or equivalent.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full border border-black flex items-center justify-center flex-shrink-0"><CheckCircle size={14} weight="bold" /></div>
                                <div>
                                    <h4 className="font-bold">Entrance Exam / SAT</h4>
                                    <p className="text-neutral-600 text-sm">Applying via SAT scores is possible for all Engineering programs.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-10 border-b border-black pb-10 pl-2">Master's Degrees</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full border border-black flex items-center justify-center flex-shrink-0"><CheckCircle size={14} weight="bold" /></div>
                                <div>
                                    <h4 className="font-bold">Bachelor's Degree</h4>
                                    <p className="text-neutral-600 text-sm">In a relevant field of study.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full border border-black flex items-center justify-center flex-shrink-0"><CheckCircle size={14} weight="bold" /></div>
                                <div>
                                    <h4 className="font-bold">Work Experience</h4>
                                    <p className="text-neutral-600 text-sm">Minimum of 2 years of relevant post-graduation work experience.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full border border-black flex items-center justify-center flex-shrink-0"><CheckCircle size={14} weight="bold" /></div>
                                <div>
                                    <h4 className="font-bold">Motivation Video</h4>
                                    <p className="text-neutral-600 text-sm">A 2-minute video introducing yourself and your goals.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

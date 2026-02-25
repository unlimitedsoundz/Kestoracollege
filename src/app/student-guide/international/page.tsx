
import { CheckCircle, Globe, Briefcase, Heart, MapPin, GraduationCap, ArrowRight, Question as HelpCircle } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import Image from 'next/image';
import TableOfContents from '@/components/course/TableOfContents';

export const metadata = {
    title: 'International Students Guide | SYKLI College',
    description: 'Practical guide for international students: permits, housing, moving to Finland, and settling in.',
};

const tocSections = [
    { id: 'intro', title: 'Purpose of Guide', content: '' },
    { id: 'why-finland', title: 'Why Study in Finland', content: '' },
    { id: 'admission', title: 'After Admission', content: '' },
    { id: 'arrival', title: 'After Arrival', content: '' },
    { id: 'living', title: 'Living in Finland', content: '' },
    { id: 'graduation', title: 'After Graduation', content: '' },
    { id: 'faq', title: 'FAQ', content: '' },
    { id: 'support', title: 'Support Services', content: '' },
];

import { SchemaLD } from '@/components/seo/SchemaLD';

export default function InternationalGuidePage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is orientation mandatory?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, it provides essential info for starting your studies. All students are expected to attend the sessions during the first week."
                }
            },
            {
                "@type": "Question",
                "name": "Can I bring my family?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, family members can apply for residence permits based on family ties. However, the student permit applicant must demonstrate sufficient financial resources for the entire family's stay."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <SchemaLD data={faqSchema} />

            {/* Hero Section */}
            <div className="w-full h-[60vh] relative bg-neutral-900 overflow-hidden">
                <Image
                    src="/images/1770771721770-019c4a37-870f-7df8-812a-5bad23d5cb9f.png"
                    alt="International Students"
                    fill
                    priority
                    className="object-cover opacity-60"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 pt-8">
                            International Students
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-2xl leading-relaxed">
                            Practical guidance for your journey to Finland and SYKLI College.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24">
                            <TableOfContents sections={tocSections} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-20">

                        {/* Purpose */}
                        <section id="intro" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Purpose of This Guide</h2>
                            <p className="text-lg text-black leading-relaxed max-w-3xl">
                                This section of the Student Guide provides international degree and exchange students with practical guidance on what to do after admission and after arrival in Finland. It covers practicalities related to living, studying, travel, and settling in Finland. It should be read together with the general new student instructions.
                            </p>
                        </section>

                        {/* Why Finland */}
                        <section id="why-finland" className="scroll-mt-32">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold text-black tracking-tight">Why Study in Finland?</h2>
                                    <div className="space-y-4 text-lg text-black leading-relaxed">
                                        <p>
                                            Finland is consistently ranked among the happiest countries in the world, reflecting its strong social stability, high quality of life, and commitment to equality, integrity, and openness. These values are deeply embedded in everyday life and public institutions.
                                        </p>
                                        <p>
                                            The Finnish education system is internationally recognized as one of the most advanced in the world. Finnish students have repeatedly performed at the top of global PISA assessments, highlighting the country’s emphasis on quality, innovation, and student-centered learning.
                                        </p>
                                        <p>
                                            Finland uniquely balances cutting-edge technology with a strong connection to nature. As Europe’s most forested country, it offers extensive public access to natural spaces, allowing everyone to explore, relax, and enjoy outdoor activities freely.
                                        </p>
                                        <p>
                                            Nature is also an integral part of life in the capital city, Helsinki. The city is safe, compact, and located by the sea, combining vibrant urban culture with easy access to green spaces. With over 70,000 university students, Helsinki provides a dynamic student environment with diverse leisure opportunities and comprehensive student services.
                                        </p>
                                        <p className="font-bold text-black border-l-2 border-black pl-5 py-1">
                                            SYKLI College operates across four campuses within the city, along with 15 additional locations across Finland and internationally, offering a broad and flexible academic environment.
                                        </p>

                                        <div className="pt-6 space-y-4">
                                            <a
                                                href="https://www.visitfinland.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all group"
                                            >
                                                <Globe size={20} weight="regular" className="text-neutral-400 group-hover:text-white transition-colors" />
                                                <div>
                                                    <span className="block font-bold">Visit Finland</span>
                                                    <span className="text-xs text-white">Official travel guide to Finland</span>
                                                </div>
                                                <ArrowRight size={16} weight="bold" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                            <a
                                                href="https://finland.fi"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:border-black transition-all group"
                                            >
                                                <Globe size={20} weight="regular" className="text-neutral-400 group-hover:text-black transition-colors" />
                                                <div>
                                                    <span className="block font-bold">thisisFINLAND</span>
                                                    <span className="text-xs text-black">Information related to the Finnish society</span>
                                                </div>
                                                <ArrowRight size={16} weight="bold" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl border border-neutral-100">
                                        <Image
                                            src="/images/news/helsinki_study_hero_1771086684833.png"
                                            alt="International students exploring Helsinki, Finland"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 40vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* After Admission */}
                        <section id="admission" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">1</span>
                                Practical Things to Do After Admission
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-10 border border-neutral-200 rounded-2xl hover:border-black transition-colors">
                                    <Globe className="mb-4 text-neutral-900" size={32} weight="regular" />
                                    <h3 className="text-xl font-bold mb-3">Residence Permits & Insurance</h3>
                                    <p className="text-neutral-600 mb-4">
                                        International students who require a student residence permit should apply immediately. Check health insurance requirements as part of the permit application.
                                    </p>
                                    <Link href="https://migri.fi/en/home" className="text-sm font-bold underline">Visit Migri.fi for details</Link>
                                </div>

                                <div className="p-10 border border-neutral-200 rounded-2xl hover:border-black transition-colors">
                                    <MapPin className="mb-4 text-neutral-900" size={32} weight="regular" />
                                    <h3 className="text-xl font-bold mb-3">Housing</h3>
                                    <p className="text-neutral-600">
                                        Arrange accommodation before arrival. Explore student housing associations (e.g., HOAS, AYY) or private market options early.
                                    </p>
                                </div>

                                <div className="p-10 border border-neutral-200 rounded-2xl hover:border-black transition-colors">
                                    <Briefcase className="mb-4 text-neutral-900" size={32} weight="regular" />
                                    <h3 className="text-xl font-bold mb-3">Financial Matters</h3>
                                    <p className="text-neutral-600">
                                        Plan for local costs and banking. Ensure you have access to funds upon arrival before setting up a Finnish bank account.
                                    </p>
                                </div>

                                <div className="p-10 border border-neutral-200 rounded-2xl hover:border-black transition-colors">
                                    <GraduationCap className="mb-4 text-neutral-900" size={32} weight="regular" />
                                    <h3 className="text-xl font-bold mb-3">Tuition Fees & Scholarships</h3>
                                    <p className="text-neutral-600 mb-4">
                                        Policies apply to non-EU/EEA/Swiss citizens. Check scholarship opportunities for fee support.
                                    </p>
                                    <Link href="/admissions/tuition" className="text-sm font-bold underline">See Tuition Info</Link>
                                </div>
                            </div>
                        </section>

                        {/* After Moving */}
                        <section id="arrival" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">2</span>
                                After Moving to Finland
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Local Transportation</h3>
                                    <p className="text-neutral-700 leading-relaxed mb-4">
                                        Public transport is punctual and extensive. Students are typically entitled to discounted travel on buses, trains, trams, and metro systems (HSL/VR).
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Registering with Authorities</h3>
                                    <div className="bg-neutral-50 p-10 pl-16 rounded-xl border-l-4 border-black mb-6">
                                        <p className="mb-3"><strong>EU/EEA Citizens:</strong> Register right of residence at DVV.</p>
                                        <p><strong>Non-EU/EEA:</strong> Must have residence permit card. Visit DVV for municipality of residence registration.</p>
                                    </div>
                                    <div className="mb-8">
                                        <Link
                                            href="/student-guide/arrival"
                                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm"
                                        >
                                            View Official Arrival Guide <ArrowRight size={14} weight="bold" />
                                        </Link>
                                    </div>
                                    <p className="text-neutral-700 mt-4">Once registered, you can open a Finnish bank account for easier transactions (paying rent, bills, etc.).</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Post-Arrival Checklist</h3>
                                    <ul className="space-y-3 list-disc pl-5 marker:text-neutral-300 text-neutral-700">
                                        <li className="pl-2">Pick up keys for housing</li>
                                        <li className="pl-2">Register at DVV (Digital and Population Data Services Agency)</li>
                                        <li className="pl-2">Pay Student Union fee (if applicable)</li>
                                        <li className="pl-2">Get HSL transport card</li>
                                        <li className="pl-2">Attend Orientation Week</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Campus Services</h3>
                                    <p className="text-neutral-700">
                                        Access libraries, study spaces, student lounges, counseling, dining services, and student union activities immediately upon enrolment.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Living in Finland */}
                        <section id="living" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">3</span>
                                Living in Finland
                            </h2>
                            <div className="mb-10">
                                <div className="relative aspect-square rounded-xl overflow-hidden max-w-md">
                                    <Image
                                        src="/images/news/helsinki_study_hero_1771086631952.png"
                                        alt="Students enjoying life in Helsinki, Finland"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 448px"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Student Health Care (FSHS)</h3>
                                    <p className="text-neutral-700 text-sm">
                                        Attending degree students must pay the healthcare fee to <a href="https://www.kela.fi/in-english" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition-colors">Kela</a>. This grants access to the Finnish Student Health Service (FSHS) for general, mental, and oral health care.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Local Culture</h3>
                                    <p className="text-neutral-700 text-sm">
                                        Finland is safe and equal. English is widely spoken. Learning Finnish is encouraged for cultural integration but not essential for daily life.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Working</h3>
                                    <p className="text-neutral-700 text-sm">
                                        International students can often work part-time (usually up to 30h/week on average). Knowledge of Finnish improves employability significantly.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Studying Finnish</h3>
                                    <p className="text-neutral-700 text-sm">
                                        Language courses are available for all levels. It enhances job prospects and understanding of the local environment.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* After Graduation */}
                        <section id="graduation" className="scroll-mt-32 bg-neutral-900 text-white p-10 rounded-3xl">
                            <h2 className="text-3xl font-bold mb-6">After Graduation</h2>
                            <p className="text-neutral-300 leading-relaxed max-w-2xl mb-8">
                                SYKLI College supports your transition to working life. We offer resources for job seeking, career guidance, and alumni networking both in Finland and internationally.
                            </p>
                            <Link href="#" className="inline-flex items-center gap-2 font-bold hover:underline">
                                Explore Career Services <ArrowRight size={18} weight="bold" />
                            </Link>
                        </section>

                        {/* FAQ */}
                        <section id="faq" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-0">
                                <div className="py-6">
                                    <h4 className="font-bold mb-3 text-lg text-black">Is orientation mandatory?</h4>
                                    <p className="text-black leading-relaxed">Yes, it provides essential info for starting your studies. All students are expected to attend the sessions during the first week.</p>
                                </div>
                                <div className="py-6">
                                    <h4 className="font-bold mb-3 text-lg text-black">Can I bring my family?</h4>
                                    <p className="text-black leading-relaxed">Yes, family members can apply for residence permits based on family ties. However, the student permit applicant must demonstrate sufficient financial resources for the entire family's stay.</p>
                                </div>
                            </div>
                            <div className="mt-8 bg-neutral-50 p-6 rounded-xl flex items-center gap-4">
                                <HelpCircle size={32} weight="regular" />
                                <div>
                                    <h4 className="font-bold">International Student Newsletters</h4>
                                    <p className="text-sm text-neutral-600">Check your email for regular updates, tips, and reminders.</p>
                                </div>
                            </div>
                        </section>

                        {/* Support Services */}
                        <section id="support" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8">Support Services</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-neutral-50 p-8 rounded-xl">
                                    <h4 className="font-bold mb-3">Peer Advice</h4>
                                    <p className="text-sm text-neutral-600">Connect with current international students for practical tips on student life.</p>
                                </div>
                                <div className="bg-neutral-50 p-8 rounded-xl">
                                    <h4 className="font-bold mb-3">Student Services Desk</h4>
                                    <p className="text-sm text-neutral-600">General guidance on academic procedures and registration.</p>
                                </div>
                                <div className="bg-neutral-50 p-8 rounded-xl">
                                    <h4 className="font-bold mb-3">Study & Stay</h4>
                                    <p className="text-sm text-neutral-600">Specialised career support to help you plan your career in Finland.</p>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

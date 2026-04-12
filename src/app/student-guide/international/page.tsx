
import { CheckCircle, Globe, Briefcase, Heart, MapPin, GraduationCap, ArrowRight, Question as HelpCircle, Users } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import Image from 'next/image';
import TableOfContents from '@/components/course/TableOfContents';
import InternationalStudentFAQ from '@/components/admissions/InternationalStudentFAQ';

export const metadata = {
    title: 'International Students Guide | Kestora University',
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
                    src="/images/international-students-hero.png"
                    alt="International Students"
                    fill
                    priority
                    className="object-cover opacity-70"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-black backdrop-blur-md border border-gray-300 text-sm font-medium mb-6">
                            <span>Global Community</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 pt-8">
                            International Students
                        </h1>
                        <p className="text-xl text-gray-100 max-w-2xl leading-relaxed">
                            Practical guidance for your journey to Finland and Kestora University.
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
                            <h2 className="text-3xl font-bold mb-6 text-black">Purpose of This Guide</h2>
                            <p className="text-lg text-gray-800 leading-relaxed max-w-3xl">
                                This section of the Student Guide provides international degree and exchange students with practical guidance on what to do after admission and after arrival in Finland. It covers practicalities related to living, studying, travel, and settling in Finland. It should be read together with the general new student instructions.
                            </p>
                        </section>

                        {/* Why Finland */}
                        <section id="why-finland" className="scroll-mt-32">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                     <h2 className="text-3xl font-bold text-black tracking-tight">Why Study in Finland?</h2>
                                     <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
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
                                         <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-2xl">
                                             <p className="font-bold text-black">
                                                Kestora University operates across four campuses within the city, along with 15 additional locations across Finland and internationally, offering a broad and flexible academic environment.
                                            </p>
                                        </div>

                                        <div className="pt-6 space-y-4">
                                             <a
                                                 href="https://www.visitfinland.com"
                                                 target="_blank"
                                                 rel="noopener noreferrer"
                                                 className="flex items-center gap-3 p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-md group border border-gray-700"
                                             >
                                                 <Globe size={24} weight="regular" className="text-gray-300 group-hover:text-white transition-colors shrink-0" />
                                                 <div>
                                                     <span className="block font-bold">Visit Finland</span>
                                                     <span className="text-xs text-gray-200">Official travel guide to Finland</span>
                                                 </div>
                                                <ArrowRight size={16} weight="bold" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                            </a>
                                             <a
                                                 href="https://finland.fi"
                                                 target="_blank"
                                                 rel="noopener noreferrer"
                                                 className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group"
                                             >
                                                 <Globe size={24} weight="regular" className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                                                 <div>
                                                     <span className="block font-bold text-black">thisisFINLAND</span>
                                                     <span className="text-xs text-gray-600">Information related to the Finnish society</span>
                                                 </div>
                                                <ArrowRight size={16} weight="bold" className="ml-auto text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
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
                             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-black">
                                 <span className="bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md">1</span>
                                 Practical Things to Do After Admission
                             </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                 <div className="p-10 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                                     <h3 className="text-xl font-bold mb-3 text-black relative z-10">Residence Permits & Insurance</h3>
                                     <p className="text-gray-700 mb-6 relative z-10">
                                        International students who require a student residence permit should apply immediately. Check health insurance requirements as part of the permit application.
                                    </p>
                                     <Link href="https://migri.fi/en/home" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-800 group-hover:translate-x-1 transition-all relative z-10">
                                        Visit Migri.fi for details <ArrowRight size={16} />
                                    </Link>
                                </div>

                                 <div className="p-10 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                                     <h3 className="text-xl font-bold mb-3 text-black relative z-10">Housing</h3>
                                     <p className="text-gray-700 relative z-10">
                                        Arrange accommodation before arrival. Explore student housing associations (e.g., HOAS, AYY) or private market options early.
                                    </p>
                                </div>

                                 <div className="p-10 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                                     <h3 className="text-xl font-bold mb-3 text-black relative z-10">Financial Matters</h3>
                                     <p className="text-gray-700 relative z-10">
                                        Plan for local costs and banking. Ensure you have access to funds upon arrival before setting up a Finnish bank account.
                                    </p>
                                </div>

                                 <div className="p-10 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                                     <h3 className="text-xl font-bold mb-3 text-black relative z-10">Tuition Fees & Scholarships</h3>
                                     <p className="text-gray-700 mb-6 relative z-10">
                                        Policies apply to non-EU/EEA/Swiss citizens. Check scholarship opportunities for fee support.
                                    </p>
                                     <Link href="/admissions/tuition" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-700 group-hover:translate-x-1 transition-all relative z-10">
                                        See Tuition Info <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* After Moving */}
                        <section id="arrival" className="scroll-mt-32 relative">
                             <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -mx-4 sm:-mx-8 md:-mx-12 px-4 sm:px-8 md:px-12 py-16 rounded-3xl -z-10" />
                             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-black">
                                 <span className="bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md">2</span>
                                 After Moving to Finland
                             </h2>

                            <div className="space-y-8">
                                <div>
                                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Local Transportation</h3>
                                     <p className="text-gray-700 leading-relaxed mb-4">
                                        Public transport is punctual and extensive. Students are typically entitled to discounted travel on buses, trains, trams, and metro systems (HSL/VR).
                                    </p>
                                </div>

                                <div>
                                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Registering with Authorities</h3>
                                     <div className="bg-white p-8 md:p-10 pl-16 rounded-2xl border-l-4 border-gray-500 shadow-sm mb-6 relative">
                                         <div className="absolute left-4 top-10 text-gray-500">
                                             <CheckCircle size={24} weight="fill" />
                                         </div>
                                         <p className="mb-4 text-black"><strong className="text-gray-900">EU/EEA Citizens:</strong> Register right of residence at DVV.</p>
                                         <p className="text-black"><strong className="text-gray-900">Non-EU/EEA:</strong> Must have residence permit card. Visit DVV for municipality of residence registration.</p>
                                     </div>
                                    <div className="mb-8">
                                         <Link
                                             href="/student-guide/arrival"
                                             className="inline-flex items-center gap-2 bg-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                         >
                                            View Official Arrival Guide <ArrowRight size={20} weight="bold" />
                                        </Link>
                                    </div>
                                     <p className="text-gray-700 mt-4">Once registered, you can open a Finnish bank account for easier transactions (paying rent, bills, etc.).</p>
                                 </div>

                                 <div>
                                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Post-Arrival Checklist</h3>
                                     <ul className="space-y-3">
                                         {[
                                             "Pick up keys for housing",
                                             "Register at DVV (Digital and Population Data Services Agency)",
                                             "Pay Student Union fee (if applicable)",
                                             "Get HSL transport card",
                                             "Attend Orientation Week"
                                         ].map((item, i) => (
                                             <li key={i} className="flex items-center gap-3 text-gray-700">
                                                 <CheckCircle size={20} className="text-gray-500 shrink-0" weight="fill" />
                                                 <span>{item}</span>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>

                                 <div>
                                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Campus Services</h3>
                                     <p className="text-gray-700">
                                        Access libraries, study spaces, student lounges, counseling, dining services, and student union activities immediately upon enrolment.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Living in Finland */}
                        <section id="living" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-black">
                                 <span className="bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md">3</span>
                                 Living in Finland
                             </h2>
                            <div className="mb-10">
                                 <div className="relative aspect-[21/9] rounded-2xl overflow-hidden max-w-4xl shadow-lg border border-gray-100">
                                    <Image
                                        src="/images/news/helsinki_study_hero_1771086631952.png"
                                        alt="Students enjoying life in Helsinki, Finland"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 896px"
                                    />
                                </div>
                            </div>
                             <div className="grid md:grid-cols-2 gap-8">
                                 <div className="space-y-3 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                                     <h3 className="text-xl font-bold text-black">Student Health Care</h3>
                                     <p className="text-gray-600 text-sm leading-relaxed">
                                         Attending degree students must pay the healthcare fee to <a href="https://www.kela.fi/in-english" target="_blank" rel="noopener noreferrer" className="text-gray-600 font-bold underline hover:text-gray-800 transition-colors">Kela</a>. This grants access to the Finnish Student Health Service (FSHS) for general, mental, and oral health care.
                                     </p>
                                 </div>
                                 <div className="space-y-3 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                                     <h3 className="text-xl font-bold text-black">Local Culture</h3>
                                     <p className="text-gray-600 text-sm leading-relaxed">
                                         Finland is safe and equal. English is widely spoken. Learning Finnish is encouraged for cultural integration but not essential for daily life.
                                     </p>
                                 </div>
                                 <div className="space-y-3 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                                     <h3 className="text-xl font-bold text-black">Working</h3>
                                     <p className="text-gray-600 text-sm leading-relaxed">
                                         International students can often work part-time (usually up to 30h/week on average). Knowledge of Finnish improves employability significantly.
                                     </p>
                                 </div>
                                 <div className="space-y-3 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                                     <h3 className="text-xl font-bold text-black">Studying Finnish</h3>
                                     <p className="text-gray-600 text-sm leading-relaxed">
                                         Language courses are available for all levels. It enhances job prospects and understanding of the local environment.
                                     </p>
                                 </div>
                             </div>
                        </section>

                        {/* After Graduation */}
                         <section id="graduation" className="scroll-mt-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-10 md:p-16 rounded-3xl relative overflow-hidden shadow-xl">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                             <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">After Graduation</h2>
                             <p className="text-gray-100 text-lg leading-relaxed max-w-2xl mb-10 relative z-10">
                                Kestora University supports your transition to working life. We offer resources for job seeking, career guidance, and alumni networking both in Finland and internationally.
                            </p>
                             <Link href="#" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all relative z-10">
                                Explore Career Services <ArrowRight size={20} weight="bold" />
                            </Link>
                        </section>

                        {/* FAQ */}
                        <section id="faq" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-8 text-black">Frequently Asked Questions</h2>
                             <InternationalStudentFAQ />
                             <div className="mt-8 bg-gray-50 p-6 md:p-8 rounded-2xl flex items-start gap-4 border border-gray-100/50">
                                 <div>
                                     <h4 className="font-bold text-black text-lg mb-1">International Student Newsletters</h4>
                                     <p className="text-gray-700 leading-relaxed">Check your student email regularly for updates, exclusive tips, and important deadlines.</p>
                                 </div>
                             </div>
                        </section>

                        {/* Support Services */}
                        <section id="support" className="scroll-mt-32">
                             <h2 className="text-3xl font-bold mb-8 text-black">Support Services</h2>
                             <div className="grid md:grid-cols-3 gap-6">
                                 <div className="bg-white border border-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-100 transition-all">
                                     <h4 className="font-bold mb-3 text-black text-xl">Peer Advice</h4>
                                     <p className="text-gray-600 leading-relaxed">Connect with current international students for practical tips on student life.</p>
                                 </div>
                                 <div className="bg-white border border-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-100 transition-all">
                                     <h4 className="font-bold mb-3 text-black text-xl">Service Desk</h4>
                                     <p className="text-gray-600 leading-relaxed">General guidance on academic procedures, enrollment, and registration.</p>
                                 </div>
                                 <div className="bg-white border border-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-100 transition-all">
                                     <h4 className="font-bold mb-3 text-black text-xl">Study & Stay</h4>
                                     <p className="text-gray-600 leading-relaxed">Specialised career support to help you plan your career and integrate in Finland.</p>
                                 </div>
                             </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

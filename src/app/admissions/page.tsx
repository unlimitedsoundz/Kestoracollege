
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import TableOfContents from '@/components/course/TableOfContents';
import StudentStoriesCarousel from '@/components/admissions/StudentStoriesCarousel';

export const metadata = {
    title: 'Admissions | Sykli College',
    description: 'Overview of admissions, degree programmes, and student life at Sykli College.',
};

const tocSections = [
    { id: 'overview', title: 'Explore our fields', content: '' },
    { id: 'degree-programmes', title: 'Degree Programmes', content: '' },
    { id: 'how-to-apply', title: 'How to Apply', content: '' },
    { id: 'events', title: 'Events for Applicants', content: '' },
    { id: 'student-stories', title: 'Student Stories', content: '' },
    { id: 'campus', title: 'Studying on Campus', content: '' },
    { id: 'careers', title: 'Career Opportunities', content: '' },
    { id: 'online-opportunities', title: 'Online & Onsite', content: '' },
    { id: 'student-life', title: 'Student Life', content: '' },
    { id: 'study-in-finland', title: 'Study in Finland', content: '' },
    { id: 'multidisciplinary', title: 'Multidisciplinary', content: '' },
    { id: 'lifelong', title: 'Lifelong Learning', content: '' },
    { id: 'summer', title: 'Summer Education', content: '' },
    { id: 'collaboration', title: 'Collaboration', content: '' },
    { id: 'contact', title: 'Contact & Support', content: '' },
];

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export default function AdmissionsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Admissions', item: '/admissions' }
            ]} />


            {/* HERO SECTION (Orange Split - Match Home Layout) */}
            <section className="bg-[#fd6402] text-black overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-20 h-[767px] lg:h-[600px] lg:py-0 relative mb-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-2 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight pt-8">
                            Admissions to SYKLI College
                        </h1>
                        <p className="text-[21px] text-neutral-800 max-w-xl leading-relaxed">
                            Apply to SYKLI College and begin your Bachelor’s or Master’s studies in an internationally focused learning environment. Our admissions process is transparent, supportive, and open to students from around the world.
                        </p>
                        <div className="space-y-3 pt-2">
                            <Link href="#how-to-apply" className="flex items-center gap-2 font-bold hover:underline group">
                                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" /> Apply Now
                            </Link>
                            <Link href="#degree-programmes" className="flex items-center gap-2 font-bold hover:underline group">
                                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" /> Explore Programmes
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-16 z-20 flex justify-center lg:block">
                        <div className="h-full">
                            <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800">
                                <Image
                                    src="/images/admissions/hero-new.jpg"
                                    alt="International students exploring Sykli College campus"
                                    fill
                                    priority
                                    className="object-cover opacity-90"
                                    sizes="(max-width: 1024px) 368px, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Table of Contents */}
                    <div className="lg:col-span-3">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <TableOfContents sections={tocSections} />
                            <div className="bg-black text-white p-10 pl-16 rounded-none border-l-4 border-[#fd6402]">
                                <h3 className="font-bold text-lg mb-2 text-white">Admissions Office</h3>
                                <p className="text-sm text-neutral-300 mb-4">Questions? We are here to help.</p>
                                <Link href="/contact" className="text-sm font-bold underline text-[#fd6402] hover:text-white transition-colors">Contact Us</Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8 md:space-y-24 px-0 md:px-0">

                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Explore our fields</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                                Studying at Sykli College offers a rich academic experience where innovation, multidisciplinary collaboration, and student community thrive together. You can pursue degree education at all levels Bachelor’s and Master’s as well as various lifelong learning options. In the Sykli College community, students have the freedom to specialise in one field or combine courses across several fields.
                            </p>
                        </section>

                        <section id="degree-programmes" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Degree Programmes & Fields of Study</h2>
                            <p className="text-lg text-neutral-700 mb-6">Sykli College offers degree programmes across multiple fields:</p>
                            <div className="grid md:grid-cols-3 gap-6 mb-6">
                                <div className="bg-neutral-100 p-10">
                                    <h3 className="font-bold text-xl mb-2">Business and Economics</h3>
                                </div>
                                <div className="bg-neutral-100 p-10">
                                    <h3 className="font-bold text-xl mb-2">Arts, Design and Creative Industries</h3>
                                </div>
                                <div className="bg-neutral-100 p-10">
                                    <h3 className="font-bold text-xl mb-2">Engineering, Technology and Sciences</h3>
                                </div>
                            </div>
                            <p className="text-neutral-700">
                                Students can pursue degrees in their chosen field or explore courses across fields, gaining new perspectives and collaborative opportunities as part of a multidisciplinary community.
                            </p>
                        </section>

                        <section id="how-to-apply" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">How to Apply</h2>
                            <p className="text-lg text-neutral-700 mb-6">You can explore admissions details and requirements for:</p>
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <Link href="/admissions/bachelor" className="flex-1 bg-black text-white p-10 hover:bg-neutral-800 transition-colors group">
                                    <h3 className="font-bold text-xl mb-2 flex justify-between items-center">Bachelor's Admissions <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" /></h3>
                                    <p className="text-neutral-400">Undergraduate programmes in English</p>
                                </Link>
                                <Link href="/admissions/master" className="flex-1 bg-black text-white p-10 hover:bg-neutral-800 transition-colors group">
                                    <h3 className="font-bold text-xl mb-2 flex justify-between items-center">Master's Admissions <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" /></h3>
                                    <p className="text-neutral-400">Graduate programmes and advanced studies</p>
                                </Link>
                            </div>
                            <p className="text-neutral-700">
                                The application process, deadlines, and eligibility criteria vary by degree level and study option. Full details can be found in the Sykli College admissions guide.
                            </p>
                        </section>

                        <section id="events" className="scroll-mt-32 bg-black text-white p-12 rounded-3xl relative overflow-hidden">
                            <h2 className="text-3xl font-bold mb-6 text-white">Events for Applicants</h2>
                            <p className="text-neutral-300 mb-8">Sykli College regularly organises events designed to help prospective students learn more about studying and applying:</p>
                            <ul className="space-y-4">
                                {[
                                    { title: "Webinars on degree programmes", desc: "Interact with programme heads and faculty" },
                                    { title: "Student chats", desc: "Peer ambassadors share study experiences" },
                                    { title: "Campus events", desc: "Tailored to applicants" },
                                    { title: "Applicant newsletters", desc: "And Q&A sessions" },
                                ].map((item) => (
                                    <li key={item.title} className="flex gap-4 items-start border-l-2 border-[#fd6402] pl-8">
                                        <div>
                                            <strong className="block text-lg text-white">{item.title}</strong>
                                            <span className="text-neutral-400">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section id="student-stories" className="scroll-mt-32">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Student Stories</h2>
                                <p className="text-lg text-neutral-700 mb-8">
                                    Hear first-hand experiences from current students and alumni about life at Sykli College, academic projects, internships, and perspectives on how the College supports personal and professional growth.
                                </p>
                            </div>
                            <StudentStoriesCarousel />
                        </section>

                        <section id="campus" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Studying on Campus</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Sykli College’s campus provides vibrant learning spaces, studios, libraries, and collaborative hubs where students experience academic life and community activities. The campus environment supports both study and leisure, encouraging a balanced student experience.
                            </p>
                        </section>

                        <section id="careers" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Career Opportunities</h2>
                            <p className="text-lg text-neutral-700 mb-8">
                                Sykli College offers support and services to help students plan and pursue careers after graduation. Our strong industry ties ensure your education translates into real-world success.
                            </p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { title: "Industry Collaboration", image: "/images/pexels-fauxels-3184291--1-.jpg", desc: "Work on real projects with our global partners.", credit: "Fauxels" },
                                    { title: "Alumni Networks", image: "/images/admissions/alumni_success.png", desc: "Connect with graduates working in leading industries.", credit: "Saara Virtanen" },
                                    { title: "Career Services", image: "/images/admissions/career_tools_digital.png", desc: "Expert guidance for your professional journey.", credit: "Markus Hakala" }
                                ].map(item => (
                                    <div key={item.title} className="bg-neutral-100 flex flex-col group">
                                        <div className="h-56 w-full relative overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={`${item.title} at Sykli College`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-10">
                                            <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                                            <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="online-opportunities" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Explore Online and Onsite Opportunities</h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Webinars on Degree Programmes</h3>
                                    <p className="text-neutral-700">Prospective students can join interactive webinars where programme content, learning outcomes, and study paths are explained by faculty and programme heads.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Podcasts About Studying</h3>
                                    <p className="text-neutral-700">Listen to podcasts where current students and staff discuss what it’s like to study at Sykli College, how programmes are structured, and tips for success.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Chat with Students</h3>
                                    <p className="text-neutral-700">Student ambassadors are available for online chats and Q&A sessions for prospective students, offering realistic insights into student life, academics and campus culture.</p>
                                </div>
                            </div>
                        </section>

                        <section id="student-life" className="scroll-mt-32">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl font-bold mb-4">Student Life</h2>
                                    <p className="text-lg text-neutral-700 leading-relaxed">
                                        Discover stories and highlights about student life, community projects, extracurricular activities, and how students grow beyond academics at Sykli College.
                                    </p>
                                </div>
                                <Link href="/student-life" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:bg-black hover:text-white transition-all">
                                    Full Student Guide
                                </Link>
                            </div>
                            <div className="relative h-[400px] w-full overflow-hidden group">
                                <Image
                                    src="/images/admissions/student_life_events.png"
                                    alt="Students enjoying a community event at Sykli College"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-8 md:p-16">
                                    <div className="max-w-md text-white">
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-[#fd6402]">Vibrant Community</p>
                                        <h3 className="text-3xl font-bold mb-4">Life Beyond the Classroom</h3>
                                        <p className="text-neutral-200">From music festivals to tech hackathons, your time at Sykli is about more than just studies.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="study-in-finland" className="scroll-mt-32">
                            <div className="bg-black text-white overflow-hidden">
                                <div className="grid md:grid-cols-2">
                                    <div className="p-12 md:p-16 flex flex-col justify-center">
                                        <h2 className="text-3xl font-bold mb-8">Study in Finland with Sykli College</h2>
                                        <ul className="space-y-6 mb-8">
                                            {[
                                                { title: "Quality & Safety", desc: "World-leading education in a safe, equal society." },
                                                { title: "Practical Innovation", desc: "Focus on independent study and real-world application." },
                                                { title: "Life Balance", desc: "Flexibility to shape your own unique academic path." }
                                            ].map(item => (
                                                <li key={item.title} className="flex gap-4">
                                                    <div className="w-1.5 h-1.5 bg-[#fd6402] mt-2 flex-shrink-0" />
                                                    <div>
                                                        <strong className="block text-lg mb-1">{item.title}</strong>
                                                        <span className="text-neutral-400 text-sm">{item.desc}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/student-guide/international" className="inline-flex items-center gap-2 font-bold hover:text-[#fd6402] transition-colors">
                                            Read our International Student Guide <ArrowRight size={18} weight="bold" />
                                        </Link>
                                    </div>
                                    <div className="relative h-[400px] md:h-auto min-h-[400px]">
                                        <Image
                                            src="/images/admissions/finland_bus.jpg"
                                            alt="Finland Campus"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="multidisciplinary" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Multidisciplinary Study Environment</h2>
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1">
                                    <p className="text-lg text-neutral-700 mb-4">
                                        Sykli College encourages cross-field learning. You can take courses in areas such as business, arts, technology, and design, enabling you to create a personalised and comprehensive academic pathway.
                                    </p>
                                    <p className="text-neutral-700">
                                        Students are encouraged to combine studies across fields to gain broader perspectives and prepare for diverse career environments.
                                    </p>
                                </div>
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fd6402] to-rose-400 flex items-center justify-center font-bold text-white text-xs text-center p-2">
                                    Cross-Pollination
                                </div>
                            </div>
                        </section>

                        <section id="lifelong" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Lifewide and Lifelong Learning</h2>
                            <p className="text-lg text-neutral-700 mb-8">Education is a journey that never ends. Explore our flexible learning paths:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { title: "Professional Modules", image: "/images/admissions/lifelong_learning_adult.png", desc: "Deepen your expertise with specialized short courses.", credit: "Timo Partanen" },
                                    { title: "Online Learning", image: "/images/admissions/online_learning.png", desc: "Flexible content accessible from anywhere in the world.", credit: "Emma Laakso" },
                                    { title: "Campus Workshops", image: "/images/admissions/workshop.png", desc: "Hands-on learning in our state-of-the-art labs.", credit: "Janne Salmi" },
                                    { title: "Custom Training", image: "/images/admissions/custom_training.png", desc: "Tailored solutions for organizational growth.", credit: "Sonja Mikkola" }
                                ].map(item => (
                                    <div key={item.title} className="flex flex-col md:flex-row bg-neutral-100 overflow-hidden group">
                                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-all duration-700"
                                            />
                                        </div>
                                        <div className="md:w-2/3 p-6 flex flex-col justify-center">
                                            <h4 className="font-bold text-lg mb-2 group-hover:text-black transition-colors">{item.title}</h4>
                                            <p className="text-sm text-neutral-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="summer" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Summer and Continuing Education</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Sykli College hosts summer courses and programmes that allow students and professionals to deepen specific skills and knowledge in compact, high-impact formats. These programmes offer valuable opportunities for networking and learning from experienced faculty and industry experts.
                            </p>
                        </section>

                        <section id="collaboration" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6">Collaboration and Community</h2>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                                Sykli College actively partners with industries, research institutions, and international universities to provide students with collaborative projects, internships, and global exchange opportunities.
                            </p>
                            <p className="text-neutral-700">
                                Students benefit from a connected academic community that supports innovation, entrepreneurship and real-world problem solving.
                            </p>
                        </section>


                        <section id="contact" className="scroll-mt-32 mb-24 -mx-4 md:mx-0">
                            <div className="bg-black text-white p-12">
                                <p className="text-lg mb-6">
                                    Prospective and current students can find support and contact information for admissions, campus visits, and student services through the official Sykli College contact pages.
                                </p>
                                <p className="text-neutral-300 mb-6">
                                    Whether you’re planning a campus visit or seeking guidance on admissions, resources are available to help guide your academic journey.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/contact" className="inline-block bg-white text-black px-8 py-3 font-bold hover:bg-neutral-200 transition-colors">
                                        Contact Us
                                    </Link>
                                    <Link href="/admissions-policy" className="inline-block border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors">
                                        Admissions Policy
                                    </Link>
                                    <Link href="/academic-regulations" className="inline-block border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors">
                                        Academic Regulations
                                    </Link>
                                    <Link href="/student-handbook" className="inline-block border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors">
                                        Student Handbook
                                    </Link>
                                    <Link href="/code-of-conduct" className="inline-block border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors">
                                        Code of Conduct
                                    </Link>
                                    <Link href="/refund-withdrawal-policy/" className="inline-block border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors">
                                        Refund Policy
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}

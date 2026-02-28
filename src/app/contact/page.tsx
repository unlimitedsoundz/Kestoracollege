
import { Metadata } from 'next';
import Link from 'next/link';
import { Envelope as Mail, Phone, MapPin, Clock, Building, Globe, FileText, CreditCard } from "@phosphor-icons/react/dist/ssr";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

export const metadata: Metadata = {
    title: 'Contact Information | Kestora College',
    description: 'Contact details for Kestora College including Registry, Admissions, Student Services, and general inquiries.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-neutral-50 pb-10 md:pb-20">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Contact', item: '/contact' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contact Kestora College",
                "url": "https://kestora.online/contact",
                "mainEntity": {
                    "@type": "EducationalOrganization",
                    "name": "Kestora College",
                    "email": "Kestora@kestora.online",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Pohjoisesplanadi 51",
                        "addressLocality": "Helsinki",
                        "postalCode": "00150",
                        "addressCountry": "FI"
                    }
                }
            }} />
            {/* Hero Section */}
            <section className="bg-black text-white pt-32 pb-10 md:pt-48 md:pb-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-8">Contact Information</h1>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Kestora College provides contact information for administrative services including Registry, Admissions,
                        Student Services and general inquiries to support students, applicants, staff and partners.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Main Info & Services */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Switchboard */}
                    <section className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Phone className="w-6 h-6 text-neutral-900" weight="regular" />
                            Main Switchboard
                        </h2>
                        <div className="space-y-4">
                            <p className="text-lg font-medium text-neutral-900">+358 20 4721 739</p>
                            <p className="text-neutral-600">(General enquiries and guidance to appropriate services)</p>
                        </div>
                        <div className="mt-8 pt-8">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-neutral-500" weight="regular" />
                                Postal Address
                            </h3>
                            <address className="not-italic text-neutral-600 leading-relaxed">
                                Kestora College – Helsinki Campus<br />
                                Pohjoisesplanadi 51,<br />
                                00150 Helsinki, Uusimaa,<br />
                                Finland
                            </address>
                        </div>
                    </section>

                    {/* Key Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Registry Office */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                            <h3 className="text-xl font-bold mb-4">Registry Office</h3>
                            <p className="text-sm text-neutral-600 mb-4">
                                Responsible for receiving official correspondence and documentation.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Mail className="w-4 h-4" />
                                    <a href="mailto:registry@kestora.online" className="hover:text-neutral-900 hover:underline transition-colors">registry@kestora.online</a>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <MapPin className="w-4 h-4" weight="regular" />
                                    <span className="text-sm">Kestora College – Helsinki Campus, Pohjoisesplanadi 51</span>
                                </div>
                            </div>
                        </div>

                        {/* Admissions Services */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                            <h3 className="text-xl font-bold mb-4">Admissions Services</h3>
                            <p className="text-sm text-neutral-600 mb-4">
                                Information on programmes, applications, scholarships, and deadlines.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Mail className="w-4 h-4" />
                                    <a href="mailto:admissions@kestora.online" className="hover:text-neutral-900 hover:underline transition-colors">admissions@kestora.online</a>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Phone className="w-4 h-4" />
                                    <span>+358 20 4721 739</span>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-500 text-sm mt-2">
                                    <Clock className="w-4 h-4" weight="regular" />
                                    <span>Check website for hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Student Services */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                            <h3 className="text-xl font-bold mb-4">Student Services</h3>
                            <p className="text-sm text-neutral-600 mb-4">
                                Support for enrolled students including study planning and wellbeing.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Mail className="w-4 h-4" />
                                    <a href="mailto:studentservices@kestora.online" className="hover:text-neutral-900 hover:underline transition-colors">studentservices@kestora.online</a>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Phone className="w-4 h-4" />
                                    <span>+358 20 4721 739</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">Operates appointment & walk-in hours.</p>
                            </div>
                        </div>

                        {/* Archives */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                            <h3 className="text-xl font-bold mb-4">Archives</h3>
                            <p className="text-sm text-neutral-600 mb-4">
                                Storage of permanent records and official documentation.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Mail className="w-4 h-4" />
                                    <a href="mailto:archives@kestora.online" className="hover:text-neutral-900 hover:underline transition-colors">archives@kestora.online</a>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-700">
                                    <Phone className="w-4 h-4" />
                                    <span>+358 20 4721 739</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Academic Schools */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Building className="w-6 h-6 text-neutral-900" weight="regular" />
                            Schools and Departments
                        </h2>
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link href="/schools/arts" className="p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                    <h4 className="font-semibold text-lg mb-1">School of Arts, Design and Architecture</h4>
                                    <span className="text-sm text-neutral-500 group-hover:text-neutral-900">View Contact Details →</span>
                                </Link>
                                <Link href="/schools/science" className="p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                    <h4 className="font-semibold text-lg mb-1">School of Science</h4>
                                    <span className="text-sm text-neutral-500 group-hover:text-neutral-900">View Contact Details →</span>
                                </Link>
                                <Link href="/schools/technology" className="p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                    <h4 className="font-semibold text-lg mb-1">School of Technology</h4>
                                    <span className="text-sm text-neutral-500 group-hover:text-neutral-900">View Contact Details →</span>
                                </Link>
                                <Link href="/schools/business" className="p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                    <h4 className="font-semibold text-lg mb-1">School of Business</h4>
                                    <span className="text-sm text-neutral-500 group-hover:text-neutral-900">View Contact Details →</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Additional Info */}
                <div className="space-y-8">

                    {/* Business Info - Neutralized */}
                    <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" weight="regular" />
                            Business Information
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block font-medium text-neutral-900">Business ID</span>
                                <span className="text-neutral-600">9996326-7</span>
                            </div>
                        </div>
                    </div>

                    {/* Invoicing - Removed styling to match request "remove stlying, this section Invoicing" 
                I will make it plain (no bg-white, no border) or merge with above? 
                User said "remove stlying... use neutral theme". I'll keep it structural but remove the 'card' look.
                Actually, consistency is key. Keep the structure but maybe lighter borders?
                The user specifically pointed out "remove stlying" for this section. 
                I'll remove the bg-white and border/shadow loop for this specific block to make it blend into the page bg?
                Or just make it consistent neutral.
                Let's stick to the card layout but strictly neutral (gray borders, no shadows).
            */}

                    {/* Related Services Links */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-neutral-900" weight="regular" />
                            Related Services
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Career Services', href: '/student-guide/international#after-graduation' },
                                { name: 'International Office', href: '/student-guide/international' },
                                { name: 'Research and Innovation Services', href: '/research' },
                                { name: 'Alumni Relations', href: '/alumni' },
                                { name: 'Media and Communications', href: '/news' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="flex justify-between items-center text-neutral-600 hover:text-neutral-900 transition-colors group">
                                        <span>{item.name}</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Campus Info Stub - Neutral Theme */}
                    <div className="p-6 rounded-xl bg-neutral-100 border border-neutral-200">
                        <h3 className="font-bold text-lg mb-2 text-neutral-900">Campus Maps</h3>
                        <p className="text-sm text-neutral-700 mb-4">
                            Find your way around our learning spaces, labs, and studios.
                        </p>
                        <button className="text-sm font-semibold text-neutral-900 hover:underline">
                            View Campus Maps
                        </button>
                    </div>

                </div>
            </div>

            {/* Bottom Policy Links */}
            <div className="container mx-auto px-4 mt-10 md:mt-20 pt-6 md:pt-10 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-500 mb-4 uppercase tracking-wider">Policies & Transparency</h3>
                <div className="flex flex-wrap gap-6 text-sm">
                    <Link href="/privacy" className="text-neutral-600 hover:text-black">Privacy Policy</Link>
                    <Link href="/cookies" className="text-neutral-600 hover:text-black">Cookie Policy</Link>
                    <Link href="/accessibility" className="text-neutral-600 hover:text-black">Accessibility Statement</Link>
                    <Link href="/terms" className="text-neutral-600 hover:text-black">Terms of Use</Link>
                </div>
            </div>

        </main>
    );
}

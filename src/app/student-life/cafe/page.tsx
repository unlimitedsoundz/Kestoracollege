
import Image from 'next/image';
import Link from 'next/link';
import { ForkKnife as Utensils, Clock, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Opiskelija Café — Kestora College Student Restaurant | Menu & Hours',
    description: 'Visit the Opiskelija Café at Kestora College Helsinki. Affordable student meals, coffee, and pastries. View the menu, opening hours, and location.',
};

export default function CafePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900 leading-relaxed">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center bg-neutral-900 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop"
                    alt="Opiskelija Cafe Atmosphere"
                    fill
                    priority
                    className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 pt-20">
                    <div className="max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                            Campus Dining & Social
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                            Opiskelija Cafe
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-300 font-medium max-w-2xl leading-relaxed">
                            A cozy sanctuary for student nourishment, artisanal coffee, and collaborative moments.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Info Bar */}
            <section className="border-b border-neutral-100 py-6 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <Clock className="text-neutral-400" size={20} weight="regular" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Opening Hours</p>
                                <p className="text-sm font-bold">Mon–Fri: 08:30 – 16:30</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Utensils className="text-neutral-400" size={20} weight="regular" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Lunch Service</p>
                                <p className="text-sm font-bold">Daily: 11:00 – 14:00</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-neutral-400" size={20} weight="regular" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Location</p>
                                <p className="text-sm font-bold">Main Campus, South Wing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Concept Section */}
            <section className="py-20 md:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
                                alt="Coffee and Pastries"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                                Curated Flavors, <br />
                                <span className="text-neutral-400">Locally Sourced</span>
                            </h2>
                            <p className="text-lg text-neutral-600 leading-relaxed font-light">
                                Our daily menu is crafted with seasonally fresh ingredients from local suppliers. We believe that good food fuels great minds, focusing on nutritious, sustainable, and hearty meals.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-widest mb-4">Daily Brunch</h4>
                                    <p className="text-sm text-neutral-500 font-light">Organic sourdough, seasonal fruits, and our signature avocado tartines.</p>
                                </div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-widest mb-4">Artisan Roast</h4>
                                    <p className="text-sm text-neutral-500 font-light">Direct trade beans roasted locally in small batches. Expertly pulled espresso.</p>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link href="#" className="inline-flex items-center gap-4 py-4 px-8 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-sm">
                                    View Weekly Menu <ArrowRight size={16} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Atmosphere Section */}
            <section className="py-20 bg-neutral-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">Your Cozy Corner on Campus</h2>
                        <p className="text-lg text-neutral-500 font-light">
                            Whether you're finishing a thesis, meeting for a group project, or simply finding a moment of calm our space is designed for comfort and connection.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer shadow-lg">
                            <Image
                                src="/images/unnamed (18).jpg"
                                alt="Silent Study"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Silent Study</h4>
                            </div>
                        </div>
                        <div className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer shadow-lg">
                            <Image
                                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800&auto=format&fit=crop"
                                alt="Lounge Area"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Lounge Soft Seating</h4>
                            </div>
                        </div>
                        <div className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer shadow-lg">
                            <Image
                                src="/images/unnamed (20).jpg"
                                alt="Summer Terrace"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Summer Terrace</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Catering Section */}
            <section className="py-20 md:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="bg-black text-white p-8 md:p-20 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                            <Image
                                src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop"
                                alt="Catering Service"
                                fill
                                className="object-cover opacity-50 contrast-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
                        </div>

                        <div className="relative z-10 max-w-xl">
                            <div className="text-neutral-400 mb-8 font-black uppercase tracking-widest text-xs">
                                <span>Events & Gatherings</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                                Exceptional Catering for Your Projects
                            </h2>
                            <p className="text-lg text-neutral-400 font-light mb-10 leading-relaxed">
                                From intimate academic seminars to large-scale conferences and faculty events. We provide elegant, professional catering tailored to your specific requirements.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact" className="py-4 px-10 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-sm text-center">
                                    Request Proposal
                                </Link>
                                <Link href="#" className="py-4 px-10 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-sm text-center">
                                    Catering Menu
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Tiny Detail */}
            <section className="py-12 border-t border-neutral-100 italic font-serif text-neutral-400 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-sm">"The warmest spot on campus, especially during the Finnish winter months."</p>
                </div>
            </section>
        </div>
    );
}

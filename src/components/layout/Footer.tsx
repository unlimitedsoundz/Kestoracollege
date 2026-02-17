'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/Logo"
import { LinkedinLogo as Linkedin, TiktokLogo as TikTok, EnvelopeSimple, MapPin } from "@phosphor-icons/react"


export function Footer() {
    const pathname = usePathname();
    const isPortalOrAdmin = pathname.startsWith('/portal') || pathname.startsWith('/admin')

    if (isPortalOrAdmin) return null;
    return (
        <footer className="bg-black text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 pt-16 pb-10">

                {/* Top Row: Brand + Social */}
                <div className="mb-12 pb-10 border-b border-white/10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <Logo className="h-16 md:h-20 text-white mb-4" />
                            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
                                SYKLI College is a premier institution dedicated to sustainability, innovation, and practical excellence.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <a href="https://www.linkedin.com/company/sykli-college" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white" aria-label="LinkedIn">
                                <Linkedin size={18} weight="fill" />
                            </a>
                            <a href="https://www.tiktok.com/@syklicollege" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white" aria-label="TikTok">
                                <TikTok size={18} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Link Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 mb-12">

                    {/* Study */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Study</h3>
                        <ul className="space-y-3">
                            <li><Link href="/studies" className="text-neutral-400 text-sm hover:text-white transition-colors">All Courses</Link></li>
                            <li><Link href="/admissions" className="text-neutral-400 text-sm hover:text-white transition-colors">Admissions</Link></li>
                            <li><Link href="/admissions/tuition" className="text-neutral-400 text-sm hover:text-white transition-colors">Scholarships</Link></li>
                            <li><Link href="/student-guide/international" className="text-neutral-400 text-sm hover:text-white transition-colors">International Students</Link></li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">About</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-neutral-400 text-sm hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/news" className="text-neutral-400 text-sm hover:text-white transition-colors">News & Events</Link></li>
                            <li><Link href="/research" className="text-neutral-400 text-sm hover:text-white transition-colors">Research</Link></li>
                            <li><Link href="/student-life" className="text-neutral-400 text-sm hover:text-white transition-colors">Campus Life</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Resources</h3>
                        <ul className="space-y-3">
                            <li><Link href="/admissions-policy" className="text-neutral-400 text-sm hover:text-white transition-colors">Admissions Policy</Link></li>
                            <li><Link href="/academic-regulations" className="text-neutral-400 text-sm hover:text-white transition-colors">Academic Regulations</Link></li>
                            <li><Link href="/student-handbook" className="text-neutral-400 text-sm hover:text-white transition-colors">Student Handbook</Link></li>
                            <li><Link href="/refund-withdrawal-policy/" className="text-neutral-400 text-sm hover:text-white transition-colors">Refund Policy</Link></li>
                            <li><Link href="/code-of-conduct" className="text-neutral-400 text-sm hover:text-white transition-colors">Code of Conduct</Link></li>
                            <li><Link href="/alumni" className="text-neutral-400 text-sm hover:text-white transition-colors">Alumni</Link></li>
                            <li><Link href="/portal/support" className="text-neutral-400 text-sm hover:text-white transition-colors">IT Support</Link></li>
                            <li><Link href="/contact" className="text-neutral-400 text-sm hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-neutral-400 text-sm">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-neutral-500" />
                                <span>Pohjoisesplanadi 51,<br />00150 Helsinki, Uusimaa</span>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400 text-sm">
                                <EnvelopeSimple size={16} className="shrink-0 text-neutral-500" />
                                <a href="mailto:sykli@syklicollege.fi" className="hover:text-white transition-colors">sykli@syklicollege.fi</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-neutral-500 text-xs order-2 md:order-1">
                            © {new Date().getFullYear()} SYKLI College. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 md:order-2">
                            <Link href="/site-index" className="text-neutral-500 text-xs hover:text-white transition-colors">Site Index</Link>
                            <Link href="/privacy" className="text-neutral-500 text-xs hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="text-neutral-500 text-xs hover:text-white transition-colors">Terms of Use</Link>
                            <Link href="/cookies" className="text-neutral-500 text-xs hover:text-white transition-colors">Cookie Policy</Link>
                            <Link href="/accessibility" className="text-neutral-500 text-xs hover:text-white transition-colors">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

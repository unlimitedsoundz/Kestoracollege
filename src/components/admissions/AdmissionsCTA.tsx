
import Link from 'next/link';
import { ArrowRight, User } from '@phosphor-icons/react/dist/ssr';

export default function AdmissionsCTA() {
    return (
        <div className="bg-neutral-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden my-12">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-neutral-300 leading-relaxed">
                        Join the next generation of global leaders at SYKLI College. Create your portal account to begin your official application.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Link
                        href="/portal/account/register"
                        className="inline-flex items-center justify-center gap-2 bg-[#fd6402] text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-all text-sm uppercase tracking-wider"
                    >
                        Create Portal Account <ArrowRight size={18} weight="bold" />
                    </Link>
                    <Link
                        href="/portal/account/login"
                        className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all text-sm uppercase tracking-wider"
                    >
                        <User size={18} weight="bold" /> Existing Student? Log In
                    </Link>
                </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fd6402]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>
    );
}

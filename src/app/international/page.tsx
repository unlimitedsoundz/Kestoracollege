
export const metadata = {
    title: 'International Students — Kestora College Finland | Visa, Housing & Work Rights',
    description: 'Essential information for international students at Kestora College. Residence permits, student housing, health insurance, working rights, and Finnish language courses in Helsinki.',
};

export default function InternationalPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Student Services</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900 pt-8">International Students</h1>

                <div className="prose prose-lg max-w-none text-neutral-600 mb-12">
                    <p>
                        Welcome to Kestora! Each year, we welcome hundreds of students from around the world. We are committed to making your transition to Finland as smooth as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-neutral-100 p-10 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-emerald-800">🛂 Residence Permits</h3>
                        <p className="mb-4 text-sm">Non-EU/EEA citizens typically need a student residence permit. You should apply as soon as you receive your acceptance letter.</p>
                        <a href="#" className="text-emerald-600 font-bold text-sm underline">Read Migri.fi Guide</a>
                    </div>
                    <div className="bg-neutral-100 p-10 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-emerald-800">🏠 Housing</h3>
                        <p className="mb-4 text-sm">We guarantee student housing support for all first-year international students through our partnership with HOAS.</p>
                        <a href="#" className="text-emerald-600 font-bold text-sm underline">Apply for Housing</a>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
                    <div className="space-y-4">
                        <details className="group p-4 rounded-lg cursor-pointer">
                            <summary className="font-bold text-neutral-900 group-hover:text-emerald-600">Can I work while studying?</summary>
                            <p className="mt-2 text-neutral-600">Yes, international students can work up to 30 hours per week on average during the academic year, and full-time during holidays.</p>
                        </details>
                        <details className="group p-4 rounded-lg cursor-pointer">
                            <summary className="font-bold text-neutral-900 group-hover:text-emerald-600">Is health insurance mandatory?</summary>
                            <p className="mt-2 text-neutral-600">Yes, you must have valid private health insurance if you are a non-EU/EEA citizen to obtain your residence permit.</p>
                        </details>
                        <details className="group p-4 rounded-lg cursor-pointer">
                            <summary className="font-bold text-neutral-900 group-hover:text-emerald-600">Are Finnish classes available?</summary>
                            <p className="mt-2 text-neutral-600">Absolutely! We offer free "Survival Finnish" courses for all incoming international students.</p>
                        </details>
                    </div>
                </section>
            </div>
        </div>
    );
}

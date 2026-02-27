
export const metadata = {
    title: 'Collaboration & Partnerships — Kestora College',
    description: 'Partner with Kestora College for research, innovation, and education. Join our network of industry leaders, government agencies, and non-profits driving systemic change.',
};

export default function CollaborationPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="bg-blue-900 text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4 pt-8">Partner with Kestora</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Join our network of industry leaders, government agencies, and non-profits driving systemic change.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900">Why Partner with Us?</h2>
                        <ul className="space-y-4">
                            {[
                                "Access to top-tier talent and recruitment pipelines.",
                                "Collaborative R&D opportunities in our state-of-the-art labs.",
                                "Custom executive education and training programs for your staff.",
                                "Joint brand visibility in global sustainability forums."
                            ].map((point, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-blue-600 font-bold text-xl">•</span>
                                    <span className="text-neutral-700 text-lg">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold mb-6">Contact Relationships Team</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Organization Name</label>
                                <input type="text" className="w-full p-3 border border-neutral-300 rounded-lg" placeholder="Company Ltd." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Email</label>
                                <input type="email" className="w-full p-3 border border-neutral-300 rounded-lg" placeholder="contact@company.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Partnership Interest</label>
                                <select className="w-full p-3 border border-neutral-300 rounded-lg">
                                    <option>Research Collaboration</option>
                                    <option>Recruitment / Internships</option>
                                    <option>Corporate Training</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                Request Information
                            </button>
                        </form>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-8 text-center text-neutral-400 uppercase tracking-widest">Trusted By</h2>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos */}
                        <span className="text-2xl font-bold">NordicEnergy</span>
                        <span className="text-2xl font-bold">BuildSmart</span>
                        <span className="text-2xl font-bold">CircularLoop</span>
                        <span className="text-2xl font-bold">EcoCity Group</span>
                        <span className="text-2xl font-bold">FutureMaterials</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

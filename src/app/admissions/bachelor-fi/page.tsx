
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Globe, Users, BookOpen, Briefcase, GraduationCap, Calendar, MapPin } from '@phosphor-icons/react/dist/ssr';
import TableOfContents from '@/components/course/TableOfContents';

export const metadata = {
    title: 'Kandidaattiohjelmat (Suomi ja Ruotsi) | Kestora College',
    description: 'Hae Kestora Collegen suomen- ja ruotsinkielisiin kandidaattiohjelmiin. Tietoa hyödyistä, opintopoluista, apurahoista ja valinnoista.',
    alternates: {
        canonical: 'https://www.kestora.fi/admissions/bachelor-fi',
        languages: {
            'en': 'https://www.kestora.fi/admissions/bachelor',
            'fi': 'https://www.kestora.fi/admissions/bachelor-fi',
        },
    },
};

const tocSections = [
    { id: 'benefits', title: 'Miksi Valita Meidät', content: '' },
    { id: 'progression', title: 'Kandista Maisteriksi', content: '' },
    { id: 'scholarships', title: 'Apurahat & Maksut', content: '' },
    { id: 'admissions', title: 'Hakutiedot', content: '' },
    { id: 'events', title: 'Tapahtumat', content: '' },
    { id: 'more', title: 'Lue Lisää', content: '' },
];

export default function BachelorAdmissionsFiPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative min-h-[30vh] lg:min-h-[20vh] flex items-center pt-20 lg:pt-0">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/admissions/hero.jpg"
                        alt="Kandidaattiopiskelijoita"
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container mx-auto px-4 relative z-10 pt-32 pb-12 md:pt-48">
                    <div className="max-w-4xl">
                        <p className="text-white font-bold tracking-wider uppercase mb-4">Opiskelijavalinnat</p>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">Hae suomen- ja ruotsinkielisiin kandidaattiohjelmiin</h1>
                        <p className="text-xl text-neutral-200 mb-8">Aloita matkasi Kestora Collegessa ja hanki taidot, kansainvälinen näkökulma ja verkostot menestyäksesi maailmanlaajuisesti.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/admissions/application-process" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2">
                                Aloita Haku <ArrowRight size={20} weight="bold" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar / Table of Contents */}
                    <div className="lg:col-span-3">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <TableOfContents sections={tocSections} />

                            <div className="bg-black text-white p-10 pl-16 rounded-none border-l-4 border-[#fd6402]">
                                <h3 className="font-bold text-lg mb-2 text-white">Hakutoimisto</h3>
                                <p className="text-sm text-neutral-300 mb-4">Kysyttävää? Olemme täällä auttaaksemme.</p>
                                <Link href="/contact" className="text-sm font-bold underline text-[#fd6402] hover:text-white transition-colors">Ota yhteyttä</Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8 md:space-y-24">

                        {/* How You Benefit */}
                        <section id="benefits" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black">
                                Miten hyödyt ohjelmistamme
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6 text-lg text-neutral-600">
                                    <ul className="space-y-4 list-disc pl-5">
                                        <li>
                                            <strong>Korkealaatuinen Koulutus:</strong> Teoriaa ja käytäntöä laskentatoimessa, rahoituksessa, taloustieteessä, johtamisessa, markkinoinnissa ja tietojärjestelmätieteessä.
                                        </li>
                                        <li>
                                            <strong>Kansainvälinen Näkökulma:</strong> Kurssit valmistavat globaaleille urille.
                                        </li>
                                        <li>
                                            <strong>Käytännön Kokemus:</strong> Todellisia tapaustutkimuksia, simulaatioita ja harjoitteluita.
                                        </li>
                                        <li>
                                            <strong>Henkilökohtainen Tuki:</strong> Pienet ryhmäkoot ja tiivis vuorovaikutus tiedekunnan kanssa.
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-100 rounded-2xl h-80 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                                        <Image src="/images/admissions/benefits.jpg" alt="Hyödyt Kestora Collegessa opiskelusta" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* From Bachelor's to Master's */}
                        <section id="progression" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black">
                                Kandidaatista Maisteriksi
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
                                <div className="bg-neutral-100 rounded-2xl h-80 overflow-hidden relative order-last md:order-first">
                                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                                        <Image src="/images/admissions/progression.jpg" alt="Polku Maisteriksi" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                </div>
                                <div className="space-y-6 text-lg text-neutral-600">
                                    <p>Kandidaatin tutkinnon suorittaminen Kestora Collegessa avaa saumattoman tien jatko-opintoihin:</p>
                                    <ul className="space-y-3">
                                        <li><strong>Sisäinen Jatkoväylä:</strong> Suora polku Kestoran maisteriohjelmiin.</li>
                                        <li><strong>Erikoistumislinjat:</strong> Keskity laskentatoimeen, taloustieteeseen tai johtamiseen.</li>
                                        <li><strong>Kansainväliset Mahdollisuudet:</strong> Hae huippuyliopistoihin ympäri maailmaa.</li>
                                        <li><strong>Tutkimusintegraatio:</strong> Kandidaatintutkielma askeleena kohti syvällisempää tutkimusta.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>

            {/* YELLOW QUOTE BANNER */}
            <div className="w-full bg-[#fd6402] text-neutral-900 py-16 my-12">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h3 className="text-2xl md:text-3xl leading-tight mb-6">
                        "Annamme opiskelijoille analyyttiset taidot ja globaalin ajattelutavan, joita tarvitaan monimutkaisessa taloudellisessa päätöksenteossa."
                    </h3>
                    <p className="text-sm font-semibold uppercase tracking-wider opacity-80">— Opiskelijavalintojen Dekaani</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-3"></div>

                    <div className="lg:col-span-12 space-y-24">
                        {/* Scholarships */}
                        <section id="scholarships" className="scroll-mt-32 grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <h2 className="text-3xl font-bold mb-6 text-black">
                                    Apurahat ja Lukukausimaksut
                                </h2>
                                <div className="space-y-4 text-lg text-neutral-600">
                                    <div className="p-8 pl-16 bg-neutral-50 border-l-4 border-black rounded-r-lg">
                                        <strong>Lukukausimaksu:</strong> Sisältyy tutkintomaksuun päätoimisille opiskelijoille.
                                    </div>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li><strong>Ansioihin perustuva:</strong> Poikkeuksellisesta opintomenestyksestä.</li>
                                        <li><strong>Tarveharkintainen:</strong> Taloudellinen tuki kelpoisille opiskelijoille.</li>
                                        <li><strong>Kansainvälinen:</strong> Ansio- ja tarveharkintainen tuki globaaleille kyvyille.</li>
                                    </ul>
                                    <Link href="/admissions/tuition" className="text-black font-bold hover:underline inline-block mt-2">Katso tarkemmat apurahatietoa →</Link>
                                </div>
                            </div>
                            <div className="w-full lg:h-full order-1 md:order-2 relative h-[250px] md:h-full min-h-[250px] md:min-h-[300px]">
                                <Image
                                    src="/images/admissions/scholarships.jpg"
                                    alt="Apurahat"
                                    fill
                                    className="object-cover rounded-2xl shadow-lg border border-neutral-100"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </section>

                        {/* Admissions Info */}
                        <section id="admissions" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-8 text-black">
                                Tietoa Opiskelijavalinnoista
                            </h2>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="bg-white p-8 shadow-xl rounded-2xl border border-neutral-100">
                                    <h3 className="text-xl font-bold mb-8 text-black pl-2">Hakukelpoisuus</h3>
                                    <ul className="space-y-3 text-neutral-700 list-disc pl-5">
                                        <li>Ylioppilastutkinto tai vastaava</li>
                                        <li>Englannin kielen taito (IELTS/TOEFL tai englannin kielen arvosana C tai parempi) (jos sovellettavissa)</li>
                                        <li>Vahva matematiikan osaaminen ja relevantti tausta</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-8 shadow-xl rounded-2xl border border-neutral-100">
                                    <h3 className="text-xl font-bold mb-8 text-black pl-2">Valintaperusteet</h3>
                                    <ul className="space-y-3 text-neutral-700 list-disc pl-5">
                                        <li>Akateeminen menestys</li>
                                        <li>Motivaatio ja henkilökohtainen lausunto</li>
                                        <li>Johtajuus ja harrastustoiminta</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Fairs & Events */}
                        <section id="events" className="scroll-mt-32 bg-black text-white p-12 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6 text-white">
                                        Messut ja Tapahtumat
                                    </h2>
                                    <ul className="space-y-4 text-neutral-300">
                                        <li><strong>Avoimet Ovet:</strong> Tutustu kampukseen ja tapaa tiedekuntaa.</li>
                                        <li><strong>Virtuaaliset Infotilaisuudet:</strong> Webinaareja hakuun liittyen.</li>
                                        <li><strong>Koulutusmessut:</strong> Tapaa meidät omassa kaupungissasi.</li>
                                    </ul>
                                    <div className="mt-8">
                                        <button className="bg-[#fd6402] text-black px-8 py-4 font-bold hover:bg-white transition-colors">Katso Tulevat Tapahtumat</button>
                                    </div>
                                </div>
                                <div className="w-full relative h-[250px] md:h-80 mt-8 md:mt-0">
                                    <Image
                                        src="/images/admissions/events.jpg"
                                        alt="Messut ja Tapahtumat"
                                        fill
                                        className="rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Learn More */}
                        <section id="more" className="scroll-mt-32 text-center max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-8">Lue Lisää Kestora Collegessa Opiskelusta</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-left">
                                <div className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group">
                                    <h4 className="font-bold mb-1">Moderni Kampus</h4>
                                    <p className="text-xs text-neutral-500">Huippuluokan tilat</p>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group">
                                    <h4 className="font-bold mb-1">Tuki</h4>
                                    <p className="text-xs text-neutral-500">Ohjaus ja neuvonta</p>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group">
                                    <h4 className="font-bold mb-1">Yhteisö</h4>
                                    <p className="text-xs text-neutral-500">Globaali verkosto</p>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group">
                                    <h4 className="font-bold mb-1">Urat</h4>
                                    <p className="text-xs text-neutral-500">Harjoittelut ja mentorointi</p>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group">
                                    <h4 className="font-bold mb-1">Opiskelijaelämä</h4>
                                    <p className="text-xs text-neutral-500">Kerhot ja urheilu</p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}

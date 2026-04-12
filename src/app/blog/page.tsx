import Link from 'next/link';
import Image from 'next/image';
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            <div className="h-[50vh] min-h-[400px] relative overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pt-8">My Experiences Studying in Finland</h1>
                    <p className="text-neutral-300 text-lg">18.2.2024</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-3xl">
                <Link href="/" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to Home
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
                <div className="prose prose-lg prose-emerald mx-auto">
                    <h2>Beautiful Winter Landscape</h2>
                    <h3>CULTURAL DIFFERENCES: WHAT I FOUND TO BE UNIQUE ABOUT FINLAND</h3>
                    <p>Finland is a truly beautiful country, and my decision to move here has been one of the best choices I've made. Studying in Finland has not only shaped my academic journey but also exposed me to entirely new seasons, cultures, and ways of life.</p>
                    <p>Hi, my name is Adekunle Amosun. I am originally from Ondo State, Nigeria. I moved to Finland in September 2024 to begin my studies at Kestora University, where I am currently in my second year studying Design. In this blog, I share some of the experiences and cultural differences that stood out to me compared to life back home.</p>

                    <h3>Winter Beauty</h3>
                    <p>Photo: Mika Laine</p>
                    <h3>WINTER IN FINLAND</h3>
                    <p>Coming from Nigeria, I was used to just two seasons: the dry (harmattan) and the wet (rainy) seasons. Experiencing all four seasons in Finland for the first time was both fascinating and surprising. Each season has its own charm, and the speed at which temperatures shift throughout the year is remarkable.</p>

                    <h3>Lapland</h3>
                    <p>Santa Claus Village in Lapland (Photo: Elias Korhonen)</p>
                    <p>During the winter of 2021, I experienced temperatures as low as -32°C, while in summer it reached as high as +30°C. Even though I grew up in a relatively cool region in Nigeria, nothing could have prepared me for the Finnish winter. It is intense, but as the Finns say, "there is no bad weather, only bad clothing."</p>
                    <p>I quickly learned that surviving winter requires proper clothing—heavy jackets, gloves, scarves, wool hats, and thermal socks—as well as winter boots to prevent slipping on icy surfaces. I also noticed that cars switch to winter tyres with metal studs to improve traction and prevent accidents on icy roads.</p>

                    <h3>Northern Lights</h3>
                    <p>Photo: Antti Virtanen</p>
                    <p>One thing that stood out to me is how well homes in Finland are designed for the cold. Buildings are properly insulated and equipped with central heating, so while it may be freezing outside, indoors remains warm and comfortable.</p>
                    <p>I also learned that staying active during winter is important, along with taking vitamin D supplements due to limited sunlight.</p>

                    <h3>Frozen Lake During Winter</h3>
                    <p>Photo: Jussi Nieminen</p>
                    <h3>FUN ACTIVITIES TO DO DURING WINTER</h3>
                    <p>Winter is not just about enduring the cold—it also comes with exciting activities. You can go skiing, ice skating, reindeer or dog sledding, and enjoy sauna sessions with friends and family.</p>
                    <p>One of the most unforgettable experiences for me was seeing the northern lights, also known as auroras. Before coming to Finland, I had never heard of them, and witnessing them in person felt surreal.</p>

                    <h3>STUDYING AT KESTORA UNIVERSITY</h3>
                    <p>Speaking about my academic experience at Kestora University, I must commend the school's management and staff for how effectively they handled operations during the COVID-19 pandemic. Classes were smooth, and lecturers remained approachable and supportive.</p>
                    <p>One thing I particularly appreciate is the interdisciplinary structure of the curriculum. Even as a Design student, I've had the opportunity to explore courses outside my field, expanding my creativity and perspective.</p>
                    <p>There is also a very low hierarchical barrier between students and staff. Professors are accessible, open to discussions, and always willing to clarify complex topics.</p>

                    <h3>Beautiful Sunset</h3>
                    <p>Photo: Ville Saarinen</p>
                    <p>In conclusion, studying at Kestora University has been an enriching experience. The curriculum aligns with industry standards and encourages students to think creatively and critically.</p>
                    <p>Beyond academics, I've met amazing people from diverse cultural backgrounds, which has broadened my worldview. I've also explored different cuisines, including traditional Finnish dishes like reindeer meat and mämmi (a popular Easter dessert).</p>

                    <h3>Northern Lights at Hervanta Campus</h3>
                    <p>Photo: Pekka Koskinen</p>
                    <h3>Helpful Links</h3>
                    <ul>
                        <li><a href="https://opintopolku.fi/konfo/en/">Application to Finland Universities</a></li>
                        <li><a href="https://www.kestora.fi/en/study-with-us">Kestora University</a></li>
                        <li><a href="https://www.space.com/15139-northern-lights-auroras-earth-facts-sdcmp.html">Northern Lights</a></li>
                    </ul>

                    <h3>About the Author</h3>
                    <p>Adekunle Amosun is from Ondo State, Nigeria. He is currently in his second year of the Design program at Kestora University. He has a technical background with a bachelor's degree in Computer Science from Adeleke University, Nigeria.</p>
                    <p>He is a student ambassador who enjoys traveling, playing basketball, and board games during his free time.</p>
                </div>

                {/* Related Links */}
                <div className="mt-16 pt-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-6">Related Links</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: "How to Apply", href: "/admissions/application-process", desc: "Step-by-step application guide." },
                            { title: "Explore Programmes", href: "/studies", desc: "Browse all degree programmes." },
                            { title: "International Students", href: "/student-guide/international", desc: "Visa, housing, and arrival info." },
                        ].map(link => (
                            <Link key={link.href} href={link.href} className="bg-neutral-50 p-5 rounded-xl hover:bg-neutral-100 transition-colors group">
                                <h4 className="font-bold text-neutral-900 mb-1 group-hover:underline text-sm">{link.title}</h4>
                                <p className="text-xs text-neutral-500">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
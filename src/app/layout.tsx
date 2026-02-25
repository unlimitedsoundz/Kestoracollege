import type { Metadata } from "next";
import { Inter, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.syklicollege.fi'),
    title: "SYKLI College Helsinki | English-Taught Degrees in Finland",
    description: "SYKLI College Helsinki is an independent higher education institution in Finland offering English-taught degree programs for international students. Not affiliated with Suomen ympäristöopisto SYKLI.",
    alternates: {
        canonical: '/',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${openSans.variable} ${playfair.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CollegeOrUniversity",
                            "name": "SYKLI College",
                            "description": "SYKLI College is an independent higher education institution in Helsinki, Finland offering English-taught degree programs for international students. SYKLI College is not affiliated with Suomen ympäristöopisto SYKLI.",
                            "alternateName": "SYKLI College Helsinki",
                            "url": "https://www.syklicollege.fi",
                            "logo": "https://www.syklicollege.fi/logo.png",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "SYKLI College – Helsinki Campus, Pohjoisesplanadi 51",
                                "addressLocality": "Helsinki",
                                "postalCode": "00150",
                                "addressRegion": "Uusimaa",
                                "addressCountry": "FI"
                            },
                            "location": {
                                "@type": "Place",
                                "name": "Helsinki, Finland"
                            },
                            "sameAs": [
                                "https://www.linkedin.com/company/sykli-college"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+358-20-4721-739",
                                "contactType": "admissions",
                                "email": "admissions@syklicollege.fi"
                            }
                        })
                    }}
                />
            </head>
            <body
                className={`font-sans antialiased`}
            >
                <AuthProvider>
                    <Header />
                    {children}
                    <Footer />
                    <CookieConsent />
                </AuthProvider>
            </body>
        </html>
    );
}

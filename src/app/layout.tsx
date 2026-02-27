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
    metadataBase: new URL('https://www.kestora.fi'),
    title: "Kestora College Helsinki | English-Taught Degrees in Finland",
    description: "Kestora College Helsinki is an independent higher education institution in Finland offering English-taught degree programs for international students.",
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
                            "name": "Kestora College",
                            "description": "Kestora College is an independent higher education institution in Helsinki, Finland offering English-taught degree programs for international students.",
                            "alternateName": "Kestora College Helsinki",
                            "url": "https://www.kestora.fi",
                            "logo": "https://www.kestora.fi/logo-kestora.png",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Kestora College – Helsinki Campus, Pohjoisesplanadi 51",
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
                                "https://www.linkedin.com/company/kestora-college"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+358-20-4721-739",
                                "contactType": "admissions",
                                "email": "admissions@kestora.fi"
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

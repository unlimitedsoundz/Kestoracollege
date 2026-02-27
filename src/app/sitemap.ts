import { MetadataRoute } from 'next';

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.kestora.fi';

    // Core pages with highest priority
    const corePages = [
        { url: `${baseUrl}/`, changeFrequency: 'weekly' as const, priority: 1.0 },
        { url: `${baseUrl}/admissions`, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/admissions/bachelor`, changeFrequency: 'monthly' as const, priority: 0.9 },
        { url: `${baseUrl}/admissions/master`, changeFrequency: 'monthly' as const, priority: 0.9 },
        { url: `${baseUrl}/admissions/application-process`, changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/admissions/tuition`, changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/admissions/requirements`, changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/admissions/bachelor-fi`, changeFrequency: 'monthly' as const, priority: 0.7 },
    ];

    // Schools & departments
    const schoolPages = [
        { url: `${baseUrl}/schools`, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/schools/arts`, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/schools/business`, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/schools/science`, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/schools/technology`, changeFrequency: 'monthly' as const, priority: 0.7 },
    ];

    // Research
    const researchPages = [
        { url: `${baseUrl}/research`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/research/projects`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/research/publications`, changeFrequency: 'monthly' as const, priority: 0.5 },
    ];

    // Student guides & life
    const studentPages = [
        { url: `${baseUrl}/student-guide`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/student-guide/international`, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/student-guide/arrival`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/student-guide/exchange`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/student-guide/bachelor`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/student-guide/master`, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/student-life`, changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/student-life/cafe`, changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/international`, changeFrequency: 'monthly' as const, priority: 0.7 },
    ];

    // Institutional pages
    const institutionalPages = [
        { url: `${baseUrl}/about-kestora-college`, changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/news`, changeFrequency: 'daily' as const, priority: 0.6 },
        { url: `${baseUrl}/alumni`, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/collaboration`, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/innovation`, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/art`, changeFrequency: 'monthly' as const, priority: 0.3 },
    ];

    // Legal & utility pages
    const legalPages = [
        { url: `${baseUrl}/privacy`, changeFrequency: 'yearly' as const, priority: 0.2 },
        { url: `${baseUrl}/terms`, changeFrequency: 'yearly' as const, priority: 0.2 },
        { url: `${baseUrl}/cookies`, changeFrequency: 'yearly' as const, priority: 0.2 },
        { url: `${baseUrl}/accessibility`, changeFrequency: 'yearly' as const, priority: 0.2 },
        { url: `${baseUrl}/site-index`, changeFrequency: 'monthly' as const, priority: 0.3 },
    ];

    return [
        ...corePages,
        ...schoolPages,
        ...researchPages,
        ...studentPages,
        ...institutionalPages,
        ...legalPages,
    ].map(item => ({
        ...item,
        url: item.url.endsWith('/') ? item.url : `${item.url}/`
    }));
}

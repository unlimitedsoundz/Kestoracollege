/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'mrqzlmkdhzwvbpljikjz.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
        ],
    },
    output: 'export',
    trailingSlash: true,
    turbopack: {
        root: '.',
    },
};

export default nextConfig;

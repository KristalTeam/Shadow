import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    deploymentId: process.env.DEPLOYMENT_VERSION,
    async headers() {
        return [
            {
                // fix caching for static files
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ]
            }
        ]
    }
}

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            'remark-gfm'
        ],
        rehypePlugins: [
            'rehype-highlight'
        ],
    },
});

export default withMDX(nextConfig)

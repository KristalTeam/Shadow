import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx']
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

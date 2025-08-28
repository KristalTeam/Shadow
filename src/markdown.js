import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import MarkdownLink from "../components/MarkdownLink";
import Header from "../components/Header";
import React from "react";
import * as prod from "react/jsx-runtime";

export async function parse(input) {
    const output = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize, {
            ...defaultSchema,
            attributes: {
                ...defaultSchema.attributes,
                "*": [...(defaultSchema.attributes["*"] || []), "style"],
            },
        })
        //.use(rehypeStringify)
        .use(rehypeReact, {
            createElement: React.createElement,
            Fragment: prod.Fragment,
            jsxs: prod.jsxs,
            jsx: prod.jsx,
            components: {
                a: (props) => <MarkdownLink className="markdown" {...props} />,
                h1: (props) => <Header className="markdown" level={1} {...props} />,
                h2: (props) => <Header className="markdown" level={2} {...props} />,
                h3: (props) => <Header className="markdown" level={3} {...props} />,
                h4: (props) => <Header className="markdown" level={4} {...props} />,
                h5: (props) => <Header className="markdown" level={5} {...props} />,
                h6: (props) => <Header className="markdown" level={6} {...props} />,
            },
        })
        .process(input);

    return output.result;
}
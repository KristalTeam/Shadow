import MarkdownLink from "components/MarkdownLink"
import Header from "components/Header"

export function useMDXComponents(components) {
    return {
        a: (props) => (
            <MarkdownLink className="markdown" {...props} />
        ),
        h1: (props) => (
            <Header className="markdown" level={1} {...props} />
        ),
        h2: (props) => (
            <Header className="markdown" level={2} {...props} />
        ),
        h3: (props) => (
            <Header className="markdown" level={3} {...props} />
        ),
        h4: (props) => (
            <Header className="markdown" level={4} {...props} />
        ),
        h5: (props) => (
            <Header className="markdown" level={5} {...props} />
        ),
        h6: (props) => (
            <Header className="markdown" level={6} {...props} />
        ),
        ...components,
    }
}
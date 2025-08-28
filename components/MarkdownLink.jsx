import Link from "next/link";

export default function MarkdownLink({ children, href }) {
    href = href || "";
    if (href.startsWith("#")) {
        return <a href={href}>{children}</a>;
    } else if (href.startsWith("/") || href === "") {
        return <Link href={href}>{children}</Link>;
    } else if (href.startsWith("lua://")) {
        return <a href={href}>{children}</a>;
    } else {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }
}
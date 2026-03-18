import Link from "next/link";

export default function Header(props) {
    // get text content from props.children
    if (typeof props.children === "string") {
        let transformed = props.children.toString()
        // transform text to be a valid id (spaces replaced with dashes, lowercase, alphanumeric characters only)

        // but first, if there's text inside of square brackets, let's transform THAT instead

        let original = transformed.replaceAll(/\[.*\]/g, (match) => {
            transformed = match
            return ""
        })
        original = original.trim()

        transformed = transformed
            .replaceAll(" ", "-")
            .toLowerCase()
            .replaceAll(/[^a-z0-9-]/g, "")
        // return a link with the transformed text as the id

        switch (props.level) {
            case 1: return <h1 {...props}><Link href={`#${transformed}`} id={transformed}>{original}</Link></h1>
            case 2: return <h2 {...props}><Link href={`#${transformed}`} id={transformed}>{original}</Link></h2>
            case 3: return <h3 {...props}><Link href={`#${transformed}`} id={transformed}>{original}</Link></h3>
            case 4: return <h4 {...props}><Link href={`#${transformed}`} id={transformed}>{original}</Link></h4>
            case 5: return <h5 {...props}><Link href={`#${transformed}`} id={transformed}>{original}</Link></h5>
            case 6: return <h6 {...props}><Link href={`#${transformed}`} id={transformed}>{original}</Link></h6>
        }
        return <h1 {...props}/>
    }
    else
    {
        switch (props.level)
        {
            case 1: return <h1 {...props}/>
            case 2: return <h2 {...props}/>
            case 3: return <h3 {...props}/>
            case 4: return <h4 {...props}/>
            case 5: return <h5 {...props}/>
            case 6: return <h6 {...props}/>
        }
        return <h1 {...props}/>
    }
}
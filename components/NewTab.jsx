export default function NewTab({children, ...props}) {
    return <a target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
}
export default function Anchor(props) {
    return <a {...props} href={`#${props.link}`} id={props.link}>{props.children}</a>
}
import Link from "next/link";

export default function Anchor(props) {
    return <Link {...props} href={`#${props.link}`} id={props.link}>{props.children}</Link>;
}
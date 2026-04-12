import styles from './Navbar.module.css';
import Link from 'next/link';
import NewTab from 'components/NewTab';

export function Item({ href, newTab, children, text, icon }) {
    const Component = newTab ? NewTab : Link;
    const url = `url("/navbar/${icon}.png")`;
    return <Component href={href} className={styles.item} title={text}>
        <div className={styles.item_text}>{text}</div>
        <div className={styles.item_icon} style={{WebkitMaskImage: url, maskImage: url}}></div>
    </Component>
}

export default function Navbar() {
    return <div id="wiki-navbar" className={styles.navbar}>
        <div className={styles.navbar_inner}>
            <Item href="/" text="Home" icon="home"/>
            <Item href="/wiki" text="Wiki" icon="wiki"/>
            <Item href="https://github.com/KristalTeam/Kristal/" newTab text="Source" icon="source"/>
            <Item href="/wiki/downloading" text="Downloads" icon="download"/>
            <Item href="https://discord.gg/8ZGuKXJE2C" newTab text="Discord" icon="discord"/>
        </div>
    </div>
}

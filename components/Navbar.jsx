import styles from './Navbar.module.css';
import Link from 'next/link';
import NewTab from 'components/NewTab';

export default function Navbar() {
    return <div className={styles.navbar}>
        <div className={styles.navbar_inner}>
            <Link href="/" className={styles.item}>Home</Link>
            <Link href="/wiki" className={styles.item}>Wiki</Link>
            <NewTab href="https://github.com/KristalTeam/Kristal/" className={styles.item}>Source</NewTab>
            <Link href="/wiki/downloading" className={styles.item}>Downloads</Link>
            <NewTab href="https://discord.gg/8ZGuKXJE2C" className={styles.item}>Discord</NewTab>
        </div>
    </div>
}

"use client";

import styles from './CollapseBox.module.css';

export default function CollapseBox({ children, ...props}) {

    return (
        <details className={styles.collapsebox} {...props}>
            <summary id={props.id} className={styles.summary}>
                <span className={styles.header}>{props.title}</span>
                {props.id && <a className={styles.anchor} href={`#${props.id}`} onClick={(e) => e.stopPropagation()}>🔗</a>}
            </summary>

            <div className={styles.content}>
                {children}
            </div>
        </details>
    );
}

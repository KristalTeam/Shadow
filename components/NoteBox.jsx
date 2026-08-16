"use client";

import styles from './NoteBox.module.css';

export default function NoteBox({ children, ...props}) {

    let typeClass;
    let header;

    switch (props.type) {
        case "warning":
            typeClass = styles.warning;
            header = "⚠️ Warning"
            break;
        case "important":
            typeClass = styles.important;
            header = "❗ Important"
            break;
        case "tip":
            typeClass = styles.tip;
            header = "💡 Tip"
            break;
        case "note":
        default:
            typeClass = styles.note;
            header = "ⓘ Note"
            break;
    }

    return (
        <aside role="note" className={`${styles.noteBox} ${typeClass}`} {...props}>
            <div className={styles.content}>
                <span className={styles.header}>{header}</span>
                {children}
            </div>
        </aside>
    );
}

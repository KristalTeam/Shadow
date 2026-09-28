import styles from './Box.module.css';

export default function Box({ children, className, noLines, ...props}) {
    const classList = [ styles.box ];

    if (!noLines) {
        classList.push(styles.headerLines);
    }

    if (className) {
        classList.push(className);
    }

    return <div className={classList.join(' ')} {...props}>{children}</div>;
}

import styles from './ScaledSprite.module.css';

export default function ScaledSprite({ src, name, width, height, scale, ...props}) {
    scale = scale || 3;

    return <img
        src={src}
        alt={name}
        title={name}
        width={width}
        height={height}
        className={styles.sprite}
        style={{
            width: width * scale,
            height: height * scale
        }}
        {...props}
    />;
}

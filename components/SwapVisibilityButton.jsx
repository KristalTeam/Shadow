"use client" 
import { useEffect, useState } from 'react';
import styles from './SwapVisibilityButton.module.css';

import Box from '@/components/Box';

export default function SwapVisibilityButton({ children, className, componentA, componentB, ...props}, ) {
    const [displayed, setDisplayed] = useState(false);

    useEffect(() => {
        let a = document.getElementById(componentA)
        let b = document.getElementById(componentB)
        a.style.display = displayed ? "block" : "none"
        b.style.display = displayed ? "none" : "block"
    }, [displayed, componentA, componentB]);

    return <Box className={styles.container}>
        <a href="#" className={displayed ? styles.unselected : styles.selected} onClick={(e) => setDisplayed(false)}>Alphabetical View</a>
        <a href="#" className={displayed ? styles.selected : styles.unselected} onClick={(e) => setDisplayed(true)}>Tree View</a>
    </Box>
}

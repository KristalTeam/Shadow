import styles from './layout.module.css'
import Sidebar from 'components/Sidebar';

import { Quicksand } from 'next/font/google'

const font = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font',
  weight: "variable"
})

export const metadata = {
  title: 'Kristal Wiki',
  description: 'Documentation for the powerful DELTARUNE fangame engine, Kristal.'
}

export default function RootLayout({children}) {
  return (
    <div className={`${styles.container} ${font.variable}`}>
      <Sidebar />
      <main className={styles.main}>
          {children}
      </main>
    </div>
  )
}

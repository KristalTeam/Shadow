import styles from './layout.module.css'
import Sidebar from 'components/Sidebar';

import { Roboto } from 'next/font/google'

const font = Roboto({
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

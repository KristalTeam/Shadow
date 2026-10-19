import styles from './layout.module.css'
import Sidebar from 'components/Sidebar';

import localFont from 'next/font/local'
import { Roboto } from 'next/font/google'

const robotoFont = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: "variable"
})

const operatorPlusFont = localFont({
  src: [
    {
        path: "../../public/8bitOperatorPlus-Regular.woff",
        weight: "400",
        style: "normal",
    },
    {
        path: "../../public/8bitOperatorPlus-Bold.woff",
        weight: "500",
        style: "normal",
    },
    {
        path: "../../public/8bitOperatorPlus-Bold.woff",
        weight: "700",
        style: "normal",
    },
  ],
  variable: "--font-operator",
});

export const metadata = {
  title: 'Kristal Wiki',
  description: 'Documentation for the powerful DELTARUNE fangame engine, Kristal.'
}

export default function RootLayout({children}) {
  return (
    <div id='wiki-container' className={`${styles.container} ${robotoFont.variable} ${operatorPlusFont.variable}`}>
      <Sidebar/>
      <main className={styles.main}>
          {children}
      </main>
    </div>
  )
}

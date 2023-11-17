import './globals.css'
import styles from './layout.module.css'
import Navbar from 'components/Navbar'

export const metadata = {
  title: 'Kristal',
  description: 'A powerful DELTARUNE fangame engine.'
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"/>
      </head>
      <body>
        <Navbar/>
        <main className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>
            DELTARUNE by Toby Fox.
            Website designed by NyakoFox.
            © 2023 Kristal Team. All rights reserved.
          </footer>
      </body>
    </html>
  )
}

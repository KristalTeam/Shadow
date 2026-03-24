import './globals.css'
import styles from './layout.module.css'
import Navbar from 'components/Navbar'
import NextTopLoader from 'nextjs-toploader';
import NewTab from 'components/NewTab';

export const metadata = {
  title: 'Kristal',
  description: 'A powerful DELTARUNE fangame engine.',
  metadataBase: process.env.BASE_URL,
  openGraph: {
    url: "/",
    images: [
      {
        url: "/square_logo.png",
        width: 512,
        height: 512,
        alt: "Kristal Logo"
      }
    ]
  },
  twitter: {
    card: "summary",
  },
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"/>
      </head>
      <body>
        <NextTopLoader color="#00FFFF"/>
        <Navbar/>
        <main className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>
          <NewTab href="https://deltarune.com/">DELTARUNE</NewTab> by Toby Fox.<br/>
          Website designed by <NewTab href="https://nyako.dev/">NyakoFox</NewTab>.<br/>
          © 2026 Kristal Team. All rights reserved.
        </footer>
      </body>
    </html>
  )
}

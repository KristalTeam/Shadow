import './globals.css'
import localFont from 'next/font/local'
import styles from './layout.module.css'
import Navbar from 'components/Navbar'
import { Providers } from './providers'
import NewTab from 'components/NewTab';

const mainFont = localFont({
    src: [
        {
            path: "../public/8bitOperatorPlus-Regular.woff",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/8bitOperatorPlus-Bold.woff",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/8bitOperatorPlus-Bold.woff",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font",
});

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
    <html lang="en" className={mainFont.variable}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"/>
      </head>
      <body>
        <Providers>
          <Navbar/>
          <main className={styles.main}>
            {children}
          </main>
          <footer className={styles.footer}>
            <NewTab href="https://deltarune.com/">DELTARUNE</NewTab> by Toby Fox.<br/>
            Website designed by <NewTab href="https://nyako.dev/">NyakoFox</NewTab>.<br/>
            © 2026 Kristal Team. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  )
}

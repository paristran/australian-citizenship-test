import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import Navigation from '@/components/Navigation'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#00843D',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.getcitizenship.com.au'),
  title: {
    default: 'Australian Citizenship Practice Test | Free Practice Questions',
    template: '%s | GetCitizenship.com.au'
  },
  description: 'Prepare for your Australian citizenship test with 250+ free practice questions based on "Our Common Bond". Practice tests, study guides, and instant feedback. Pass your test with confidence!',
  keywords: ['Australian citizenship test', 'citizenship practice test', 'Our Common Bond', 'Australian citizenship questions', 'citizenship test 2025', 'Australian citizenship preparation'],
  authors: [{ name: 'GetCitizenship.com.au' }],
  creator: 'GetCitizenship.com.au',
  publisher: 'GetCitizenship.com.au',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://www.getcitizenship.com.au',
    siteName: 'Australian Citizenship Practice Test',
    title: 'Australian Citizenship Practice Test | Free Practice Questions',
    description: 'Prepare for your Australian citizenship test with 250+ free practice questions. Pass with confidence!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Australian Citizenship Practice Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Australian Citizenship Practice Test',
    description: '250+ free practice questions based on Our Common Bond. Pass your citizenship test!',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.getcitizenship.com.au',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PC5YTH4GEN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PC5YTH4GEN', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
        
        {/* Main Content */}
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

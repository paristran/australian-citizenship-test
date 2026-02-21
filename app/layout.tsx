import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Australian Citizenship Practice Test',
  description: 'Prepare for your Australian citizenship test with 1000+ practice questions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

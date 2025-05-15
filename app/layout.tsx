import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quadcydle Careers',
  description: 'Join our innovative team at Quadcydle',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

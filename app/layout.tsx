import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EngHub — Engineering Career Community',
  description:
    'Discuss salaries, share interview experiences, and connect with professionals across every engineering discipline.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

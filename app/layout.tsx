import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'EngHub — Engineering Career Community',
  description:
    'Discuss salaries, share interview experiences, and connect with professionals across every engineering discipline.',
}

const hasClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('placeholder')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="en">
      <body>{children}</body>
    </html>
  )

  return hasClerkKeys ? <ClerkProvider>{content}</ClerkProvider> : content
}

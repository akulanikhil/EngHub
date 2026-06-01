import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'EngyNation — Engineering Career Community',
  description:
    'Discuss salaries, share interview experiences, and connect with professionals across every engineering discipline.',
}

const hasClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('placeholder')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {hasClerkKeys ? (
          <ClerkProvider
            appearance={{
              variables: {
                colorModalBackdrop: 'rgba(0, 0, 0, 0.4)',
              },
              elements: {
                modalBackdrop: 'clerk-modal-backdrop',
              },
            }}
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}

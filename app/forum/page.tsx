import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/forum/Sidebar'
import PostFeed from '@/components/forum/PostFeed'

interface ForumPageProps {
  searchParams: Promise<{ major?: string; role?: string }>
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const params = await searchParams
  const major = params.major ?? 'cs'
  const role = params.role ?? 'all'

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar activeMajor={major} activeRole={role} />
        <PostFeed major={major} role={role} />
      </div>
    </div>
  )
}

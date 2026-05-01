// Placeholder feed — will be replaced with real DB queries in Sprint 2

interface Post {
  id: string
  author: string
  role: string
  title: string
  preview: string
  upvotes: number
  comments: number
  time: string
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'SoftwareEng23',
    role: 'Software Engineer',
    title: 'Honest review of my Amazon L5 interview process (2026)',
    preview: 'Just finished my Amazon loop last week. 5 rounds, heavy on LP questions. The bar raiser was actually the coding round, not what I expected...',
    upvotes: 142,
    comments: 38,
    time: '2h ago',
  },
  {
    id: '2',
    author: 'MLresearcher',
    role: 'ML / AI Engineer',
    title: "Negotiated $340k TC at a top AI lab — here's what worked",
    preview: 'After 3 competing offers I was able to get to $340k TC (base + RSUs). The key leverage point was playing offers against each other, not just asking for more...',
    upvotes: 289,
    comments: 74,
    time: '5h ago',
  },
  {
    id: '3',
    author: 'BackendDev_NYC',
    role: 'Backend Dev',
    title: 'Is Rust actually worth learning for backend in 2026?',
    preview: 'Been seeing more JDs asking for Rust, especially at infra companies. Coming from Go the learning curve is real, but the performance gains are hard to argue with...',
    upvotes: 67,
    comments: 45,
    time: '8h ago',
  },
  {
    id: '4',
    author: 'NewGradCS',
    role: 'Software Engineer',
    title: 'What nobody tells you about your first 90 days as a new grad SWE',
    preview: 'Six months in at my first job. Here are the things I wish someone had told me before I started — the onboarding reality vs. the recruiting pitch...',
    upvotes: 203,
    comments: 61,
    time: '1d ago',
  },
]

interface PostFeedProps {
  major: string
  role: string
}

export default function PostFeed({ major, role }: PostFeedProps) {
  const heading = role === 'all' ? 'All Roles' : role

  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-white">
          <span className="text-indigo-400 uppercase">{major}</span>
          <span className="text-[var(--text-muted)] mx-2">·</span>
          {heading}
        </h1>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors font-medium">
          + New Post
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-indigo-500/20 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                <button className="text-[var(--text-muted)] hover:text-indigo-400 transition-colors text-xs">▲</button>
                <span className="text-sm font-mono text-white font-medium">{post.upvotes}</span>
                <button className="text-[var(--text-muted)] hover:text-red-400 transition-colors text-xs">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                    {post.role}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {post.author} · {post.time}
                  </span>
                </div>
                <h2 className="font-display font-bold text-white mb-2 hover:text-indigo-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {post.preview}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-[var(--text-muted)]">💬 {post.comments} comments</span>
                  <button className="text-xs text-[var(--text-muted)] hover:text-white transition-colors">Share</button>
                  <button className="text-xs text-[var(--text-muted)] hover:text-white transition-colors">Save</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

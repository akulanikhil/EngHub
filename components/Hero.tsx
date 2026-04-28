import Link from 'next/link'

const stats = [
  { num: '8+', label: 'Engineering Majors' },
  { num: '80+', label: 'Career Tracks' },
  { num: 'AI', label: 'Career Advisor Built-in' },
  { num: 'Free', label: 'Always for Students' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          Now in Beta — Join the waitlist
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-tight mb-6">
          The Career Community<br />
          <span className="text-indigo-400">Built for Engineers</span>
        </h1>

        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10">
          Discuss salaries, share interview experiences, and connect with professionals
          across every engineering discipline — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Join EngHub Free →
          </Link>
          <Link href="#demo" className="px-6 py-3 text-[var(--text-muted)] hover:text-white transition-colors">
            Watch Demo ↓
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-black text-3xl text-white">{s.num}</div>
              <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

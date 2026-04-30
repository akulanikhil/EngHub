export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-[var(--bg-elevated)]">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-indigo-400 text-sm font-mono uppercase tracking-wider mb-3">Get Early Access</div>
        <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
          Join the waitlist
        </h2>
        <p className="text-[var(--text-muted)] mb-8">
          We're rolling out access to early members. Drop your email and we'll reach out
          when your major's community is ready.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="engineer@university.edu"
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Join Waitlist →
          </button>
        </form>
      </div>
    </section>
  )
}

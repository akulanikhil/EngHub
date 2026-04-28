const features = [
  {
    icon: '💬',
    title: 'Major-Specific Forums',
    desc: 'Dedicated channels for every engineering discipline. No more wading through irrelevant posts.',
  },
  {
    icon: '💰',
    title: 'Salary Transparency',
    desc: 'Crowd-sourced compensation data by role, company, YOE, and location — specific to your field.',
  },
  {
    icon: '🤖',
    title: 'AI Career Advisor',
    desc: 'Ask anything about your career path, interview prep, or salary expectations. Powered by Claude.',
  },
  {
    icon: '🎓',
    title: 'Student & Pro Tracks',
    desc: 'Separate spaces for students navigating internships and professionals leveling up their careers.',
  },
  {
    icon: '🔍',
    title: 'Interview Intel',
    desc: 'Real interview questions and experiences from engineers who have been through the process.',
  },
  {
    icon: '🌐',
    title: 'Cross-Discipline Networking',
    desc: 'Connect with engineers outside your major. Multidisciplinary careers are the new normal.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-indigo-400 text-sm font-mono uppercase tracking-wider mb-3">Features</div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Everything engineers need
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Built by engineers, for engineers. Every feature solves a real problem we've faced in our careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-indigo-500/30 transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

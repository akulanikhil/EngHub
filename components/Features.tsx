const features = [
  { icon: '🗂️', title: 'Major-Specific Forums', body: '8 engineering disciplines, each with dedicated spaces. No more wading through irrelevant content — find discussions that actually apply to your field.' },
  { icon: '💼', title: 'Role-Based Threads', body: 'Each major has 10+ career tracks. Discuss SWE vs ML Engineer, Structural vs Geotechnical — conversations organized around your exact role.' },
  { icon: '🤖', title: 'AI Career Advisor', body: 'Ask about salaries, interview prep, or career paths and get instant, field-specific guidance from our built-in AI advisor.' },
  { icon: '💰', title: 'Real Salary Discussions', body: 'Actual engineers sharing real comp data. Know what to expect and negotiate with confidence — by role, company, and experience level.' },
  { icon: '🎓', title: 'Student & Pro Friendly', body: "Whether you're a freshman exploring options or a 10-year veteran, EngHub has a place for you. Register as a student or experienced professional." },
  { icon: '🔗', title: 'Anonymous-Friendly', body: "Share candidly about your company, salary, or job search without fear. Like Blind, but built for all engineers — not just big tech." },
]

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="section-inner">
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">Built different,<br />for engineers</h2>
        <p className="section-sub">No finance bros. No generic advice. A platform built specifically around how engineers navigate careers.</p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-body">{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

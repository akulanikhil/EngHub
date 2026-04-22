const steps = [
  { num: '01', title: 'Create your account', body: 'Register as a student (with your year) or experienced professional. Choose your primary engineering major to personalize your feed.' },
  { num: '02', title: 'Find your discipline', body: 'Navigate to your engineering major and filter by the specific career track you\'re interested in — from ML Engineer to Propulsion Engineer.' },
  { num: '03', title: 'Join the conversation', body: 'Read real experiences, post questions, share salary data, or get instant answers from the AI Advisor — all in one place.' },
]

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="section-inner">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Simple.<br />Powerful.</h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>Get started in minutes and find the career insights you&apos;ve been looking for.</p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-body">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

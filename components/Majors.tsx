const majors = [
  { icon: '💻', name: 'Computer Science',       jobs: 'SWE · ML Engineer · DevOps · Security · PM',           bar: 'linear-gradient(90deg,#4f8ef7,#a78bfa)' },
  { icon: '⚡', name: 'Electrical Engineering',  jobs: 'IC Design · Embedded · RF · FPGA · Power',             bar: 'linear-gradient(90deg,#fbbf24,#f87171)' },
  { icon: '⚙️', name: 'Mechanical Engineering',  jobs: 'Robotics · Automotive · HVAC · Thermal · Design',      bar: 'linear-gradient(90deg,#f87171,#fbbf24)' },
  { icon: '🏗️', name: 'Civil Engineering',        jobs: 'Structural · Transportation · Geotechnical · Urban',   bar: 'linear-gradient(90deg,#34d399,#4f8ef7)' },
  { icon: '🧪', name: 'Chemical Engineering',     jobs: 'Process · Pharma · Petrochemical · Materials',         bar: 'linear-gradient(90deg,#a78bfa,#f472b6)' },
  { icon: '🚀', name: 'Aerospace Engineering',    jobs: 'Propulsion · Avionics · Structures · Space Systems',   bar: 'linear-gradient(90deg,#f472b6,#a78bfa)' },
  { icon: '🧬', name: 'Biomedical Engineering',   jobs: 'Med Devices · Bioinformatics · Clinical · Pharma',     bar: 'linear-gradient(90deg,#2dd4bf,#34d399)' },
  { icon: '🌱', name: 'Environmental Engineering', jobs: 'Sustainability · Water · Air Quality · Remediation',  bar: 'linear-gradient(90deg,#86efac,#34d399)' },
]

export default function Majors() {
  return (
    <section className="section" id="majors">
      <div className="section-inner">
        <div className="section-label">Engineering Disciplines</div>
        <h2 className="section-title">Your major.<br />Your community.</h2>
        <p className="section-sub">Eight dedicated communities, each with career tracks tailored to that discipline&apos;s real job landscape.</p>
        <div className="majors-grid">
          {majors.map((m) => (
            <div key={m.name} className="major-card">
              <div className="major-card-icon">{m.icon}</div>
              <div className="major-card-name">{m.name}</div>
              <div className="major-card-jobs">{m.jobs}</div>
              <div className="major-card-bar" style={{ background: m.bar }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

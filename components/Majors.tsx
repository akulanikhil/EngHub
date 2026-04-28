const majors = [
  { key: 'cs',    label: 'Computer Science',        short: 'CS',   color: 'bg-indigo-500',  roles: ['Software Engineer', 'ML Engineer', 'DevOps', 'PM'] },
  { key: 'elec',  label: 'Electrical Engineering',  short: 'EE',   color: 'bg-yellow-500',  roles: ['IC Design', 'Embedded Systems', 'RF Engineer', 'FPGA'] },
  { key: 'mech',  label: 'Mechanical Engineering',  short: 'ME',   color: 'bg-blue-500',    roles: ['Design Engineer', 'Robotics', 'Automotive', 'HVAC'] },
  { key: 'civil', label: 'Civil Engineering',        short: 'CE',   color: 'bg-green-500',   roles: ['Structural', 'Transportation', 'Geotechnical', 'Urban Planning'] },
  { key: 'chem',  label: 'Chemical Engineering',     short: 'ChE',  color: 'bg-orange-500',  roles: ['Process Engineer', 'Pharma', 'Petrochemical', 'R&D'] },
  { key: 'aero',  label: 'Aerospace Engineering',    short: 'AE',   color: 'bg-sky-500',     roles: ['Propulsion', 'Avionics', 'Structures', 'Spacecraft'] },
  { key: 'bio',   label: 'Biomedical Engineering',   short: 'BME',  color: 'bg-pink-500',    roles: ['Medical Devices', 'Bioinformatics', 'Clinical', 'Pharma'] },
  { key: 'env',   label: 'Environmental Engineering',short: 'EnvE', color: 'bg-emerald-500', roles: ['Water Quality', 'Air Quality', 'Sustainability', 'Remediation'] },
]

export default function Majors() {
  return (
    <section id="majors" className="py-24 px-6 bg-[var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-indigo-400 text-sm font-mono uppercase tracking-wider mb-3">By Major</div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Your discipline, your community
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            8 engineering majors, 80+ career tracks. Find the exact community for your path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {majors.map((m) => (
            <div
              key={m.key}
              className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-indigo-500/30 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center font-mono font-bold text-white text-xs mb-4`}>
                {m.short}
              </div>
              <h3 className="font-display font-bold text-white mb-3">{m.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {m.roles.map((r) => (
                  <span
                    key={r}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] border border-[var(--border)]"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

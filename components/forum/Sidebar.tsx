'use client'

import Link from 'next/link'

const MAJORS = [
  { key: 'cs',    label: 'Computer Science',         short: 'CS',   color: 'bg-indigo-500' },
  { key: 'elec',  label: 'Electrical Eng.',           short: 'EE',   color: 'bg-yellow-500' },
  { key: 'mech',  label: 'Mechanical Eng.',           short: 'ME',   color: 'bg-blue-500' },
  { key: 'civil', label: 'Civil Eng.',                short: 'CE',   color: 'bg-green-500' },
  { key: 'chem',  label: 'Chemical Eng.',             short: 'ChE',  color: 'bg-orange-500' },
  { key: 'aero',  label: 'Aerospace Eng.',            short: 'AE',   color: 'bg-sky-500' },
  { key: 'bio',   label: 'Biomedical Eng.',           short: 'BME',  color: 'bg-pink-500' },
  { key: 'env',   label: 'Environmental Eng.',        short: 'EnvE', color: 'bg-emerald-500' },
]

const ROLES: Record<string, string[]> = {
  cs:    ['All Roles', 'Software Engineer', 'Frontend Dev', 'Backend Dev', 'ML / AI Engineer', 'DevOps / SRE', 'Product Manager', 'Data Engineer', 'Security Engineer'],
  elec:  ['All Roles', 'IC Design Engineer', 'Embedded Systems', 'Power Electronics', 'RF Engineer', 'FPGA Engineer', 'Control Systems', 'Hardware Engineer'],
  mech:  ['All Roles', 'Design Engineer', 'Manufacturing Eng.', 'HVAC Engineer', 'Robotics Engineer', 'Automotive Engineer', 'Thermal Engineer'],
  civil: ['All Roles', 'Structural Engineer', 'Transportation Eng.', 'Geotechnical Eng.', 'Construction Mgr', 'Water Resources Eng.', 'Urban Planner'],
  chem:  ['All Roles', 'Process Engineer', 'R&D Chemist', 'Pharmaceutical Eng.', 'Materials Engineer', 'Plant Engineer', 'Quality Assurance'],
  aero:  ['All Roles', 'Aerodynamics Eng.', 'Propulsion Engineer', 'Avionics Engineer', 'Structures Engineer', 'Flight Test Eng.', 'Spacecraft Design'],
  bio:   ['All Roles', 'Medical Device Eng.', 'Tissue Engineering', 'Bioinformatics', 'Clinical Engineer', 'Regulatory Affairs', 'R&D Scientist'],
  env:   ['All Roles', 'Environmental Consult.', 'Water Quality Eng.', 'Air Quality Eng.', 'Remediation Eng.', 'Sustainability Eng.', 'Waste Management'],
}

interface SidebarProps {
  activeMajor: string
  activeRole: string
}

export default function Sidebar({ activeMajor, activeRole }: SidebarProps) {
  const roles = ROLES[activeMajor] ?? ROLES.cs

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-[var(--border)] bg-[var(--bg-card)] p-4 shrink-0 sticky top-16 overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-3">Major</div>
        <div className="space-y-0.5">
          {MAJORS.map((m) => (
            <Link
              key={m.key}
              href={`/forum?major=${m.key}&role=all`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeMajor === m.key
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-6 h-6 rounded ${m.color} flex items-center justify-center text-white text-xs font-mono font-bold shrink-0`}>
                {m.short.slice(0, 2)}
              </span>
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-3">Role</div>
        <div className="space-y-0.5">
          {roles.map((role) => {
            const slug = role === 'All Roles' ? 'all' : role.toLowerCase().replace(/[\s/.]+/g, '-')
            const isActive = activeRole === slug
            return (
              <Link
                key={role}
                href={`/forum?major=${activeMajor}&role=${slug}`}
                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                {role}
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

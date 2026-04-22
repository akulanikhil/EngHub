import Image from 'next/image'

const stats = [
  { label: 'CS / Software Career Demand', level: 'Very High', width: '92%', bar: 'linear-gradient(90deg,#4f8ef7,#a78bfa)' },
  { label: 'Electrical / Semiconductor',  level: 'High',      width: '80%', bar: 'linear-gradient(90deg,#fbbf24,#f87171)' },
  { label: 'Aerospace / Space Boom',      level: 'Growing Fast', width: '75%', bar: 'linear-gradient(90deg,#f472b6,#a78bfa)' },
  { label: 'Mechanical / Robotics',       level: 'Strong',    width: '70%', bar: 'linear-gradient(90deg,#f87171,#fbbf24)' },
  { label: 'Environmental / Sustainability', level: 'Rising', width: '62%', bar: 'linear-gradient(90deg,#34d399,#86efac)' },
  { label: 'Biomedical Engineering',      level: 'Steady',    width: '58%', bar: 'linear-gradient(90deg,#2dd4bf,#34d399)' },
]

const founders = [
  {
    name: 'Mohammad Najarzadegan',
    role: 'Co-Founder & CEO',
    bio: 'Visionary behind EngHub. Mohammad, a Finance and Accounting student at UKY, identified the gap in engineering career communities and drove the product from idea to launch.',
    img: '/images/Mnajarzadegan.jpg',
    linkedin: 'https://www.linkedin.com/in/mohammad-nj/',
    email: 'mailto:mohammad.nj@uky.edu',
  },
  {
    name: 'Henry Moore',
    role: 'Co-Founder & CFO',
    bio: 'Operations and growth lead for EngHub. Henry, a Finance and Accounting student at UKY, brings strategic thinking and hustle to building the community from the ground up.',
    img: '/images/HMoore.jpg',
    linkedin: 'https://www.linkedin.com/in/henry-moore-143541329/',
    email: 'mailto:henry.moore@uky.edu',
  },
  {
    name: 'Nikhil Akula',
    role: 'Co-Founder & CTO',
    bio: 'The technical brain of EngHub. Nikhil, a Computer Science and Finance student at UKY, architected and built the entire platform — from the forum engine to the AI advisor integration.',
    img: '/images/nakula.jpg',
    linkedin: 'https://www.linkedin.com/in/akulan/',
    email: 'mailto:nikhil.akula@uky.edu',
  },
]

export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-inner">
        <div className="section-label">About EngHub</div>
        <h2 className="section-title">Built by engineers,<br />for engineers</h2>

        <div className="story-grid">
          <div className="story-text">
            <p>We&apos;re a team of students at the <strong>University of Kentucky</strong> who got tired of having nowhere to talk honestly about engineering careers. Wall Street Oasis exists for finance. Blind exists for big tech. <strong>But what about the civil engineer trying to negotiate their first salary? Or the biomedical engineer deciding between med-tech and a PhD?</strong></p>
            <p>EngHub was born out of that frustration. We wanted a place where engineering students and professionals could have the kind of <strong>candid, specific conversations</strong> that actually help — organized by major, broken down by career track, and enhanced by AI.</p>
            <p>We&apos;re in early beta and growing. <strong>Join us and help shape what EngHub becomes.</strong></p>
          </div>
          <div className="story-visual">
            <div className="story-stat-row">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="story-stat-label">{s.label} <span>{s.level}</span></div>
                  <div className="story-stat-bar">
                    <div className="story-stat-fill" style={{ width: s.width, background: s.bar }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <div className="section-label">Meet the Founders</div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>The team behind<br />EngHub</h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, fontWeight: 300, marginBottom: 0 }}>Three University of Kentucky students who decided to build the community they always needed.</p>
        </div>

        <div className="founders-grid">
          {founders.map((f) => (
            <div key={f.name} className="founder-card">
              <div className="founder-photo">
                <div className="founder-photo-overlay"></div>
                <Image src={f.img} alt={f.name} width={400} height={220} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              </div>
              <div className="founder-info">
                <div className="founder-name">{f.name}</div>
                <div className="founder-role">{f.role}</div>
                <div className="founder-bio">{f.bio}</div>
                <div className="founder-links">
                  <a href={f.linkedin} className="founder-link" target="_blank" rel="noopener noreferrer">🔗 LinkedIn</a>
                  <a href={f.email} className="founder-link">✉️ Email</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

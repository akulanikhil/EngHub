import Image from 'next/image'

const team = [
  { name: 'N. Akula',          role: 'Founder',     image: '/images/nakula.jpg' },
  { name: 'H. Moore',          role: 'Co-Founder',  image: '/images/HMoore.jpg' },
  { name: 'M. Najarzadegan',   role: 'Co-Founder',  image: '/images/Mnajarzadegan.jpg' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-indigo-400 text-sm font-mono uppercase tracking-wider mb-3">About</div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Built by engineers
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            We felt the same frustrations — scattered advice, opaque salaries, and communities
            that didn't understand our specific discipline. So we built EngHub.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-indigo-500/30">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-medium text-white">{member.name}</div>
              <div className="text-sm text-[var(--text-muted)]">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

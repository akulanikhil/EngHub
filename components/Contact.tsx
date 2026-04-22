'use client'

import { useState } from 'react'

const methods = [
  { icon: '📧', label: 'General Inquiries',      value: 'hello@enghub.io' },
  { icon: '🎓', label: 'University Partnerships', value: 'partnerships@enghub.io' },
  { icon: '💼', label: 'Investors & Press',        value: 'investors@enghub.io' },
  { icon: '📍', label: 'Based At',                 value: 'University of Kentucky, Lexington KY' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="section" id="contact">
      <div className="section-inner">
        <div className="section-label">Get In Touch</div>
        <h2 className="section-title">We&apos;d love to<br />hear from you</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Let&apos;s connect</h3>
            <p>Whether you&apos;re a student wanting early access, a professor interested in collaborating, an investor, or just have feedback — we want to hear it. We&apos;re a small team and we actually read every message.</p>
            <div className="contact-methods">
              {methods.map((m) => (
                <div key={m.label} className="contact-method">
                  <div className="contact-method-icon">{m.icon}</div>
                  <div>
                    <div className="contact-method-label">{m.label}</div>
                    <div className="contact-method-value">{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-form">
            <h3>Send us a message</h3>
            {sent && <div className="alert success show">Thanks! We&apos;ll get back to you within 24 hours. 🚀</div>}
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" type="text" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="you@university.edu" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input form-select">
                  <option>General Feedback</option>
                  <option>University Partnership</option>
                  <option>Investor Inquiry</option>
                  <option>Bug Report</option>
                  <option>Press / Media</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" placeholder="Tell us what&apos;s on your mind…" required></textarea>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} type="submit">Send Message →</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

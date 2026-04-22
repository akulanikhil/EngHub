'use client'

import { useState } from 'react'

export default function Demo() {
  const [playing, setPlaying] = useState(false)
  const [activeThread, setActiveThread] = useState(0)

  function playDemo() {
    setPlaying(true)
    let i = 1
    const interval = setInterval(() => {
      setActiveThread(i % 3)
      i++
      if (i > 6) clearInterval(interval)
    }, 1500)
  }

  return (
    <section className="section" id="demo">
      <div className="section-inner">
        <div className="section-label">See It In Action</div>
        <h2 className="section-title">Everything you need,<br />in one platform</h2>
        <p className="section-sub">Watch how EngHub brings together career discussions, salary data, and AI advice — organized by your exact engineering major and job role.</p>

        <div className="demo-wrapper">
          <div className="demo-bar">
            <div className="demo-dot red"></div>
            <div className="demo-dot amber"></div>
            <div className="demo-dot green"></div>
            <div className="demo-url">enghub.io/forum/cs/software-engineer</div>
          </div>
          <div className="demo-screen">
            <div className="demo-app">
              <div className="demo-sidebar">
                <div className="demo-sidebar-logo">Eng<span>Hub</span></div>
                {[
                  { dot: '#505878', label: 'All Majors', active: false },
                  { dot: '#4f8ef7', label: 'Computer Science', active: true },
                  { dot: '#fbbf24', label: 'Electrical Eng.', active: false },
                  { dot: '#f87171', label: 'Mechanical Eng.', active: false },
                  { dot: '#34d399', label: 'Civil Eng.', active: false },
                  { dot: '#a78bfa', label: 'Chemical Eng.', active: false },
                  { dot: '#f472b6', label: 'Aerospace Eng.', active: false },
                ].map((item) => (
                  <div key={item.label} className={`demo-sidebar-item${item.active ? ' active' : ''}`}>
                    <div className="demo-sidebar-dot" style={{ background: item.dot }}></div>
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="demo-main">
                <div className="demo-topbar">
                  <div className="demo-topbar-title">Computer Science</div>
                  <div className="demo-topbar-btn">+ New Post</div>
                </div>
                <div className="demo-content">
                  <div className="demo-threads">
                    {[
                      { tag: 'CS', tagColor: 'rgba(79,142,247,0.15)', tagText: '#4f8ef7', title: 'Rejected from FAANG 3x — what finally worked', meta: '▲ 47 · 💬 12 · codeGrinder99' },
                      { tag: 'CS', tagColor: 'rgba(79,142,247,0.15)', tagText: '#4f8ef7', title: 'Is an MS in ML worth it for AI roles in 2025?', meta: '▲ 31 · 💬 8 · tensorFlow_Bro' },
                      { tag: 'AE', tagColor: 'rgba(167,139,250,0.15)', tagText: '#a78bfa', title: 'SpaceX Raptor team experience — AMA', meta: '▲ 89 · 💬 34 · raptorWrangler' },
                    ].map((t, i) => (
                      <div key={i} className={`demo-thread-item${activeThread === i ? ' active' : ''}`}>
                        <div className="demo-thread-tag" style={{ background: t.tagColor, color: t.tagText }}>{t.tag}</div>
                        <div className="demo-thread-title">{t.title}</div>
                        <div className="demo-thread-meta">{t.meta}</div>
                      </div>
                    ))}
                  </div>
                  <div className="demo-msgs">
                    <div className="demo-msg">
                      <div className="demo-msg-header">
                        <div className="demo-msg-avatar" style={{ background: '#4f8ef7' }}>cG</div>
                        <div className="demo-msg-name">codeGrinder99</div>
                      </div>
                      <div className="demo-msg-body">After failing 3 FAANG loops, I finally landed Meta L4. The key was switching from grinding random LeetCode to mastering 10 core patterns...</div>
                    </div>
                    <div className="demo-msg">
                      <div className="demo-msg-header">
                        <div className="demo-msg-avatar" style={{ background: '#34d399' }}>AA</div>
                        <div className="demo-msg-name">AlgoAmy</div>
                      </div>
                      <div className="demo-msg-body">Don&apos;t neglect behavioral! I bombed an Amazon loop because my STAR stories were weak even though my coding was fine.</div>
                    </div>
                    <div className="demo-msg ai">
                      <div className="demo-msg-header">
                        <div className="demo-msg-avatar" style={{ background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)' }}>🤖</div>
                        <div className="demo-msg-name" style={{ color: '#4f8ef7' }}>EngHub AI</div>
                      </div>
                      <div className="demo-msg-body">Top FAANG failure reasons: poor time management, not communicating thought process, weak behavioral stories...</div>
                      <div className="demo-typing"><span></span><span></span><span></span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!playing && (
              <div className="play-overlay">
                <div>
                  <div className="play-btn" onClick={playDemo}>▶</div>
                  <div className="play-label">Watch 60-second demo</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

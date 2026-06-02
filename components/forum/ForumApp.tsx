'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

// ── Static data ────────────────────────────────────────────────────
const MAJORS: Record<string, { label: string; short: string; colorClass: string }> = {
  cs:    { label: 'Computer Science', short: 'CS',   colorClass: 'mc-cs' },
  elec:  { label: 'Electrical Eng.',  short: 'EE',   colorClass: 'mc-elec' },
  mech:  { label: 'Mechanical Eng.',  short: 'ME',   colorClass: 'mc-mech' },
  civil: { label: 'Civil Engineering',short: 'CE',   colorClass: 'mc-civil' },
  chem:  { label: 'Chemical Eng.',    short: 'ChE',  colorClass: 'mc-chem' },
  aero:  { label: 'Aerospace Eng.',   short: 'AE',   colorClass: 'mc-aero' },
  bio:   { label: 'Biomedical Eng.',  short: 'BME',  colorClass: 'mc-bio' },
  env:   { label: 'Environmental Eng.',short:'EnvE', colorClass: 'mc-env' },
}

const JOBS: Record<string, string[]> = {
  cs:    ['All Roles','Software Engineer','Frontend Dev','Backend Dev','ML / AI Engineer','DevOps / SRE','Product Manager','Data Engineer','Security Engineer','Mobile Dev','Engineering Manager'],
  elec:  ['All Roles','IC Design Engineer','Embedded Systems','Power Electronics','RF Engineer','FPGA Engineer','Control Systems','Test Engineer','Hardware Engineer','Signal Processing','Systems Architect'],
  mech:  ['All Roles','Design Engineer','Manufacturing Eng.','HVAC Engineer','Automotive Engineer','Robotics Engineer','Structural Analyst','Thermal Engineer','Process Engineer','Quality Engineer','R&D Engineer'],
  civil: ['All Roles','Structural Engineer','Transportation Eng.','Geotechnical Eng.','Construction Mgr','Water Resources Eng.','Urban Planner','Bridge Engineer','Surveying Engineer','Project Manager','Site Engineer'],
  chem:  ['All Roles','Process Engineer','R&D Chemist','Petrochemical Eng.','Pharmaceutical Eng.','Materials Engineer','Plant Engineer','Quality Assurance','Safety Engineer','Environmental Eng.','Biochemical Eng.'],
  aero:  ['All Roles','Aerodynamics Eng.','Propulsion Engineer','Avionics Engineer','Structures Engineer','Flight Test Eng.','Mission Systems','Spacecraft Design','Satellite Engineer','Defense Systems','Systems Integration'],
  bio:   ['All Roles','Medical Device Eng.','Tissue Engineering','Bioinformatics','Clinical Engineer','Regulatory Affairs','R&D Scientist','Imaging Engineer','Prosthetics Eng.','Pharma Engineer','Biomechanics Eng.'],
  env:   ['All Roles','Environmental Consult.','Water Quality Eng.','Air Quality Eng.','Remediation Eng.','Sustainability Eng.','Waste Management','Environmental Planner','Climate Engineer','Eco Systems Eng.','Green Infrastructure'],
}

async function fetchAIResponse(message: string, context?: {
  threadTitle?: string
  threadContent?: string
  major?: string
  job?: string
}): Promise<string> {
  const r = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  })
  const j = await r.json()
  if (!r.ok) return j.error || 'Sorry, the AI advisor is unavailable right now.'
  return j.text || 'Sorry, I could not generate a response.'
}

// ── Types ─────────────────────────────────────────────────────────
interface ApiPost {
  id: string
  title: string
  content: string
  major: string
  job: string
  createdAt: string
  authorName: string | null
  authorEmail: string
  authorMajor: string
  commentCount: number
}

interface DisplayPost extends ApiPost {
  votes: number
  voted: boolean
}

interface ApiComment {
  id: string
  content: string
  createdAt: string
  authorName: string | null
  authorEmail: string
  authorMajor: string
}

interface DisplayComment extends ApiComment {
  votes: number
  voted: boolean
  downvoted: boolean
  isAI?: boolean
}

interface MeData {
  id: string
  major: string
  name: string | null
  email: string
}

// ── Helpers ────────────────────────────────────────────────────────
function majorColor(m: string) {
  const c: Record<string, string> = { cs:'#4f8ef7',elec:'#fbbf24',mech:'#f87171',civil:'#34d399',chem:'#a78bfa',aero:'#f472b6',bio:'#2dd4bf',env:'#86efac' }
  return c[m] || '#4f8ef7'
}

function formatBody(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .split('</p><p>').map((p: string) => `<p>${p}</p>`).join('')
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function displayName(name: string | null, email: string) {
  return name || email.split('@')[0]
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}


// ── Component ──────────────────────────────────────────────────────
export default function ForumApp() {
  const { user, isLoaded } = useUser()

  const [meData, setMeData]           = useState<MeData | null>(null)
  const [meLoading, setMeLoading]     = useState(true)
  const [posts, setPosts]             = useState<DisplayPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [comments, setComments]       = useState<Record<string, DisplayComment[]>>({})
  const [commentsLoading, setCommentsLoading] = useState(false)

  const [currentMajor, setCurrentMajor] = useState('all')
  const [currentJob, setCurrentJob]     = useState('All Roles')
  const [activePostId, setActivePostId] = useState<string | null>(null)
  const [search, setSearch]             = useState('')

  const [aiReplyMode, setAiReplyMode]   = useState(false)
  const [aiPanelOpen, setAiPanelOpen]   = useState(false)
  const [aiMessages, setAiMessages]     = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm your Engineering Career AI Advisor. Ask me anything about salaries, interview prep, career paths, industry trends, or specific roles in any engineering field." }
  ])
  const [aiInput, setAiInput]           = useState('')
  const [aiTyping, setAiTyping]         = useState(false)

  const [newPostModal, setNewPostModal] = useState(false)
  const [postMajor, setPostMajor]       = useState('')
  const [postJob, setPostJob]           = useState('')
  const [postTitle, setPostTitle]       = useState('')
  const [postBody, setPostBody]         = useState('')
  const [postAlert, setPostAlert]       = useState('')
  const [postSubmitting, setPostSubmitting] = useState(false)

  const [replyText, setReplyText]           = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiScrollRef    = useRef<HTMLDivElement>(null)

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) return
    fetch('/api/me')
      .then(r => r.json())
      .then(j => setMeData(j.data ?? null))
      .catch(() => setMeData(null))
      .finally(() => setMeLoading(false))
  }, [isLoaded, user])

  const fetchPosts = useCallback(() => {
    setPostsLoading(true)
    const url = currentMajor === 'all' ? '/api/posts' : `/api/posts?major=${currentMajor}`
    fetch(url)
      .then(r => r.json())
      .then(j => setPosts((j.data ?? []).map((p: ApiPost) => ({ ...p, votes: 0, voted: false }))))
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false))
  }, [currentMajor])

  useEffect(() => {
    if (!isLoaded || !user) return
    fetchPosts()
  }, [isLoaded, user, fetchPosts])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments, activePostId])

  useEffect(() => {
    if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight
  }, [aiMessages, aiTyping])

  // ── Forum actions ──────────────────────────────────────────────
  const filteredPosts = posts.filter(p => {
    if (currentJob && currentJob !== 'All Roles' && p.job !== currentJob) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.content.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function voteComment(postId: string, idx: number, up: boolean) {
    setComments(prev => {
      const list = [...(prev[postId] || [])]
      const m = { ...list[idx] }
      if (up) { m.voted = !m.voted; m.votes += m.voted ? 1 : -1; if (m.voted) m.downvoted = false }
      else { m.downvoted = !m.downvoted; if (m.downvoted && m.voted) { m.voted = false; m.votes-- } }
      list[idx] = m
      return { ...prev, [postId]: list }
    })
  }

  function votePost(postId: string) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const voted = !p.voted
      return { ...p, voted, votes: p.votes + (voted ? 1 : -1) }
    }))
  }

  async function openThread(postId: string) {
    setActivePostId(postId)
    if (comments[postId]) return  // already loaded
    setCommentsLoading(true)
    try {
      const r = await fetch(`/api/posts/${postId}/comments`)
      const j = await r.json()
      setComments(prev => ({
        ...prev,
        [postId]: (j.data ?? []).map((c: ApiComment) => ({ ...c, votes: 0, voted: false, downvoted: false }))
      }))
    } finally {
      setCommentsLoading(false)
    }
  }

  async function submitReply() {
    if (!activePostId) return
    if (aiReplyMode) {
      const post = posts.find(p => p.id === activePostId)!
      setReplySubmitting(true)
      try {
        const text = await fetchAIResponse('Generate a helpful reply for this thread.', {
          threadTitle: post.title,
          threadContent: post.content,
          major: post.major,
          job: post.job,
        })
        const aiComment: DisplayComment = {
          id: `ai-${Date.now()}`,
          content: text,
          createdAt: new Date().toISOString(),
          authorName: 'EngHub AI',
          authorEmail: 'ai@enghub.com',
          authorMajor: 'cs',
          votes: 0, voted: false, downvoted: false, isAI: true,
        }
        setComments(prev => ({ ...prev, [activePostId]: [...(prev[activePostId] || []), aiComment] }))
      } finally {
        setReplySubmitting(false)
      }
      return
    }
    if (!replyText.trim() || replySubmitting) return
    setReplySubmitting(true)
    try {
      const r = await fetch(`/api/posts/${activePostId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText.trim() }),
      })
      if (!r.ok) return
      const j = await r.json()
      const newComment: DisplayComment = {
        ...j.data,
        authorName:  meData?.name ?? null,
        authorEmail: meData?.email ?? '',
        authorMajor: meData?.major ?? 'cs',
        votes: 0, voted: false, downvoted: false,
      }
      setComments(prev => ({ ...prev, [activePostId]: [...(prev[activePostId] || []), newComment] }))
      setPosts(prev => prev.map(p => p.id === activePostId ? { ...p, commentCount: p.commentCount + 1 } : p))
      setReplyText('')
    } finally {
      setReplySubmitting(false)
    }
  }

  async function submitNewPost() {
    if (!postMajor || !postTitle.trim() || !postBody.trim()) { setPostAlert('Please fill all fields.'); return }
    if (postSubmitting) return
    setPostSubmitting(true)
    setPostAlert('')
    try {
      const r = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle.trim(), content: postBody.trim(), major: postMajor, job: postJob || 'All Roles' }),
      })
      if (!r.ok) {
        let msg = 'Failed to create post.'
        try { const j = await r.json(); msg = j.error || msg } catch {}
        setPostAlert(msg)
        return
      }
      setNewPostModal(false)
      setPostTitle(''); setPostBody(''); setPostMajor(''); setPostJob(''); setPostAlert('')
      // Reload posts — switch major filter to match new post if needed
      if (currentMajor !== 'all' && currentMajor !== postMajor) {
        setCurrentMajor(postMajor)
      } else {
        fetchPosts()
      }
    } finally {
      setPostSubmitting(false)
    }
  }

  async function sendAIMessage() {
    if (!aiInput.trim() || aiTyping) return
    const msg = aiInput.trim()
    setAiInput('')
    setAiMessages(prev => [...prev, { role: 'user', text: msg }])
    setAiTyping(true)
    try {
      const text = await fetchAIResponse(msg)
      setAiMessages(prev => [...prev, { role: 'bot', text }])
    } catch {
      setAiMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not connect to the AI advisor.' }])
    } finally {
      setAiTyping(false)
    }
  }

  // ── Loading / auth guard ───────────────────────────────────────
  if (!isLoaded || meLoading) {
    return (
      <div className="forum-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  const myName     = user ? (user.fullName || user.primaryEmailAddress?.emailAddress || 'You') : 'You'
  const myMajor    = meData?.major ?? 'cs'
  const myInitials = initials(myName)

  const activePost = activePostId ? posts.find(p => p.id === activePostId) : null
  const threadComments = activePostId ? (comments[activePostId] || []) : []

  // ── App screen ─────────────────────────────────────────────────
  return (
    <div className="forum-root">
      <div className="forum-layout">
        {/* SIDEBAR */}
        <nav className="forum-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">⚙️</div>
              Eng<span>Hub</span>
            </div>
            <div className="user-chip">
              <div className="f-avatar">{myInitials}</div>
              <div>
                <div className="avatar-name">{myName}</div>
                <div className="avatar-major">{MAJORS[myMajor]?.label}</div>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Engineering Majors</div>
            {[['all', 'All Majors', 'var(--text3)'], ...Object.entries(MAJORS).map(([k, v]) => [k, v.label, majorColor(k)])].map(([key, label, color]) => (
              <button key={key} className={`major-btn${currentMajor === key ? ' active' : ''}`} onClick={() => { setCurrentMajor(key as string); setCurrentJob('All Roles'); setActivePostId(null) }}>
                <span className="major-dot" style={{ background: color as string }}></span>
                {label}
                <span className="major-count">{key === 'all' ? posts.length : posts.filter(p => p.major === key).length}</span>
              </button>
            ))}
          </div>
          <div className="sidebar-actions">
            <button className="f-btn f-btn-primary" style={{ fontSize: 13.5 }} onClick={() => setNewPostModal(true)}>+ New Post</button>
          </div>
        </nav>

        {/* MAIN */}
        <div className="forum-main">
          <div className="topbar">
            <div className="topbar-title">{currentMajor === 'all' ? 'All Engineering' : MAJORS[currentMajor]?.label}</div>
            {currentMajor !== 'all' && (
              <div className={`topbar-major-badge f-badge ${MAJORS[currentMajor]?.colorClass}`}>{MAJORS[currentMajor]?.short}</div>
            )}
            <div className="topbar-actions">
              <button className="f-btn f-btn-sm f-btn-ai" onClick={() => setAiPanelOpen(o => !o)}>🤖 AI Advisor</button>
              <button className="f-btn f-btn-sm f-btn-ghost" onClick={() => setNewPostModal(true)}>+ New Post</button>
            </div>
          </div>

          <div className="content-area">
            {/* THREAD LIST */}
            <div className="thread-list-panel">
              <div className="panel-header">
                <span className="panel-title">Discussions</span>
                <span className="panel-count">{filteredPosts.length}</span>
                <div className="panel-actions">
                  <input className="form-input" style={{ width: 130, fontSize: 12, padding: '6px 10px' }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              {currentMajor !== 'all' && (
                <div className="job-tabs-scroll">
                  {(JOBS[currentMajor] || []).map(j => (
                    <button key={j} className={`job-tab${currentJob === j ? ' active' : ''}`} onClick={() => setCurrentJob(j)}>{j}</button>
                  ))}
                </div>
              )}
              <div className="thread-list">
                {postsLoading ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Loading discussions…</div>
                ) : filteredPosts.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                    No discussions yet.<br /><br />
                    <button className="f-btn f-btn-sm f-btn-ghost" onClick={() => setNewPostModal(true)}>Start the first one →</button>
                  </div>
                ) : filteredPosts.map(p => {
                  const m = MAJORS[p.major] ?? MAJORS.cs
                  const author = displayName(p.authorName, p.authorEmail)
                  return (
                    <div key={p.id} className={`thread-item${activePostId === p.id ? ' active' : ''}`} onClick={() => openThread(p.id)}>
                      <div className="thread-meta">
                        <span className={`thread-tag ${m.colorClass}`}>{m.short}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>{p.job || 'General'}</span>
                        <span className="thread-time">{timeAgo(p.createdAt)}</span>
                      </div>
                      <div className="thread-title">{p.title}</div>
                      <div className="thread-preview">{p.content}</div>
                      <div className="thread-footer">
                        <span className="thread-stat" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); votePost(p.id) }}>▲ {p.votes}</span>
                        <span className="thread-stat">💬 {p.commentCount}</span>
                        <div className="thread-author">
                          <div className="thread-author-avatar" style={{ background: majorColor(p.authorMajor) }}>{initials(author)}</div>
                          <span className="thread-author-name">{author}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* THREAD VIEW */}
            <div className="thread-view-panel">
              {!activePost ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <div className="empty-title">Select a discussion</div>
                  <div className="empty-sub">Pick a thread from the left to read and join the conversation</div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div className="thread-view-header">
                    <div className="thread-view-title">{activePost.title}</div>
                    <div className="thread-view-meta">
                      <span className={`f-badge ${MAJORS[activePost.major]?.colorClass}`}>{MAJORS[activePost.major]?.label}</span>
                      {activePost.job && activePost.job !== 'All Roles' && (
                        <span className="f-badge" style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>{activePost.job}</span>
                      )}
                      <span style={{ fontSize: 12.5, color: 'var(--text3)', marginLeft: 'auto' }}>
                        Posted by {displayName(activePost.authorName, activePost.authorEmail)} · {timeAgo(activePost.createdAt)} · {activePost.votes} votes
                      </span>
                    </div>
                  </div>
                  <div className="messages-scroll">
                    {/* Original post body as first message */}
                    <div className="message-card">
                      <div className="msg-header">
                        <div className="f-avatar" style={{ background: majorColor(activePost.authorMajor) }}>
                          {initials(displayName(activePost.authorName, activePost.authorEmail))}
                        </div>
                        <div>
                          <div className="msg-username">{displayName(activePost.authorName, activePost.authorEmail)}</div>
                        </div>
                        <span className="msg-time">{timeAgo(activePost.createdAt)}</span>
                      </div>
                      <div className="msg-body" dangerouslySetInnerHTML={{ __html: formatBody(activePost.content) }} />
                      <div className="msg-actions">
                        <button className={`vote-btn${activePost.voted ? ' voted' : ''}`} onClick={() => votePost(activePost.id)}>▲ {activePost.votes}</button>
                        <button className="reply-btn" onClick={() => document.getElementById('reply-ta')?.focus()}>↩ Reply</button>
                      </div>
                    </div>
                    {/* Comments */}
                    {commentsLoading && !threadComments.length ? (
                      <div style={{ padding: '16px 20px', color: 'var(--text3)', fontSize: 13 }}>Loading replies…</div>
                    ) : threadComments.map((c, idx) => (
                      <div key={c.id} className={`message-card${c.isAI ? ' ai-card' : ''}`}>
                        <div className="msg-header">
                          <div className="f-avatar" style={{ background: c.isAI ? '#4f8ef7' : majorColor(c.authorMajor) }}>
                            {c.isAI ? '🤖' : initials(displayName(c.authorName, c.authorEmail))}
                          </div>
                          <div>
                            <div className="msg-username">{c.isAI ? 'EngHub AI' : displayName(c.authorName, c.authorEmail)}</div>
                            {c.isAI && <div className="msg-role ai">AI Advisor</div>}
                          </div>
                          <span className="msg-time">{timeAgo(c.createdAt)}</span>
                        </div>
                        <div className="msg-body" dangerouslySetInnerHTML={{ __html: formatBody(c.content) }} />
                        <div className="msg-actions">
                          <button className={`vote-btn${c.voted ? ' voted' : ''}`} onClick={() => voteComment(activePost.id, idx, true)}>▲ {c.votes}</button>
                          <button className={`vote-btn down${c.downvoted ? ' voted' : ''}`} onClick={() => voteComment(activePost.id, idx, false)}>▼</button>
                          <button className="reply-btn" onClick={() => document.getElementById('reply-ta')?.focus()}>↩ Reply</button>
                          {c.isAI && <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 'auto' }}>🤖 AI Generated</span>}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="composer">
                    <div className="composer-header">
                      <div className="f-avatar">{myInitials}</div>
                      <span className="composer-label">Add your reply</span>
                      <div className="composer-ai-toggle">
                        <span style={{ fontSize: 12 }}>🤖 AI Reply</span>
                        <div className={`toggle-switch${aiReplyMode ? ' on' : ''}`} onClick={() => setAiReplyMode(o => !o)}></div>
                      </div>
                    </div>
                    <textarea id="reply-ta" className="composer-textarea" placeholder={aiReplyMode ? '🤖 AI will generate a reply based on this thread context…' : 'Share your experience, ask a question, or give advice…'} value={replyText} onChange={e => setReplyText(e.target.value)} disabled={aiReplyMode} />
                    <div className="composer-footer">
                      <span className="composer-hint">Markdown supported · Be respectful</span>
                      <button className="f-btn f-btn-primary f-btn-sm" style={{ width: 'auto' }} onClick={submitReply} disabled={replySubmitting}>
                        {replySubmitting ? 'Posting…' : 'Post Reply →'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI PANEL */}
            {aiPanelOpen && (
              <div className="ai-panel">
                <div className="ai-panel-header">
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span className="ai-panel-title">EngHub AI Advisor</span>
                  <button className="ai-close" onClick={() => setAiPanelOpen(false)}>✕</button>
                </div>
                <div className="ai-chat-scroll" ref={aiScrollRef}>
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`ai-msg ${m.role}`}>
                      {m.role === 'bot' && <div className="ai-icon">AI ADVISOR</div>}
                      <span dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }} />
                    </div>
                  ))}
                  {aiTyping && (
                    <div className="ai-msg bot">
                      <div className="ai-icon">AI ADVISOR</div>
                      <div className="typing"><span></span><span></span><span></span></div>
                    </div>
                  )}
                </div>
                <div className="ai-composer">
                  <input className="ai-input" placeholder="Ask about careers, salaries, interviews…" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendAIMessage() }} />
                  <button className="ai-send" onClick={sendAIMessage}>↑</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW POST MODAL */}
      {newPostModal && (
        <div className="forum-modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setNewPostModal(false) }}>
          <div className="forum-modal">
            <div className="forum-modal-title">✍️ Create New Discussion</div>
            {postAlert && <div className="f-alert error show">{postAlert}</div>}
            <div className="form-group">
              <label className="form-label">Engineering Major</label>
              <select className="form-input form-select" value={postMajor} onChange={e => { setPostMajor(e.target.value); setPostJob('') }}>
                <option value="">Select major…</option>
                <option value="cs">Computer Science / Software</option>
                <option value="elec">Electrical Engineering</option>
                <option value="mech">Mechanical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="chem">Chemical Engineering</option>
                <option value="aero">Aerospace Engineering</option>
                <option value="bio">Biomedical Engineering</option>
                <option value="env">Environmental Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Career / Job Role</label>
              <select className="form-input form-select" value={postJob} onChange={e => setPostJob(e.target.value)} disabled={!postMajor}>
                <option value="">{postMajor ? 'Select role (optional)…' : 'Select major first…'}</option>
                {(JOBS[postMajor] || []).map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input className="form-input" type="text" placeholder="e.g. How to negotiate salary as a new grad SWE?" value={postTitle} onChange={e => setPostTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea className="composer-textarea" style={{ minHeight: 110 }} placeholder="Share your experience, ask a question, or start a conversation…" value={postBody} onChange={e => setPostBody(e.target.value)} />
            </div>
            <div className="forum-modal-footer">
              <button className="f-btn f-btn-ghost f-btn-sm" style={{ width: 'auto' }} onClick={() => setNewPostModal(false)}>Cancel</button>
              <button className="f-btn f-btn-primary f-btn-sm" style={{ width: 'auto' }} onClick={submitNewPost} disabled={postSubmitting}>
                {postSubmitting ? 'Publishing…' : 'Publish Post →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

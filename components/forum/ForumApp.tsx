'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

// ── Static data (A–Z by full name) ─────────────────────────────────
const MAJORS: Record<string, { label: string; short: string; colorClass: string }> = {
  aero:  { label: 'Aerospace Eng.',    short: 'AE',   colorClass: 'mc-aero' },
  bio:   { label: 'Biomedical Eng.',   short: 'BME',  colorClass: 'mc-bio' },
  chem:  { label: 'Chemical Eng.',     short: 'ChE',  colorClass: 'mc-chem' },
  civil: { label: 'Civil Engineering', short: 'CE',   colorClass: 'mc-civil' },
  cs:    { label: 'Computer Science',  short: 'CS',   colorClass: 'mc-cs' },
  elec:  { label: 'Electrical Eng.',   short: 'EE',   colorClass: 'mc-elec' },
  env:   { label: 'Environmental Eng.',short: 'EnvE', colorClass: 'mc-env' },
  mech:  { label: 'Mechanical Eng.',   short: 'ME',   colorClass: 'mc-mech' },
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

const PAGE_SIZE = 15

function fmtCount(n: number): string {
  if (n >= 1000) return '1000+'
  if (n >= 100)  return '100+'
  return String(n)
}

async function streamAI(body: Record<string, unknown>, onUpdate: (fullText: string) => void) {
  const r = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || 'AI request failed') }
  if (!r.body) throw new Error('No response body')
  const reader = r.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    fullText += decoder.decode(value, { stream: true })
    onUpdate(fullText)
  }
}

// ── Types ─────────────────────────────────────────────────────────
interface ApiPost {
  id: string; title: string; content: string; major: string; job: string
  createdAt: string; authorId: string; authorUsername: string | null
  authorName: string | null; authorImageUrl: string | null
  authorEmail: string; authorMajor: string | null; commentCount: number
}
interface DisplayPost extends ApiPost { votes: number; voted: boolean }

interface ApiComment {
  id: string; content: string; isAi: boolean; createdAt: string
  authorId: string; authorUsername: string | null; authorName: string | null
  authorImageUrl: string | null; authorEmail: string; authorMajor: string | null
}
interface DisplayComment extends ApiComment {
  votes: number; voted: boolean; downvoted: boolean; isAI?: boolean
}

interface MeData { id: string; major: string | null; username: string | null; name: string | null; imageUrl: string | null; email: string }

// ── Helpers ────────────────────────────────────────────────────────
function majorColor(m: string) {
  const c: Record<string,string> = { cs:'#4f8ef7',elec:'#fbbf24',mech:'#f87171',civil:'#34d399',chem:'#a78bfa',aero:'#f472b6',bio:'#2dd4bf',env:'#86efac' }
  return c[m] || '#4f8ef7'
}
function formatBody(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br/>').split('</p><p>').map((p:string)=>`<p>${p}</p>`).join('')
}
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
function displayName(username: string | null, name: string | null, email: string) {
  return username || name || email.split('@')[0]
}
function initials(name: string) { return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) }

// Render avatar: real photo if available, otherwise coloured initials
function Avatar({ imageUrl, name, color, size = 28 }: { imageUrl?: string | null; name: string; color: string; size?: number }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    )
  }
  return (
    <div className="f-avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}>
      {initials(name)}
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────
export default function ForumApp() {
  const { user, isLoaded } = useUser()

  const [meData, setMeData]           = useState<MeData | null>(null)
  const [meLoading, setMeLoading]     = useState(true)
  const [posts, setPosts]             = useState<DisplayPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [page, setPage]               = useState(1)
  const [hasMore, setHasMore]         = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [postCounts, setPostCounts]   = useState<Record<string,number>>({})
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
  const [aiInput, setAiInput]   = useState('')
  const [aiTyping, setAiTyping] = useState(false)

  const [newPostModal, setNewPostModal] = useState(false)
  const [postMajor, setPostMajor]       = useState('')
  const [postJob, setPostJob]           = useState('')
  const [postTitle, setPostTitle]       = useState('')
  const [postBody, setPostBody]         = useState('')
  const [postAlert, setPostAlert]       = useState('')
  const [postSubmitting, setPostSubmitting] = useState(false)

  const [replyText, setReplyText]               = useState('')
  const [replySubmitting, setReplySubmitting]   = useState(false)

  // Edit/delete state
  const [editingPostId, setEditingPostId]             = useState<string | null>(null)
  const [editingPostContent, setEditingPostContent]   = useState('')
  const [editingCommentId, setEditingCommentId]       = useState<string | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiScrollRef    = useRef<HTMLDivElement>(null)

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) return
    fetch('/api/me')
      .then(r=>r.json())
      .then(j => {
        const me = j.data ?? null
        setMeData(me)
        // Patch any already-loaded posts/comments with fresh profile data
        // (guards against race where fetchPosts ran before ensureUser wrote to DB)
        if (me) {
          setPosts(prev => prev.map(p =>
            p.authorId === me.id
              ? { ...p, authorUsername: me.username, authorImageUrl: me.imageUrl, authorName: me.name }
              : p
          ))
          setComments(prev => {
            const updated: Record<string, DisplayComment[]> = {}
            for (const [postId, list] of Object.entries(prev)) {
              updated[postId] = list.map(c =>
                c.authorId === me.id
                  ? { ...c, authorUsername: me.username, authorImageUrl: me.imageUrl, authorName: me.name }
                  : c
              )
            }
            return updated
          })
        }
      })
      .catch(()=>setMeData(null))
      .finally(()=>setMeLoading(false))
    fetch('/api/posts/counts').then(r=>r.json()).then(j=>setPostCounts(j.data??{})).catch(()=>{})
  }, [isLoaded, user])

  const fetchPosts = useCallback((p = 1, append = false) => {
    if (p === 1) setPostsLoading(true); else setLoadingMore(true)
    const major = currentMajor === 'all' ? '' : `&major=${currentMajor}`
    fetch(`/api/posts?limit=${PAGE_SIZE}&page=${p}${major}`)
      .then(r=>r.json())
      .then(j => {
        const newPosts = (j.data ?? []).map((p: ApiPost) => ({ ...p, votes: 0, voted: false }))
        setPosts(prev => append ? [...prev, ...newPosts] : newPosts)
        setHasMore(newPosts.length === PAGE_SIZE)
        setPage(p)
      })
      .catch(()=>{ if (!append) setPosts([]) })
      .finally(()=>{ setPostsLoading(false); setLoadingMore(false) })
  }, [currentMajor])

  // Wait for meLoading to be false so ensureUser has synced imageUrl/username to DB
  // before the posts query runs its JOIN against the users table.
  useEffect(() => {
    if (!isLoaded || !user || meLoading) return
    setActivePostId(null)
    fetchPosts(1, false)
  }, [isLoaded, user, meLoading, fetchPosts])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [comments, activePostId])
  useEffect(() => { if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight }, [aiMessages, aiTyping])

  // ── Forum actions ──────────────────────────────────────────────
  const filteredPosts = posts.filter(p => {
    if (currentJob && currentJob !== 'All Roles' && p.job !== currentJob) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.content.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function voteComment(postId: string, idx: number, up: boolean) {
    setComments(prev => {
      const list = [...(prev[postId] || [])]; const m = { ...list[idx] }
      if (up) { m.voted = !m.voted; m.votes += m.voted ? 1 : -1; if (m.voted) m.downvoted = false }
      else { m.downvoted = !m.downvoted; if (m.downvoted && m.voted) { m.voted = false; m.votes-- } }
      list[idx] = m; return { ...prev, [postId]: list }
    })
  }

  function votePost(postId: string) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const voted = !p.voted; return { ...p, voted, votes: p.votes + (voted ? 1 : -1) }
    }))
  }

  async function openThread(postId: string) {
    setActivePostId(postId)
    setEditingPostId(null); setEditingCommentId(null)
    if (comments[postId]) return
    setCommentsLoading(true)
    try {
      const r = await fetch(`/api/posts/${postId}/comments`)
      const j = await r.json()
      setComments(prev => ({ ...prev, [postId]: (j.data ?? []).map((c: ApiComment) => ({ ...c, votes: 0, voted: false, downvoted: false, isAI: c.isAi })) }))
    } finally { setCommentsLoading(false) }
  }

  async function deletePost(postId: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.id !== postId))
    setPostCounts(prev => {
      const post = posts.find(p => p.id === postId)
      if (!post) return prev
      return { ...prev, [post.major]: Math.max(0, (prev[post.major] ?? 1) - 1) }
    })
    if (activePostId === postId) setActivePostId(null)
  }

  async function saveEditPost(postId: string) {
    if (!editingPostContent.trim()) return
    const r = await fetch(`/api/posts/${postId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editingPostContent }),
    })
    if (!r.ok) return
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: editingPostContent } : p))
    setComments(prev => {
      const list = prev[postId]; if (!list) return prev
      // Update the content in the first "original post" display if cached — not needed since we read from posts state
      return prev
    })
    setEditingPostId(null)
  }

  async function deleteComment(postId: string, commentId: string) {
    if (!confirm('Delete this reply?')) return
    await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' })
    setComments(prev => ({ ...prev, [postId]: (prev[postId] || []).filter(c => c.id !== commentId) }))
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentCount: Math.max(0, p.commentCount - 1) } : p))
  }

  async function saveEditComment(postId: string, commentId: string) {
    if (!editingCommentContent.trim()) return
    const r = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editingCommentContent }),
    })
    if (!r.ok) return
    setComments(prev => ({ ...prev, [postId]: (prev[postId] || []).map(c => c.id === commentId ? { ...c, content: editingCommentContent } : c) }))
    setEditingCommentId(null)
  }

  async function submitReply() {
    if (!activePostId) return
    if (aiReplyMode) {
      const postId = activePostId
      const post = posts.find(p => p.id === postId)!
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId]||[]), { id:`ai-${Date.now()}`, content:'', isAi:true, createdAt: new Date().toISOString(), authorId:'ai', authorUsername:null, authorName:'EngyNation AI', authorImageUrl:null, authorEmail:'ai@engynation.com', authorMajor:null, votes:0, voted:false, downvoted:false, isAI:true }] }))
      setReplySubmitting(true)
      try {
        let finalText = ''
        await streamAI({ message:'Write a helpful reply for this forum thread.', context:{ threadTitle:post.title, threadContent:post.content, major:post.major, job:post.job } }, (fullText) => {
          finalText = fullText
          setComments(prev => { const list=[...(prev[postId]||[])]; list[list.length-1]={...list[list.length-1],content:fullText}; return {...prev,[postId]:list} })
        })
        // Persist the AI reply to the database so it survives a refresh
        if (finalText.trim()) {
          const r = await fetch(`/api/posts/${postId}/comments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ content: finalText.trim(), isAi: true }) })
          if (r.ok) {
            const j = await r.json()
            // Swap the temp local id for the real DB id, keep isAI flag for this session
            setComments(prev => {
              const list = [...(prev[postId]||[])]
              list[list.length-1] = { ...list[list.length-1], id: j.data.id, createdAt: j.data.createdAt }
              return { ...prev, [postId]: list }
            })
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentCount: p.commentCount+1 } : p))
          }
        }
      } catch {
        setComments(prev => { const list=[...(prev[postId]||[])]; list[list.length-1]={...list[list.length-1],content:'Sorry, could not generate a reply.'}; return {...prev,[postId]:list} })
      } finally { setReplySubmitting(false) }
      return
    }
    if (!replyText.trim() || replySubmitting) return
    setReplySubmitting(true)
    try {
      const r = await fetch(`/api/posts/${activePostId}/comments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({content:replyText.trim()}) })
      if (!r.ok) return
      const j = await r.json()
      const newComment: DisplayComment = { ...j.data, authorId: meData?.id ?? '', authorUsername: meData?.username??null, authorName:meData?.name??null, authorImageUrl:meData?.imageUrl??null, authorEmail:meData?.email??'', authorMajor:meData?.major??null, votes:0, voted:false, downvoted:false }
      setComments(prev => ({ ...prev, [activePostId]: [...(prev[activePostId]||[]), newComment] }))
      setPosts(prev => prev.map(p => p.id === activePostId ? { ...p, commentCount: p.commentCount+1 } : p))
      setReplyText('')
    } finally { setReplySubmitting(false) }
  }

  async function submitNewPost() {
    if (!postMajor || !postTitle.trim() || !postBody.trim()) { setPostAlert('Please fill all fields.'); return }
    if (postSubmitting) return
    setPostSubmitting(true); setPostAlert('')
    try {
      const r = await fetch('/api/posts', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ title:postTitle.trim(), content:postBody.trim(), major:postMajor, job:postJob||'All Roles' }) })
      if (!r.ok) { let msg='Failed to create post.'; try { const j=await r.json(); msg=j.error||msg } catch {} setPostAlert(msg); return }
      setNewPostModal(false); setPostTitle(''); setPostBody(''); setPostMajor(''); setPostJob(''); setPostAlert('')
      setPostCounts(prev => ({ ...prev, [postMajor]: (prev[postMajor] ?? 0) + 1 }))
      if (currentMajor !== 'all' && currentMajor !== postMajor) { setCurrentMajor(postMajor) } else { fetchPosts(1, false) }
    } finally { setPostSubmitting(false) }
  }

  async function sendAIMessage() {
    if (!aiInput.trim() || aiTyping) return
    const msg = aiInput.trim(); setAiInput('')
    setAiMessages(prev => [...prev, { role:'user', text:msg }, { role:'bot', text:'' }])
    setAiTyping(true)
    try {
      await streamAI({ message:msg }, (fullText) => { setAiMessages(prev => { const msgs=[...prev]; msgs[msgs.length-1]={role:'bot',text:fullText}; return msgs }) })
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Sorry, could not connect to the AI advisor.'
      setAiMessages(prev => { const msgs=[...prev]; msgs[msgs.length-1]={role:'bot',text:errMsg}; return msgs })
    } finally { setAiTyping(false) }
  }

  // ── Loading / auth guard ───────────────────────────────────────
  if (!isLoaded || meLoading) {
    return (
      <div className="forum-root" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
        <div style={{ color:'var(--text3)', fontSize:14 }}>Loading…</div>
      </div>
    )
  }

  const myName     = meData?.username || user?.fullName || user?.primaryEmailAddress?.emailAddress || 'You'
  const myMajor    = meData?.major ?? null
  const myImageUrl = meData?.imageUrl ?? user?.imageUrl ?? null
  const myInitials = initials(myName)
  const activePost = activePostId ? posts.find(p => p.id === activePostId) : null
  const threadComments = activePostId ? (comments[activePostId] || []) : []
  const isMyPost = (p: DisplayPost) => !!meData && p.authorId === meData.id
  const isMyComment = (c: DisplayComment) => !!meData && c.authorId === meData.id

  // ── App screen ─────────────────────────────────────────────────
  return (
    <div className="forum-root">
      <div className="forum-layout">
        {/* SIDEBAR */}
        <nav className="forum-sidebar">
          <div className="sidebar-header">
            <Link href="/" className="sidebar-logo" style={{ textDecoration:'none', color:'inherit' }}>
              <div className="sidebar-logo-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="EngyNation" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              Engy<span>Nation</span>
            </Link>
            <div className="user-chip">
              <Avatar imageUrl={myImageUrl} name={myName} color={majorColor(myMajor ?? 'cs')} size={32} />
              <div>
                <div className="avatar-name">{myName}</div>
                <div className="avatar-major">{myMajor ? (MAJORS[myMajor]?.label ?? 'General') : 'General'}</div>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Engineering Majors</div>
            {([['all', 'All Majors', 'var(--text3)'] as [string,string,string], ...Object.entries(MAJORS).map(([k,v]) => [k, v.label, majorColor(k)] as [string,string,string])]).map(([key, label, color]) => {
              const count = key === 'all' ? Object.values(postCounts).reduce((a,b)=>a+b,0) : (postCounts[key] ?? 0)
              return (
                <button key={key} className={`major-btn${currentMajor===key?' active':''}`} onClick={()=>{ setCurrentMajor(key); setCurrentJob('All Roles'); setActivePostId(null) }}>
                  <span className="major-dot" style={{ background:color }}></span>
                  {label}
                  <span className="major-count">{fmtCount(count)}</span>
                </button>
              )
            })}
          </div>
          <div className="sidebar-actions">
            <button className="f-btn f-btn-primary" style={{ fontSize:13.5 }} onClick={()=>setNewPostModal(true)}>+ New Post</button>
          </div>
        </nav>

        {/* MAIN */}
        <div className="forum-main">
          <div className="topbar">
            <div className="topbar-title">{currentMajor==='all' ? 'All Engineering' : MAJORS[currentMajor]?.label}</div>
            {currentMajor !== 'all' && (
              <div className={`topbar-major-badge f-badge ${MAJORS[currentMajor]?.colorClass}`}>{MAJORS[currentMajor]?.short}</div>
            )}
            <div className="topbar-actions">
              <ThemeToggle />
              <button className="f-btn f-btn-sm f-btn-ai" onClick={()=>setAiPanelOpen(o=>!o)}>🤖 AI Advisor</button>
              <button className="f-btn f-btn-sm f-btn-ghost" onClick={()=>setNewPostModal(true)}>+ New Post</button>
            </div>
          </div>

          <div className="content-area">
            {/* THREAD LIST */}
            <div className="thread-list-panel">
              <div className="panel-header">
                <span className="panel-title">Discussions</span>
                <span className="panel-count">{filteredPosts.length}{hasMore ? '+' : ''}</span>
                <div className="panel-actions">
                  <input className="form-input" style={{ width:130, fontSize:12, padding:'6px 10px' }} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
              </div>
              {currentMajor !== 'all' && (
                <div className="job-tabs-scroll">
                  {(JOBS[currentMajor]||[]).map(j=>(
                    <button key={j} className={`job-tab${currentJob===j?' active':''}`} onClick={()=>setCurrentJob(j)}>{j}</button>
                  ))}
                </div>
              )}
              <div className="thread-list">
                {postsLoading ? (
                  <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--text3)', fontSize:13 }}>Loading discussions…</div>
                ) : filteredPosts.length === 0 ? (
                  <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--text3)', fontSize:13 }}>
                    No discussions yet.<br /><br />
                    <button className="f-btn f-btn-sm f-btn-ghost" onClick={()=>setNewPostModal(true)}>Start the first one →</button>
                  </div>
                ) : (
                  <>
                    {filteredPosts.map(p => {
                      const m = MAJORS[p.major] ?? MAJORS.cs
                      const author = displayName(p.authorUsername, p.authorName, p.authorEmail)
                      return (
                        <div key={p.id} className={`thread-item${activePostId===p.id?' active':''}`} onClick={()=>openThread(p.id)}>
                          <div className="thread-meta">
                            <span className={`thread-tag ${m.colorClass}`}>{m.short}</span>
                            <span style={{ fontSize:11.5, color:'var(--text3)' }}>{p.job||'General'}</span>
                            <span className="thread-time">{timeAgo(p.createdAt)}</span>
                          </div>
                          <div className="thread-title">{p.title}</div>
                          <div className="thread-preview">{p.content}</div>
                          <div className="thread-footer">
                            <span className="thread-stat" style={{ cursor:'pointer' }} onClick={e=>{ e.stopPropagation(); votePost(p.id) }}>▲ {p.votes}</span>
                            <span className="thread-stat">💬 {p.commentCount}</span>
                            <div className="thread-author">
                              <Avatar imageUrl={p.authorImageUrl} name={author} color={majorColor(p.authorMajor ?? 'cs')} size={20} />
                              <span className="thread-author-name">{author}</span>
                            </div>
                            {isMyPost(p) && (
                              <button className="thread-delete-btn" title="Delete post" onClick={e=>{ e.stopPropagation(); deletePost(p.id) }}>🗑</button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {hasMore && (
                      <div style={{ padding:'16px 20px', textAlign:'center' }}>
                        <button className="f-btn f-btn-ghost f-btn-sm" style={{ width:'auto' }} onClick={()=>fetchPosts(page+1, true)} disabled={loadingMore}>
                          {loadingMore ? 'Loading…' : 'Load more →'}
                        </button>
                      </div>
                    )}
                  </>
                )}
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
                <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                  <div className="thread-view-header">
                    <div className="thread-view-title">{activePost.title}</div>
                    <div className="thread-view-meta">
                      <span className={`f-badge ${MAJORS[activePost.major]?.colorClass}`}>{MAJORS[activePost.major]?.label}</span>
                      {activePost.job && activePost.job !== 'All Roles' && (
                        <span className="f-badge" style={{ background:'var(--surface2)', color:'var(--text2)' }}>{activePost.job}</span>
                      )}
                      <span style={{ fontSize:12.5, color:'var(--text3)', marginLeft:'auto' }}>
                        Posted by {displayName(activePost.authorUsername, activePost.authorName, activePost.authorEmail)} · {timeAgo(activePost.createdAt)} · {activePost.votes} votes
                      </span>
                    </div>
                  </div>
                  <div className="messages-scroll">
                    {/* Original post body */}
                    <div className="message-card">
                      <div className="msg-header">
                        <Avatar imageUrl={activePost.authorImageUrl} name={displayName(activePost.authorUsername, activePost.authorName, activePost.authorEmail)} color={majorColor(activePost.authorMajor ?? 'cs')} />
                        <div>
                          <div className="msg-username">{displayName(activePost.authorUsername, activePost.authorName, activePost.authorEmail)}</div>
                        </div>
                        <span className="msg-time">{timeAgo(activePost.createdAt)}</span>
                        {isMyPost(activePost) && (
                          <div className="msg-owner-actions">
                            <button className="owner-btn" onClick={()=>{ setEditingPostId(activePost.id); setEditingPostContent(activePost.content) }}>✏️</button>
                            <button className="owner-btn" onClick={()=>deletePost(activePost.id)}>🗑</button>
                          </div>
                        )}
                      </div>
                      {editingPostId === activePost.id ? (
                        <div className="edit-box">
                          <textarea className="composer-textarea" style={{ minHeight:80 }} value={editingPostContent} onChange={e=>setEditingPostContent(e.target.value)} />
                          <div style={{ display:'flex', gap:8, marginTop:8 }}>
                            <button className="f-btn f-btn-primary f-btn-sm" style={{ width:'auto' }} onClick={()=>saveEditPost(activePost.id)}>Save</button>
                            <button className="f-btn f-btn-ghost f-btn-sm" style={{ width:'auto' }} onClick={()=>setEditingPostId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="msg-body" dangerouslySetInnerHTML={{ __html:formatBody(activePost.content) }} />
                      )}
                      <div className="msg-actions">
                        <button className={`vote-btn${activePost.voted?' voted':''}`} onClick={()=>votePost(activePost.id)}>▲ {activePost.votes}</button>
                        <button className="reply-btn" onClick={()=>document.getElementById('reply-ta')?.focus()}>↩ Reply</button>
                      </div>
                    </div>
                    {/* Comments */}
                    {commentsLoading && !threadComments.length ? (
                      <div style={{ padding:'16px 20px', color:'var(--text3)', fontSize:13 }}>Loading replies…</div>
                    ) : threadComments.map((c, idx) => (
                      <div key={c.id} className={`message-card${c.isAI?' ai-card':''}`}>
                        <div className="msg-header">
                          {c.isAI
                            ? <div className="f-avatar" style={{ background:'#4f8ef7' }}>🤖</div>
                            : <Avatar imageUrl={c.authorImageUrl} name={displayName(c.authorUsername, c.authorName, c.authorEmail)} color={majorColor(c.authorMajor ?? 'cs')} />
                          }
                          <div>
                            <div className="msg-username">{c.isAI ? 'EngyNation AI' : displayName(c.authorUsername, c.authorName, c.authorEmail)}</div>
                            {c.isAI && <div className="msg-role ai">AI Advisor</div>}
                          </div>
                          <span className="msg-time">{timeAgo(c.createdAt)}</span>
                          {!c.isAI && isMyComment(c) && (
                            <div className="msg-owner-actions">
                              <button className="owner-btn" onClick={()=>{ setEditingCommentId(c.id); setEditingCommentContent(c.content) }}>✏️</button>
                              <button className="owner-btn" onClick={()=>deleteComment(activePost.id, c.id)}>🗑</button>
                            </div>
                          )}
                        </div>
                        {editingCommentId === c.id ? (
                          <div className="edit-box">
                            <textarea className="composer-textarea" style={{ minHeight:60 }} value={editingCommentContent} onChange={e=>setEditingCommentContent(e.target.value)} />
                            <div style={{ display:'flex', gap:8, marginTop:8 }}>
                              <button className="f-btn f-btn-primary f-btn-sm" style={{ width:'auto' }} onClick={()=>saveEditComment(activePost.id, c.id)}>Save</button>
                              <button className="f-btn f-btn-ghost f-btn-sm" style={{ width:'auto' }} onClick={()=>setEditingCommentId(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="msg-body" dangerouslySetInnerHTML={{ __html:formatBody(c.content) }} />
                        )}
                        <div className="msg-actions">
                          <button className={`vote-btn${c.voted?' voted':''}`} onClick={()=>voteComment(activePost.id, idx, true)}>▲ {c.votes}</button>
                          <button className={`vote-btn down${c.downvoted?' voted':''}`} onClick={()=>voteComment(activePost.id, idx, false)}>▼</button>
                          <button className="reply-btn" onClick={()=>document.getElementById('reply-ta')?.focus()}>↩ Reply</button>
                          {c.isAI && <span style={{ fontSize:11, color:'var(--accent)', marginLeft:'auto' }}>🤖 AI Generated</span>}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="composer">
                    <div className="composer-header">
                      <Avatar imageUrl={myImageUrl} name={myName} color={majorColor(myMajor ?? 'cs')} />
                      <span className="composer-label">Add your reply</span>
                      <div className="composer-ai-toggle">
                        <span style={{ fontSize:12 }}>🤖 AI Reply</span>
                        <div className={`toggle-switch${aiReplyMode?' on':''}`} onClick={()=>setAiReplyMode(o=>!o)}></div>
                      </div>
                    </div>
                    <textarea id="reply-ta" className="composer-textarea" placeholder={aiReplyMode ? '🤖 AI will generate a reply based on this thread context…' : 'Share your experience, ask a question, or give advice…'} value={replyText} onChange={e=>setReplyText(e.target.value)} disabled={aiReplyMode} />
                    <div className="composer-footer">
                      <span className="composer-hint">Markdown supported · Be respectful</span>
                      <button className="f-btn f-btn-primary f-btn-sm" style={{ width:'auto' }} onClick={submitReply} disabled={replySubmitting}>
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
                  <span style={{ fontSize:16 }}>🤖</span>
                  <span className="ai-panel-title">EngyNation AI Advisor</span>
                  <button className="ai-close" onClick={()=>setAiPanelOpen(false)}>✕</button>
                </div>
                <div className="ai-chat-scroll" ref={aiScrollRef}>
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`ai-msg ${m.role}`}>
                      {m.role === 'bot' && <div className="ai-icon">AI ADVISOR</div>}
                      {m.role==='bot' && !m.text && aiTyping && i===aiMessages.length-1
                        ? <div className="typing"><span></span><span></span><span></span></div>
                        : <span dangerouslySetInnerHTML={{ __html:m.text.replace(/\n/g,'<br/>') }} />
                      }
                    </div>
                  ))}
                </div>
                <div className="ai-composer">
                  <input className="ai-input" placeholder="Ask about careers, salaries, interviews…" value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') sendAIMessage() }} />
                  <button className="ai-send" onClick={sendAIMessage}>↑</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW POST MODAL */}
      {newPostModal && (
        <div className="forum-modal-overlay open" onClick={e=>{ if(e.target===e.currentTarget) setNewPostModal(false) }}>
          <div className="forum-modal">
            <div className="forum-modal-title">✍️ Create New Discussion</div>
            {postAlert && <div className="f-alert error show">{postAlert}</div>}
            <div className="form-group">
              <label className="form-label">Engineering Major</label>
              <select className="form-input form-select" value={postMajor} onChange={e=>{ setPostMajor(e.target.value); setPostJob('') }}>
                <option value="">Select major…</option>
                <option value="aero">Aerospace Engineering</option>
                <option value="bio">Biomedical Engineering</option>
                <option value="chem">Chemical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="cs">Computer Science / Software</option>
                <option value="elec">Electrical Engineering</option>
                <option value="env">Environmental Engineering</option>
                <option value="mech">Mechanical Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Career / Job Role</label>
              <select className="form-input form-select" value={postJob} onChange={e=>setPostJob(e.target.value)} disabled={!postMajor}>
                <option value="">{postMajor ? 'Select role (optional)…' : 'Select major first…'}</option>
                {(JOBS[postMajor]||[]).map(j=><option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input className="form-input" type="text" placeholder="e.g. How to negotiate salary as a new grad SWE?" value={postTitle} onChange={e=>setPostTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea className="composer-textarea" style={{ minHeight:110 }} placeholder="Share your experience, ask a question, or start a conversation…" value={postBody} onChange={e=>setPostBody(e.target.value)} />
            </div>
            <div className="forum-modal-footer">
              <button className="f-btn f-btn-ghost f-btn-sm" style={{ width:'auto' }} onClick={()=>setNewPostModal(false)}>Cancel</button>
              <button className="f-btn f-btn-primary f-btn-sm" style={{ width:'auto' }} onClick={submitNewPost} disabled={postSubmitting}>
                {postSubmitting ? 'Publishing…' : 'Publish Post →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

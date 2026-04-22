'use client'

import { useState, useRef, useEffect } from 'react'

// ── DATA ──────────────────────────────────────────────────────────
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

const AI_KNOWLEDGE: Record<string, Record<string, string>> = {
  cs: {
    'Software Engineer': 'Software Engineers at top tech companies (FAANG) earn $150k–$250k+ with RSUs. Entry level is typically $120–180k TC. Focus on DSA for interviews — LeetCode medium is standard. Strong demand across all industries.',
    'ML / AI Engineer': 'ML Engineers are among the highest-paid in tech. Senior ML roles at top companies often exceed $300k TC. Python, PyTorch/TensorFlow, and understanding of math (linear algebra, stats) are must-haves. The field is booming.',
    default: 'CS graduates have incredible versatility. The highest-paying roles include ML, distributed systems, and FAANG SWE. Interview prep typically takes 3–6 months. Focus on system design and algorithms for senior roles.',
  },
  elec: {
    'IC Design Engineer': 'IC Design is highly specialized and well-compensated. TSMC, Intel, Qualcomm, NVIDIA, and Apple Silicon teams pay $130–200k+ for experienced engineers. Requires deep knowledge of VLSI, Verilog/VHDL, and EDA tools.',
    default: 'EE graduates have strong career paths in semiconductors, defense, automotive, and consumer electronics. The semiconductor boom post-CHIPS Act has increased demand significantly.',
  },
  mech: {
    'Robotics Engineer': 'Robotics Engineering sits at the intersection of ME, EE, and CS. Extremely hot field — Tesla, Boston Dynamics, Amazon Robotics are top employers. Salaries $90–160k. ROS, Python, and kinematics are key skills.',
    default: 'ME is one of the most versatile engineering degrees. The rise of robotics, EVs, and advanced manufacturing has created strong demand. Average starting salary is $70–90k, rising significantly with experience.',
  },
  civil: {
    default: 'Civil engineering offers stability and the opportunity to shape physical infrastructure. Government and consulting are the two main paths. PE licensure is highly recommended for career advancement.',
  },
  chem: {
    default: 'ChE graduates have flexibility in oil & gas, pharma, materials, and sustainability. The energy transition is creating new opportunities in green hydrogen and carbon capture.',
  },
  aero: {
    'Propulsion Engineer': 'Propulsion engineers are critical for the space economy boom. SpaceX, Blue Origin, Rocket Lab, and NASA/JPL are top employers. Salaries range $85–160k. CFD skills (ANSYS Fluent) and thermodynamics depth are key.',
    default: 'Aerospace is experiencing a renaissance with commercial space. Traditional defense firms and new space companies (SpaceX, Blue Origin, Relativity) offer exciting opportunities. Average starting salary $75–100k.',
  },
  bio: {
    default: 'BME graduates often pursue medical school, MD/PhD programs, or industry roles in med-tech. The aging population drives strong demand. Skills bridging biology and engineering are extremely valuable.',
  },
  env: {
    default: 'Environmental engineering is increasingly important as climate concerns drive regulation and investment. The Inflation Reduction Act has supercharged clean energy and environmental consulting.',
  },
}

interface Message { id: number; author: string; authorMajor: string; role: string | null; time: string; body: string; votes: number; voted: boolean; downvoted: boolean }
interface Thread { id: number; major: string; job: string; title: string; body: string; author: string; authorMajor: string; time: string; votes: number; tags: string[] }
interface User { email: string; password: string; name: string; major: string }

const SEED_THREADS: Thread[] = [
  { id: 1, major: 'cs',    job: 'Software Engineer',    title: 'Rejected from FAANG 3 times — what actually worked for me on the 4th', body: "After failing coding interviews at Google, Meta, and Amazon, I finally landed a SWE role at Meta L4. Here's what changed...", author: 'codeGrinder99',   authorMajor: 'cs',    time: '2h ago',  votes: 47, tags: ['Interview','FAANG'] },
  { id: 2, major: 'cs',    job: 'ML / AI Engineer',     title: 'Is an MS in ML worth it for AI Engineer roles in 2025?',               body: "I'm 2 years into my career as a SWE and considering going back for an MSML from CMU or Stanford. Does the degree actually open doors or is self-study enough now?", author: 'tensorFlow_Bro',  authorMajor: 'cs',    time: '4h ago',  votes: 31, tags: ['Education','ML/AI'] },
  { id: 3, major: 'elec',  job: 'IC Design Engineer',   title: 'NVIDIA vs Intel IC Design offers — how to decide?',                    body: 'Got offers from both NVIDIA RTX GPU team and Intel Silicon Engineering. NVIDIA pays 30% more but Intel has better WLB from what I hear. Thoughts?', author: 'vlsiVictor',       authorMajor: 'elec',  time: '6h ago',  votes: 28, tags: ['Offers','Semiconductors'] },
  { id: 4, major: 'mech',  job: 'Robotics Engineer',    title: 'Boston Dynamics vs Tesla Bot — which team is more exciting to work on?', body: 'I have a recruiter reaching out from both teams. Both seem incredible from a technical perspective. Anyone have insight into culture and day-to-day work?', author: 'mechaMonk',        authorMajor: 'mech',  time: '1d ago',  votes: 52, tags: ['Robotics','Career'] },
  { id: 5, major: 'aero',  job: 'Propulsion Engineer',  title: 'SpaceX Raptor team experience — AMA',                                   body: 'Just finished 2 years on the Raptor engine combustion team. Happy to answer questions about the interview process, day-to-day work, and what they actually look for.', author: 'raptorWrangler',   authorMajor: 'aero',  time: '1d ago',  votes: 89, tags: ['SpaceX','AMA'] },
  { id: 6, major: 'civil', job: 'Structural Engineer',  title: 'PE exam prep — best resources for structural section?',                 body: "Taking the PE next spring. Anyone have good structural study resources? Currently using Lindeburg but wondering if there's something better for the CBT format.", author: 'bridgeBuilder23', authorMajor: 'civil', time: '2d ago',  votes: 18, tags: ['PE Exam','Study'] },
  { id: 7, major: 'chem',  job: 'Process Engineer',     title: 'Oil & Gas vs. Green Energy — where is ChE headed?',                    body: 'I have an offer from ExxonMobil process engineering and another from a green hydrogen startup. Big salary difference but the startup has equity. Long-term which field is better?', author: 'aspenSimQueen',  authorMajor: 'chem',  time: '3d ago',  votes: 35, tags: ['Career Path','Energy'] },
  { id: 8, major: 'bio',   job: 'Medical Device Eng.',  title: 'Breaking into med-tech without industry experience',                    body: "I'm graduating with a BME degree and all my research was academic. How do I position myself for medical device companies when I have zero industry internships?", author: 'bioengineerBabs', authorMajor: 'bio',   time: '3d ago',  votes: 22, tags: ['New Grad','Med-Tech'] },
]

const SEED_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, author: 'codeGrinder99', authorMajor: 'cs', role: null, time: '2h ago', body: "So I failed three FAANG loops before getting in. The real turning point was switching from 'solving as many Leetcode problems as possible' to deeply understanding patterns.\n\nI focused on 10 core patterns (sliding window, two pointers, modified binary search, etc.) and could recognize them in new problems. Game changer.\n\nAlso: mock interviews with a real human are 100x better than solo practice. I used Pramp and paid for 5 sessions on interviewing.io — worth every penny.", votes: 47, voted: false, downvoted: false },
    { id: 2, author: 'AlgoAmy', authorMajor: 'cs', role: null, time: '1h 45m ago', body: "This is exactly what worked for me too. I'd also add: don't neglect behavioral. I bombed an Amazon loop because my STAR stories were weak even though my coding was fine. Leadership principles matter there.", votes: 12, voted: false, downvoted: false },
    { id: 3, author: 'EngHub AI', authorMajor: 'ai', role: 'ai', time: '1h 30m ago', body: "Great discussion! To add some data:\n\n**Top reasons candidates fail FAANG loops:**\n1. Poor time management on coding problems\n2. Not communicating thought process\n3. Weak behavioral stories\n4. Gaps in system design fundamentals\n\nFor system design specifically, studying \"Designing Data-Intensive Applications\" by Kleppmann is widely recommended by FAANG engineers as the highest ROI resource. For coding, the Blind 75 list covers ~80% of patterns seen in interviews.", votes: 23, voted: false, downvoted: false },
  ],
  5: [
    { id: 1, author: 'raptorWrangler', authorMajor: 'aero', role: null, time: '1d ago', body: "SpaceX AMA — ask me anything about working on the Raptor engine combustion team. Some things I can share, some I can't (NDA), but I'll be as helpful as possible.\n\nBackground: BS AE from Georgia Tech, joined SpaceX as a new grad, worked on combustion stability and injector design.", votes: 89, voted: false, downvoted: false },
    { id: 2, author: 'aeroNerd42', authorMajor: 'aero', role: null, time: '23h ago', body: 'What does the interview process look like? How many rounds and what was the technical depth?', votes: 14, voted: false, downvoted: false },
    { id: 3, author: 'raptorWrangler', authorMajor: 'aero', role: null, time: '22h ago', body: 'Interview process: phone screen with recruiter → 2 technical phone interviews (thermo + fluids focused) → on-site with 5 interviews (technical depth, practical problem solving, and a culture fit). Very fast-paced compared to traditional aerospace. Decision in about a week. They move FAST.', votes: 31, voted: false, downvoted: false },
  ],
}

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

function generateAIReply(thread: Thread) {
  const knowledge = AI_KNOWLEDGE[thread.major]
  const specific = knowledge?.[thread.job] || knowledge?.default || ''
  return `Great question! Here's what I know about this topic:\n\n${specific}\n\n**Key takeaways:**\n- Network actively — many opportunities in engineering come through referrals\n- Document your projects with measurable outcomes\n- Consider professional certifications specific to your field\n\nFeel free to ask follow-up questions! 🚀`
}

function getAIPanelResponse(query: string) {
  const q = query.toLowerCase()
  for (const [major, data] of Object.entries(AI_KNOWLEDGE)) {
    if (q.includes(MAJORS[major].label.toLowerCase()) || q.includes(major)) {
      for (const [job, text] of Object.entries(data)) {
        if (job !== 'default' && q.includes(job.toLowerCase().split(' ')[0])) return text
      }
      return data.default || `I have information about ${MAJORS[major].label} careers. Could you be more specific?`
    }
  }
  if (q.includes('salary') || q.includes('pay') || q.includes('comp')) return 'Engineering salaries vary widely by field and location. CS/SWE at top tech companies: $120–250k+. EE/semiconductors: $90–180k. ME/AE: $75–140k. Civil/Env: $65–110k. ChE/BME: $75–140k. Location matters a lot — Bay Area adds ~30% vs national avg.'
  if (q.includes('interview') || q.includes('prep')) return 'Interview prep depends on the field:\n- **SWE**: Algorithms (LeetCode), System Design\n- **Hardware/EE**: Circuit analysis, digital design\n- **ME/AE**: Thermo, fluid mechanics, FEA\n- **Civil**: PE concepts, project management\n\nStart 3–6 months out for competitive positions. Mock interviews are critical.'
  return 'I can help with engineering career questions — salary ranges, interview prep, career path advice, industry trends, or comparing job offers. What would you like to know?'
}

// ── COMPONENT ────────────────────────────────────────────────────
export default function ForumApp() {
  const [screen, setScreen] = useState<'auth' | 'app'>('auth')
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([{ email: 'demo@enghub.com', password: 'password', name: 'Demo User', major: 'cs' }])
  const [loginAlert, setLoginAlert] = useState('')
  const [regAlert, setRegAlert] = useState('')

  const [currentMajor, setCurrentMajor] = useState('all')
  const [currentJob, setCurrentJob] = useState('All Roles')
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null)
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS)
  const [messages, setMessages] = useState<Record<number, Message[]>>(SEED_MESSAGES)
  const [search, setSearch] = useState('')

  const [aiReplyMode, setAiReplyMode] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm your Engineering Career AI Advisor. Ask me anything about salaries, interview prep, career paths, industry trends, or specific roles in any engineering field. 🚀" }
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)

  const [newPostModal, setNewPostModal] = useState(false)
  const [postMajor, setPostMajor] = useState('')
  const [postJob, setPostJob] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [postAlert, setPostAlert] = useState('')

  const [replyText, setReplyText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeThreadId])

  useEffect(() => {
    if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight
  }, [aiMessages, aiTyping])

  // AUTH
  function handleLogin() {
    const email = (document.getElementById('f-login-email') as HTMLInputElement).value.trim()
    const pass = (document.getElementById('f-login-pass') as HTMLInputElement).value
    const user = users.find(u => u.email === email && u.password === pass)
    if (!user) { setLoginAlert('Invalid email or password.'); return }
    loginUser(user)
  }

  function handleRegister() {
    const name = (document.getElementById('f-reg-name') as HTMLInputElement).value.trim()
    const email = (document.getElementById('f-reg-email') as HTMLInputElement).value.trim()
    const major = (document.getElementById('f-reg-major') as HTMLSelectElement).value
    const pass = (document.getElementById('f-reg-pass') as HTMLInputElement).value
    const confirm = (document.getElementById('f-reg-confirm') as HTMLInputElement).value
    if (!name || !email || !major || !pass) { setRegAlert('Please fill all fields.'); return }
    if (pass.length < 6) { setRegAlert('Password must be at least 6 characters.'); return }
    if (pass !== confirm) { setRegAlert('Passwords do not match.'); return }
    if (users.find(u => u.email === email)) { setRegAlert('Email already registered.'); return }
    const user: User = { email, password: pass, name, major }
    setUsers(prev => [...prev, user])
    setRegAlert('✓ Account created! Signing you in…')
    setTimeout(() => loginUser(user), 800)
  }

  function loginUser(user: User) {
    setCurrentUser(user)
    setScreen('app')
    setCurrentMajor('all')
    setCurrentJob('All Roles')
  }

  // FORUM
  const filteredThreads = threads.filter(t => {
    if (currentMajor !== 'all' && t.major !== currentMajor) return false
    if (currentJob && currentJob !== 'All Roles' && t.job !== currentJob) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.body.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function voteMsg(threadId: number, idx: number, up: boolean) {
    setMessages(prev => {
      const msgs = [...(prev[threadId] || [])]
      const m = { ...msgs[idx] }
      if (up) { m.voted = !m.voted; m.votes += m.voted ? 1 : -1; if (m.voted) m.downvoted = false }
      else { m.downvoted = !m.downvoted; if (m.downvoted && m.voted) { m.voted = false; m.votes-- } }
      msgs[idx] = m
      return { ...prev, [threadId]: msgs }
    })
  }

  function submitReply() {
    if (!activeThreadId || !currentUser) return
    if (aiReplyMode) {
      const thread = threads.find(t => t.id === activeThreadId)!
      const aiText = generateAIReply(thread)
      setMessages(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), { id: Date.now(), author: 'EngHub AI', authorMajor: 'ai', role: 'ai', time: 'just now', body: aiText, votes: 0, voted: false, downvoted: false }]
      }))
      return
    }
    if (!replyText.trim()) return
    setMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), { id: Date.now(), author: currentUser.name, authorMajor: currentUser.major, role: null, time: 'just now', body: replyText.trim(), votes: 0, voted: false, downvoted: false }]
    }))
    setReplyText('')
  }

  function openThread(id: number) {
    setActiveThreadId(id)
    if (!messages[id]) {
      const thread = threads.find(t => t.id === id)!
      setMessages(prev => ({ ...prev, [id]: [{ id: 1, author: thread.author, authorMajor: thread.authorMajor, role: null, time: thread.time, body: thread.body, votes: thread.votes, voted: false, downvoted: false }] }))
    }
  }

  function submitNewPost() {
    if (!postMajor || !postJob || !postTitle.trim() || !postBody.trim()) { setPostAlert('Please fill all fields.'); return }
    const id = threads.length + 1
    const thread: Thread = { id, major: postMajor, job: postJob, title: postTitle.trim(), body: postBody.trim(), author: currentUser!.name, authorMajor: currentUser!.major, time: 'just now', votes: 0, tags: [] }
    setThreads(prev => [thread, ...prev])
    setMessages(prev => ({ ...prev, [id]: [{ id: 1, author: currentUser!.name, authorMajor: currentUser!.major, role: null, time: 'just now', body: postBody.trim(), votes: 0, voted: false, downvoted: false }] }))
    setNewPostModal(false)
    setPostTitle(''); setPostBody(''); setPostMajor(''); setPostJob(''); setPostAlert('')
    if (currentMajor !== 'all' && currentMajor !== postMajor) setCurrentMajor(postMajor)
    openThread(id)
  }

  function sendAIMessage() {
    if (!aiInput.trim()) return
    const msg = aiInput.trim()
    setAiInput('')
    setAiMessages(prev => [...prev, { role: 'user', text: msg }])
    setAiTyping(true)
    setTimeout(() => {
      setAiTyping(false)
      setAiMessages(prev => [...prev, { role: 'bot', text: getAIPanelResponse(msg) }])
    }, 1200 + Math.random() * 800)
  }

  const initials = currentUser ? currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  const activeThread = activeThreadId ? threads.find(t => t.id === activeThreadId) : null
  const threadMessages = activeThreadId ? (messages[activeThreadId] || []) : []

  // ── AUTH SCREEN ──
  if (screen === 'auth') {
    return (
      <div className="forum-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)', top: -100, left: -100, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', bottom: 0, right: 0, pointerEvents: 'none' }}></div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px 44px', width: 440, maxWidth: 'calc(100vw - 32px)', position: 'relative', zIndex: 1, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 42, height: 42, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚙️</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Eng<span style={{ color: 'var(--accent)' }}>Hub</span></h1>
          </div>
          <div className="auth-tabs">
            <div className={`auth-tab${authTab === 'login' ? ' active' : ''}`} onClick={() => setAuthTab('login')}>Sign In</div>
            <div className={`auth-tab${authTab === 'register' ? ' active' : ''}`} onClick={() => setAuthTab('register')}>Register</div>
          </div>

          {authTab === 'login' ? (
            <div>
              {loginAlert && <div className="f-alert error show">{loginAlert}</div>}
              <div className="form-group"><label className="form-label">Email</label><input id="f-login-email" className="form-input" type="email" placeholder="engineer@university.edu" /></div>
              <div className="form-group"><label className="form-label">Password</label><input id="f-login-pass" className="form-input" type="password" placeholder="••••••••" /></div>
              <button className="f-btn f-btn-primary" style={{ marginTop: 8 }} onClick={handleLogin}>Sign In →</button>
            </div>
          ) : (
            <div>
              {regAlert && <div className={`f-alert ${regAlert.startsWith('✓') ? 'success' : 'error'} show`}>{regAlert}</div>}
              <div className="form-group"><label className="form-label">Full Name</label><input id="f-reg-name" className="form-input" type="text" placeholder="Alex Johnson" /></div>
              <div className="form-group"><label className="form-label">Email</label><input id="f-reg-email" className="form-input" type="email" placeholder="alex@university.edu" /></div>
              <div className="form-group">
                <label className="form-label">Engineering Major</label>
                <select id="f-reg-major" className="form-input form-select">
                  <option value="">Select your major…</option>
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
              <div className="form-group"><label className="form-label">Password</label><input id="f-reg-pass" className="form-input" type="password" placeholder="min. 6 characters" /></div>
              <div className="form-group"><label className="form-label">Confirm Password</label><input id="f-reg-confirm" className="form-input" type="password" placeholder="repeat password" /></div>
              <button className="f-btn f-btn-primary" style={{ marginTop: 8 }} onClick={handleRegister}>Create Account →</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── APP SCREEN ──
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
              <div className="f-avatar">{initials}</div>
              <div>
                <div className="avatar-name">{currentUser?.name}</div>
                <div className="avatar-major">{MAJORS[currentUser?.major || 'cs']?.label}</div>
              </div>
              <button className="logout-btn" onClick={() => setScreen('auth')} title="Sign out">⏻</button>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Engineering Majors</div>
            {[['all', 'All Majors', 'var(--text3)'], ...Object.entries(MAJORS).map(([k, v]) => [k, v.label, majorColor(k)])].map(([key, label, color]) => (
              <button key={key} className={`major-btn${currentMajor === key ? ' active' : ''}`} onClick={() => { setCurrentMajor(key); setCurrentJob('All Roles'); setActiveThreadId(null) }}>
                <span className="major-dot" style={{ background: color as string }}></span>
                {label}
                <span className="major-count">{key === 'all' ? threads.length : threads.filter(t => t.major === key).length}</span>
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
                <span className="panel-count">{filteredThreads.length}</span>
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
                {filteredThreads.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                    No discussions found.<br /><br />
                    <button className="f-btn f-btn-sm f-btn-ghost" onClick={() => setNewPostModal(true)}>Start the first one →</button>
                  </div>
                ) : filteredThreads.map(t => {
                  const m = MAJORS[t.major]
                  const replyCount = (messages[t.id] || []).length
                  return (
                    <div key={t.id} className={`thread-item${activeThreadId === t.id ? ' active' : ''}`} onClick={() => openThread(t.id)}>
                      <div className="thread-meta">
                        <span className={`thread-tag ${m.colorClass}`}>{m.short}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>{t.job}</span>
                        <span className="thread-time">{t.time}</span>
                      </div>
                      <div className="thread-title">{t.title}</div>
                      <div className="thread-preview">{t.body}</div>
                      <div className="thread-footer">
                        <span className="thread-stat">▲ {t.votes}</span>
                        <span className="thread-stat">💬 {replyCount}</span>
                        <div className="thread-author">
                          <div className="thread-author-avatar" style={{ background: majorColor(t.authorMajor) }}>{t.author.slice(0, 2).toUpperCase()}</div>
                          <span className="thread-author-name">{t.author}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* THREAD VIEW */}
            <div className="thread-view-panel">
              {!activeThread ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <div className="empty-title">Select a discussion</div>
                  <div className="empty-sub">Pick a thread from the left to read and join the conversation</div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div className="thread-view-header">
                    <div className="thread-view-title">{activeThread.title}</div>
                    <div className="thread-view-meta">
                      <span className={`f-badge ${MAJORS[activeThread.major]?.colorClass}`}>{MAJORS[activeThread.major]?.label}</span>
                      <span className="f-badge" style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>{activeThread.job}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--text3)', marginLeft: 'auto' }}>Posted by {activeThread.author} · {activeThread.time} · {activeThread.votes} votes</span>
                    </div>
                  </div>
                  <div className="messages-scroll">
                    {threadMessages.map((m, idx) => {
                      const isAI = m.role === 'ai'
                      return (
                        <div key={m.id} className={`message-card${isAI ? ' ai-card' : ''}`}>
                          <div className="msg-header">
                            <div className="f-avatar" style={{ background: isAI ? '#4f8ef7' : majorColor(m.authorMajor) }}>{isAI ? '🤖' : m.author.slice(0, 2).toUpperCase()}</div>
                            <div>
                              <div className="msg-username">{m.author}</div>
                              {m.role && <div className={`msg-role ${m.role}`}>{m.role === 'ai' ? 'AI Advisor' : 'Mod'}</div>}
                            </div>
                            <span className="msg-time">{m.time}</span>
                          </div>
                          <div className="msg-body" dangerouslySetInnerHTML={{ __html: formatBody(m.body) }} />
                          <div className="msg-actions">
                            <button className={`vote-btn${m.voted ? ' voted' : ''}`} onClick={() => voteMsg(activeThreadId!, idx, true)}>▲ {m.votes}</button>
                            <button className={`vote-btn down${m.downvoted ? ' voted' : ''}`} onClick={() => voteMsg(activeThreadId!, idx, false)}>▼</button>
                            <button className="reply-btn" onClick={() => document.getElementById('reply-ta')?.focus()}>↩ Reply</button>
                            {isAI && <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 'auto' }}>🤖 AI Generated</span>}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="composer">
                    <div className="composer-header">
                      <div className="f-avatar">{initials}</div>
                      <span className="composer-label">Add your reply</span>
                      <div className="composer-ai-toggle">
                        <span style={{ fontSize: 12 }}>🤖 AI Reply</span>
                        <div className={`toggle-switch${aiReplyMode ? ' on' : ''}`} onClick={() => setAiReplyMode(o => !o)}></div>
                      </div>
                    </div>
                    <textarea id="reply-ta" className="composer-textarea" placeholder={aiReplyMode ? '🤖 AI will generate a reply based on this thread context…' : 'Share your experience, ask a question, or give advice…'} value={replyText} onChange={e => setReplyText(e.target.value)} />
                    <div className="composer-footer">
                      <span className="composer-hint">Markdown supported · Be respectful</span>
                      <button className="f-btn f-btn-primary f-btn-sm" style={{ width: 'auto' }} onClick={submitReply}>Post Reply →</button>
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
                <option value="">{postMajor ? 'Select role…' : 'Select major first…'}</option>
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
              <button className="f-btn f-btn-primary f-btn-sm" style={{ width: 'auto' }} onClick={submitNewPost}>Publish Post →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

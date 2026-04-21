// ══════════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════════

const MAJORS = {
  cs:    { label: 'Computer Science', short: 'CS', colorClass: 'mc-cs' },
  elec:  { label: 'Electrical Eng.', short: 'EE', colorClass: 'mc-elec' },
  mech:  { label: 'Mechanical Eng.', short: 'ME', colorClass: 'mc-mech' },
  civil: { label: 'Civil Engineering', short: 'CE', colorClass: 'mc-civil' },
  chem:  { label: 'Chemical Eng.', short: 'ChE', colorClass: 'mc-chem' },
  aero:  { label: 'Aerospace Eng.', short: 'AE', colorClass: 'mc-aero' },
  bio:   { label: 'Biomedical Eng.', short: 'BME', colorClass: 'mc-bio' },
  env:   { label: 'Environmental Eng.', short: 'EnvE', colorClass: 'mc-env' },
};

const JOBS = {
  cs:    ['All Roles','Software Engineer','Frontend Dev','Backend Dev','ML / AI Engineer','DevOps / SRE','Product Manager','Data Engineer','Security Engineer','Mobile Dev','Engineering Manager'],
  elec:  ['All Roles','IC Design Engineer','Embedded Systems','Power Electronics','RF Engineer','FPGA Engineer','Control Systems','Test Engineer','Hardware Engineer','Signal Processing','Systems Architect'],
  mech:  ['All Roles','Design Engineer','Manufacturing Eng.','HVAC Engineer','Automotive Engineer','Robotics Engineer','Structural Analyst','Thermal Engineer','Process Engineer','Quality Engineer','R&D Engineer'],
  civil: ['All Roles','Structural Engineer','Transportation Eng.','Geotechnical Eng.','Construction Mgr','Water Resources Eng.','Urban Planner','Bridge Engineer','Surveying Engineer','Project Manager','Site Engineer'],
  chem:  ['All Roles','Process Engineer','R&D Chemist','Petrochemical Eng.','Pharmaceutical Eng.','Materials Engineer','Plant Engineer','Quality Assurance','Safety Engineer','Environmental Eng.','Biochemical Eng.'],
  aero:  ['All Roles','Aerodynamics Eng.','Propulsion Engineer','Avionics Engineer','Structures Engineer','Flight Test Eng.','Mission Systems','Spacecraft Design','Satellite Engineer','Defense Systems','Systems Integration'],
  bio:   ['All Roles','Medical Device Eng.','Tissue Engineering','Bioinformatics','Clinical Engineer','Regulatory Affairs','R&D Scientist','Imaging Engineer','Prosthetics Eng.','Pharma Engineer','Biomechanics Eng.'],
  env:   ['All Roles','Environmental Consult.','Water Quality Eng.','Air Quality Eng.','Remediation Eng.','Sustainability Eng.','Waste Management','Environmental Planner','Climate Engineer','Eco Systems Eng.','Green Infrastructure'],
};

const AI_KNOWLEDGE = {
  cs: {
    'Software Engineer': 'Software Engineers at top tech companies (FAANG) earn $150k–$250k+ with RSUs. Entry level is typically $120–180k TC. Focus on DSA for interviews — LeetCode medium is standard. Strong demand across all industries.',
    'ML / AI Engineer': 'ML Engineers are among the highest-paid in tech. Senior ML roles at top companies often exceed $300k TC. Python, PyTorch/TensorFlow, and understanding of math (linear algebra, stats) are must-haves. The field is booming.',
    'default': 'CS graduates have incredible versatility. The highest-paying roles include ML, distributed systems, and FAANG SWE. Interview prep typically takes 3–6 months. Focus on system design and algorithms for senior roles.',
  },
  elec: {
    'IC Design Engineer': 'IC Design is highly specialized and well-compensated. TSMC, Intel, Qualcomm, NVIDIA, and Apple Silicon teams pay $130–200k+ for experienced engineers. Requires deep knowledge of VLSI, Verilog/VHDL, and EDA tools.',
    'Embedded Systems': 'Embedded engineers are in high demand for automotive, IoT, and defense. Salaries range from $80k–160k. C/C++ proficiency, RTOS knowledge, and hardware debugging skills are essential.',
    'default': 'EE graduates have strong career paths in semiconductors, defense, automotive, and consumer electronics. The semiconductor boom post-CHIPS Act has increased demand significantly.',
  },
  mech: {
    'Robotics Engineer': 'Robotics Engineering sits at the intersection of ME, EE, and CS. Extremely hot field — Tesla, Boston Dynamics, Amazon Robotics are top employers. Salaries $90–160k. ROS, Python, and kinematics are key skills.',
    'Automotive Engineer': 'The EV transition has created massive demand for ME graduates at Tesla, GM, Ford, Rivian. Salaries $80–140k. Battery thermal management and lightweight materials expertise are highly valued.',
    'default': 'ME is one of the most versatile engineering degrees. The rise of robotics, EVs, and advanced manufacturing has created strong demand. Average starting salary is $70–90k, rising significantly with experience.',
  },
  civil: {
    'Structural Engineer': 'Structural engineers are critical for infrastructure. PE licensure significantly boosts earning potential ($90–140k with PE). California, Texas, and NYC are top markets. ASCE membership is recommended.',
    'Transportation Eng.': 'With massive federal infrastructure investment (IIJA), transportation engineers are in high demand. DOT and consulting firms are top employers. GIS, traffic modeling software skills add value.',
    'default': 'Civil engineering offers stability and the opportunity to shape physical infrastructure. Government and consulting are the two main paths. PE licensure is highly recommended for career advancement.',
  },
  chem: {
    'Process Engineer': 'Process engineers in oil & gas and petrochemicals earn $85–150k. Aspen Plus simulation skills, P&ID reading, and Six Sigma certification add significant value. Major employers: ExxonMobil, Dow, LyondellBasell.',
    'Pharmaceutical Eng.': 'Pharma engineering is growing rapidly. FDA regulatory knowledge is highly valued. Companies like Pfizer, Merck, and J&J pay $85–140k. GMP (Good Manufacturing Practice) experience is essential.',
    'default': 'ChE graduates have flexibility in oil & gas, pharma, materials, and sustainability. The energy transition is creating new opportunities in green hydrogen and carbon capture.',
  },
  aero: {
    'Propulsion Engineer': 'Propulsion engineers are critical for the space economy boom. SpaceX, Blue Origin, Rocket Lab, and NASA/JPL are top employers. Salaries range $85–160k. CFD skills (ANSYS Fluent) and thermodynamics depth are key.',
    'Avionics Engineer': 'Avionics combines EE and AE skills. Boeing, Raytheon, Northrop, and Lockheed are major employers. Defense clearance significantly boosts opportunities and compensation ($90–160k).',
    'default': 'Aerospace is experiencing a renaissance with commercial space. Traditional defense firms and new space companies (SpaceX, Blue Origin, Relativity) offer exciting opportunities. Average starting salary $75–100k.',
  },
  bio: {
    'Medical Device Eng.': 'Med device is one of the most stable and growing fields in BME. FDA 510(k) regulatory knowledge is highly valuable. Top employers: Medtronic, Boston Scientific, Abbott, Stryker. Salaries $75–130k.',
    'Bioinformatics': 'Bioinformatics is booming with genomics. Python, R, and machine learning skills are essential. Pharma and biotech companies pay $90–160k. Strong academic career paths also exist.',
    'default': 'BME graduates often pursue medical school, MD/PhD programs, or industry roles in med-tech. The aging population drives strong demand. Skills bridging biology and engineering are extremely valuable.',
  },
  env: {
    'Sustainability Eng.': 'ESG and sustainability roles are growing rapidly as corporations adopt net-zero targets. Consulting firms (ERM, WSP, AECOM) and corporate sustainability teams are top employers. $70–120k.',
    'Water Quality Eng.': 'Water infrastructure is a national priority with aging systems and PFAS contamination issues. State agencies and consulting firms are major employers. PE licensure recommended. $65–105k.',
    'default': 'Environmental engineering is increasingly important as climate concerns drive regulation and investment. The Inflation Reduction Act has supercharged clean energy and environmental consulting.',
  },
};

// ── Seed Data ──
let threads = [
  { id: 1, major: 'cs', job: 'Software Engineer', title: 'Rejected from FAANG 3 times — what actually worked for me on the 4th', body: 'After failing coding interviews at Google, Meta, and Amazon, I finally landed a SWE role at Meta L4. Here\'s what changed...', author: 'codeGrinder99', authorMajor: 'cs', time: '2h ago', votes: 47, replies: 12, tags: ['Interview', 'FAANG'] },
  { id: 2, major: 'cs', job: 'ML / AI Engineer', title: 'Is an MS in ML worth it for AI Engineer roles in 2025?', body: 'I\'m 2 years into my career as a SWE and considering going back for an MSML from CMU or Stanford. Does the degree actually open doors or is self-study enough now?', author: 'tensorFlow_Bro', authorMajor: 'cs', time: '4h ago', votes: 31, replies: 8, tags: ['Education', 'ML/AI'] },
  { id: 3, major: 'elec', job: 'IC Design Engineer', title: 'NVIDIA vs Intel IC Design offers — how to decide?', body: 'Got offers from both NVIDIA RTX GPU team and Intel Silicon Engineering. NVIDIA pays 30% more but Intel has better WLB from what I hear. Thoughts?', author: 'vlsiVictor', authorMajor: 'elec', time: '6h ago', votes: 28, replies: 15, tags: ['Offers', 'Semiconductors'] },
  { id: 4, major: 'mech', job: 'Robotics Engineer', title: 'Boston Dynamics vs Tesla Bot — which team is more exciting to work on?', body: 'I have a recruiter reaching out from both teams. Both seem incredible from a technical perspective. Anyone have insight into culture and day-to-day work?', author: 'mechaMonk', authorMajor: 'mech', time: '1d ago', votes: 52, replies: 19, tags: ['Robotics', 'Career'] },
  { id: 5, major: 'aero', job: 'Propulsion Engineer', title: 'SpaceX Raptor team experience — AMA', body: 'Just finished 2 years on the Raptor engine combustion team. Happy to answer questions about the interview process, day-to-day work, and what they actually look for.', author: 'raptorWrangler', authorMajor: 'aero', time: '1d ago', votes: 89, replies: 34, tags: ['SpaceX', 'AMA'] },
  { id: 6, major: 'civil', job: 'Structural Engineer', title: 'PE exam prep — best resources for structural section?', body: 'Taking the PE next spring. Anyone have good structural study resources? Currently using Lindeburg but wondering if there\'s something better for the CBT format.', author: 'bridgeBuilder23', authorMajor: 'civil', time: '2d ago', votes: 18, replies: 7, tags: ['PE Exam', 'Study'] },
  { id: 7, major: 'chem', job: 'Process Engineer', title: 'Oil & Gas vs. Green Energy — where is ChE headed?', body: 'I have an offer from ExxonMobil process engineering and another from a green hydrogen startup. Big salary difference but the startup has equity. Long-term which field is better?', author: 'aspenSimQueen', authorMajor: 'chem', time: '3d ago', votes: 35, replies: 11, tags: ['Career Path', 'Energy'] },
  { id: 8, major: 'bio', job: 'Medical Device Eng.', title: 'Breaking into med-tech without industry experience', body: 'I\'m graduating with a BME degree and all my research was academic. How do I position myself for medical device companies when I have zero industry internships?', author: 'bioengineerBabs', authorMajor: 'bio', time: '3d ago', votes: 22, replies: 9, tags: ['New Grad', 'Med-Tech'] },
];

let messages = {
  1: [
    { id: 1, author: 'codeGrinder99', authorMajor: 'cs', role: null, time: '2h ago', body: 'So I failed three FAANG loops before getting in. The real turning point was switching from "solving as many Leetcode problems as possible" to deeply understanding patterns.\n\nI focused on 10 core patterns (sliding window, two pointers, modified binary search, etc.) and could recognize them in new problems. Game changer.\n\nAlso: mock interviews with a real human are 100x better than solo practice. I used Pramp and paid for 5 sessions on interviewing.io — worth every penny.', votes: 47, voted: false, downvoted: false },
    { id: 2, author: 'AlgoAmy', authorMajor: 'cs', role: null, time: '1h 45m ago', body: 'This is exactly what worked for me too. I\'d also add: don\'t neglect behavioral. I bombed an Amazon loop because my STAR stories were weak even though my coding was fine. Leadership principles matter there.', votes: 12, voted: false, downvoted: false },
    { id: 3, author: 'EngHub AI', authorMajor: 'ai', role: 'ai', time: '1h 30m ago', body: 'Great discussion! To add some data: \n\n**Top reasons candidates fail FAANG loops:**\n1. Poor time management on coding problems\n2. Not communicating thought process\n3. Weak behavioral stories\n4. Gaps in system design fundamentals\n\nFor system design specifically, studying "Designing Data-Intensive Applications" by Kleppmann is widely recommended by FAANG engineers as the highest ROI resource. For coding, the Blind 75 list covers ~80% of patterns seen in interviews.', votes: 23, voted: false, downvoted: false },
  ],
  5: [
    { id: 1, author: 'raptorWrangler', authorMajor: 'aero', role: null, time: '1d ago', body: 'SpaceX AMA — ask me anything about working on the Raptor engine combustion team. Some things I can share, some I can\'t (NDA), but I\'ll be as helpful as possible.\n\nBackground: BS AE from Georgia Tech, joined SpaceX as a new grad, worked on combustion stability and injector design.', votes: 89, voted: false, downvoted: false },
    { id: 2, author: 'aeroNerd42', authorMajor: 'aero', role: null, time: '23h ago', body: 'What does the interview process look like? How many rounds and what was the technical depth?', votes: 14, voted: false, downvoted: false },
    { id: 3, author: 'raptorWrangler', authorMajor: 'aero', role: null, time: '22h ago', body: 'Interview process: phone screen with recruiter → 2 technical phone interviews (thermo + fluids focused) → on-site with 5 interviews (technical depth, practical problem solving, and a culture fit). Very fast-paced compared to traditional aerospace. Decision in about a week. They move FAST.', votes: 31, voted: false, downvoted: false },
  ],
};

// ── State ──
let currentUser = null;
let currentMajor = 'all';
let currentJob = 'All Roles';
let activeThreadId = null;
let aiReplyMode = false;
let aiPanelOpen = false;
let users = [
  { email: 'demo@enghub.com', password: 'password', name: 'Demo User', major: 'cs' }
];

// ══════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) => t.classList.toggle('active', (i===0 && tab==='login')||(i===1 && tab==='register')));
  document.getElementById('login-form').classList.toggle('active', tab==='login');
  document.getElementById('register-form').classList.toggle('active', tab==='register');
}

function showAlert(id, msg, type='error') {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `alert ${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) { showAlert('login-alert', 'Invalid email or password.'); return; }
  loginUser(user);
}

function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const major = document.getElementById('reg-major').value;
  const pass = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  if (!name || !email || !major || !pass) { showAlert('reg-alert', 'Please fill all fields.'); return; }
  if (pass.length < 6) { showAlert('reg-alert', 'Password must be at least 6 characters.'); return; }
  if (pass !== confirm) { showAlert('reg-alert', 'Passwords do not match.'); return; }
  if (users.find(u => u.email === email)) { showAlert('reg-alert', 'Email already registered.'); return; }
  const user = { email, password: pass, name, major };
  users.push(user);
  showAlert('reg-alert', 'Account created! Signing you in…', 'success');
  setTimeout(() => loginUser(user), 800);
}

function loginUser(user) {
  currentUser = user;
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  const initials = user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('composer-avatar').textContent = initials;
  document.getElementById('sidebar-name').textContent = user.name;
  document.getElementById('sidebar-major').textContent = MAJORS[user.major]?.label || '';
  updateCounts();
  selectMajor('all');
}

function handleLogout() {
  currentUser = null;
  activeThreadId = null;
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('auth-screen').classList.add('active');
}

// ══════════════════════════════════════════════════════
//  MAJOR + JOB NAVIGATION
// ══════════════════════════════════════════════════════
function selectMajor(major) {
  currentMajor = major;
  currentJob = 'All Roles';
  activeThreadId = null;

  document.querySelectorAll('.major-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('major-btn-' + major)?.classList.add('active');

  const topTitle = document.getElementById('topbar-title');
  const topBadge = document.getElementById('topbar-badge');
  if (major === 'all') {
    topTitle.textContent = 'All Engineering';
    topBadge.style.display = 'none';
  } else {
    topTitle.textContent = MAJORS[major].label;
    topBadge.style.display = 'flex';
    topBadge.className = `topbar-major-badge badge ${MAJORS[major].colorClass}`;
    topBadge.textContent = MAJORS[major].short;
  }

  renderJobTabs();
  renderThreadList();
  showEmptyState();
}

function renderJobTabs() {
  const container = document.getElementById('job-tabs');
  if (currentMajor === 'all') { container.innerHTML = ''; return; }
  const jobs = JOBS[currentMajor] || [];
  container.innerHTML = jobs.map(j => `<button class="job-tab${j===currentJob?' active':''}" onclick="selectJob('${j}')">${j}</button>`).join('');
}

function selectJob(job) {
  currentJob = job;
  document.querySelectorAll('.job-tab').forEach(t => t.classList.toggle('active', t.textContent === job));
  renderThreadList();
}

function renderThreadList() {
  const search = document.getElementById('search-input').value.toLowerCase();
  let filtered = threads.filter(t => {
    if (currentMajor !== 'all' && t.major !== currentMajor) return false;
    if (currentJob && currentJob !== 'All Roles' && t.job !== currentJob) return false;
    if (search && !t.title.toLowerCase().includes(search) && !t.body.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('thread-count').textContent = filtered.length;

  const container = document.getElementById('thread-list');
  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:32px 20px;text-align:center;color:var(--text3);font-size:13px">No discussions found.<br><br><button class="btn btn-sm btn-ghost" onclick="openNewPostModal()">Start the first one →</button></div>`;
    return;
  }
  container.innerHTML = filtered.map(t => {
    const m = MAJORS[t.major];
    const replies = (messages[t.id] || []).length;
    return `<div class="thread-item${activeThreadId===t.id?' active':''}" onclick="openThread(${t.id})">
      <div class="thread-meta">
        <span class="thread-tag ${m.colorClass}">${m.short}</span>
        <span style="font-size:11.5px;color:var(--text3)">${t.job}</span>
        <span class="thread-time">${t.time}</span>
      </div>
      <div class="thread-title">${t.title}</div>
      <div class="thread-preview">${t.body}</div>
      <div class="thread-footer">
        <span class="thread-stat">▲ ${t.votes}</span>
        <span class="thread-stat">💬 ${replies}</span>
        <div class="thread-author">
          <div class="avatar" style="width:20px;height:20px;font-size:9px;background:${majorColor(t.authorMajor)}">${t.author.slice(0,2).toUpperCase()}</div>
          <span class="thread-author-name">${t.author}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function majorColor(m) {
  const colors = { cs:'#4f8ef7',elec:'#fbbf24',mech:'#f87171',civil:'#34d399',chem:'#a78bfa',aero:'#f472b6',bio:'#2dd4bf',env:'#86efac' };
  return colors[m] || '#4f8ef7';
}

function updateCounts() {
  const keys = Object.keys(MAJORS);
  let total = 0;
  keys.forEach(m => {
    const c = threads.filter(t => t.major === m).length;
    const el = document.getElementById('count-' + m);
    if (el) el.textContent = c;
    total += c;
  });
  document.getElementById('count-all').textContent = total;
}

// ══════════════════════════════════════════════════════
//  THREAD VIEW
// ══════════════════════════════════════════════════════
function openThread(id) {
  activeThreadId = id;
  const t = threads.find(x => x.id === id);
  if (!t) return;

  renderThreadList(); // highlight active

  const m = MAJORS[t.major];
  document.getElementById('tv-title').textContent = t.title;
  document.getElementById('tv-major-badge').textContent = m.label;
  document.getElementById('tv-major-badge').className = `badge ${m.colorClass}`;
  document.getElementById('tv-job-badge').textContent = t.job;
  document.getElementById('tv-meta').textContent = `Posted by ${t.author} · ${t.time} · ${t.votes} votes`;

  document.getElementById('empty-state').style.display = 'none';
  const tc = document.getElementById('thread-content');
  tc.style.display = 'flex';

  renderMessages(id);
  if (!messages[id]) messages[id] = [];
  if (messages[id].length === 0) {
    messages[id].push({ id: 1, author: t.author, authorMajor: t.authorMajor, role: null, time: t.time, body: t.body, votes: t.votes, voted: false, downvoted: false });
  }
  renderMessages(id);
}

function renderMessages(threadId) {
  const msgs = messages[threadId] || [];
  const container = document.getElementById('messages-scroll');
  container.innerHTML = msgs.map((m, idx) => {
    const isAI = m.role === 'ai';
    const initials = m.author.slice(0,2).toUpperCase();
    const bgColor = isAI ? '#4f8ef7' : majorColor(m.authorMajor);
    return `<div class="message-card${isAI?' ai-card':''}">
      <div class="msg-header">
        <div class="avatar" style="background:${bgColor}">${isAI?'🤖':initials}</div>
        <div>
          <div class="msg-username">${m.author}</div>
          ${m.role ? `<div class="msg-role ${m.role}">${m.role==='ai'?'AI Advisor':'Mod'}</div>` : ''}
        </div>
        <span class="msg-time">${m.time}</span>
      </div>
      <div class="msg-body">${formatBody(m.body)}</div>
      <div class="msg-actions">
        <button class="vote-btn${m.voted?' voted':''}" onclick="voteMsg(${threadId},${idx},true)">▲ ${m.votes}</button>
        <button class="vote-btn down${m.downvoted?' voted':''}" onclick="voteMsg(${threadId},${idx},false)">▼</button>
        <button class="reply-btn" onclick="focusReply()">↩ Reply</button>
        ${isAI?'<span style="font-size:11px;color:var(--accent);margin-left:auto">🤖 AI Generated</span>':''}
      </div>
    </div>`;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

function formatBody(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .split('</p><p>').map(p => `<p>${p}</p>`).join('');
}

function voteMsg(threadId, idx, up) {
  const m = messages[threadId][idx];
  if (up) { m.voted = !m.voted; m.votes += m.voted ? 1 : -1; if (m.voted) m.downvoted = false; }
  else { m.downvoted = !m.downvoted; if (m.downvoted && m.voted) { m.voted = false; m.votes--; } }
  renderMessages(threadId);
}

function focusReply() {
  document.getElementById('reply-textarea').focus();
}

function toggleAIReply() {
  aiReplyMode = !aiReplyMode;
  const toggle = document.getElementById('ai-toggle');
  toggle.classList.toggle('on', aiReplyMode);
  const ta = document.getElementById('reply-textarea');
  ta.placeholder = aiReplyMode
    ? '🤖 AI will generate a reply based on this thread context…'
    : 'Share your experience, ask a question, or give advice…';
}

function submitReply() {
  if (!activeThreadId) return;
  const ta = document.getElementById('reply-textarea');
  const body = ta.value.trim();

  if (aiReplyMode) {
    ta.value = '';
    const t = threads.find(x => x.id === activeThreadId);
    const aiText = generateAIReply(t);
    messages[activeThreadId].push({
      id: Date.now(), author: 'EngHub AI', authorMajor: 'ai', role: 'ai',
      time: 'just now', body: aiText, votes: 0, voted: false, downvoted: false
    });
    renderMessages(activeThreadId);
    return;
  }

  if (!body) return;
  messages[activeThreadId].push({
    id: Date.now(), author: currentUser.name, authorMajor: currentUser.major, role: null,
    time: 'just now', body, votes: 0, voted: false, downvoted: false
  });
  ta.value = '';
  renderMessages(activeThreadId);
}

function generateAIReply(thread) {
  const knowledge = AI_KNOWLEDGE[thread.major];
  const specific = knowledge?.[thread.job] || knowledge?.['default'] || '';
  const intros = [
    'Great question! Here\'s what I know about this topic:',
    'Based on industry data and community insights, here\'s my take:',
    'This is a common question. Let me break it down:',
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  return `${intro}\n\n${specific}\n\n**Key takeaways:**\n- Network actively — many opportunities in engineering come through referrals\n- Document your projects with measurable outcomes\n- Consider professional certifications specific to your field\n\nFeel free to ask follow-up questions and I'll do my best to help! 🚀`;
}

function showEmptyState() {
  activeThreadId = null;
  document.getElementById('empty-state').style.display = '';
  const tc = document.getElementById('thread-content');
  tc.style.display = 'none';
}

// ══════════════════════════════════════════════════════
//  NEW POST MODAL
// ══════════════════════════════════════════════════════
function openNewPostModal() {
  document.getElementById('new-post-modal').classList.add('open');
  document.getElementById('post-major').value = currentMajor !== 'all' ? currentMajor : '';
  updatePostJobs();
}
function closeNewPostModal() { document.getElementById('new-post-modal').classList.remove('open'); }
document.getElementById('new-post-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeNewPostModal(); });

function updatePostJobs() {
  const major = document.getElementById('post-major').value;
  const jobSelect = document.getElementById('post-job');
  if (!major) { jobSelect.innerHTML = '<option>Select major first…</option>'; return; }
  const jobs = JOBS[major] || [];
  jobSelect.innerHTML = jobs.map(j => `<option value="${j}">${j}</option>`).join('');
}

function submitNewPost() {
  const major = document.getElementById('post-major').value;
  const job = document.getElementById('post-job').value;
  const title = document.getElementById('post-title').value.trim();
  const body = document.getElementById('post-body').value.trim();
  if (!major || !job || !title || !body) { showAlert('post-alert', 'Please fill all fields.'); return; }
  const id = threads.length + 1;
  threads.unshift({ id, major, job, title, body, author: currentUser.name, authorMajor: currentUser.major, time: 'just now', votes: 0, replies: 0, tags: [] });
  messages[id] = [{ id: 1, author: currentUser.name, authorMajor: currentUser.major, role: null, time: 'just now', body, votes: 0, voted: false, downvoted: false }];
  closeNewPostModal();
  document.getElementById('post-title').value = '';
  document.getElementById('post-body').value = '';
  updateCounts();
  if (currentMajor !== 'all' && currentMajor !== major) selectMajor(major);
  else renderThreadList();
  openThread(id);
}

// ══════════════════════════════════════════════════════
//  AI PANEL
// ══════════════════════════════════════════════════════
function toggleAIPanel() {
  aiPanelOpen = !aiPanelOpen;
  document.getElementById('ai-panel').style.display = aiPanelOpen ? 'flex' : 'none';
}

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  appendAIMessage(msg, 'user');

  // typing indicator
  const scroll = document.getElementById('ai-chat-scroll');
  const typingEl = document.createElement('div');
  typingEl.className = 'ai-msg bot';
  typingEl.innerHTML = '<div class="ai-icon">AI ADVISOR</div><div class="typing"><span></span><span></span><span></span></div>';
  scroll.appendChild(typingEl);
  scroll.scrollTop = scroll.scrollHeight;

  setTimeout(() => {
    typingEl.remove();
    const response = getAIPanelResponse(msg);
    appendAIMessage(response, 'bot');
  }, 1200 + Math.random() * 800);
}

function appendAIMessage(text, role) {
  const scroll = document.getElementById('ai-chat-scroll');
  const el = document.createElement('div');
  el.className = `ai-msg ${role}`;
  if (role === 'bot') {
    el.innerHTML = `<div class="ai-icon">AI ADVISOR</div>${text.replace(/\n/g,'<br>')}`;
  } else {
    el.textContent = text;
  }
  scroll.appendChild(el);
  scroll.scrollTop = scroll.scrollHeight;
}

function getAIPanelResponse(query) {
  const q = query.toLowerCase();
  // Match major-specific
  for (const [major, data] of Object.entries(AI_KNOWLEDGE)) {
    const mLabel = MAJORS[major].label.toLowerCase();
    if (q.includes(mLabel) || q.includes(major)) {
      for (const [job, text] of Object.entries(data)) {
        if (job !== 'default' && q.includes(job.toLowerCase().split(' ')[0])) return text;
      }
      return data.default || `I have information about ${MAJORS[major].label} careers. Could you be more specific about which role or topic?`;
    }
  }
  // Generic responses
  if (q.includes('salary') || q.includes('pay') || q.includes('comp')) return 'Engineering salaries vary widely by field and location. CS/SWE at top tech companies: $120–250k+. EE/semiconductors: $90–180k. ME/AE: $75–140k. Civil/Env: $65–110k. ChE/BME: $75–140k. Location matters a lot — Bay Area adds ~30% vs national avg.';
  if (q.includes('interview') || q.includes('prep')) return 'Interview prep depends on the field:\n- **SWE**: Algorithms (LeetCode), System Design\n- **Hardware/EE**: Circuit analysis, digital design\n- **ME/AE**: Thermo, fluid mechanics, FEA\n- **Civil**: PE concepts, project management\n\nStart 3–6 months out for competitive positions. Mock interviews are critical.';
  if (q.includes('internship') || q.includes('new grad')) return 'For internships and new grad roles: apply early (6–9 months ahead for big companies), leverage your university career center, and network on LinkedIn. Engineering internships typically pay $25–50/hr. Don\'t neglect smaller companies — great learning opportunities often come from non-FAANG employers.';
  if (q.includes('masters') || q.includes('ms') || q.includes('phd')) return 'Graduate school ROI varies by field:\n- **CS/SWE**: Often not needed, but opens ML/research doors\n- **EE**: MS helps significantly for IC design and R&D\n- **ME/AE**: PhD valuable for research, MS for design roles\n- **Civil**: PE + experience often beats MS\n- **BME/ChE**: PhD important for research paths\n\nFunded PhDs are always worth considering if research interests you.';
  return 'I can help with engineering career questions — salary ranges, interview prep, career path advice, industry trends, or comparing job offers. What would you like to know about your engineering career?';
}

// init counts on load
window.addEventListener('load', () => {
  // Pre-populate counts (no login yet, will run after login)
});
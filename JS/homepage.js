// ═══════════════ STATE ═══════════════
let currentUser = null;
let users = [{ email:'demo@enghub.com', password:'password', name:'Demo User', username:'DemoUser', major:'cs', type:'student' }];

// ═══════════════ MODAL ═══════════════
function openModal(tab) {
  document.getElementById('auth-modal').classList.add('open');
  switchTab(tab);
}
function closeModal() { document.getElementById('auth-modal').classList.remove('open'); }
document.getElementById('auth-modal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab==='login');
  document.getElementById('tab-register').classList.toggle('active', tab==='register');
  document.getElementById('form-login').classList.toggle('active', tab==='login');
  document.getElementById('form-register').classList.toggle('active', tab==='register');
}

function toggleRegType() {
  const t = document.getElementById('reg-type').value;
  document.getElementById('student-fields').style.display = t==='professional' ? 'none' : 'block';
  document.getElementById('professional-fields').style.display = t==='professional' ? 'block' : 'none';
}

function showAlert(id, msg, type='error') {
  const el = document.getElementById(id);
  el.textContent = msg; el.className = `alert ${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ═══════════════ AUTH ═══════════════
function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const user = users.find(u => u.email===email && u.password===pass);
  if (!user) { showAlert('login-alert','Invalid email or password.'); return; }
  loginUser(user);
}

function handleRegister() {
  const first = document.getElementById('reg-first').value.trim();
  const last = document.getElementById('reg-last').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const major = document.getElementById('reg-major').value;
  const pass = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const type = document.getElementById('reg-type').value;
  if (!first||!last||!email||!major||!pass) { showAlert('reg-alert','Please fill all required fields.'); return; }
  if (pass.length<6) { showAlert('reg-alert','Password must be at least 6 characters.'); return; }
  if (pass!==confirm) { showAlert('reg-alert','Passwords do not match.'); return; }
  if (users.find(u=>u.email===email)) { showAlert('reg-alert','Email already registered.'); return; }
  const username = first.toLowerCase() + last[0].toUpperCase() + Math.floor(Math.random()*99);
  const user = { email, password:pass, name:`${first} ${last}`, username, major, type };
  users.push(user);
  showAlert('reg-alert','Account created! Signing you in…','success');
  setTimeout(() => loginUser(user), 700);
}

function loginUser(user) {
  currentUser = user;
  closeModal();
  // Update navbar
  document.getElementById('nav-auth-out').style.display = 'none';
  const authIn = document.getElementById('nav-auth-in');
  authIn.style.display = 'flex';
  document.getElementById('nav-avatar').textContent = user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('nav-username').textContent = user.username || user.name.split(' ')[0];
}

function handleLogout() {
  currentUser = null;
  document.getElementById('nav-auth-out').style.display = 'flex';
  document.getElementById('nav-auth-in').style.display = 'none';
}

// ═══════════════ CONTACT ═══════════════
function submitContact() {
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const msg = document.getElementById('contact-message').value.trim();
  if (!name||!email||!msg) { showAlert('contact-alert','Please fill all fields.','error'); return; }
  showAlert('contact-alert', `Thanks ${name}! We'll get back to you within 24 hours. 🚀`, 'success');
  document.getElementById('contact-name').value='';
  document.getElementById('contact-email').value='';
  document.getElementById('contact-message').value='';
}

// ═══════════════ DEMO ═══════════════
function playDemo() {
  const overlay = document.getElementById('play-overlay');
  overlay.style.opacity = '0';
  setTimeout(() => overlay.style.display='none', 300);
  // Animate the demo screen
  animateDemo();
}

function animateDemo() {
  // Highlight different threads with delays
  const items = document.querySelectorAll('.demo-thread-item');
  let i = 0;
  const cycle = setInterval(() => {
    items.forEach(x => x.classList.remove('active'));
    items[i % items.length].classList.add('active');
    i++;
    if (i > 6) clearInterval(cycle);
  }, 1500);
}

// ═══════════════ SCROLL ANIMATIONS ═══════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .major-card, .founder-card, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Stagger cards
document.querySelectorAll('.features-grid .feature-card, .majors-grid .major-card, .founders-grid .founder-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});
/* ============================================================
   FOCUSFLOW — SHARED UTILITIES (utils.js)
   ============================================================ */

// ── TOAST ──────────────────────────────────────────────────
let _toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  const icon = t.querySelector('.toast-icon');
  t.querySelector('.toast-msg').textContent = msg;
  if (icon) {
    icon.innerHTML = type === 'success'
      ? `<svg viewBox="0 0 20 20" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"><polyline points="4 10 8 14 16 6"/></svg>`
      : `<svg viewBox="0 0 20 20" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>`;
  }
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ── SCROLL REVEAL ───────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── NAV SCROLL ──────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      drawer.classList.toggle('open');
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
      });
    });
  }
}

// ── FORM VALIDATION ─────────────────────────────────────────
function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function validateField(fieldEl, input, condition, msg) {
  const err = fieldEl.querySelector('.field-error');
  if (!condition) {
    fieldEl.classList.add('error');
    if (err) err.textContent = msg || 'This field is required.';
    return false;
  }
  fieldEl.classList.remove('error');
  return true;
}

// ── LOADING BUTTON ──────────────────────────────────────────
function setLoading(btn, loading) {
  if (loading) {
    btn._label = btn.innerHTML;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`;
    btn.disabled = true;
  } else {
    btn.innerHTML = btn._label || btn.innerHTML;
    btn.disabled = false;
  }
}

// ── SUPABASE HELPER ─────────────────────────────────────────
// This is the single place where Supabase is initialised.
// Replace the two constants with your real project values.
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_PUBLIC_ANON_KEY';

let _sb = null;
function getSupabase() {
  if (_sb) return _sb;
  if (typeof window.supabase === 'undefined') {
    console.warn('Supabase SDK not loaded yet.');
    return null;
  }
  _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  return _sb;
}

// ── AUTH HELPERS ─────────────────────────────────────────────
async function getCurrentUser() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function requireAuth(redirectTo = 'auth.html') {
  const user = await getCurrentUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

// ── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
});

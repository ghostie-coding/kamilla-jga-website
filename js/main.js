// ── SURPRISE OVERLAY ──
function tearTicket() {
  const ticketTop = document.getElementById('ticket-top');
  const ticketBottom = document.getElementById('ticket-bottom');
  ticketTop.classList.add('-translate-x-10', '-translate-y-5', '-rotate-6', 'opacity-0');
  ticketBottom.classList.add('translate-x-8', 'translate-y-3', 'rotate-3', 'opacity-0');
  setTimeout(() => {
    document.getElementById('surprise-overlay').classList.add('hidden');
    sessionStorage.setItem('surprise-seen', '1');
  }, 700);
}
// Nur beim ersten Besuch pro Session zeigen
if (sessionStorage.getItem('surprise-seen')) {
  document.getElementById('surprise-overlay').classList.add('hidden');
}
// Petals
(function () {
  const wrap = document.getElementById('petals');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'absolute rounded-full bg-lilac animate-fall';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (4 + Math.random() * 6) + 'px';
    p.style.animationDuration = (4 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    p.style.opacity = 0.4 + Math.random() * 0.4;
    wrap.appendChild(p);
  }
})();

// ── COUNTDOWN ──
// ⚠️ Datum anpassen: new Date(Jahr, Monat-1, Tag, Stunde, Minute)
const JGA_DATE = new Date(2026, 6, 11, 0, 30); // 11. Juli 2026
function updateCountdown() {
  const diff = JGA_DATE - new Date();
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div class="font-serif text-2xl italic text-lilac">Es ist so weit! 🎉</div>';
    return;
  }
  document.getElementById('cd-days').textContent  = String(Math.floor(diff/86400000)).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown, 1000);

// ── ZEITPLAN UNLOCK (nach 13.07.26) ──
const UNLOCK_DATE = new Date(2026, 6, 13); // 13. Juli 2026
function unlockSchedule() {
  document.getElementById('zeitplan-locked').classList.add('hidden');
  document.getElementById('zeitplan-revealed').classList.remove('hidden');
  document.getElementById('tag3-revealed').classList.remove('hidden');
  document.getElementById('spiele').classList.remove('hidden');
}
if (new Date() >= UNLOCK_DATE) unlockSchedule();
// Spiele bis zum Unlock ausblenden
if (new Date() < UNLOCK_DATE) document.getElementById('spiele').classList.add('hidden');

// ── NAV SCROLL ──
// Tailwind-Klassen, die je nach Scroll-Zustand getauscht werden (kein eigenes CSS nötig)
const NAV_DEFAULT = ['bg-[rgba(26,15,15,0.92)]', 'md:bg-[rgba(26,15,15,0)]', 'backdrop-blur-[10px]', 'py-[0.6rem]', 'md:py-[1.2rem]'];
const NAV_SCROLLED = ['bg-[rgba(26,15,15,0.98)]', 'md:bg-[rgba(26,15,15,0.98)]', 'backdrop-blur-[12px]', 'py-[0.5rem]', 'md:py-[0.8rem]'];
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainnav');
  const scrolled = window.scrollY > 60;
  nav.classList.remove(...(scrolled ? NAV_DEFAULT : NAV_SCROLLED));
  nav.classList.add(...(scrolled ? NAV_SCROLLED : NAV_DEFAULT));
});

// ── DAY TABS ──
function showDay(id, btn) {
  document.querySelectorAll('.day-content').forEach(d => d.classList.add('hidden'));
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('bg-brown', 'text-cream'));
  document.getElementById(id).classList.remove('hidden');
  btn.classList.add('bg-brown', 'text-cream');
}

// ── SCROLL-EINBLEND-ANIMATION ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.remove('opacity-0', 'translate-y-8');
      e.target.classList.add('opacity-100', 'translate-y-0');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── PASSWORT-MODAL ──
const PW = 'TaKa';
function openPwModal() {
  const overlay = document.getElementById('pw-overlay');
  overlay.classList.remove('opacity-0', 'invisible');
  overlay.classList.add('opacity-100', 'visible');
  setTimeout(() => document.getElementById('pw-input').focus(), 100);
}
function closePwModal() {
  const overlay = document.getElementById('pw-overlay');
  overlay.classList.remove('opacity-100', 'visible');
  overlay.classList.add('opacity-0', 'invisible');
  document.getElementById('pw-input').value = '';
  document.getElementById('pw-err').textContent = '';
}
function checkPw() {
  const val = document.getElementById('pw-input').value;
  if (val === PW) {
    closePwModal();
    revealContent();
    sessionStorage.setItem('pw-unlocked', '1');
  } else {
    const inp = document.getElementById('pw-input');
    inp.classList.add('border-[#c0392b]', 'animate-shake');
    document.getElementById('pw-err').textContent = 'Falsches Passwort 🙈';
    setTimeout(() => inp.classList.remove('border-[#c0392b]', 'animate-shake'), 400);
  }
}
function revealContent() {
  unlockSchedule();
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
// Prüfen, ob in dieser Session schon entsperrt wurde
if (sessionStorage.getItem('pw-unlocked') === '1') revealContent();

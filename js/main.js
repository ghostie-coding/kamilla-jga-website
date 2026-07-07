// ── PUZZLE GATE (Rätsel) ──
// ANTALYA liegt diagonal von oben rechts (0,7) nach unten links (6,1).
(function () {
  const letters = [
    ['S', 'E', 'L', 'R', 'O', 'D', 'I', 'A'],
    ['U', 'B', 'R', 'F', 'S', 'E', 'N', 'K'],
    ['G', 'P', 'D', 'S', 'P', 'T', 'O', 'L'],
    ['X', 'H', 'N', 'S', 'A', 'L', 'Y', 'R'],
    ['R', 'T', 'I', 'L', 'L', 'E', 'S', 'B'],
    ['F', 'R', 'Y', 'N', 'B', 'S', 'T', 'V'],
    ['C', 'A', 'P', 'L', 'E', 'S', 'N', 'E'],
    ['T', 'O', 'S', 'T', 'I', 'O', 'R', 'C']
  ];
  // Diagonale Koordinaten: r steigt, c fällt (A-N-T-A-L-Y-A)
  const targetWordCoords = [
    { r: 0, c: 7 }, { r: 1, c: 6 }, { r: 2, c: 5 }, { r: 3, c: 4 },
    { r: 4, c: 3 }, { r: 5, c: 2 }, { r: 6, c: 1 }
  ];

  const gate = document.getElementById('puzzle-gate');
  const grid = document.getElementById('puzzle-grid');
  const winMessage = document.getElementById('puzzle-win');
  if (!gate || !grid) return;

  const BASE = ['bg-white/5', 'border', 'border-white/10', 'text-cream'];
  const CORRECT = ['bg-lilac-deep', 'text-white'];
  const WRONG = ['bg-[#e56b6f]', 'text-white', 'animate-shake'];
  const GLOW = ['bg-lilac', 'text-black', 'scale-110', 'shadow-[0_0_15px_#c0a8cc]', 'z-[1]'];

  // Bereits in dieser Session gelöst? Gate sofort ausblenden (kein Flackern).
  if (sessionStorage.getItem('puzzle-solved') === '1') {
    gate.classList.add('hidden');
  } else {
    document.body.classList.add('overflow-hidden');
  }

  let foundCount = 0;
  let solved = false;

  for (let r = 0; r < letters.length; r++) {
    for (let c = 0; c < letters[r].length; c++) {
      const cell = document.createElement('div');
      cell.className = 'aspect-square flex items-center justify-center rounded font-serif text-base md:text-lg font-bold cursor-pointer select-none transition-all duration-300 ' + BASE.join(' ');
      cell.textContent = letters[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('click', () => handleClick(cell, r, c));
      grid.appendChild(cell);
    }
  }

  function handleClick(cell, r, c) {
    if (solved || cell.classList.contains('is-correct')) return;

    const expected = targetWordCoords[foundCount];
    if (expected && r === expected.r && c === expected.c) {
      cell.classList.remove(...WRONG, ...BASE);
      cell.classList.add(...CORRECT, 'is-correct');
      foundCount++;
      if (foundCount === targetWordCoords.length) {
        solved = true;
        targetWordCoords.forEach(({ r, c }) => {
          const el = grid.querySelector('[data-r="' + r + '"][data-c="' + c + '"]');
          el.classList.remove(...CORRECT);
          el.classList.add(...GLOW);
        });
        winMessage.classList.remove('opacity-0');
        winMessage.classList.add('opacity-100');
        setTimeout(() => {
          gate.classList.add('opacity-0');
          document.body.classList.remove('overflow-hidden');
          sessionStorage.setItem('puzzle-solved', '1');
          setTimeout(() => gate.classList.add('hidden'), 800);
        }, 1200);
      }
    } else {
      cell.classList.add(...WRONG);
      setTimeout(() => cell.classList.remove(...WRONG), 400);
      resetProgress();
    }
  }

  function resetProgress() {
    foundCount = 0;
    grid.querySelectorAll('.is-correct').forEach(el => {
      el.classList.remove(...CORRECT, 'is-correct');
      el.classList.add(...BASE);
    });
  }
})();

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

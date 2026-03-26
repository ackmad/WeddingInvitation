/* animation.js — Wedding Invitation Baroque Theme */

/* ==========================================
   1. SCROLL REVEAL — multi-direction
   ========================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

/* ==========================================
   2. PARALLAX BACKGROUND
   ========================================== */
function handleParallax() {
  const scrollY = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

window.addEventListener('scroll', handleParallax, { passive: true });

/* ==========================================
   3. FLOATING ELEMENTS (bunga, castle)
   ========================================== */
function initFloatAnimation() {
  document.querySelectorAll('[data-float]').forEach((el, i) => {
    const duration = parseFloat(el.dataset.float) || 4;
    const delay = i * 0.6;
    el.style.animation = `floatUpDown ${duration}s ease-in-out ${delay}s infinite`;
  });
}

/* ==========================================
   4. FLOWER ENTRANCE ANIMATION (kiri & kanan)
   ========================================== */
function initFlowerEntrance() {
  const flowersLeft = document.querySelector('.flowers-left');
  const flowersRight = document.querySelector('.flowers-right');

  if (flowersLeft) {
    setTimeout(() => {
      flowersLeft.classList.add('flowers-entered');
    }, 300);
  }
  if (flowersRight) {
    setTimeout(() => {
      flowersRight.classList.add('flowers-entered');
    }, 500);
  }
}

/* ==========================================
   5. PETAL RAIN
   ========================================== */
function createPetal(container) {
  const petal = document.createElement('div');
  petal.classList.add('petal');

  const size = Math.random() * 20 + 10;
  const startX = Math.random() * window.innerWidth;
  const duration = Math.random() * 4 + 5;
  const delay = Math.random() * 6;
  const sway = (Math.random() - 0.5) * 120;
  const rotation = Math.random() * 360;
  const img = ['petal-single.png'];

  petal.style.cssText = `
    position: fixed;
    top: -60px;
    left: ${startX}px;
    width: ${size}px;
    height: ${size}px;
    background-image: url('assets/${img[0]}');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
    z-index: 999;
    transform: rotate(${rotation}deg);
    animation: petalFall ${duration}s ease-in ${delay}s forwards;
    --sway: ${sway}px;
  `;

  container.appendChild(petal);

  setTimeout(() => {
    petal.remove();
    createPetal(container);
  }, (duration + delay) * 1000 + 500);
}

function initPetalRain() {
  const container = document.createElement('div');
  container.id = 'petal-container';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < 8; i++) {
    createPetal(container);
  }
}

/* ==========================================
   6. SPARKLE TWINKLE
   ========================================== */
function createSparkle(container) {
  const sparkle = document.createElement('img');
  sparkle.src = 'assets/sparkle-star.svg';
  sparkle.classList.add('sparkle');

  const size = Math.random() * 20 + 8;
  const x = Math.random() * 90 + 5;
  const y = Math.random() * 80 + 5;
  const delay = Math.random() * 3;
  const duration = Math.random() * 1.5 + 1.5;

  sparkle.style.cssText = `
    position: absolute;
    left: ${x}%;
    top: ${y}%;
    width: ${size}px;
    height: ${size}px;
    opacity: 0;
    pointer-events: none;
    animation: sparkleTwinkle ${duration}s ease-in-out ${delay}s infinite;
  `;

  container.appendChild(sparkle);
}

function initSparkles() {
  const sections = document.querySelectorAll('.has-sparkles');
  sections.forEach(section => {
    section.style.position = 'relative';
    for (let i = 0; i < 10; i++) {
      createSparkle(section);
    }
  });
}

/* ==========================================
   7. FRAME BAROQUE REVEAL
   ========================================== */
function initFrameReveal() {
  const frame = document.querySelector('.baroque-frame');
  if (frame) {
    frame.style.opacity = '0';
    setTimeout(() => {
      frame.style.transition = 'opacity 2s ease-in-out';
      frame.style.opacity = '1';
    }, 200);
  }
}

/* ==========================================
   8. COUNTDOWN FLIP CLOCK
   ========================================== */
function initFlipClock(targetDate) {
  const target = new Date(targetDate).getTime();

  function updateClock() {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      document.querySelectorAll('.flip-value').forEach(el => {
        el.textContent = '00';
      });
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const units = { days, hours, minutes, seconds };

    Object.entries(units).forEach(([unit, val]) => {
      const el = document.querySelector(`.flip-${unit}`);
      if (!el) return;
      const valStr = String(val).padStart(2, '0');
      const current = el.querySelector('.flip-value');
      if (current && current.textContent !== valStr) {
        el.classList.add('flipping');
        setTimeout(() => {
          if (current) current.textContent = valStr;
          el.classList.remove('flipping');
        }, 300);
      }
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================
   9. MUSIC PLAYER
   ========================================== */
function initMusicPlayer() {
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
    }
    playing = !playing;
  });
}

/* ==========================================
   10. RSVP & GIFT — WhatsApp redirect
   ========================================== */
function submitRSVP(name, attendance, wa) {
  const msg = encodeURIComponent(
    `Halo, saya ${name} ingin konfirmasi kehadiran: ${attendance}. Terima kasih!`
  );
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');

  // Feedback visual
  const feedback = document.getElementById('rsvp-feedback');
  if (feedback) {
    feedback.style.display = 'block';
    feedback.style.opacity = '1';
  }
}

function copyRekening(nomor) {
  navigator.clipboard.writeText(nomor).then(() => {
    const btn = event.currentTarget;
    const original = btn.textContent;
    btn.textContent = 'Tersalin ✓';
    btn.style.background = '#d4edda';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 2000);
  });
}

function submitGift(name, bank, amount, wa) {
  const msg = encodeURIComponent(
    `Halo, saya ${name} ingin konfirmasi transfer hadiah pernikahan. Bank: ${bank}, Nominal: Rp${amount}. Terima kasih!`
  );
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
}

function submitWish(name, wish, wa) {
  const msg = encodeURIComponent(`💌 Ucapan dari ${name}:\n\n${wish}`);
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
}

/* ==========================================
   INIT — jalankan semua saat halaman siap
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initFlowerEntrance();
  initFrameReveal();
  initSparkles();
  initFloatAnimation();
  initMusicPlayer();

  // Petal rain hanya aktif di splash & hero
  const splash = document.getElementById('splash');
  if (splash) initPetalRain();

  // Countdown ke tanggal pernikahan
  initFlipClock('2026-03-29T08:00:00');
});

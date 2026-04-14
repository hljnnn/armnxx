/* ================================================
   COURTING PROPOSAL — script.js
   Ring box · Music manager · Interactions
   ================================================ */

const box   = document.getElementById('box');
const ring  = document.getElementById('ring');
const music = document.getElementById('bgMusic');

let fadeInterval;

/* ── Music: fade in ── */
function fadeIn(audio, target = 0.6) {
  clearInterval(fadeInterval);
  audio.volume = 0;
  audio.play().catch(() => {});
  fadeInterval = setInterval(() => {
    if (audio.volume < target - .01) {
      audio.volume = Math.min(audio.volume + .02, target);
    } else {
      audio.volume = target;
      clearInterval(fadeInterval);
    }
  }, 80);
}

/* ── Music: fade out ── */
function fadeOut(audio) {
  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (audio.volume > .022) {
      audio.volume = Math.max(audio.volume - .02, 0);
    } else {
      audio.pause();
      audio.volume = 0;
      clearInterval(fadeInterval);
    }
  }, 80);
}

/* ── Music: save & restore state ── */
function saveMusicState() {
  if (!music) return;
  localStorage.setItem('musicTime',    music.currentTime);
  localStorage.setItem('musicPlaying', !music.paused);
}

function restoreMusicState() {
  if (!music) return;
  const time    = localStorage.getItem('musicTime');
  const playing = localStorage.getItem('musicPlaying') === 'true';
  if (time)    music.currentTime = parseFloat(time);
  if (playing) { music.volume = 0.6; music.play().catch(() => {}); }
}

/* ── Box interaction ── */
if (box && ring && music) {
  restoreMusicState();

  box.addEventListener('click', (e) => {
    /* Don't toggle if user clicked ring or buttons */
    if (e.target.closest('#ring'))              return;
    if (e.target.closest('.choice-container'))  return;
    if (e.target.closest('.promise-text'))      return;

    const wasOpen = box.classList.contains('open');
    box.classList.toggle('open');

    if (!wasOpen) {
      /* Opening */
      fadeIn(music);
      burstSparkles(e);
      saveMusicState();

      /* Fire custom event so ring.html script knows it opened */
      document.dispatchEvent(new CustomEvent('boxOpened'));
    } else {
      /* Closing */
      fadeOut(music);
      ring.classList.remove('spinning');
    }
  });

  /* Click ring to spin */
  ring.addEventListener('click', (e) => {
    e.stopPropagation();
    if (box.classList.contains('open')) {
      ring.classList.toggle('spinning');
    }
  });
}

window.addEventListener('beforeunload', saveMusicState);

/* ── Sparkle burst on open ── */
function burstSparkles(e) {
  const BURST = ['✨','💫','🌸','💕','🌟','💖'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const sp = document.createElement('div');
      sp.className = 'burst-sparkle';
      sp.textContent = BURST[Math.floor(Math.random() * BURST.length)];
      const angle = (i / 18) * Math.PI * 2;
      const dist  = 50 + Math.random() * 100;
      sp.style.cssText = `
        position:fixed; z-index:999; pointer-events:none;
        left:${e.clientX}px; top:${e.clientY}px;
        font-size:${.8 + Math.random() * .7}rem;
        --tx:${Math.cos(angle) * dist}px;
        --ty:${Math.sin(angle) * dist}px;
        animation:burstFly ${.6 + Math.random() * .4}s ease forwards;
      `;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 1100);
    }, i * 30);
  }
}


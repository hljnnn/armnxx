/* ================================================
   COURTING PROPOSAL — script.js (FIXED)
   ================================================ */

const box = document.getElementById('box');
const ring = document.getElementById('ring');
const music = document.getElementById('bgMusic');

let fadeInterval;

// ── Music logic ──
function fadeIn(audio, target = 0.6) {
    clearInterval(fadeInterval);
    if (audio.paused) {
        audio.volume = 0;
        audio.play().catch(err => console.log("User interaction required for audio"));
    }
    fadeInterval = setInterval(() => {
        if (audio.volume < target - 0.01) {
            audio.volume = Math.min(audio.volume + 0.02, target);
        } else {
            audio.volume = target;
            clearInterval(fadeInterval);
        }
    }, 80);
}

function fadeOut(audio) {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0.02) {
            audio.volume = Math.max(audio.volume - 0.02, 0);
        } else {
            audio.pause();
            audio.volume = 0;
            clearInterval(fadeInterval);
        }
    }, 80);
}

// ── Box interaction ──
if (box && ring) {
    // Restore music if it was playing on previous page
    if (localStorage.getItem('musicPlaying') === 'true') {
        music.currentTime = parseFloat(localStorage.getItem('musicTime') || 0);
        music.volume = 0.6;
        music.play().catch(() => {});
    }

    box.addEventListener('click', (e) => {
        // Prevent closing if clicking buttons or the ring itself
        if (e.target.closest('.choice-container') || e.target.closest('.take-btn')) return;

        const isOpen = box.classList.contains('open');
        
        if (!isOpen) {
            box.classList.add('open');
            fadeIn(music);
            burstSparkles(e);
            // Notify ring.html to show buttons
            document.dispatchEvent(new CustomEvent('boxOpened'));
        } else {
            // Only allow closing if clicking the base or lid, not the ring
            if (!e.target.closest('#ring')) {
                box.classList.remove('open');
                fadeOut(music);
                ring.classList.remove('spinning');
            }
        }
    });

    ring.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop box from closing
        if (box.classList.contains('open')) {
            ring.classList.toggle('spinning');
        }
    });
}

// ── Save state before leaving ──
window.addEventListener('beforeunload', () => {
    if (music) {
        localStorage.setItem('musicTime', music.currentTime);
        localStorage.setItem('musicPlaying', !music.paused);
    }
});

function burstSparkles(e) {
    const BURST = ['✨', '💫', '🌸', '💕', '🌟', '💖'];
    for (let i = 0; i < 18; i++) {
        const sp = document.createElement('div');
        sp.className = 'burst-sparkle';
        sp.textContent = BURST[Math.floor(Math.random() * BURST.length)];
        const angle = (i / 18) * Math.PI * 2;
        const dist = 50 + Math.random() * 100;
        
        sp.style.left = e.clientX + 'px';
        sp.style.top = e.clientY + 'px';
        sp.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        sp.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 1000);
    }
}

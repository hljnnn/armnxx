const box = document.getElementById("box");
const ring = document.getElementById("ring");
const music = document.getElementById("bgMusic");

let fadeInterval;

/* -------- MUSIC FADE -------- */
function fadeIn(audio, targetVolume = 0.6) {
    clearInterval(fadeInterval);
    audio.volume = 0;
    audio.play().catch(() => {});
    fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + 0.02, targetVolume);
        } else {
            clearInterval(fadeInterval);
        }
    }, 100);
}

function fadeOut(audio) {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0.02) {
            audio.volume -= 0.02;
        } else {
            audio.pause();
            audio.volume = 0;
            clearInterval(fadeInterval);
        }
    }, 100);
}

/* -------- SAVE MUSIC STATE -------- */
function saveMusicState() {
    if (!music) return;
    localStorage.setItem("musicTime", music.currentTime);
    localStorage.setItem("musicPlaying", !music.paused);
}

/* -------- RESTORE MUSIC STATE -------- */
function restoreMusicState() {
    if (!music) return;

    const time = localStorage.getItem("musicTime");
    const playing = localStorage.getItem("musicPlaying") === "true";

    if (time !== null) {
        music.currentTime = parseFloat(time);
    }

    if (playing) {
        music.volume = 0.6;
        music.play().catch(() => {});
    }
}

/* -------- BOX & RING -------- */
if (box && ring && music) {
    restoreMusicState();

    box.addEventListener("click", (e) => {
        if (e.target.closest("#ring")) return;

        box.classList.toggle("open");

        if (box.classList.contains("open")) {
            fadeIn(music);
        } else {
            fadeOut(music);
            ring.classList.remove("spinning");
        }
    });

    ring.addEventListener("click", (e) => {
        e.stopPropagation();
        if (box.classList.contains("open")) {
            ring.classList.toggle("spinning");
        }
    });
}

/* -------- SAVE BEFORE PAGE CHANGE -------- */
window.addEventListener("beforeunload", saveMusicState);

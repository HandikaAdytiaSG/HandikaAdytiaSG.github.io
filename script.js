// App state
const AppState = {
    currentLang: 'en',
    currentTheme: 'dark',
    isLoaded: false
};

// ============================================
//   STARFIELD + PARTICLES + EXPLOSIONS + NEBULA
//   (Hero background effects)
// ============================================
const container = document.getElementById("home");
let W = window.innerWidth;
let H = window.innerHeight;

/* ESTRELLAS (Stars) */
const STAR_COUNT = 350;
const stars = [];

function createStar() {
    const s = document.createElement("div");
    s.className = "star";
    resetStar(s);
    container.appendChild(s);
    stars.push(s);
}

function resetStar(s) {
    s.x = Math.random() * W;
    s.y = Math.random() * H;
    s.z = Math.random() * W;
}

for (let i = 0; i < STAR_COUNT; i++) createStar();

/* PARTICLES */
const particles = [];

function createParticle() {
    const p = document.createElement("div");
    p.className = "particle";
    p.x = W / 2;
    p.y = H / 2;
    const a = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 6;
    p.vx = Math.cos(a) * speed;
    p.vy = Math.sin(a) * speed;
    p.life = 0;
    p.max = 140 + Math.random() * 80;
    container.appendChild(p);
    particles.push(p);
}

/* EXPLOSION */
const explosions = [];

function createExplosion(x, y, vx, vy) {
    for (let i = 0; i < 20; i++) {
        const e = document.createElement("div");
        e.className = "explosion";
        e.x = x;
        e.y = y;
        const a = Math.atan2(vy, vx) + (Math.random() - .5) * Math.PI;
        const s = 2 + Math.random() * 4;
        e.vx = Math.cos(a) * s;
        e.vy = Math.sin(a) * s;
        e.life = 0;
        e.max = 40 + Math.random() * 30;
        container.appendChild(e);
        explosions.push(e);
    }
}

/* NEBULA */
function createNebula() {
    const n = document.createElement("div");
    n.className = "nebula";
    n.style.width = n.style.height = (300 + Math.random() * 500) + "px";
    n.style.left = Math.random() * W + "px";
    n.style.top = Math.random() * H + "px";
    n.style.background =
        ["rgba(120,80,255,.25)",
            "rgba(16,185,129,.25)",
            "rgba(80,200,255,.25)",
            "rgba(6,182,212,.25)"
        ][Math.floor(Math.random() * 4)];
    container.appendChild(n);

    n.animate([
        { opacity: 0 },
        { opacity: .25 },
        { opacity: 0 }
    ], { duration: 20000 }).onfinish = () => n.remove();
}

/* LOOP */
function loop() {
    /* Stars */
    for (const s of stars) {
        s.z -= 2;
        if (s.z <= 0) resetStar(s);

        const x = (s.x - W / 2) / s.z * W + W / 2;
        const y = (s.y - H / 2) / s.z * H + H / 2;

        s.style.transform = `translate(${x}px,${y}px)`;
    }

    /* Particles */
    if (Math.random() < .005) createParticle();

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        p.style.transform = `translate(${p.x}px,${p.y}px)`;
        p.style.opacity = 1 - p.life / p.max;

        if (Math.random() < .002) createExplosion(p.x, p.y, p.vx, p.vy);

        if (p.life > p.max) {
            p.remove();
            particles.splice(i, 1);
        }
    }

    /* Explosions */
    for (let i = explosions.length - 1; i >= 0; i--) {
        const e = explosions[i];
        e.x += e.vx;
        e.y += e.vy;
        e.life++;

        e.style.transform = `translate(${e.x}px,${e.y}px)`;
        e.style.opacity = 1 - e.life / e.max;

        if (e.life > e.max) {
            e.remove();
            explosions.splice(i, 1);
        }
    }

    /* Nebula */
    if (Math.random() < .002) createNebula();

    requestAnimationFrame(loop);
}
loop();

/* Resize */
window.onresize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
};

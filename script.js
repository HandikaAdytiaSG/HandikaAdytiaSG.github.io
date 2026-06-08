const AppState = {
    currentLang: 'en',
    currentTheme: 'dark',
    currentSection: 'home',
    isMenuOpen: false,
    isLoaded: false
};


// handle loader animation
window.addEventListener('load', () => {
    setTimeout(() => {
        initLoaderAnimation();
    }, 100);
});

function initLoaderAnimation() {
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    if (!loader || !loaderPercent) return;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader,
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            loader.classList.add('hidden');
                            initPageAnimations();
                        }
                    });
                } else {
                    loader.classList.add('hidden');
                    initPageAnimations();
                }
            }, 300);
        }
        if (loaderPercent) {
            loaderPercent.textContent = Math.floor(progress) + '%';
        }
    }, 100);
}



document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadPreferences();
    initLanguage();
    // initTheme();
    // initNavigation();
    // initScrollEffects();
    // initFormHandlers();
    // initMobileMenu();
    updateLanguageUI();
    // updateThemeUI();
    AppState.isLoaded = true;
}

function loadPreferences() {
    const savedLang = localStorage.getItem('portfolio-lang');
    // // const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedLang) AppState.currentLang = savedLang;
    // // // if (savedTheme) AppState.currentTheme = savedTheme;
}


function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    setLanguage(AppState.currentLang);
}

function toggleLanguage() {
    const newLang = AppState.currentLang === 'en' ? 'id' : 'en';
    setLanguage(newLang);
    localStorage.setItem('portfolio-lang', newLang);
}

function setLanguage(lang) {
    AppState.currentLang = lang;
    const html = document.documentElement;
    const body = document.body;
    
    if (lang === 'id') {
        html.setAttribute('lang', 'id');
        // html.setAttribute('dir', 'rtl');
        body.setAttribute('data-lang', 'id');
        // body.setAttribute('data-dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en');
        // html.setAttribute('dir', 'ltr');
        body.setAttribute('data-lang', 'en');
        // body.setAttribute('data-dir', 'ltr');
    }
    updateLanguageUI();
}

function updateLanguageUI() {
    const textElements = document.querySelectorAll('[data-text-en], [data-text-id]');
    textElements.forEach(element => {
        const enText = element.getAttribute('data-text-en');
        const idText = element.getAttribute('data-text-id');
        if (AppState.currentLang === 'id' && idText) {
            element.textContent = idText;
        } else if (AppState.currentLang === 'en' && enText) {
            element.textContent = enText;
        }
    });
    
    const placeholderElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-id]');
    placeholderElements.forEach(element => {
        const enPlaceholder = element.getAttribute('data-placeholder-en');
        const idPlaceholder = element.getAttribute('data-placeholder-id');
        if (AppState.currentLang === 'id' && idPlaceholder) {
            element.setAttribute('placeholder', idPlaceholder);
        } else if (AppState.currentLang === 'en' && enPlaceholder) {
            element.setAttribute('placeholder', enPlaceholder);
        }
    });
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = AppState.currentLang === 'en' ? 'ID' : 'EN';
        }
    }
}


// default values
let size = 40;
let highlightDuration = 500;
let color = '#b4bdfa59';
let theme = '🌙'

// Grid effect
const grid = document.querySelector(".grid");

const setClass = (target) => {
  target.classList.add("highlight");
  setTimeout(() => {
    target.classList.remove("highlight");
  }, highlightDuration);
};

const handleOver = (index) => (event) => {
  const numCols = parseInt(grid.dataset.columns);
  const numRows = parseInt(grid.dataset.rows);

  const adjacents = [
    index - numCols - 1, // top left
    index - numCols, // top
    index - numCols + 1, // top right
    index - 1, // left
    index + 1, // right
    index + numCols - 1, // bottom left
    index + numCols, // bottom
    index + numCols + 1 // bottom right
  ].filter(
    (i) =>
      // adjacent is in grid from 1 to n
      i >= 1 &&
      i <= numCols * numRows &&
      // and column from overed cell is neighbour to supposed adjacent cell
      Math.abs(((index-1) % numCols) - ((i-1) % numCols)) <= 1
  );
  const { currentTarget } = event
  setClass(currentTarget)

  shuffle(adjacents).slice(0,1).forEach((index) => {
    setClass(grid.children[index - 1])
  })
};

const initGrid = () => {
  if (grid.hasChildNodes()) grid.innerHTML = "";
  columns = Math.floor(document.body.clientWidth / size);
  rows = Math.floor(document.body.clientHeight / size);
  grid.dataset.columns = columns;
  grid.dataset.rows = rows;
  grid.style.setProperty("--columns", columns);
  grid.style.setProperty("--rows", rows);

  const total = columns * rows;

  Array.from(Array(total)).forEach((cell, index) => {
    const element = document.createElement("div");
    element.classList.add("cell");
    /* FOR DEBUGGING
    // element.innerText = index + 1;
    // element.dataset.column = index % columns + 1
    // element.dataset.row = Math.floor(index / columns) + 1
    // element.addEventListener('click', () => { console.log(index + 1)})
    */
    element.addEventListener("mousemove", handleOver(index + 1));
    grid.appendChild(element);
  });
};

initGrid();
window.addEventListener("resize", initGrid);

function shuffle(array) {
  return array.sort(() => Math.random() - 2.5);
}

const container = document.getElementById("home");
let W = window.innerWidth;
let H = window.innerHeight;

/* =============================
   ESTRELLAS
=============================*/
const STAR_COUNT = 700;
const stars = [];

function createStar(){
  const s = document.createElement("div");
  s.className="star";
  resetStar(s);
  container.appendChild(s);
  stars.push(s);
}

function resetStar(s){
  s.x = Math.random()*W;
  s.y = Math.random()*H;
  s.z = Math.random()*W;
}

for(let i=0;i<STAR_COUNT;i++) createStar();

/* =============================
   PARTICULAS
=============================*/
function createParticle(){
  const p=document.createElement("div");
  p.className="particle";
  p.x=W/2;
  p.y=H/2;
  const a=Math.random()*Math.PI*2;
  const speed=6+Math.random()*6;
  p.vx=Math.cos(a)*speed;
  p.vy=Math.sin(a)*speed;
  p.life=0;
  p.max=140+Math.random()*80;
  container.appendChild(p);
  particles.push(p);
}
const particles=[];

/* =============================
   EXPLOSION
=============================*/
function createExplosion(x,y,vx,vy){
  for(let i=0;i<20;i++){
    const e=document.createElement("div");
    e.className="explosion";
    e.x=x;
    e.y=y;
    const a=Math.atan2(vy,vx)+(Math.random()-.5)*Math.PI;
    const s=2+Math.random()*4;
    e.vx=Math.cos(a)*s;
    e.vy=Math.sin(a)*s;
    e.life=0;
    e.max=40+Math.random()*30;
    container.appendChild(e);
    explosions.push(e);
  }
}
const explosions=[];

/* =============================
   NEBULA
=============================*/
function createNebula(){
  const n=document.createElement("div");
  n.className="nebula";
  n.style.width=n.style.height=(300+Math.random()*500)+"px";
  n.style.left=Math.random()*W+"px";
  n.style.top=Math.random()*H+"px";
  n.style.background=
   ["rgba(120,80,255,.25)",
    "rgba(255,100,180,.25)",
    "rgba(80,200,255,.25)",
    "rgba(150,255,200,.25)"
   ][Math.floor(Math.random()*4)];
  container.appendChild(n);

  n.animate([
    {opacity:0},
    {opacity:.25},
    {opacity:0}
  ],{duration:20000}).onfinish=()=>n.remove();
}

/* =============================
   LOOP
=============================*/
function loop(){

  /* Stars */
  for(const s of stars){
    s.z-=2;
    if(s.z<=0) resetStar(s);

    const x=(s.x-W/2)/s.z*W+W/2;
    const y=(s.y-H/2)/s.z*H+H/2;

    s.style.transform=`translate(${x}px,${y}px)`;
  }

  /* Particles */
  if(Math.random()<.005) createParticle();

  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;
    p.y+=p.vy;
    p.life++;

    p.style.transform=`translate(${p.x}px,${p.y}px)`;
    p.style.opacity=1-p.life/p.max;

    if(Math.random()<.002) createExplosion(p.x,p.y,p.vx,p.vy);

    if(p.life>p.max){
      p.remove();
      particles.splice(i,1);
    }
  }

  /* Explosion */
  for(let i=explosions.length-1;i>=0;i--){
    const e=explosions[i];
    e.x+=e.vx;
    e.y+=e.vy;
    e.life++;

    e.style.transform=`translate(${e.x}px,${e.y}px)`;
    e.style.opacity=1-e.life/e.max;

    if(e.life>e.max){
      e.remove();
      explosions.splice(i,1);
    }
  }

  /* Nebula */
  if(Math.random()<.002) createNebula();

  requestAnimationFrame(loop);
}
loop();

/* Resize */
window.onresize=()=>{
  W=window.innerWidth;
  H=window.innerHeight;
};
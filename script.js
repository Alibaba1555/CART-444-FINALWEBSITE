const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function rafCursor() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(rafCursor);
})();

const PROJECT_DATA = {
  pacman: {
    tag: 'Game · 2024',
    systemsLabel: 'Game Modes',
    process: `The project was developed through iterative experiments. I started from the original Pac-Man mechanics, then introduced controlled disruptions — limiting vision, cloning agents, deforming the maze, and altering pacing.<br><br>Each iteration tested a specific question: how much can the system change before it stops being recognizable?`,
    reflection: `This project revealed how strongly players rely on learned patterns. Even small changes — like reduced visibility or slight spatial distortion — can create tension and uncertainty.<br><br>Looking back, the project could be pushed further by introducing more dynamic systems, such as adaptive AI or procedural level changes, allowing the game to respond to the player rather than remain fixed.`,
    modes: [
      { n: '01', title: 'Classic Mode', sub: 'Easy' },
      { n: '02', title: 'Classic Mode', sub: 'Hard' },
      { n: '03', title: 'Clone Mode' },
      { n: '04', title: 'Limited Vision', sub: 'Easy' },
      { n: '05', title: 'Limited Vision', sub: 'Hard' },
      { n: '06', title: 'Maze Deformation' },
      { n: '07', title: 'Survival Mode' },
      { n: '08', title: 'Chill Guy Mode' }
    ]
  },
  parkour: {
    tag: 'Game · 2024',
    systemsLabel: 'Game Systems',
    process: `This project started from a simple side-scrolling runner, but I wanted it to feel less passive. Instead of only avoiding obstacles, I introduced combat as a core mechanic.<br><br>The player controls a knight who keeps moving forward, while dealing with enemies through normal attacks and skill-based attacks. I designed two types of enemies — melee and ranged — to create different kinds of pressure.<br><br>Throughout development, I kept adjusting the balance between movement, combat timing, and survival. The goal was to create a rhythm where the player is constantly making small decisions: attack, dodge, or recover.`,
    reflection: `What I found interesting is how quickly a simple runner becomes stressful once combat is introduced. Movement is no longer just about speed, but about timing and positioning.<br><br>The game still feels quite minimal, but that also makes every mistake more visible. Sometimes the difficulty comes more from rough transitions than intentional design.<br><br>If I continue developing this project, I would refine enemy behaviors and add clearer feedback for attacks and damage. Right now, the system works, but it could feel much more responsive and alive.`,
    modes: [
      { n: '01', title: 'Knight Runner', sub: 'Core Loop' },
      { n: '02', title: 'Normal Attack', sub: 'Close-range combat' },
      { n: '03', title: 'Skill Attack', sub: 'Stronger burst damage' },
      { n: '04', title: 'Melee Enemy', sub: 'Direct pressure' },
      { n: '05', title: 'Ranged Enemy', sub: 'Distance control' },
      { n: '06', title: 'Healing Items', sub: 'Recovery system' }
    ]
  }
};

const BD = {
  'blob-photography': { cx: 89, cy: 124, r: 78 },
  'blob-design':      { cx: 107, cy: 110, r: 88 },
  'blob-film':        { cx: 79, cy: 128, r: 68 },
  'blob-game':        { cx: 100, cy: 115, r: 83 }
};

const NOISE = {
  'blob-photography': [[13,1.3,0.0],[9,2.3,1.2],[6,0.8,2.5],[11,3.0,0.9]],
  'blob-design':      [[15,1.1,1.4],[7,2.5,0.3],[10,0.9,3.0],[6,1.8,1.8]],
  'blob-film':        [[11,1.6,2.8],[8,2.0,0.7],[9,0.7,1.4],[14,2.6,3.4]],
  'blob-game':        [[10,1.9,0.7],[13,1.0,2.1],[7,2.7,0.5],[9,1.5,1.9]]
};

const FLOAT_ANIM = {
  'blob-photography': 'fa 3.9s 0s ease-in-out infinite',
  'blob-design':      'fb 4.3s 0s ease-in-out infinite',
  'blob-film':        'fc 3.6s 0s ease-in-out infinite',
  'blob-game':        'fd 4.7s 0s ease-in-out infinite'
};

const N_PTS = 6;
const f = n => Math.round(n * 10) / 10;

function blobPts(cx, cy, r, noise, t, sx = 1, sy = 1) {
  return Array.from({ length: N_PTS }, (_, i) => {
    const angle = (i / N_PTS) * Math.PI * 2 - Math.PI / 2;
    const dr = noise.reduce((s, [a, freq, p]) => s + a * Math.sin(t * freq + p + i * 1.09), 0);
    return [
      cx + Math.cos(angle) * (r + dr) * sx,
      cy + Math.sin(angle) * (r + dr) * sy
    ];
  });
}

function smoothPath(pts) {
  const N = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % N];
    const p0 = pts[(i - 1 + N) % N];
    const p3 = pts[(i + 2) % N];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

function idleMorph(ts) {
  const t = ts / 1000;
  document.querySelectorAll('.blob:not(.flying-js)').forEach(blob => {
    const bd = BD[blob.id];
    if (!bd) return;
    const idx = ['blob-photography','blob-design','blob-film','blob-game'].indexOf(blob.id);
    const [spd, ph] = [[1.8,0.0],[2.1,1.4],[1.5,2.8],[2.4,0.7]][idx];
    const s = t * spd + ph;
    const { cx, cy, r } = bd;
    const n = NOISE[blob.id];
    const dw = Math.sin(s * .90) * r * .09;
    const dh = Math.cos(s * .70 + 1.2) * r * .04;
    const dcx = Math.sin(s * .50 + .8) * 5;
    const dty = Math.cos(s * .60) * 3;
    const asy = Math.sin(s * 1.1 + 2.0) * r * .08;
    blob.querySelector('path').setAttribute(
      'd',
      smoothPath(blobPts(cx + dcx, cy + dty, r + dw + asy, n, t, 1, 1))
    );
  });
  requestAnimationFrame(idleMorph);
}
requestAnimationFrame(idleMorph);

document.querySelectorAll('.blob').forEach(b => {
  b.addEventListener('mouseenter', () => {
    ring.style.width = '58px';
    ring.style.height = '58px';
  });
  b.addEventListener('mouseleave', () => {
    ring.style.width = '34px';
    ring.style.height = '34px';
  });
});

const floodCanvas = document.getElementById('color-flood');
const floodCtx = floodCanvas.getContext('2d');
let floodRaf = null;

function resizeFlood() {
  floodCanvas.width = window.innerWidth;
  floodCanvas.height = window.innerHeight;
}
resizeFlood();
window.addEventListener('resize', resizeFlood);

function clearFlood() {
  if (floodRaf) {
    cancelAnimationFrame(floodRaf);
    floodRaf = null;
  }
  floodCtx.clearRect(0, 0, floodCanvas.width, floodCanvas.height);
}

const EDGES = [
  { side: 'left', ph: 0.0 },
  { side: 'right', ph: 2.65 },
  { side: 'top', ph: 1.3 },
  { side: 'bottom', ph: 3.85 }
];

function drawTideStrip(side, prog, t, ph, bgColor) {
  const W = floodCanvas.width;
  const H = floodCanvas.height;
  const maxInset = (side === 'left' || side === 'right') ? W * 0.54 : H * 0.54;
  const inset = maxInset * prog;
  const amp = Math.min(72, inset * 0.48);

  function w(u) {
    return amp * (
      0.50 * Math.sin(u * 0.0038 + t * 1.15 + ph) +
      0.33 * Math.sin(u * 0.0105 - t * 0.78 + ph + 1.9) +
      0.17 * Math.sin(u * 0.0222 + t * 2.05 + ph + 4.1)
    );
  }

  const STEP = 3;
  floodCtx.fillStyle = bgColor;
  floodCtx.beginPath();

  if (side === 'left') {
    floodCtx.moveTo(0, 0);
    for (let y = 0; y <= H; y += STEP) floodCtx.lineTo(Math.max(0, inset + w(y)), y);
    floodCtx.lineTo(0, H);
  } else if (side === 'right') {
    floodCtx.moveTo(W, 0);
    for (let y = 0; y <= H; y += STEP) floodCtx.lineTo(Math.min(W, W - inset + w(y)), y);
    floodCtx.lineTo(W, H);
  } else if (side === 'top') {
    floodCtx.moveTo(0, 0);
    for (let x = 0; x <= W; x += STEP) floodCtx.lineTo(x, Math.max(0, inset + w(x)));
    floodCtx.lineTo(W, 0);
  } else {
    floodCtx.moveTo(0, H);
    for (let x = 0; x <= W; x += STEP) floodCtx.lineTo(x, Math.min(H, H - inset + w(x)));
    floodCtx.lineTo(W, H);
  }

  floodCtx.closePath();
  floodCtx.fill();
}

function drawAllTide(prog, t, bgColor) {
  floodCtx.clearRect(0, 0, floodCanvas.width, floodCanvas.height);
  EDGES.forEach(({ side, ph }) => drawTideStrip(side, prog, t, ph, bgColor));
}

function animateTideIn(bgColor, duration, onPanel) {
  clearFlood();
  const startT = performance.now();
  let panelFired = false;
  const eIO = p => p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

  function frame(now) {
    const elapsed = now - startT;
    const raw = Math.min(elapsed / duration, 1);
    const prog = eIO(raw);
    drawAllTide(prog, elapsed / 1000, bgColor);

    if (!panelFired && raw >= 0.46) {
      panelFired = true;
      if (onPanel) onPanel();
    }

    if (raw < 1) {
      floodRaf = requestAnimationFrame(frame);
    } else {
      floodRaf = null;
      floodCtx.fillStyle = bgColor;
      floodCtx.fillRect(0, 0, floodCanvas.width, floodCanvas.height);
    }
  }

  floodRaf = requestAnimationFrame(frame);
}

function animateTideOut(bgColor, duration, onDone) {
  if (floodRaf) {
    cancelAnimationFrame(floodRaf);
    floodRaf = null;
  }
  const startT = performance.now();
  const eOut3 = p => 1 - Math.pow(1 - p, 3);

  function frame(now) {
    const elapsed = now - startT;
    const raw = Math.min(elapsed / duration, 1);
    const prog = 1 - eOut3(raw);
    drawAllTide(prog, elapsed / 1000, bgColor);

    if (raw < 1) {
      floodRaf = requestAnimationFrame(frame);
    } else {
      clearFlood();
      if (onDone) onDone();
    }
  }

  floodRaf = requestAnimationFrame(frame);
}

const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelCount = document.getElementById('panel-count');
const panelStrip = document.getElementById('panel-strip');
const worksGrid = document.getElementById('works-grid');
const closeBtn = document.getElementById('close-btn');
let activeBlob = null;
let lastFlight = {};

function flyBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');

  const rectBefore = blob.getBoundingClientRect();
  blob.classList.add('flying-js');
  blob.style.opacity = '1';
  blob.style.animation = 'none';
  void blob.offsetHeight;

  const rectSnap = blob.getBoundingClientRect();
  const floatDy = rectBefore.top - rectSnap.top;
  const DURATION = 1600;
  const totalTravel = rectBefore.top + rectBefore.height / 2 + 120;

  const color = blob.dataset.color;
  const n = parseInt(color.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const k = lum >= 160 ? 0.74 : 1.0;
  const bgColor = `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;

  lastFlight = { id, floatDy, totalTravel, bgColor };
  panelStrip.style.background = 'rgba(255,255,255,.38)';

  const eIO = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const eOut = t => 1 - (1 - t) * (1 - t);
  const eIn = t => t * t;
  const start = performance.now();
  let floodStarted = false;

  function frame(now) {
    const prog = Math.min((now - start) / DURATION, 1);
    const tSec = (now - start) / 1000;

    blob.style.transform = `translateY(${floatDy - eIO(prog) * totalTravel}px)`;
    if (prog > .86) blob.style.opacity = String(1 - (prog - .86) / .14);

    let sx, sy;
    if (prog < .06) {
      const q = Math.sin((prog / .06) * Math.PI);
      sx = 1 + q * .14;
      sy = 1 - q * .11;
    } else if (prog < .68) {
      const q = eOut((prog - .06) / .62);
      sx = 1 - q * .25;
      sy = 1 + q * .32;
    } else if (prog < .78) {
      const q = eIn((prog - .68) / .10);
      sx = 0.75 + q * 2.0;
      sy = 1.32 - q * 1.20;
    } else if (prog < .86) {
      const q = eOut((prog - .78) / .08);
      sx = 2.75 - q * 1.25;
      sy = 0.12 + q * .38;
    } else {
      const q = (prog - .86) / .14;
      sx = 1.5 + q * 1.5;
      sy = 0.50 - q * .49;
    }

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec + 8, sx, sy)));

    if (prog >= 0.86 && !floodStarted) {
      floodStarted = true;
      animateTideIn(bgColor, 950, () => {
        panel.classList.add('active');
        panel.style.color = '#ffffff';
      });
    }

    if (prog < 1) requestAnimationFrame(frame);
    else blob.style.visibility = 'hidden';
  }

  requestAnimationFrame(frame);
}

function returnBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');
  const { floatDy, totalTravel } = lastFlight;
  const RDUR = 1450;
  const eOut3 = t => 1 - Math.pow(1 - t, 3);
  const eOut = t => 1 - (1 - t) * (1 - t);
  const start = performance.now();

  blob.style.visibility = '';
  blob.style.opacity = '0';
  blob.style.transform = `translateY(${floatDy - totalTravel}px)`;
  blob.style.zIndex = '490';

  function frame(now) {
    const prog = Math.min((now - start) / RDUR, 1);
    const tSec = (now - start) / 1000;
    blob.style.transform = `translateY(${floatDy - (1 - eOut3(prog)) * totalTravel}px)`;
    if (prog < .16) blob.style.opacity = String(prog / .16);
    else blob.style.opacity = '1';

    let sx, sy;
    if (prog < .14) {
      const q = eOut(prog / .14);
      sx = 2.8 - q * 2.1;
      sy = 0.02 + q * 1.26;
    } else if (prog < .82) {
      const q = eOut3((prog - .14) / .68);
      sx = 0.7 + q * .30;
      sy = 1.28 - q * .28;
    } else if (prog < .93) {
      const q = Math.sin(((prog - .82) / .11) * Math.PI);
      sx = 1 + q * .13;
      sy = 1 - q * .10;
    } else {
      sx = 1;
      sy = 1;
    }

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec + 20, sx, sy)));

    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      blob.style.transform = '';
      blob.style.opacity = '';
      blob.style.zIndex = '';
      blob.style.animation = FLOAT_ANIM[id];
      blob.classList.remove('flying-js');
    }
  }

  requestAnimationFrame(frame);
}

document.querySelectorAll('.blob').forEach(blob => {
  blob.addEventListener('click', () => {
    if (blob.classList.contains('flying-js')) return;
    activeBlob = blob;
    panelTitle.textContent = blob.dataset.category;
    panelCount.textContent = String(JSON.parse(blob.dataset.works).length).padStart(2, '0') + ' Works';

    const works = JSON.parse(blob.dataset.works);
    worksGrid.innerHTML = works.map((w, i) => w.project
      ? `<div class="work-card featured" data-project="${w.project}" data-play="${w.play || ''}" data-github="${w.github || ''}" data-title="${w.title}" data-desc="${w.desc || ''}" data-year="${w.year}">
           <div class="work-card-ghost">${String(i + 1).padStart(2, '0')}</div>
           <div class="work-card-body">
             <div class="work-card-title">${w.title}</div>
             <div class="work-card-year">${w.year}</div>
             <div class="work-card-cta">View project + play ↗</div>
           </div>
         </div>`
      : `<div class="work-card">
           <div class="work-card-ghost">${String(i + 1).padStart(2, '0')}</div>
           <div class="work-card-title">${w.title}</div>
           <div class="work-card-year">${w.year}</div>
         </div>`
    ).join('');

    flyBlob(blob);
  });
});

const projPanel = document.getElementById('proj-panel');
const projBack = document.getElementById('proj-back');
const gameFrame = document.getElementById('game-frame');
const gamePH = document.getElementById('game-placeholder');
const gameExtLink = document.getElementById('game-external');

function openProject(card) {
  const projectId = card.dataset.project || '';
  const play = card.dataset.play || '';
  const github = card.dataset.github || '#';
  const title = card.dataset.title || '';
  const desc = card.dataset.desc || '';
  const year = card.dataset.year || '';
  const data = PROJECT_DATA[projectId] || {};

  document.getElementById('proj-title').textContent = title;
  document.getElementById('proj-desc').innerHTML = desc;
  document.getElementById('proj-tag').textContent = data.tag || `Game · ${year}`;
  document.getElementById('proj-gh-link').href = github;
  document.getElementById('proj-process').innerHTML = data.process || '';
  document.getElementById('proj-reflection').innerHTML = data.reflection || '';
  document.getElementById('proj-systems-label').textContent = data.systemsLabel || 'Game Modes';

  const modesList = document.getElementById('proj-modes-list');
  const modesSection = modesList.closest('.proj-modes');
  const modes = data.modes || [];

  if (modes.length > 0) {
    modesList.innerHTML = modes.map(m =>
      `<li><em>${m.n}</em> ${m.title}${m.sub ? ` <span>(${m.sub})</span>` : ''}</li>`
    ).join('');
    modesSection.style.display = '';
  } else {
    modesSection.style.display = 'none';
  }

  gameFrame.src = '';
  gamePH.classList.remove('hidden');
  gameExtLink.href = play || github;
  gameExtLink.textContent = play ? 'Open in new tab ↗' : 'View on GitHub ↗';

  if (play) {
    setTimeout(() => {
      gameFrame.src = play;
      const hide = () => gamePH.classList.add('hidden');
      gameFrame.onload = hide;
      setTimeout(hide, 5000);
    }, 600);
  }

  projPanel.classList.add('active');
}

function closeProject() {
  projPanel.classList.remove('active');
  setTimeout(() => {
    gameFrame.src = '';
  }, 700);
}

projBack.addEventListener('click', closeProject);
projBack.addEventListener('mouseenter', () => {
  ring.style.width = '50px';
  ring.style.height = '50px';
});
projBack.addEventListener('mouseleave', () => {
  ring.style.width = '34px';
  ring.style.height = '34px';
});

document.addEventListener('click', e => {
  const card = e.target.closest('.work-card.featured');
  if (card) openProject(card);
});

closeBtn.addEventListener('click', () => {
  const blob = activeBlob;
  activeBlob = null;
  const { bgColor } = lastFlight;

  panel.classList.remove('active');
  panel.style.color = '';

  setTimeout(() => animateTideOut(bgColor, 800, null), 180);
  setTimeout(() => returnBlob(blob), 820);
});

closeBtn.addEventListener('mouseenter', () => {
  ring.style.width = '50px';
  ring.style.height = '50px';
});
closeBtn.addEventListener('mouseleave', () => {
  ring.style.width = '34px';
  ring.style.height = '34px';
});
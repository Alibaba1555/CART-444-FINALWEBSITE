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
  },
  roland: {
    tag: 'Design · 2022 · Stable Diffusion',
    systemsLabel: 'About the Work',
    noGithub: true,
    gallery: ['images/La1.png','images/La2.png'],
    process: `I was among the first students in the program to submit a design project made with generative AI — at a time when most people were still unfamiliar with the tools. Rather than using a generic model, I locally deployed Stable Diffusion and trained my own fine-tuned weights to achieve a specific visual register: the texture and weight of classical oil painting, applied to the epic narrative of La Chanson de Roland.<br><br>Each spread was treated as a composition problem — how to give visual form to a medieval poem without illustration becoming literal. The AI was a tool for translation, not automation.`,
    reflection: `The project earned strong results, but more importantly it changed how I understood design research. Fine-tuning a model is a design act: every training decision is a curatorial one, shaping what the system considers plausible or beautiful.<br><br>Looking back, I would push further into the relationship between text and image — using the poem's rhythm and line breaks as compositional logic, not just its narrative content.`,
    modes: [
      { n: '01', title: 'Custom model training', sub: 'Oil painting style weights' },
      { n: '02', title: 'Narrative composition', sub: 'Spread-by-spread layout' },
      { n: '03', title: 'Local SD deployment', sub: 'Fully offline pipeline' },
      { n: '04', title: 'Style research', sub: 'Medieval manuscript + neorealism' }
    ]
  },
  poster: {
    tag: 'Design · 2023',
    systemsLabel: 'About the Work',
    noGithub: true,
    gallery: ['images/D1.png','images/D2.png'],
    process: `The Roberto Rossellini poster started from an interest in how film posters from the 1950s–70s used typography as a structural element rather than decoration. The challenge was to make something that felt of its era — heavy serif type, collaged photography — without becoming pastiche.<br><br>The Chinese character poster explores the same tension in a different tradition: using ink silhouettes of a figure against a field of solid colour, where the negative space carries as much weight as the mark.`,
    reflection: `Graphic design, for me, is mostly about restraint — deciding what not to include. Both posters taught me that strong work often comes from committing fully to a single compositional idea and removing everything that dilutes it.`,
    modes: [
      { n: '01', title: 'Rossellini tribute', sub: 'Typographic poster' },
      { n: '02', title: 'Chinese character poster', sub: 'Silhouette + flat colour' },
      { n: '03', title: 'Book cover design', sub: 'Editorial layout' }
    ]
  },
  puppet: {
    tag: 'Design · 2023 · Adobe Animate',
    systemsLabel: 'About the Work',
    noGithub: true,
    gallery: ['images/P1.png'],
    process: `The shadow puppet animation was made in Adobe Animate, drawing directly from the 皮影戏 tradition — a Chinese performance form where articulated leather figures are manipulated behind a lit screen.<br><br>The characters were illustrated in an ink-wash register with hand-keyed movement. The goal was not to simulate physical puppetry accurately, but to preserve its quality of imprecision — the slight hesitation before a gesture, the way a sleeve doesn't quite follow the arm.`,
    reflection: `The most interesting constraint was the background: painting an ink-wash landscape means accepting that the image will never be exact. That looseness became the visual identity of the piece. Working within a traditional form also raised questions about what it means to adapt cultural material — how much to preserve, how much to translate.`,
    modes: [
      { n: '01', title: 'Frame-by-frame keyframing', sub: 'Adobe Animate' },
      { n: '02', title: 'Ink-wash illustration', sub: 'Mountain landscape' },
      { n: '03', title: 'Character rigging', sub: 'Articulated puppet joints' }
    ]
  },
  film: {
    tag: 'Design · 2023 · Short Film',
    systemsLabel: 'About the Work',
    noGithub: true,
    gallery: ['images/F1.png','images/F2.png','images/F3.png','images/F4.png','images/F5.png'],
    process: `Short film production with classmates — I worked primarily on camera operation and on-set framing decisions. The process was less about following a plan and more about staying attentive to what the scene was actually doing: when to hold a shot, when to move, when a quieter choice would carry more weight than a dynamic one.<br><br>The concert and interior scenes in particular required working quickly in low light with available sources — which made exposure and composition decisions feel immediate and consequential.`,
    reflection: `What I took away from this work was a sharper sense of when to get out of the way of what is happening in front of the camera. Good cinematography is often invisible — and that invisibility is the result of many deliberate choices.`,
    modes: [
      { n: '01', title: 'Camera operation', sub: 'Handheld & tripod' },
      { n: '02', title: 'Available light', sub: 'Interior & stage' },
      { n: '03', title: 'On-set collaboration', sub: 'Multi-person crew' }
    ]
  },
  environment: {
    tag: 'Design · 2024 · Environment & 3D',
    systemsLabel: 'About the Work',
    noGithub: true,
    gallery: ['images/E1.png'],
    process: `These pieces explore spatial storytelling through environment design — dark corridor architecture, game space atmosphere, and a voxel-style ship. The corridors were built to communicate a specific feeling before any narrative context: something industrial, confined, and slightly worn.<br><br>The voxel ship model works differently — the grid-based aesthetic creates a visual language that is simultaneously retro and abstract, letting the glowing yellow elements read as light sources or collectibles depending on what the viewer brings to it.`,
    reflection: `Environment design taught me that space communicates before story does. A player or viewer will have already formed an emotional register from the space before they encounter a single narrative element. Getting that register right — through scale, lighting, and surface quality — is most of the work.`,
    modes: [
      { n: '01', title: 'Corridor architecture', sub: 'Atmospheric game space' },
      { n: '02', title: 'Voxel modelling', sub: 'Ship with dynamic lighting' },
      { n: '03', title: 'Spatial composition', sub: 'Scale & shadow' }
    ]
  },
  recipe: {
    tag: 'Other · 2024 · OpenAI API',
    systemsLabel: 'Features',
    noGithub: false,
    gallery: ['images/O1.png'],
    process: `The idea was simple: instead of searching for a recipe and then checking if you have the ingredients, reverse the process entirely. You enter what you already have — a few items, however odd the combination — and the site generates a fitting recipe on the spot.<br><br>Under the hood, the input (ingredients + cuisine preference + dietary flags) is assembled into a structured prompt and sent to the OpenAI API. The response is parsed and rendered as a clean recipe card with ingredients, step-by-step instructions, and estimated preparation time.`,
    reflection: `What surprised me was how much the framing of the prompt matters. Early versions returned generic results; tightening the instruction structure — specifying format, tone, and constraints — made the output dramatically more useful and consistent.<br><br>The project also raised an interesting design question: how do you make an AI-generated result feel trustworthy? Small details like structured layout, estimated times, and dietary labels helped the output feel considered rather than arbitrary.`,
    modes: [
      { n: '01', title: 'Ingredient input', sub: 'Free-form text entry' },
      { n: '02', title: 'Cuisine selector', sub: 'French, Italian, Asian…' },
      { n: '03', title: 'Dietary filters', sub: 'Gluten-free, Vegan, Dessert' },
      { n: '04', title: 'OpenAI API', sub: 'GPT-powered recipe generation' },
      { n: '05', title: 'Recipe card output', sub: 'Ingredients + instructions' }
    ]
  },
  pollution: {
    tag: 'Other · 2025 · Max/MSP',
    systemsLabel: 'Sound Sources',
    noGithub: true,
    gallery: ['images/O2.png'],
    process: `O2 is a real-time city sound system built in Max/MSP. Air quality data is pulled live from any city via API — pollutants like NO₂, PM2.5, CO, and ozone are each mapped to distinct sound textures and layered together.<br><br>A heavily polluted city generates industrial noise, low-frequency hum, and synthetic interference. A clean city produces wind, birdsong, and open natural tones. All values are summed into a single continuous audio output — a sonic portrait of a city's atmosphere at that exact moment.`,
    reflection: `What interested me most was the question of legibility: can someone hear pollution without being told what they are listening to? Early tests suggested yes — listeners consistently described the heavily polluted presets as dense, uncomfortable, or mechanical, without prior context.<br><br>The project also raised questions about data as material. Rather than visualising air quality, sonifying it forces a different kind of attention — duration, texture, and change over time become the medium.`,
    modes: [
      { n: '01', title: 'NO₂', sub: 'Industrial / factory noise' },
      { n: '02', title: 'PM2.5', sub: 'Dense granular texture' },
      { n: '03', title: 'CO', sub: 'Low-frequency hum' },
      { n: '04', title: 'Ozone', sub: 'High resonant interference' },
      { n: '05', title: 'Clean baseline', sub: 'Wind & birdsong' },
      { n: '06', title: 'Live API pull', sub: 'Any city, real-time' }
    ]
  },
  jukebox: {
    tag: 'Other · 2025 · Max/MSP · OpenAI API',
    systemsLabel: 'Signal Chain',
    noGithub: true,
    gallery: ['images/O3.png'],
    process: `The name Max/MSP comes from Max Mathews — the engineer who, in 1961, programmed the IBM 7094 to sing Daisy Bell, the first time a computer had ever produced a recognisable human voice. That moment was the direct inspiration for this patch.<br><br>The goal was to reconstruct that sound: not a sample or a recording, but a synthesised voice built from scratch in Max. When a song title is entered, a Node.js bridge sends it to the OpenAI API, which returns the note sequence as pitch, length, and velocity values. Those values are then routed through a custom synthesizer — sine oscillators, resonant filters, a PWM-driven pulse wave, and an ADSR envelope — to produce the melody.<br><br>A LoFi mode layers noise, tanh distortion, and bit degradation (down to 6-bit at 11025 Hz) to push the output closer to the texture of the original 1961 IBM recording.`,
    reflection: `What surprised me was how much the LoFi processing matters. Without it, the output sounds like a clean MIDI render. With the degradation chain engaged, something shifts — the sound becomes fragile in a way that feels more like memory than music.<br><br>The project also revealed how much information is carried by imperfection. The IBM 7094 didn&#39;t sound the way it did by design — it sounded that way because of hardware constraints. Simulating those constraints intentionally is a different act entirely, and that gap is worth sitting with.`,
    modes: [
      { n: '01', title: 'Song title input', sub: 'Text → OpenAI API' },
      { n: '02', title: 'Note sequence', sub: 'Pitch · length · velocity' },
      { n: '03', title: 'Sine synthesis', sub: 'Custom oscillator chain' },
      { n: '04', title: 'Resonant filters', sub: 'Bandpass · highpass · lowpass' },
      { n: '05', title: 'LoFi mode', sub: '6-bit · noise · tanh distortion' },
      { n: '06', title: 'PWM LFO', sub: 'Auto duty-cycle modulation' }
    ]
  },
  soulslike: {
    tag: 'Game · 2025 · Unreal Engine 4',
    systemsLabel: 'Game Systems',
    noGithub: true,
    gallery: [
      'images/week10 7.png',
      'images/week10 8.png',
      'images/week11 1.png',
      'images/week11 2.png',
      'images/week11 3.png',
      'images/week11 51.gif',
      'images/week11 71.gif'
    ],
    process: `This project was first created as an early prototype in 2023, but at that time it remained unfinished. Recently, I returned to it and finally had the chance to turn it into a more complete playable experience.<br><br>The main focus was building a combat loop that feels heavier and more deliberate. I developed a moveset with two light attacks and four heavy combo attacks, while also adding a dodge roll so the player could avoid enemy attacks and create openings.<br><br>The overall structure is linear: the player progresses from point A to point B through a sequence of encounters. Rather than building a large world, I focused on creating a small but complete slice of a soul-like experience.`,
    reflection: `What matters most in this project is not scale, but rhythm. Once dodge timing, attack commitment, and enemy pressure are introduced, even a short level can start to feel tense and intentional.<br><br>At its current stage, the game already forms a full loop: movement, combat, enemy encounters, and a boss at the end. At the same time, it still feels like a test space rather than a fully polished game.<br><br>If I continue developing it, I would improve enemy behavior, attack feedback, and encounter pacing so the combat feels more readable, punishing, and satisfying.`,
    modes: [
      { n: '01', title: 'Linear Progression', sub: 'Point A to B flow' },
      { n: '02', title: 'Light Attacks', sub: '2-hit combat option' },
      { n: '03', title: 'Heavy Combos', sub: '4 chained attacks' },
      { n: '04', title: 'Dodge Roll', sub: 'Avoid enemy damage' },
      { n: '05', title: 'Standard Enemy', sub: 'Basic encounter' },
      { n: '06', title: 'Boss Fight', sub: 'Combat climax' }
    ]
  }
};

const BD = {
  'blob-photography': { cx: 89, cy: 124, r: 78 },
  'blob-design':      { cx: 107, cy: 110, r: 88 },
  'blob-other':       { cx: 79, cy: 128, r: 68 },
  'blob-game':        { cx: 100, cy: 115, r: 83 }
};

const NOISE = {
  'blob-photography': [[13,1.3,0.0],[9,2.3,1.2],[6,0.8,2.5],[11,3.0,0.9]],
  'blob-design':      [[15,1.1,1.4],[7,2.5,0.3],[10,0.9,3.0],[6,1.8,1.8]],
  'blob-other':       [[11,1.6,2.8],[8,2.0,0.7],[9,0.7,1.4],[14,2.6,3.4]],
  'blob-game':        [[10,1.9,0.7],[13,1.0,2.1],[7,2.7,0.5],[9,1.5,1.9]]
};

const FLOAT_ANIM = {
  'blob-photography': 'fa 3.9s 0s ease-in-out infinite',
  'blob-design':      'fb 4.3s 0s ease-in-out infinite',
  'blob-other':       'fc 3.6s 0s ease-in-out infinite',
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
    const idx = ['blob-photography','blob-design','blob-other','blob-game'].indexOf(blob.id);
    const [spd, ph] = [[1.8,0.0],[2.1,1.4],[1.5,2.8],[2.4,0.7]][idx];
    const s = t * spd + ph;
    const { cx, cy, r } = bd;
    const n = NOISE[blob.id];
    const dw = Math.sin(s * .90) * r * .09;
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
    // Collect all photo items for the viewer
    const photoItems = works.filter(w => w.photo).map(w => w.photo);

    worksGrid.innerHTML = works.map((w, i) => {
      const n = String(i + 1).padStart(2, '0');
      if (w.photo) {
        return `<div class="work-card photo-card" data-photo-index="${i}"
                     style="background-image:url('${w.photo}')">
                  <div class="photo-card-overlay">
                    <span class="photo-card-num">${n}</span>
                    <span class="photo-card-cta">View ↗</span>
                  </div>
                </div>`;
      }
      if (w.project) {
        return `<div class="work-card featured" data-project="${w.project}"
                     data-play="${w.play || ''}" data-github="${w.github || ''}"
                     data-title="${w.title}" data-desc="${w.desc || ''}"
                     data-year="${w.year}" data-img="${w.img || ''}">
                  <div class="work-card-ghost">${n}</div>
                  <div class="work-card-body">
                    <div class="work-card-title">${w.title}</div>
                    <div class="work-card-year">${w.year}</div>
                    <div class="work-card-cta">View project + play ↗</div>
                  </div>
                </div>`;
      }
      return `<div class="work-card">
                <div class="work-card-ghost">${n}</div>
                <div class="work-card-title">${w.title}</div>
                <div class="work-card-year">${w.year}</div>
              </div>`;
    }).join('');

    // Wire photo card clicks → open photo viewer
    if (photoItems.length > 0) {
      worksGrid.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', () => openPhotoViewer(photoItems, parseInt(card.dataset.photoIndex)));
      });
    }

    flyBlob(blob);
  });
});

const projPanel = document.getElementById('proj-panel');
const projBack = document.getElementById('proj-back');
const gameFrame = document.getElementById('game-frame');
const gamePH = document.getElementById('game-placeholder');
const gameExtLink = document.getElementById('game-external');
const demoImage = document.getElementById('demo-image');

// Gallery state
let galleryImages = [];
let galleryIndex  = 0;
let galleryTimer  = null;

function showGalleryFrame(idx) {
  galleryIndex = ((idx % galleryImages.length) + galleryImages.length) % galleryImages.length;
  const src = galleryImages[galleryIndex];
  demoImage.style.opacity = '0';
  demoImage.onload = () => { demoImage.style.opacity = '1'; };
  demoImage.src = src;
  if (!demoImage.classList.contains('active')) demoImage.classList.add('active');
  gamePH.classList.add('hidden');
  // Update dots
  document.querySelectorAll('.gallery-dot').forEach((d,i) => {
    d.classList.toggle('active', i === galleryIndex);
  });
}

function startGalleryAuto() {
  stopGalleryAuto();
  galleryTimer = setInterval(() => showGalleryFrame(galleryIndex + 1), 3200);
}
function stopGalleryAuto() {
  if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; }
}

function openProject(card) {
  const projectId = card.dataset.project || '';
  const play      = card.dataset.play    || '';
  const github    = card.dataset.github  || '#';
  const title     = card.dataset.title   || '';
  const desc      = card.dataset.desc    || '';
  const year      = card.dataset.year    || '';
  const data      = PROJECT_DATA[projectId] || {};

  document.getElementById('proj-title').textContent    = title;
  document.getElementById('proj-desc').innerHTML       = desc;
  document.getElementById('proj-tag').textContent      = data.tag || `Game · ${year}`;
  document.getElementById('proj-process').innerHTML    = data.process || '';
  document.getElementById('proj-reflection').innerHTML = data.reflection || '';
  document.getElementById('proj-systems-label').textContent = data.systemsLabel || 'Game Modes';

  // GitHub link: hide entirely when project has no public repo
  const ghLink = document.getElementById('proj-gh-link');
  if (data.noGithub || !github || github === '#') {
    ghLink.style.display = 'none';
  } else {
    ghLink.style.display = '';
    ghLink.href = github;
  }

  // Modes list
  const modesList    = document.getElementById('proj-modes-list');
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

  // Reset media area
  stopGalleryAuto();
  gameFrame.src = '';
  demoImage.classList.remove('active');
  demoImage.style.opacity = '1';
  demoImage.removeAttribute('src');
  gamePH.classList.remove('hidden');
  gamePH.querySelector('span').textContent = 'Loading…';

  // Remove old gallery nav if any
  document.querySelectorAll('.gallery-nav, .gallery-dots').forEach(el => el.remove());

  const ghExternal = document.getElementById('game-external');

  if (data.gallery && data.gallery.length > 0) {
    // ── Image gallery mode ──────────────────────────────────────
    galleryImages = data.gallery;
    galleryIndex  = 0;

    // Build dot indicators
    const dots = document.createElement('div');
    dots.className = 'gallery-dots';
    dots.innerHTML = galleryImages.map((_,i) =>
      `<span class="gallery-dot${i===0?' active':''}"></span>`).join('');
    document.querySelector('.proj-play-wrap').appendChild(dots);

    // Build prev/next arrows
    const nav = document.createElement('div');
    nav.className = 'gallery-nav';
    nav.innerHTML = `<button class="gal-prev">&#8592;</button><button class="gal-next">&#8594;</button>`;
    document.querySelector('.proj-play-wrap').appendChild(nav);

    nav.querySelector('.gal-prev').addEventListener('click', () => {
      stopGalleryAuto(); showGalleryFrame(galleryIndex - 1); startGalleryAuto();
    });
    nav.querySelector('.gal-next').addEventListener('click', () => {
      stopGalleryAuto(); showGalleryFrame(galleryIndex + 1); startGalleryAuto();
    });

    // Hide external link row — no playable version
    ghExternal.parentElement.style.display = 'none';

    setTimeout(() => { showGalleryFrame(0); startGalleryAuto(); }, 500);

  } else if (play && play !== '#') {
    // ── Iframe / playable mode ──────────────────────────────────
    ghExternal.parentElement.style.display = '';
    ghExternal.href = play;
    ghExternal.textContent = 'Open in new tab ↗';
    setTimeout(() => {
      gameFrame.src = play;
      const hide = () => gamePH.classList.add('hidden');
      gameFrame.onload = hide;
      setTimeout(hide, 5000);
    }, 600);
  } else {
    ghExternal.parentElement.style.display = '';
    ghExternal.href = github !== '#' ? github : '#';
    ghExternal.textContent = github !== '#' ? 'View on GitHub ↗' : 'Preview unavailable';
    gamePH.querySelector('span').textContent = 'Playable demo not embedded';
  }

  projPanel.classList.add('active');
}

function closeProject() {
  projPanel.classList.remove('active');
  stopGalleryAuto();
  setTimeout(() => {
    gameFrame.src = '';
    demoImage.classList.remove('active');
    demoImage.removeAttribute('src');
    gamePH.classList.remove('hidden');
    gamePH.querySelector('span').textContent = 'Loading game…';
    document.querySelectorAll('.gallery-nav, .gallery-dots').forEach(el => el.remove());
    galleryImages = [];
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


// ── Photo viewer panel ───────────────────────────────────────
const photoPanel   = document.getElementById('photo-panel');
const photoBack    = document.getElementById('photo-back');
const photoMainImg = document.getElementById('photo-main-img');
const photoPrev    = document.getElementById('photo-prev');
const photoNext    = document.getElementById('photo-next');
const photoThumbRow= document.getElementById('photo-thumb-row');

let photoList  = [];
let photoIndex = 0;

function showPhoto(idx) {
  photoIndex = ((idx % photoList.length) + photoList.length) % photoList.length;
  photoMainImg.style.opacity = '0';
  photoMainImg.onload = () => { photoMainImg.style.opacity = '1'; };
  photoMainImg.src = photoList[photoIndex];
  photoThumbRow.querySelectorAll('.ph-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === photoIndex);
  });
}

function openPhotoViewer(photos, startIdx) {
  photoList = photos;

  // Build thumbnails
  photoThumbRow.innerHTML = photos.map((src, i) =>
    `<div class="ph-thumb${i === startIdx ? ' active' : ''}" data-i="${i}">
       <img src="${src}" alt="" />
     </div>`
  ).join('');
  photoThumbRow.querySelectorAll('.ph-thumb').forEach(t => {
    t.addEventListener('click', () => showPhoto(parseInt(t.dataset.i)));
  });

  photoMainImg.src = '';
  photoMainImg.style.opacity = '0';
  photoPanel.classList.add('active');
  setTimeout(() => showPhoto(startIdx), 80);
}

photoBack.addEventListener('click', () => {
  photoPanel.classList.remove('active');
  setTimeout(() => {
    photoMainImg.src = '';
    photoThumbRow.innerHTML = '';
    photoList = [];
  }, 700);
});

photoPrev.addEventListener('click', () => showPhoto(photoIndex - 1));
photoNext.addEventListener('click', () => showPhoto(photoIndex + 1));

// Keyboard nav when photo panel is open
document.addEventListener('keydown', e => {
  if (!photoPanel.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  showPhoto(photoIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(photoIndex + 1);
  if (e.key === 'Escape')     photoBack.click();
});

photoBack.addEventListener('mouseenter', () => { ring.style.width='50px'; ring.style.height='50px'; });
photoBack.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; });

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

// ── About panel / Wheel-based crawl ─────────────────────────
const aboutPanel = document.getElementById('about-panel');
const aboutBack = document.getElementById('about-back');
const crawlScrollEl = document.getElementById('crawl-scroll');
const navAbout = document.getElementById('nav-about');

let crawlOpen = false;
let crawlPos = 0;
let crawlTarget = 0;

function getCrawlMetrics() {
  const contentH = crawlScrollEl.scrollHeight;
  const viewportH = window.innerHeight;

  const topLimit = viewportH * 3;
  const startY = topLimit;
  const endY = -(contentH - viewportH * 0.82);

  return { topLimit, startY, endY };
}

function clampCrawl(value) {
  const { topLimit, endY } = getCrawlMetrics();
  return Math.max(endY, Math.min(topLimit, value));
}

function resetCrawl() {
  const { startY } = getCrawlMetrics();
  crawlPos = startY;
  crawlTarget = startY;
  crawlScrollEl.style.transform = `translateY(${startY}px)`;
}

navAbout.addEventListener('click', e => {
  e.preventDefault();
  aboutPanel.classList.add('active');
  crawlOpen = true;

  requestAnimationFrame(() => {
    resetCrawl();
  });
});

aboutBack.addEventListener('click', () => {
  crawlOpen = false;
  aboutPanel.classList.remove('active');
});

aboutBack.addEventListener('mouseenter', () => {
  ring.style.width = '50px';
  ring.style.height = '50px';
});

aboutBack.addEventListener('mouseleave', () => {
  ring.style.width = '34px';
  ring.style.height = '34px';
});

document.addEventListener('keydown', e => {
  if (!crawlOpen) return;

  if (e.key === 'Escape') aboutBack.click();

  if (e.key === 'ArrowDown') {
    crawlTarget -= 90;
    crawlTarget = clampCrawl(crawlTarget);
  }

  if (e.key === 'ArrowUp') {
    crawlTarget += 90;
    crawlTarget = clampCrawl(crawlTarget);
  }

  if (e.key === 'Home') {
    resetCrawl();
  }

  if (e.key === 'End') {
    const { endY } = getCrawlMetrics();
    crawlTarget = endY;
  }
});

aboutPanel.addEventListener('wheel', e => {
  if (!crawlOpen) return;
  e.preventDefault();

  crawlTarget -= e.deltaY;
  crawlTarget = clampCrawl(crawlTarget);
}, { passive: false });

window.addEventListener('resize', () => {
  if (!crawlOpen) return;
  crawlTarget = clampCrawl(crawlTarget);
  crawlPos = clampCrawl(crawlPos);
  crawlScrollEl.style.transform = `translateY(${crawlPos}px)`;
});

(function crawlRaf() {
  requestAnimationFrame(crawlRaf);
  if (!crawlOpen) return;

  crawlPos += (crawlTarget - crawlPos) * 0.1;
  crawlScrollEl.style.transform = `translateY(${crawlPos}px)`;
})();

// ── Contact panel ───────────────────────────────────────────
const contactPanel = document.getElementById('contact-panel');
const contactBack = document.getElementById('contact-back');
const navContact = document.getElementById('nav-contact');

const CONTACT_BG = 'rgb(34, 24, 18)';
let contactOpen = false;

navContact.addEventListener('click', e => {
  e.preventDefault();
  if (contactOpen) return;

  contactOpen = true;

  animateTideIn(CONTACT_BG, 950, () => {
    contactPanel.classList.add('active');
  });
});

contactBack.addEventListener('click', () => {
  contactPanel.classList.remove('active');

  setTimeout(() => {
    animateTideOut(CONTACT_BG, 820, () => {
      contactOpen = false;
    });
  }, 160);
});

contactBack.addEventListener('mouseenter', () => {
  ring.style.width = '50px';
  ring.style.height = '50px';
});

contactBack.addEventListener('mouseleave', () => {
  ring.style.width = '34px';
  ring.style.height = '34px';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && contactOpen) {
    contactBack.click();
  }
});
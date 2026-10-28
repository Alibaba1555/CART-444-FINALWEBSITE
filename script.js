const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

// The parent cursor must not remain painted over an embedded project.
let portfolioCursorVisible = false;
function hidePortfolioCursor() {
  portfolioCursorVisible = false;
  cursor.style.visibility = 'hidden';
  ring.style.visibility = 'hidden';
}
hidePortfolioCursor();
document.addEventListener('mousemove', e => {
  if (e.target instanceof HTMLIFrameElement) {
    hidePortfolioCursor();
    return;
  }
  mx = e.clientX;
  my = e.clientY;
  if (!portfolioCursorVisible) {
    rx = mx;
    ry = my;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  cursor.style.visibility = 'visible';
  ring.style.visibility = 'visible';
  portfolioCursorVisible = true;
});
document.querySelectorAll('iframe').forEach(frame => {
  frame.addEventListener('pointerenter', hidePortfolioCursor);
  frame.addEventListener('mouseenter', hidePortfolioCursor);
  // Also cover a preview that loads directly underneath a stationary pointer.
  frame.addEventListener('load', () => {
    if (document.elementFromPoint(mx, my) === frame) hidePortfolioCursor();
  });
});
document.documentElement.addEventListener('mouseleave', hidePortfolioCursor);
window.addEventListener('blur', hidePortfolioCursor);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hidePortfolioCursor();
});

(function rafCursor() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(rafCursor);
})();

const PROJECT_DATA = {
  accessibleweather: {
    tag: 'Accessible Interaction Design · 2026 · Work in Progress',
    noGithub: true,
    manualGallery: true,
    gallery: ['images/IMG_4485.mov', 'images/weather-hardware.png', 'images/weather-interface.png', 'images/weather-controller.png', 'images/weather-sensor.png', 'images/weather-concept.png'],
    captions: ['Hardware prototype — video demonstration. Use the player controls to play or pause.', 'Hardware prototype in progress — Raspberry Pi, speakers, wiring and tactile buttons.', 'Interface prototype — large type, high contrast, and weather readings; the local gas sensor is not connected to this interface yet.', 'Hardware concept — proposed tactile controls for speech, volume, navigation, and confirmation.', 'BME680 test — local sensor readings captured in the terminal; integration is in progress.', 'AI-assisted concept illustration — an imagined interaction with the device, not a photograph of a completed prototype.'],
    process: `Our team is developing the project around the needs of a user with a visual impairment. The interface uses large type, strong contrast, and a simple hierarchy to make weather readings easier to find. The hardware concept explores a large speak button, volume controls, and tactile navigation with spoken feedback.<br><br>The video and hardware photograph document the prototype in progress. The remaining images show separate parts of the work: a weather interface prototype, an annotated controller concept, and a BME680 sensor test. The final image is an AI-assisted illustration of the intended interaction. These components are still being brought together.`,
    reflection: `Designing for a specific access need means reconsidering what can be read, felt, and heard. A visually simple interface is only one part of the experience; controls and feedback also need to be clear and predictable. The next steps are hardware and software integration, followed by evaluation with the intended user and further refinement.`,
    modes: []
  },
  archipelago: {
    tag: 'Interaction Design · 2026 · Work in Progress',
    noGithub: false,
    github: 'https://github.com/Jimmy-Le/CART470Project',
    githubLabel: 'Team Repository ↗',
    gallery: ['images/island-prototype.png', 'images/island-team.png'],
    process: `I explored water animation and a wet-paper visual texture, then tested how an island name could emerge from the water after selection. Seagull Island is a temporary test name. Slight differences in letter position and rotation suggest floating, while the surrounding currents leave space for the text.<br><br>The linked repository contains our shared team project. My contribution focuses on water animation and island-name interactions.<br><br>The first image shows my standalone water and naming experiment. The second shows the shared team interface, which provides the context for the next integration step.`,
    reflection: `The animation needs to support orientation without distracting from documentary content. The next step is to adapt the experiment to the shared map structure, then test readability, island switching, performance, and a reduced-motion alternative.`,
    modes: [],
    resource: 'https://alibaba1555.github.io/CART-470-Project-Journal/',
    resourceLabel: 'Read process journal ↗'
  },
  cornerset: {
    journal: 'https://alibaba1555.github.io/CART-498-Project-Journal/#week-05',
    tag: 'UX & Interface Design · 2026 · Work in Progress',
    noGithub: true,
    process: `The prototype explores two connected journeys: a performer setting up a street performance and an audience member discovering nearby music. Iterations focus on map filtering, performer profiles, short audio previews, and the flow from discovery to support.`,
    reflection: `This is an interface prototype. Payments and Face ID are simulated, and the project is still being refined. Current work focuses on clearer proximity feedback and a Moment Ticket that records an encounter.`,
    modes: [],
    resource: 'https://alibaba1555.github.io/CART-498-Prototype-Project-Corner-Set/',
    resourceLabel: 'Open in new tab ↗'
  },

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
    tag: 'Game · Early 2025',
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
    process: `In late 2022, I began exploring generative AI while it was still unfamiliar to many people around me. I deployed Stable Diffusion locally and experimented with it for this coursework project.<br><br>I selected images for their narrative relevance and visual consistency, then arranged them into spreads with the text. The main design challenge was connecting individual generated images into a coherent sequence.`,
    reflection: `This project reflects my willingness to learn unfamiliar tools early and find practical uses for them. Generating images was only one part of the process: selecting, arranging, and revising them was what turned the experiments into a coherent project.<br><br>If I developed it further, I would explore how the poem's rhythm and line breaks could shape the page layouts.`,
    modes: [
      { n: '01', title: 'Local deployment', sub: 'Stable Diffusion' },
      { n: '02', title: 'Visual experimentation', sub: 'Classical oil painting aesthetic' },
      { n: '03', title: 'Image selection', sub: 'Narrative and visual consistency' },
      { n: '04', title: 'Editorial composition', sub: 'Text and illustrated spreads' }
    ]
  },
  quixote: {
    tag: 'Design · 2023 · Book Cover',
    noGithub: true,
    gallery: ['images/D1.png'],
    process: `The composition uses the relationship between filled shapes and empty space to bring different figures into the same image. A smaller rider is set against a much larger silhouette, while the limited palette keeps attention on their outlines.`,
    reflection: `The cover explores how much a silhouette can communicate with very little detail. The contrast in scale creates a tension between the figure and the world imagined around it.`,
    modes: []
  },
  poster: {
    tag: 'Design · 2023 · Film Poster',
    noGithub: true,
    gallery: ['images/D2.png'],
    process: `I arranged the film stills into a repeated grid and layered a larger cutout portrait over them. The director's name anchors the top of the composition, while the ladder and smaller figure extend the collage toward the foreground.`,
    reflection: `The main challenge in this composition is hierarchy: the portrait and title need to remain clear within a dense collection of images. The repeated grid provides structure, while the overlapping figures break its regularity.`,
    modes: []
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
    tag: 'Design · 2024 · Unreal Engine 4',
    noGithub: true,
    gallery: ['images/E1.png'],
    process: `I worked on the scene in Unreal Engine 4, focusing on how the arrangement of walls, overhead structures, and lighting shapes the corridor. Repeated structural elements establish depth, while material surfaces and changes in brightness give the space its industrial character.`,
    reflection: `This study explores how an environment can suggest an atmosphere before a player encounters a character or story. Lighting and spatial rhythm are central to how the corridor feels and where the eye travels.`,
    modes: []
  },
  recipe: {
    tag: 'Creative Computing · 2024 · OpenAI API',
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
    tag: 'Creative Computing · 2025 · Max/MSP',
    systemsLabel: 'Sound Sources',
    noGithub: true,
    gallery: ['images/O2.png'],
    process: `O2 is a real-time city sound system built in Max/MSP. Air quality data is pulled live from any city via API — pollutants like NO₂, PM2.5, CO, and ozone are each mapped to distinct sound textures and layered together.<br><br>A heavily polluted city generates industrial noise, low-frequency hum, and synthetic interference. A clean city produces wind, birdsong, and open natural tones. All values are summed into a single continuous audio output — a sonic portrait of a city's atmosphere at that exact moment.`,
    reflection: `What interested me most was the question of legibility: can someone hear pollution without being told what they are listening to? I used dense, mechanical textures to suggest pollution, but whether listeners interpret them as intended remains a question for future testing.<br><br>The project also raised questions about data as material. Rather than visualising air quality, sonifying it forces a different kind of attention — duration, texture, and change over time become the medium.`,
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
    tag: 'Creative Computing · 2025 · Max/MSP · OpenAI API',
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


// Only confirmed project contexts are displayed; unknown fields remain omitted.
const PROJECT_FACTS = {
  accessibleweather: {type: 'Group project', context: 'Coursework · CART 484', role: 'Interface prototyping and accessible information presentation within a collaborative hardware and software project', tools: 'HTML · CSS · JavaScript · Raspberry Pi · BME680', completion: 'Mid-December 2026'},
  archipelago: {completion: 'Mid-December 2026', type: 'Group project', context: 'Coursework · CART 470', role: 'Water animation, visual material experiments, and island-name interaction prototype', tools: 'HTML · CSS · JavaScript'},
  cornerset: {completion: 'Mid-December 2026', context: 'Coursework · CART 498', role: 'UX design, user flows, interface design, and interactive prototyping', tools: 'HTML · CSS · JavaScript'},

  pacman: {context: 'Coursework · CART 253', role: 'Game mechanics, variation design, and programming', tools: 'JavaScript · p5.js'},
  parkour: {context: 'Coursework · CART 263 · Early 2025', role: 'Gameplay design and programming', tools: 'JavaScript · Phaser'},
  roland: {context: 'Coursework · 2022', role: 'Local AI setup, image experimentation, selection, and page composition', tools: 'Stable Diffusion'},
  film: {type: 'Group project', context: 'Coursework', role: 'Camera operation and on-set framing'},
  pollution: {role: 'Sound mapping and patch development', tools: 'Max/MSP · Air quality API'},
  recipe: {role: 'Interface and recipe-generation workflow', tools: 'OpenAI API'},
  jukebox: {role: 'Patch development and sound synthesis', tools: 'Max/MSP · Node.js · OpenAI API'},
  puppet: {role: 'Illustration and animation', tools: 'Adobe Animate'},
  quixote: {role: 'Negative-space composition and book cover design'},
  poster: {role: 'Image collage, typography, and poster composition'},
  environment: {role: 'Environment design and spatial composition', tools: 'Unreal Engine 4'},
  soulslike: {role: 'Combat systems and encounter design', tools: 'Unreal Engine 4'}
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

function idleBlobPoints(id, t) {
  const {cx,cy,r} = BD[id];
  const idx = ['blob-photography','blob-design','blob-other','blob-game'].indexOf(id);
  const [spd,ph] = [[1.8,0],[2.1,1.4],[1.5,2.8],[2.4,.7]][idx];
  const v=t*spd+ph;
  return blobPts(cx+Math.sin(v*.5+.8)*5,cy+Math.cos(v*.6)*3,
    r+Math.sin(v*.9)*r*.09+Math.sin(v*1.1+2)*r*.08,NOISE[id],t);
}
function idleMorph(ts) {
  document.querySelectorAll('.blob:not(.flying-js)').forEach(blob => {
    if(BD[blob.id]) blob.querySelector('path').setAttribute('d',smoothPath(idleBlobPoints(blob.id,ts/1000)));
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

function animateTideIn(bgColor, duration, onPanel, revealAt = .46) {
  clearFlood();
  const startT = performance.now();
  let panelFired = false;
  const eIO = p => p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

  function frame(now) {
    const elapsed = now - startT;
    const raw = Math.min(elapsed / duration, 1);
    const prog = eIO(raw);
    drawAllTide(prog, elapsed / 1000, bgColor);

    if (!panelFired && raw >= revealAt) {
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
  const pathEl = blob.querySelector('path');
  const rect = blob.getBoundingClientRect();
  // Capture the complete floating transform before disabling CSS animation.
  const current = getComputedStyle(blob).transform;
  const matrix = new DOMMatrix(current === 'none' ? undefined : current);
  const floatDy = matrix.m42;
  const totalTravel = rect.bottom + 100;
  const color = blob.dataset.color;
  const n = parseInt(color.slice(1),16);
  const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  const k=(.299*r+.587*g+.114*b)>=160?.74:1;
  const bgColor=id==='blob-photography'?'#090805':`rgb(${Math.round(r*k)},${Math.round(g*k)},${Math.round(b*k)})`;
  lastFlight={id,floatDy,totalTravel,bgColor};
  blob.classList.add('flying-js');
  blob.style.transform=matrix.toString();
  blob.style.animation='none';
  blob.style.opacity='1';
  panelStrip.style.background='rgba(255,255,255,.38)';
  const duration=id==='blob-photography'?1250:1050;
  const start=performance.now();
  let floodStarted=false;
  function frame(now) {
    const progress=Math.min((now-start)/duration,1);
    const travel=progress*progress*(3-2*progress);
    const moving=new DOMMatrix(matrix.toString());
    moving.m42=matrix.m42-travel*totalTravel;
    blob.style.transform=moving.toString();
    blob.style.opacity=String(1-Math.max(0,(progress-.8)/.2));
    // Use the idle clock throughout, so the outline does not reset on click.
    const points=idleBlobPoints(id,now/1000);
    const cx=BD[id].cx,cy=BD[id].cy;
    // Acceleration pulls the leading tip upward; the lower body follows later.
    // Both envelopes start at zero, preserving the exact outline on click.
    const pull=Math.pow(Math.sin(progress*Math.PI),1.2);
    const tail=Math.pow(Math.sin(progress*Math.PI),1.6);
    const radius=BD[id].r;
    pathEl.setAttribute('d',smoothPath(points.map(([x,y])=>{
      const dy=y-cy;
      const height=Math.max(-1,Math.min(1,dy/radius));
      const leading=Math.max(0,-height);
      const trailing=Math.max(0,height);
      const width=1-.18*pull-.16*pull*leading+.06*tail*trailing;
      return [cx+(x-cx)*width,
        cy+dy*(1+.36*pull)-radius*.23*pull*leading*leading
          +radius*.16*tail*trailing*trailing];
    })));
    if(progress>=.62&&!floodStarted) {
      floodStarted=true;
      animateTideIn(bgColor,id==='blob-photography'?950:700,()=>{
        if(id==='blob-photography') {
          photoPanel.classList.add('from-home');
          openPhotoViewer(JSON.parse(blob.dataset.works).map(w=>w.photo),0);
        } else {panel.classList.add('active');panel.style.color='#ffffff';}
      }, id==='blob-photography'?.72:.46);
    }
    if(progress<1)requestAnimationFrame(frame);
    else blob.style.visibility='hidden';
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
    blob.style.transform = `translateY(${(floatDy - totalTravel) * (1 - eOut3(prog))}px)`;
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
    } else {
      sx = 1;
      sy = 1;
    }
    const moving = blobPts(bd.cx,bd.cy,bd.r,NOISE[id],tSec+20,sx,sy);
    const idle = idleBlobPoints(id,now/1000);
    const blend = Math.max(0,Math.min(1,(prog-.55)/.45));
    const smooth = blend*blend*(3-2*blend);
    pathEl.setAttribute('d',smoothPath(moving.map((point,i)=>point.map((v,j)=>v+(idle[i][j]-v)*smooth))));

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
    if (activeBlob || document.querySelector('.blob.flying-js')) return;
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
                    ${w.status ? `<div class="work-status"><span class="work-status-badge"><span aria-hidden="true">✦</span> IN PROGRESS</span><span class="work-status-date">Expected completion · ${w.expected}</span></div>` : ''}
                    <div class="work-card-year">${w.year}</div>
                    <div class="work-card-cta">${w.play && w.play !== '#' ? 'Try prototype ↗' : 'View project ↗'}</div>
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
let galleryCaptions = [];
let galleryIndex  = 0;
let galleryTimer  = null;
let galleryManual = false;
let galleryPending = null;
const mediaWrap = document.querySelector('.proj-play-wrap');
const demoVideo = document.createElement('video');
demoVideo.className = 'demo-video';
demoVideo.controls = true;
demoVideo.playsInline = true;
demoVideo.preload = 'metadata';
demoVideo.setAttribute('aria-label', 'Accessible Weather hardware demonstration');
mediaWrap.appendChild(demoVideo);
function clearProjectVideo() {
  demoVideo.pause();
  demoVideo.hidden = true;
  demoVideo.removeAttribute('src');
  demoVideo.load();
}
clearProjectVideo();
function fitRotatedHardware() {
  const rotated = demoImage.classList.contains('hardware-rotated');
  demoImage.style.width = rotated ? Math.max(1, mediaWrap.clientHeight - 64) + 'px' : '';
  demoImage.style.height = rotated ? Math.max(1, mediaWrap.clientWidth - 100) + 'px' : '';
}
new ResizeObserver(fitRotatedHardware).observe(mediaWrap);

function showGalleryFrame(idx) {
  if (!galleryImages.length) return;
  galleryIndex = ((idx % galleryImages.length) + galleryImages.length) % galleryImages.length;
  const src = galleryImages[galleryIndex];
  const isVideo = /\.(mov|mp4|webm)$/i.test(src);
  clearProjectVideo();
  demoImage.classList.toggle('active', !isVideo);
  demoImage.classList.toggle('hardware-rotated', src === 'images/weather-hardware.png');
  fitRotatedHardware();
  const external = document.getElementById('game-external');
  external.parentElement.style.display = isVideo ? '' : 'none';
  if (isVideo) {
    demoImage.removeAttribute('src');
    demoVideo.hidden = false;
    demoVideo.src = src;
    external.href = src;
    external.textContent = 'Video not playing? Open the original file ↗';
  } else {
    demoImage.style.opacity = '0';
    demoImage.onload = () => { demoImage.style.opacity = '1'; };
    demoImage.src = src;
    demoImage.alt = galleryCaptions[galleryIndex] || 'Project image ' + (galleryIndex + 1);
  }
  if (galleryCaptions.length) document.querySelector('.proj-controls-hint').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length + ' · ' + galleryCaptions[galleryIndex];
  gamePH.classList.add('hidden');
  // Update dots
  document.querySelectorAll('.gallery-dot').forEach((d,i) => {
    d.classList.toggle('active', i === galleryIndex);
  });
}

function startGalleryAuto() {
  stopGalleryAuto();
  if (galleryManual || !projPanel.classList.contains('active')) return;
  galleryTimer = setInterval(() => showGalleryFrame(galleryIndex + 1), 3200);
}
function stopGalleryAuto() {
  if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; }
}

function openProject(card) {
  const projectId = card.dataset.project || '';
  const play      = card.dataset.play    || '';
  const github    = card.dataset.github || PROJECT_DATA[projectId]?.github || '#';
  const title     = card.dataset.title   || '';
  const desc      = card.dataset.desc    || '';
  const year      = card.dataset.year    || '';
  const data      = PROJECT_DATA[projectId] || {};
  projPanel.classList.toggle('immersive-project', projectId === 'cornerset');
  projPanel.classList.toggle('map-project', ['archipelago', 'accessibleweather'].includes(projectId));
  projPanel.classList.toggle('weather-project', projectId === 'accessibleweather');
  projPanel.classList.remove('details-open');
  const toggle = document.getElementById('project-details-toggle');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'About this project';
  const journal = document.getElementById('project-journal');
  journal.hidden = !data.journal;
  if (data.journal) journal.href = data.journal;
  const resource = document.getElementById('project-resource');
  resource.hidden = !data.resource;
  if (data.resource) { resource.href = data.resource; resource.textContent = data.resourceLabel; }

  const facts = PROJECT_FACTS[projectId] || {};
  const labels = {type: 'Project type', context: 'Context', role: 'My contribution', tools: 'Tools', completion: 'Expected completion'};
  const factsEl = document.getElementById('project-facts');
  factsEl.replaceChildren();
  Object.entries(facts).forEach(([key, value]) => {
    const dt = document.createElement('dt'); dt.textContent = labels[key];
    const dd = document.createElement('dd'); dd.textContent = value;
    factsEl.append(dt, dd);
  });
  document.querySelector('.proj-controls-hint').textContent =
    projectId === 'cornerset' ? 'Interactive prototype · payments are simulated' :
    data.gallery ? 'Use the arrows to browse project images' :
    play && play !== '#' ? 'See the game instructions for controls' : '';


  document.getElementById('proj-title').textContent    = title;
  document.getElementById('proj-desc').innerHTML       = desc;
  document.getElementById('proj-tag').textContent      = data.tag || `Game · ${year}`;
  document.getElementById('proj-process').innerHTML    = data.process || '';
  document.getElementById('proj-reflection').innerHTML = data.reflection || '';
  document.getElementById('proj-systems-label').textContent = data.systemsLabel || 'Game Modes';

  // GitHub link: hide entirely when project has no public repo
  const ghLink = document.getElementById('proj-gh-link');
  ghLink.textContent = data.githubLabel || 'View on GitHub ↗';
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
  clearTimeout(galleryPending);
  clearProjectVideo();
  galleryManual = !!data.manualGallery;
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
    galleryCaptions = data.captions || [];
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

    galleryPending = setTimeout(() => { showGalleryFrame(0); startGalleryAuto(); }, 500);

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
  clearTimeout(galleryPending);
  clearProjectVideo();
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

const reducedPhotoMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let photoRequest = 0;
function showPhoto(idx) {
  if (!photoList.length) return;
  const direction = idx < photoIndex ? -1 : 1;
  photoIndex = ((idx % photoList.length) + photoList.length) % photoList.length;
  const request = ++photoRequest;
  const src = photoList[photoIndex];
  const preload = new Image();
  preload.onload = () => {
    if (request !== photoRequest) return;
    photoMainImg.src = src;
    photoMainImg.alt = 'Photography collection ' + (photoIndex + 1);
    photoMainImg.style.opacity = '1';
    photoMainImg.getAnimations().forEach(a => a.cancel());
    photoMainImg.animate([{opacity:0, transform:`translateX(${direction * 28}px) scale(.98)`, filter:'blur(3px)'}, {opacity:1, transform:'none', filter:'blur(0px)'}], {duration:reducedPhotoMotion.matches ? 0 : 650, easing:'cubic-bezier(.2,.7,.2,1)'});
    if (lightbox.open) updateLightbox();
  };
  preload.onerror = () => { if (request === photoRequest) { photoMainImg.alt = 'Collection unavailable'; photoMainImg.src = src; } };
  preload.src = src;
  document.getElementById('photo-counter').textContent = String(photoIndex + 1).padStart(2,'0') + ' / ' + String(photoList.length).padStart(2,'0');
  photoThumbRow.querySelectorAll('.ph-thumb').forEach((t,i) => {t.classList.toggle('active',i===photoIndex);t.setAttribute('aria-pressed',String(i===photoIndex));});
}
function openPhotoViewer(photos, startIdx) {
  photoList = photos;
  photoThumbRow.innerHTML = photos.map((src,i) => `<button type="button" class="ph-thumb" data-i="${i}" aria-label="View collection ${i+1}"><img src="${src}" alt="" /></button>`).join('');
  photoThumbRow.querySelectorAll('.ph-thumb').forEach(t => t.addEventListener('click',()=>showPhoto(Number(t.dataset.i))));
  photoPanel.classList.add('active');
  showPhoto(startIdx);
}
photoBack.addEventListener('click', () => {
  photoPanel.classList.remove('active'); ++photoRequest;
  if(photoPanel.classList.contains('from-home')) closeBtn.click();
});
photoPrev.addEventListener('click',()=>showPhoto(photoIndex-1));
photoNext.addEventListener('click',()=>showPhoto(photoIndex+1));
const lightbox = document.getElementById('photo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxStage = document.getElementById('lightbox-stage');
let photoZoom=1, photoX=0, photoY=0, photoDrag=null, lightboxClosing=false;
function positionLightbox() {
  const maxX=Math.max(0,(lightboxImg.clientWidth*photoZoom-lightboxStage.clientWidth)/2);
  const maxY=Math.max(0,(lightboxImg.clientHeight*photoZoom-lightboxStage.clientHeight)/2);
  photoX=Math.max(-maxX,Math.min(maxX,photoX)); photoY=Math.max(-maxY,Math.min(maxY,photoY));
  lightboxImg.style.transform=`translate(${photoX}px, ${photoY}px) scale(${photoZoom})`;
  document.getElementById('lightbox-zoom').textContent=photoZoom>1?'Fit to screen':'Zoom +';
  lightboxStage.style.cursor=photoZoom>1?'grab':'zoom-in';
}
function updateLightbox() {
  lightboxImg.src=photoMainImg.src; lightboxImg.alt=photoMainImg.alt;
  document.getElementById('lightbox-count').textContent=document.getElementById('photo-counter').textContent;
  photoZoom=1;photoX=photoY=0;positionLightbox();
}
function imageFlight(from,to,reverse=false) {
  if (reducedPhotoMotion.matches || !from.width || !to.width) return null;
  const frame={transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`};
  return lightboxImg.animate(reverse?[{transform:'none'},frame]:[frame,{transform:'none'}],{duration:550,easing:'cubic-bezier(.22,.8,.22,1)',fill:'both'});
}
function openLightbox() {
  if (!photoMainImg.naturalWidth || lightbox.open) return;
  const from=photoMainImg.getBoundingClientRect();lightbox.showModal(); updateLightbox();
  requestAnimationFrame(()=>{const anim=imageFlight(from,lightboxImg.getBoundingClientRect());if(anim)anim.onfinish=()=>anim.cancel();});
}
function closeLightbox() {
  if(lightboxClosing)return;lightboxClosing=true;photoZoom=1;photoX=photoY=0;positionLightbox();
  lightboxImg.getAnimations().forEach(a=>a.cancel());
  const anim=imageFlight(photoMainImg.getBoundingClientRect(),lightboxImg.getBoundingClientRect(),true);
  const finish=()=>{lightbox.close();if(anim)anim.cancel();lightboxClosing=false;photoMainImg.focus();};
  if(anim)anim.onfinish=finish;else finish();
}
photoMainImg.addEventListener('click',openLightbox);
photoMainImg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox();}});
document.getElementById('lightbox-close').addEventListener('click',closeLightbox);
lightbox.addEventListener('cancel',e=>{e.preventDefault();closeLightbox();});
document.getElementById('lightbox-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
document.getElementById('lightbox-next').addEventListener('click',()=>showPhoto(photoIndex+1));
document.getElementById('lightbox-zoom').addEventListener('click',()=>{photoZoom=photoZoom>1?1:2.5;photoX=photoY=0;positionLightbox();});
lightboxStage.addEventListener('wheel',e=>{e.preventDefault();photoZoom=Math.max(1,Math.min(4,photoZoom-e.deltaY*.003));positionLightbox();},{passive:false});
lightboxStage.addEventListener('pointerdown',e=>{if(photoZoom<=1)return;photoDrag={x:e.clientX-photoX,y:e.clientY-photoY};lightboxStage.setPointerCapture(e.pointerId);});
lightboxStage.addEventListener('pointermove',e=>{if(!photoDrag)return;photoX=e.clientX-photoDrag.x;photoY=e.clientY-photoDrag.y;positionLightbox();});
lightboxStage.addEventListener('pointerup',()=>photoDrag=null);
lightboxStage.addEventListener('pointercancel',()=>photoDrag=null);
window.addEventListener('resize',()=>{if(lightbox.open)positionLightbox();});
document.addEventListener('keydown',e=>{
  if(!photoPanel.classList.contains('active') || lightboxClosing)return;
  if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}
  if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}
  if(e.key==='Escape'&&!lightbox.open)photoBack.click();
});

photoBack.addEventListener('mouseenter', () => { ring.style.width='50px'; ring.style.height='50px'; });
photoBack.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; });

closeBtn.addEventListener('click', () => {
  const blob = activeBlob;
  if (!blob) return;
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
const aboutMode = document.getElementById('about-mode');
aboutMode.addEventListener('click', () => {
  const reading = aboutPanel.classList.toggle('reading-mode');
  crawlOpen = !reading;
  aboutMode.textContent = reading ? 'Cinematic view' : 'Reading view';
  aboutMode.setAttribute('aria-pressed', String(!reading));
  document.querySelector('.crawl-stage').scrollTop = 0;
  resetCrawl();
});
aboutPanel.addEventListener('keydown', e => {
  if (e.key === 'Escape') aboutBack.click();
});
let touchY = null;
aboutPanel.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, {passive: true});
aboutPanel.addEventListener('touchmove', e => {
  if (!crawlOpen || touchY === null) return;
  const nextY = e.touches[0].clientY;
  crawlTarget = clampCrawl(crawlTarget + nextY - touchY);
  touchY = nextY;
  e.preventDefault();
}, {passive: false});


let crawlOpen = false;
let crawlPos = 0;
let crawlTarget = 0;

function getCrawlMetrics() {
  const contentH = crawlScrollEl.scrollHeight;
  const viewportH = window.innerHeight;

  const topLimit = 0;
  const startY = 0;
  const endY = -(contentH + viewportH);

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
  crawlOpen = !aboutPanel.classList.contains('reading-mode');

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

let crawlLastFrame = null;
(function crawlRaf(timestamp) {
  requestAnimationFrame(crawlRaf);
  if (!crawlOpen || document.hidden) { crawlLastFrame = null; return; }
  const elapsed = crawlLastFrame === null ? 0 : Math.min((timestamp - crawlLastFrame) / 1000, 0.05);
  crawlLastFrame = timestamp;
  crawlTarget = clampCrawl(crawlTarget - 26 * elapsed);
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
document.getElementById('project-details-toggle').addEventListener('click', function () {
  const open = projPanel.classList.toggle('details-open');
  this.setAttribute('aria-expanded', String(open));
  this.textContent = open ? 'Close details' : 'About this project';
});

// CV card: turn toward the reader, hold, then fold into a download control.
const cvStage=document.querySelector('.crawl-stage');
const cvStory=document.getElementById('cv-story');
const cvCard=document.getElementById('cv-card');
const cvHeading=document.querySelector('.cv-heading');
const cvPreview=cvCard.querySelector('.cv-pages');
const cvLabel=cvCard.querySelector('.cv-button-label');
const cvSheen=cvCard.querySelector('.cv-sheen');
const cvScrollNote=document.querySelector('.cv-scroll-note');
// Anchor the cue to the viewport-sized panel, not the entering sticky section.
aboutPanel.appendChild(cvScrollNote);
cvScrollNote.style.opacity='0';
const cvDownloadNote=document.querySelector('.cv-download-note');
const cvSticky=cvStory.querySelector('.cv-sticky');
// Each visible face stays within 90 degrees of the viewer.
cvCard.style.backfaceVisibility='hidden';
let cvFrame=null;
const cvClamp=v=>Math.max(0,Math.min(1,v));
const cvEase=v=>{v=cvClamp(v);return v*v*(3-2*v);};
function renderCV() {
  cvFrame=null;
  if(!aboutPanel.classList.contains('active')||!aboutPanel.classList.contains('reading-mode'))return;
  const h=cvStage.clientHeight;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fullWidth=Math.min(1200,cvStage.clientWidth-48);
  const pageHeight=fullWidth*792/612;
  const viewHeight=Math.min(pageHeight,h-150);
  const readDistance=Math.max(0,pageHeight*2+24-viewHeight);
  const intro=h*1.65, ending=h*1.6;
  const total=intro+readDistance+ending;
  cvStory.style.height=reduced?'auto':(total+h)+'px';
  const top=cvStory.getBoundingClientRect().top-cvStage.getBoundingClientRect().top;
  const distance=Math.max(0,-top);
  const turn=cvEase(distance/(h*.95));
  const grow=cvEase((distance-h*.7)/(h*.95));
  const endingProgress=reduced?0:cvClamp((distance-intro-readDistance)/ending);
  // One continuous gesture: tilt, soften the page, then settle into the button.
  // Staying short of edge-on prevents the card collapsing into a tiny sliver.
  const motion=cvEase(endingProgress);
  const angle=62*Math.sin(Math.PI*motion);
  const shrink=cvEase((endingProgress-.18)/.72);
  const fold=cvEase((endingProgress-.35)/.55);
  const arrive=cvEase((endingProgress-.68)/.28);
  const glow=reduced ? 0 : cvEase((endingProgress-.32)/.68);
  const smallWidth=Math.min(460,cvStage.clientWidth*.65,h*.52*612/792);
  const width=smallWidth+(fullWidth-smallWidth)*grow;
  const cardHeight=smallWidth*792/612+(viewHeight-smallWidth*792/612)*grow;
  cvCard.style.width=reduced?'100%':(width+(220-width)*shrink)+'px';
  cvCard.style.height=reduced?'auto':(cardHeight+(58-cardHeight)*shrink)+'px';
  cvCard.style.borderRadius=(10*(1-grow)+28*fold)+'px';
  cvCard.style.transform=reduced?'none':`translateY(${35*(1-grow)}px) rotateX(${28*(1-turn)}deg) rotateY(${-65*(1-turn)}deg) rotateZ(${-14*(1-turn)}deg) rotate3d(0.258819,0.965926,0,${angle}deg)`;
  // Keep the same shadow layers throughout so there is no on/off boundary.
  cvCard.style.boxShadow=`0 ${25-9*glow}px ${80-24*glow}px rgba(0,0,0,${.56-.12*glow}), 0 0 28px rgba(255,239,202,${.16*glow}), 0 0 85px rgba(242,213,155,${.13*glow}), 0 0 170px rgba(225,190,122,${.07*glow})`;
  // Broad ambient illumination, with a soft centre instead of a bright outline.
  if(cvSticky) cvSticky.style.background=`radial-gradient(ellipse 460px 310px at 50% calc(50% + 35px), rgba(233,210,164,${.085*glow}) 0%, rgba(211,183,131,${.045*glow}) 35%, rgba(185,155,102,${.012*glow}) 65%, transparent 100%)`;
  const readOffset=Math.min(readDistance,Math.max(0,distance-intro));
  cvPreview.style.transform=reduced?'none':`translateY(${-readOffset*(width+(220-width)*shrink)/fullWidth}px)`;
  cvPreview.style.opacity=String(1-cvEase((endingProgress-.28)/.28));
  cvLabel.style.opacity=String(arrive);
  cvSheen.style.opacity=String(.3*(1-turn));
  cvHeading.style.opacity=String(reduced?0:1-cvEase(distance/(h*.7)));
  // Position the cue beside the rendered card, including its entry and 3D turn.
  const cardRect = cvCard.getBoundingClientRect();
  const panelRect = aboutPanel.getBoundingClientRect();
  const cueAside = cvScrollNote.querySelector('.cv-scroll-aside');
  const cueWidth = cueAside.offsetWidth;
  const cueHeight = cueAside.offsetHeight;
  const cueX = Math.min(cardRect.right-panelRect.left+28, panelRect.width-cueWidth-16);
  const cueY = cardRect.top-panelRect.top+cardRect.height*.48;
  cueAside.style.left = Math.max(16,cueX)+'px';
  cueAside.style.top = cueY+'px';
  const cueEntry = cvEase((h*.88-(cueY+cueHeight*.5))/(h*.16));
  const cueOpacity = reduced ? 0 : cueEntry*(1-cvEase(distance/(h*.45)));
  cvScrollNote.style.opacity=String(cueOpacity);
  cvScrollNote.classList.toggle('is-lit', !reduced && cueOpacity > .01);
  cvDownloadNote.style.opacity=String(arrive);
  cvCard.dataset.downloadReady=String(arrive>.98);
  cvCard.tabIndex=arrive>.98?0:-1;
  cvCard.style.cursor=arrive>.98?'pointer':'default';
}
// Reading the pages must not accidentally start a download.
cvCard.addEventListener('click',e=>{if(cvCard.dataset.downloadReady!=='true')e.preventDefault();});
function scheduleCV(){if(cvFrame===null)cvFrame=requestAnimationFrame(renderCV);}
cvStage.addEventListener('scroll',scheduleCV,{passive:true});
window.addEventListener('resize',scheduleCV);
navAbout.addEventListener('click',scheduleCV);
aboutMode.addEventListener('click',scheduleCV);
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',scheduleCV);

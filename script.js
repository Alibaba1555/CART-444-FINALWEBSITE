// ── Cursor ───────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function rafCursor() {
  rx += (mx - rx) * .11; ry += (my - ry) * .11;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(rafCursor);
})();

// ── Blob base geometry ────────────────────────────────────────
const BD = {
  'blob-photography': { cx: 89,  cy: 124, r: 78 },
  'blob-design':      { cx: 107, cy: 110, r: 88 },
  'blob-film':        { cx: 79,  cy: 128, r: 68 },
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

// ── Blob path helpers ─────────────────────────────────────────
const N_PTS = 6;
const f = n => Math.round(n * 10) / 10;

function blobPts(cx, cy, r, noise, t, sx = 1, sy = 1) {
  return Array.from({ length: N_PTS }, (_, i) => {
    const angle = (i / N_PTS) * Math.PI * 2 - Math.PI / 2;
    const dr = noise.reduce((s, [amp, freq, phase]) =>
      s + amp * Math.sin(t * freq + phase + i * 1.09), 0);
    return [cx + Math.cos(angle) * (r + dr) * sx,
            cy + Math.sin(angle) * (r + dr) * sy];
  });
}
function smoothPath(pts) {
  const N = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p1 = pts[i], p2 = pts[(i+1)%N];
    const p0 = pts[(i-1+N)%N], p3 = pts[(i+2)%N];
    const c1x = p1[0]+(p2[0]-p0[0])/6, c1y = p1[1]+(p2[1]-p0[1])/6;
    const c2x = p2[0]-(p3[0]-p1[0])/6, c2y = p2[1]-(p3[1]-p1[1])/6;
    d += `C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// ── Wavy tide clip-path ───────────────────────────────────────
// Creates a frame-border that fills inward from all four edges,
// but each edge has a sine-wave boundary instead of a straight line.
// p=0  → nothing visible (inner = outer rect, cancel via nonzero winding)
// p=50 → full screen covered (inner collapses to centre point)
// N=24 points per side gives smooth arcing "tide" shapes.
function makeWavyClip(p) {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const mx = W * p / 100;
  const my = H * p / 100;
  const tx = mx, ty = my;
  const bx = W - mx, by = H - my;

  // Wave amplitude: grows with frame thickness, fades to 0 near full coverage
  // so the final fill is clean with no stray bumps.
  const rawAmp = Math.min(mx * 0.55, 78);
  const fade   = Math.min(1, Math.max(0, (50 - p) / 18));
  const amp    = rawAmp * fade;

  const N    = 24;   // sample points per side
  const freq = 2.5;  // wave cycles per side (non-integer → irregular look)

  // Generate N points along (x0,y0)→(x1,y1),
  // displaced perpendicular to travel by amp*sin(t·π·freq).
  // px,py = unit perpendicular direction.
  function side(x0, y0, x1, y1, px, py) {
    return Array.from({length: N}, (_, i) => {
      const t    = i / (N - 1);
      const wave = Math.sin(t * Math.PI * freq) * amp;
      return `${(x0+(x1-x0)*t+px*wave).toFixed(1)}px ${(y0+(y1-y0)*t+py*wave).toFixed(1)}px`;
    });
  }

  // Outer CW rect (4 pts) + bridge (1 pt) + inner CCW wavy (4×N pts)
  const pts = [
    `0px 0px`, `${W}px 0px`, `${W}px ${H}px`, `0px ${H}px`,
    `0px 0px`,                    // bridge outer TL → inner TL
    ...side(tx, ty, tx, by,  1, 0),  // left  ↓ wave ±X
    ...side(tx, by, bx, by,  0,-1),  // bottom→ wave ±Y (inward=up)
    ...side(bx, by, bx, ty, -1, 0),  // right  ↑ wave ±X (inward=left)
    ...side(bx, ty, tx, ty,  0, 1),  // top   ← wave ±Y (inward=down)
  ];

  return `polygon(${pts.join(', ')})`;
}

// ── Idle liquid morph ─────────────────────────────────────────
function idleMorph(ts) {
  const t = ts / 1000;
  document.querySelectorAll('.blob:not(.flying-js)').forEach(blob => {
    const bd = BD[blob.id];
    if (!bd) return;
    const [spd, ph] = [[1.8,0.0],[2.1,1.4],[1.5,2.8],[2.4,0.7]][
      ['blob-photography','blob-design','blob-film','blob-game'].indexOf(blob.id)
    ] || [1.8, 0];
    const s = t * spd + ph;
    const [cx,cy,r] = [bd.cx,bd.cy,bd.r];
    const noise = NOISE[blob.id];
    const dw = Math.sin(s*.90)*r*.09, dh = Math.cos(s*.70+1.2)*r*.04;
    const dcx = Math.sin(s*.50+.8)*5, dty = Math.cos(s*.60)*3;
    const asy = Math.sin(s*1.1+2.0)*r*.08;
    blob.querySelector('path').setAttribute('d',
      smoothPath(blobPts(cx+dcx, cy+dty, r+dw+asy, noise, t, 1, 1)));
  });
  requestAnimationFrame(idleMorph);
}
requestAnimationFrame(idleMorph);

// ── Cursor ring ───────────────────────────────────────────────
document.querySelectorAll('.blob').forEach(b => {
  b.addEventListener('mouseenter', () => { ring.style.width='58px'; ring.style.height='58px'; });
  b.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; });
});

// ── Panel refs ────────────────────────────────────────────────
const panel      = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelCount = document.getElementById('panel-count');
const panelStrip = document.getElementById('panel-strip');
const worksGrid  = document.getElementById('works-grid');
const closeBtn   = document.getElementById('close-btn');
let activeBlob   = null;
let lastFlight   = {};

const colorFlood = document.getElementById('color-flood');

// Cancel any running WAAPI animation on the flood element
function resetFlood() {
  colorFlood.getAnimations().forEach(a => a.cancel());
  colorFlood.style.clipPath = makeWavyClip(0);
}

// ── Fly animation ─────────────────────────────────────────────
function flyBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');

  const rectBefore = blob.getBoundingClientRect();

  blob.classList.add('flying-js');
  blob.style.opacity = '1';
  blob.style.animation = 'none';
  void blob.offsetHeight;

  const rectSnap    = blob.getBoundingClientRect();
  const floatDy     = rectBefore.top - rectSnap.top;
  const DURATION    = 1600;
  const totalTravel = rectBefore.top + rectBefore.height / 2 + 120;

  lastFlight = { id, floatDy, totalTravel };

  // Compute background colour: full category colour, dim only if very bright
  const color = blob.dataset.color;
  const n = parseInt(color.slice(1), 16);
  const r = (n>>16)&255, g = (n>>8)&255, b = n&255;
  const lum = 0.299*r + 0.587*g + 0.114*b;
  const k = lum >= 160 ? 0.72 : 1.0;
  const bgColor = `rgb(${Math.round(r*k)},${Math.round(g*k)},${Math.round(b*k)})`;

  resetFlood();
  colorFlood.style.background = bgColor;
  document.getElementById('panel-bg').style.background = bgColor;
  panelStrip.style.background = 'rgba(255,255,255,.38)';

  const eIO  = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
  const eOut = t => 1-(1-t)*(1-t);
  const eIn  = t => t*t;
  const start = performance.now();
  let floodTriggered = false;

  function frame(now) {
    const prog = Math.min((now - start) / DURATION, 1);
    const tSec = (now - start) / 1000;

    blob.style.transform = `translateY(${floatDy - eIO(prog) * totalTravel}px)`;
    if (prog > .86) blob.style.opacity = String(1 - (prog - .86) / .14);

    // ── Shape morph ──
    let sx, sy;
    if (prog < .06) {
      const q = Math.sin((prog/.06)*Math.PI);
      sx = 1+q*.14; sy = 1-q*.11;
    } else if (prog < .68) {
      const q = eOut((prog-.06)/.62);
      sx = 1-q*.25; sy = 1+q*.32;
    } else if (prog < .78) {
      const q = eIn((prog-.68)/.10);
      sx = 0.75+q*2.0; sy = 1.32-q*1.20;
    } else if (prog < .86) {
      const q = eOut((prog-.78)/.08);
      sx = 2.75-q*1.25; sy = 0.12+q*.38;
    } else {
      const q = (prog-.86)/.14;
      sx = 1.5+q*1.5; sy = 0.50-q*.49;
    }
    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec+8, sx, sy)));

    // ── Flood trigger: fires when blob is ~10% opacity ──────────────
    // At this moment a thin border appears at ALL FOUR EDGES simultaneously
    // and converges inward, completing just as panel content fades in.
    if (prog >= 0.86 && !floodTriggered) {
      floodTriggered = true;

      // Snap to p=0 (nothing), then WAAPI drives p: 0 → 3 → 26 → 50
      // Frame 0%  → barely-visible border at all 4 edges (instant spark)
      // Frame 38% → border ~26% thick, half the screen surrounded
      // Frame 100%→ completely filled
      colorFlood.animate([
        { clipPath: makeWavyClip(3),  easing: 'cubic-bezier(0.0, 0.0, 0.3, 1)' },
        { clipPath: makeWavyClip(26), offset: 0.38 },
        { clipPath: makeWavyClip(50) }
      ], { duration: 880, fill: 'forwards' });

      // Panel content fades in once ~half the screen is coloured (~380ms in)
      setTimeout(() => {
        panel.classList.add('active');
        panel.style.color = '#ffffff';
      }, 360);
    }

    if (prog < 1) requestAnimationFrame(frame);
    else blob.style.visibility = 'hidden';
  }

  requestAnimationFrame(frame);
}

// ── Return animation ──────────────────────────────────────────
// Blob condenses from where the colour converged and falls back.
// z-index raised above the flood so it's always visible during descent.
function returnBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');
  const { floatDy, totalTravel } = lastFlight;

  const RDUR = 1450;
  const eOut3 = t => 1 - Math.pow(1-t, 3);
  const eOut  = t => 1 - (1-t)*(1-t);
  const start = performance.now();

  blob.style.visibility = '';
  blob.style.opacity    = '0';
  blob.style.transform  = `translateY(${floatDy - totalTravel}px)`;
  blob.style.zIndex     = '490';   // above the flood (z:480) so always visible

  function frame(now) {
    const prog = Math.min((now - start) / RDUR, 1);
    const tSec = (now - start) / 1000;

    blob.style.transform = `translateY(${floatDy - (1 - eOut3(prog)) * totalTravel}px)`;

    // Fade in during condensation phase
    if (prog < .16) blob.style.opacity = String(prog / .16);
    else            blob.style.opacity = '1';

    let sx, sy;
    if (prog < .14) {
      const q = eOut(prog/.14);
      sx = 2.8 - q*2.1; sy = 0.02 + q*1.26;  // splat → column
    } else if (prog < .82) {
      const q = eOut3((prog-.14)/.68);
      sx = 0.7 + q*.30; sy = 1.28 - q*.28;   // column → circle
    } else if (prog < .93) {
      const q = Math.sin(((prog-.82)/.11)*Math.PI);
      sx = 1+q*.13; sy = 1-q*.10;             // landing squish
    } else {
      sx = 1; sy = 1;
    }

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec+20, sx, sy)));

    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      blob.style.transform = '';
      blob.style.opacity   = '';
      blob.style.zIndex    = '';
      blob.style.animation = FLOAT_ANIM[id];
      blob.classList.remove('flying-js');
    }
  }

  requestAnimationFrame(frame);
}

// ── Blob click ────────────────────────────────────────────────
document.querySelectorAll('.blob').forEach(blob => {
  blob.addEventListener('click', () => {
    if (blob.classList.contains('flying-js')) return;
    activeBlob = blob;

    panelTitle.textContent = blob.dataset.category;
    panelCount.textContent = String(JSON.parse(blob.dataset.works).length).padStart(2,'0') + ' Works';
    worksGrid.innerHTML = JSON.parse(blob.dataset.works).map((w,i) => `
      <div class="work-card">
        <div class="work-card-ghost">${String(i+1).padStart(2,'0')}</div>
        <div class="work-card-title">${w.title}</div>
        <div class="work-card-year">${w.year}</div>
      </div>`).join('');

    flyBlob(blob);
  });
});

// ── Close panel ───────────────────────────────────────────────
// Sequence:
//  t=0    panel content fades (CSS transition, ~350ms)
//  t=180  flood retracts: full fill → shrinks inward → thin edge border → nothing
//         mirror of opening but accelerating (ease-in), 780ms
//  t=600  blob starts condensing from top — appears just as border fully vanishes
closeBtn.addEventListener('click', () => {
  const blob = activeBlob;
  activeBlob = null;

  panel.classList.remove('active');
  panel.style.color = '';

  // Flood retracts — reverse the frame animation
  setTimeout(() => {
    colorFlood.getAnimations().forEach(a => a.cancel());
    colorFlood.animate([
      { clipPath: makeWavyClip(50) },
      { clipPath: makeWavyClip(24), offset: 0.50 },
      { clipPath: makeWavyClip(3),  offset: 0.88 },
      { clipPath: makeWavyClip(0)  }
    ], { duration: 780, easing: 'cubic-bezier(0.55, 0, 0.85, 0.25)', fill: 'forwards' });
  }, 180);

  // Blob condenses just as the last coloured edge border disappears
  // (180 + 780 * 0.88 ≈ 867ms → blob starts at ~850ms to overlap the final vanish)
  setTimeout(() => returnBlob(blob), 820);
});

closeBtn.addEventListener('mouseenter', () => { ring.style.width='50px'; ring.style.height='50px'; });
closeBtn.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; });
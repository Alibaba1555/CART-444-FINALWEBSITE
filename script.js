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
// cx, cy: centre in SVG viewBox coords; r: base radius in px
const BD = {
  'blob-photography': { cx: 89,  cy: 124, r: 78 },
  'blob-design':      { cx: 107, cy: 110, r: 88 },
  'blob-film':        { cx: 79,  cy: 128, r: 68 },
  'blob-game':        { cx: 100, cy: 115, r: 83 }
};

// 4 sine-wave noise layers per blob: [amplitude, frequency, perPoint phase-shift]
// Different settings per blob so they never move in sync
const NOISE = {
  'blob-photography': [[13, 1.3, 0.0], [9, 2.3, 1.2], [6, 0.8, 2.5], [11, 3.0, 0.9]],
  'blob-design':      [[15, 1.1, 1.4], [7, 2.5, 0.3], [10, 0.9, 3.0], [6, 1.8, 1.8]],
  'blob-film':        [[11, 1.6, 2.8], [8, 2.0, 0.7], [9, 0.7, 1.4], [14, 2.6, 3.4]],
  'blob-game':        [[10, 1.9, 0.7], [13, 1.0, 2.1], [7, 2.7, 0.5], [9, 1.5, 1.9]]
};

const FLOAT_ANIM = {
  'blob-photography': 'fa 3.9s 0s ease-in-out infinite',
  'blob-design':      'fb 4.3s 0s ease-in-out infinite',
  'blob-film':        'fc 3.6s 0s ease-in-out infinite',
  'blob-game':        'fd 4.7s 0s ease-in-out infinite'
};

// ── Organic blob path generator ───────────────────────────────
// Generates N anchor points in a ring, each with an independently
// time-varying radius driven by 4 stacked sine waves.
// scaleX/scaleY let us squash/stretch for flight physics.
const N_PTS = 6;
const f = n => Math.round(n * 10) / 10;

function blobPts(cx, cy, r, noise, t, sx = 1, sy = 1) {
  return Array.from({ length: N_PTS }, (_, i) => {
    const angle = (i / N_PTS) * Math.PI * 2 - Math.PI / 2; // start from top
    // Each point gets all 4 sine layers, offset by point index so no two move identically
    const dr = noise.reduce((s, [amp, freq, phase]) =>
      s + amp * Math.sin(t * freq + phase + i * 1.09), 0);
    return [
      cx + Math.cos(angle) * (r + dr) * sx,
      cy + Math.sin(angle) * (r + dr) * sy
    ];
  });
}

// Catmull-Rom spline → cubic bezier closed path.
// Gives perfectly smooth curves through the anchor points with no cusps.
function smoothPath(pts) {
  const N = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p1 = pts[i],            p2 = pts[(i + 1) % N];
    const p0 = pts[(i - 1 + N) % N], p3 = pts[(i + 2) % N];
    // Catmull-Rom → bezier: ctrl pts are 1/6 of chord from adjacent anchor
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// ── Idle liquid morph ─────────────────────────────────────────
// Runs every frame for every non-flying blob.
// Pure path-attribute mutation — no CSS transform involved.
function idleMorph(ts) {
  const t = ts / 1000;
  document.querySelectorAll('.blob:not(.flying-js)').forEach(blob => {
    const bd = BD[blob.id];
    if (!bd) return;
    const pts = blobPts(bd.cx, bd.cy, bd.r, NOISE[blob.id], t);
    blob.querySelector('path').setAttribute('d', smoothPath(pts));
  });
  requestAnimationFrame(idleMorph);
}
requestAnimationFrame(idleMorph);

// ── Cursor ring ───────────────────────────────────────────────
document.querySelectorAll('.blob').forEach(b => {
  b.addEventListener('mouseenter', () => { ring.style.width = '58px'; ring.style.height = '58px'; });
  b.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; });
});

// ── Panel refs ────────────────────────────────────────────────
const panel      = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelCount = document.getElementById('panel-count');
const panelStrip = document.getElementById('panel-strip');
const worksGrid  = document.getElementById('works-grid');
const closeBtn   = document.getElementById('close-btn');
let activeBlob   = null;

// ── Fly animation ─────────────────────────────────────────────
// Physics phases (DURATION = 1600ms):
//   0.00–0.06  Pre-jump: blob squishes wide & flat (surface tension charging)
//   0.06–0.68  Rising:   blob elongates vertically (ascending liquid column)
//   0.68–0.78  Impact:   tip hits ceiling → splats wide and paper-thin
//   0.78–0.86  Rebound:  elastic partial reassembly
//   0.86–1.00  Dissolve: second wider splat, fades to nothing
//
// KEY FIX for teleport bug:
//   The CSS float animation (fa/fb/…) applies transform:translateY on .blob.
//   If we kill it before noting the offset, the blob snaps back to its
//   base position. We capture the visual Y offset first, then add it as
//   the JS animation's starting translate so the blob stays in place.

// Stores flight params so the return animation knows where to fall back to
let lastFlight = null;

function flyBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');

  const rectBefore = blob.getBoundingClientRect();

  // Lock opacity before killing animation — blob HTML has opacity:0 inline,
  // and blob-enter's `forwards` was the only thing keeping it at 1.
  blob.classList.add('flying-js');
  blob.style.opacity = '1';
  blob.style.animation = 'none';
  void blob.offsetHeight;

  const rectSnap   = blob.getBoundingClientRect();
  const floatDy    = rectBefore.top - rectSnap.top;
  const DURATION   = 1600;
  const totalTravel = rectBefore.top + rectBefore.height / 2 + 120;

  // Remember for return journey
  lastFlight = { id, floatDy, totalTravel };

  // ── Paint the panel with the blob's colour BEFORE it slides up ──
  const color = blob.dataset.color;
  const n = parseInt(color.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;

  // Compute blob's horizontal center as % of viewport
  // (flood origin = exact point where blob disappeared)
  const blobCenterX = Math.round(
    (rectBefore.left + rectBefore.width / 2) / window.innerWidth * 100
  );

  // Dark tinted background: 35% blob colour + 65% ink (#050400)
  const nr = Math.round(r * .35 + 5 * .65);
  const ng = Math.round(g * .35 + 4 * .65);
  const nb = Math.round(b * .35 + 0 * .65);
  const darkColor = `rgb(${nr},${ng},${nb})`;

  const colorFlood = document.getElementById('color-flood');
  // Position flood at blob's center, fully hidden — no transition yet
  colorFlood.style.transition = 'none';
  colorFlood.style.clipPath   = `circle(0% at ${blobCenterX}% 0%)`;
  colorFlood.style.background = darkColor;
  document.getElementById('panel-bg').style.background = darkColor;
  panelStrip.style.background = color;

  lastFlight.blobCenterX = blobCenterX;

  const eIO  = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
  const eOut = t => 1 - (1-t) * (1-t);
  const eIn  = t => t * t;
  const start = performance.now();

  function frame(now) {
    const prog = Math.min((now - start) / DURATION, 1);
    const tSec = (now - start) / 1000;

    blob.style.transform = `translateY(${floatDy - eIO(prog) * totalTravel}px)`;
    if (prog > .86) blob.style.opacity = String(1 - (prog - .86) / .14);

    let sx, sy;
    if (prog < .06) {
      const q = Math.sin((prog / .06) * Math.PI);
      sx = 1 + q * .14; sy = 1 - q * .11;
    } else if (prog < .68) {
      const q = eOut((prog - .06) / .62);
      sx = 1 - q * .25; sy = 1 + q * .32;
    } else if (prog < .78) {
      const q = eIn((prog - .68) / .10);
      sx = 0.75 + q * 2.0; sy = 1.32 - q * 1.20;
    } else if (prog < .86) {
      const q = eOut((prog - .78) / .08);
      sx = 2.75 - q * 1.25; sy = 0.12 + q * .38;
    } else {
      const q = (prog - .86) / .14;
      sx = 1.5 + q * 1.5; sy = 0.50 - q * .49;
    }

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec + 8, sx, sy)));
    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      // Blob fully invisible — fire the radial flood from that exact point
      blob.style.visibility = 'hidden';
      void colorFlood.offsetHeight; // flush any pending style before transition
      // Expand: fast initial burst, decelerates as it fills edges
      colorFlood.style.transition = 'clip-path .80s cubic-bezier(0.15, 0.5, 0.35, 1)';
      colorFlood.style.clipPath   = `circle(150% at ${blobCenterX}% 0%)`;
      // Panel content fades in 130ms into the expansion
      setTimeout(() => panel.classList.add('active'), 130);
    }
  }

  requestAnimationFrame(frame);
}

// ── Return drop animation (time-reversal of fly) ──────────────
// Phases:
//   0.00–0.12  Condense out of ceiling: flat splat → elongated column
//   0.12–0.82  Fall back down: column → circular (gravity pull)
//   0.82–0.92  Landing squish: brief belly-out on impact
//   0.92–1.00  Settle to idle
function returnBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');
  const { floatDy, totalTravel } = lastFlight;

  const DURATION = 1500;
  const eOut3 = t => 1 - Math.pow(1 - t, 3); // ease-out cubic (gentle fall)
  const eOut  = t => 1 - (1-t) * (1-t);
  const start = performance.now();

  blob.style.visibility = '';
  blob.style.opacity = '0';
  // Start at the same "dissolved" position: spread flat at top
  blob.style.transform = `translateY(${floatDy - totalTravel}px)`;

  function frame(now) {
    const prog = Math.min((now - start) / DURATION, 1);
    const tSec = (now - start) / 1000;

    // ── Fall back: from top to original position ──
    // eOut3 gives a slight acceleration (like gravity) then ease at landing
    const travel = floatDy - (1 - eOut3(prog)) * totalTravel;
    blob.style.transform = `translateY(${travel}px)`;

    // ── Fade in during condensation phase ──
    if (prog < .18) blob.style.opacity = String(prog / .18);
    else            blob.style.opacity = '1';

    // ── Shape: reverse of fly ──
    let sx, sy;
    if (prog < .12) {
      // Condense from flat ceiling splat back into elongated column
      const q = eOut(prog / .12);
      sx = 3.0 - q * 2.25;  // 3.0 → 0.75
      sy = 0.01 + q * 1.31; // 0.01 → 1.32
    } else if (prog < .82) {
      // Column falls and rounds out into circle
      const q = eOut3((prog - .12) / .70);
      sx = 0.75 + q * .25; // 0.75 → 1.0
      sy = 1.32 - q * .32; // 1.32 → 1.0
    } else if (prog < .92) {
      // Landing squish: brief outward belly as it hits its rest position
      const q = Math.sin(((prog - .82) / .10) * Math.PI);
      sx = 1 + q * .13;
      sy = 1 - q * .10;
    } else {
      sx = 1; sy = 1;
    }

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec + 20, sx, sy)));

    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      // Hand off to CSS float + idleMorph
      blob.style.transform = '';
      blob.style.opacity   = '';
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
    worksGrid.innerHTML = JSON.parse(blob.dataset.works).map((w, i) => `
      <div class="work-card">
        <div class="work-card-ghost">${String(i+1).padStart(2,'0')}</div>
        <div class="work-card-title">${w.title}</div>
        <div class="work-card-year">${w.year}</div>
      </div>`).join('');

    flyBlob(blob);
  });
});

// ── Close panel ───────────────────────────────────────────────
closeBtn.addEventListener('click', () => {
  const blob = activeBlob;
  activeBlob = null;
  const { blobCenterX } = lastFlight;
  const colorFlood = document.getElementById('color-flood');

  // 1. Fade out panel content
  panel.classList.remove('active');

  // 2. Colour retreats radially back toward the original blob impact point.
  //    Easing: accelerates inward (ease-in feel), giving a "sucked back" quality.
  setTimeout(() => {
    colorFlood.style.transition = 'clip-path .72s cubic-bezier(0.65, 0, 0.9, 0.5)';
    colorFlood.style.clipPath   = `circle(0% at ${blobCenterX}% 0%)`;
  }, 280);

  // 3. Blob starts condensing and falling just as the colour fully converges —
  //    looks like the colour crystallises back into the droplet.
  setTimeout(() => {
    returnBlob(blob);
  }, 820);
});

closeBtn.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; });
closeBtn.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; });
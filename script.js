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

function flyBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');

  // 1. Record VISUAL position before touching anything
  const rectBefore = blob.getBoundingClientRect();

  // 2. Kill CSS animation (blob snaps to base position).
  //    CRITICAL: set opacity:1 BEFORE killing animation — the blob HTML has
  //    opacity:0 inline, and blob-enter's `forwards` fill-mode was the only
  //    thing keeping it visible. Killing animation reverts to the inline 0.
  blob.classList.add('flying-js');
  blob.style.opacity = '1';
  blob.style.animation = 'none';
  void blob.offsetHeight; // force layout reflow

  // 3. Record snapped position, compute float offset we just lost
  const rectSnap = blob.getBoundingClientRect();
  const floatDy  = rectBefore.top - rectSnap.top; // e.g. −7px if float pushed it up

  // 4. Total upward travel: current visual top + half height + overshoot
  //    so the blob fully exits the viewport before splat
  const DURATION    = 1600;
  const totalTravel = rectBefore.top + rectBefore.height / 2 + 120;

  const eIO  = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
  const eOut = t => 1 - (1-t) * (1-t);
  const eIn  = t => t * t;

  const start = performance.now();

  function frame(now) {
    const prog = Math.min((now - start) / DURATION, 1);
    const tSec = (now - start) / 1000; // seconds, for noise continuity

    // ── Movement: translateY from floatDy (start) to -(totalTravel) (top) ──
    const travel = floatDy - eIO(prog) * totalTravel;
    blob.style.transform = `translateY(${travel}px)`;

    // ── Opacity: fade out during dissolve phase ──
    if (prog > .86) {
      blob.style.opacity = String(1 - (prog - .86) / .14);
    }

    // ── Shape: interpolate scaleX/scaleY based on phase ──
    let sx, sy;
    if (prog < .06) {
      const q = Math.sin((prog / .06) * Math.PI); // rises then falls → one pulse
      sx = 1 + q * .14;    // brief belly-out
      sy = 1 - q * .11;
    } else if (prog < .68) {
      const q = eOut((prog - .06) / .62);
      sx = 1 - q * .25;    // narrow as it rises
      sy = 1 + q * .32;    // tall
    } else if (prog < .78) {
      const q = eIn((prog - .68) / .10);
      sx = 0.75 + q * 2.0; // 0.75 → 2.75
      sy = 1.32 - q * 1.20; // 1.32 → 0.12
    } else if (prog < .86) {
      const q = eOut((prog - .78) / .08);
      sx = 2.75 - q * 1.25; // 2.75 → 1.5
      sy = 0.12 + q * .38;  // 0.12 → 0.50
    } else {
      const q = (prog - .86) / .14;
      sx = 1.5  + q * 1.5;  // 1.5 → 3.0
      sy = 0.50 - q * .49;  // 0.50 → 0.01
    }

    const pts = blobPts(bd.cx, bd.cy, bd.r, NOISE[id], tSec + 8, sx, sy);
    pathEl.setAttribute('d', smoothPath(pts));

    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      blob.style.visibility = 'hidden';
    }
  }

  requestAnimationFrame(frame);

  // Panel rises after impact (prog ≈ 0.78)
  setTimeout(() => panel.classList.add('active'), DURATION * .80);
}

// ── Blob click ────────────────────────────────────────────────
document.querySelectorAll('.blob').forEach(blob => {
  blob.addEventListener('click', () => {
    if (blob.classList.contains('flying-js')) return;
    activeBlob = blob;

    panelTitle.textContent = blob.dataset.category;
    panelCount.textContent = String(JSON.parse(blob.dataset.works).length).padStart(2,'0') + ' Works';
    panelStrip.style.background = blob.dataset.color;
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
  panel.classList.remove('active');
  setTimeout(() => {
    if (!activeBlob) return;
    const id  = activeBlob.id;
    const bd  = BD[id];
    // Restore to neutral circle so idleMorph takes over cleanly
    activeBlob.querySelector('path').setAttribute('d',
      smoothPath(blobPts(bd.cx, bd.cy, bd.r, NOISE[id], 0)));
    activeBlob.style.visibility = '';
    activeBlob.style.transform  = '';
    activeBlob.style.opacity    = '';
    activeBlob.style.animation  = FLOAT_ANIM[id];
    activeBlob.classList.remove('flying-js');
    activeBlob = null;
  }, 900);
});

closeBtn.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; });
closeBtn.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; });
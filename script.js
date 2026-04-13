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

// ── Blob geometry (SVG local coords) ─────────────────────────
// [cx, tipY, half-width, height]
const BD = {
  'blob-photography': [89,  8,  73, 232],
  'blob-design':      [107, 10, 94, 200],
  'blob-film':        [79,  5,  68, 245],
  'blob-game':        [100, 7,  90, 215]
};

const MC = {
  'blob-photography': [1.8, 0.0],
  'blob-design':      [2.1, 1.4],
  'blob-film':        [1.5, 2.8],
  'blob-game':        [2.4, 0.7]
};

const FLOAT_ANIM = {
  'blob-photography': 'fa 3.9s 0s ease-in-out infinite',
  'blob-design':      'fb 4.3s 0s ease-in-out infinite',
  'blob-film':        'fc 3.6s 0s ease-in-out infinite',
  'blob-game':        'fd 4.7s 0s ease-in-out infinite'
};

// ── Path math ─────────────────────────────────────────────────
// 24 numbers (12 pts) for a 4-bezier closed teardrop.
// tip at top, round belly below. wR/wL = L/R asymmetry.
function mkPts(cx, tipY, wR, wL, h) {
  const mY = tipY + h * .52;
  const bY = tipY + h;
  return [
    cx,        tipY,
    cx+wR*.38, tipY,      cx+wR, tipY+h*.42,  cx+wR, mY,
    cx+wR,     mY+h*.40,  cx+wR*.45, bY,       cx,    bY,
    cx-wL*.45, bY,        cx-wL, mY+h*.40,    cx-wL, mY,
    cx-wL,     tipY+h*.42, cx-wL*.38, tipY
  ];
}

function toPath(p) {
  const f = n => Math.round(n * 10) / 10;
  return `M${f(p[0])},${f(p[1])}`+
    `C${f(p[2])},${f(p[3])} ${f(p[4])},${f(p[5])} ${f(p[6])},${f(p[7])}`+
    `C${f(p[8])},${f(p[9])} ${f(p[10])},${f(p[11])} ${f(p[12])},${f(p[13])}`+
    `C${f(p[14])},${f(p[15])} ${f(p[16])},${f(p[17])} ${f(p[18])},${f(p[19])}`+
    `C${f(p[20])},${f(p[21])} ${f(p[22])},${f(p[23])} ${f(p[0])},${f(p[1])}Z`;
}

function lerpPts(a, b, t) { return a.map((v, i) => v + (b[i] - v) * t); }

const eIO  = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
const eOut = t => 1-(1-t)*(1-t);
const eIn  = t => t*t;

// ── Idle liquid morph ─────────────────────────────────────────
// Drives all non-flying blob paths with layered sine perturbations.
function idleMorph(ts) {
  const t = ts / 1000;
  document.querySelectorAll('.blob:not(.flying-js)').forEach(blob => {
    const bd = BD[blob.id];
    if (!bd) return;
    const [cx, tipY, w, h] = bd;
    const [spd, ph] = MC[blob.id];
    const s = t * spd + ph;

    const dw  = Math.sin(s * .90)       * w * .09;
    const dh  = Math.cos(s * .70 + 1.2) * h * .04;
    const dcx = Math.sin(s * .50 + .8)  * 5;
    const dty = Math.cos(s * .60)       * 3;
    const asy = Math.sin(s * 1.1 + 2.0) * w * .08;

    const p = mkPts(cx+dcx, tipY+dty, w+dw+asy, w+dw-asy, h+dh);
    blob.querySelector('path').setAttribute('d', toPath(p));
  });
  requestAnimationFrame(idleMorph);
}
requestAnimationFrame(idleMorph);

// ── Cursor ring expand ────────────────────────────────────────
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

// ── Fly + morph animation ─────────────────────────────────────
// Phase timeline (1550ms total):
//  0.00-0.06  Pre-jump: belly squishes (surface tension)
//  0.06-0.70  Rising:   elongates/narrows (ascending droplet)
//  0.70-0.80  Impact:   splats wide+flat against ceiling
//  0.80-0.88  Rebound:  elastic partial reassembly
//  0.88-1.00  Dissolve: second splat, fades out
function flyBlob(blob) {
  const id = blob.id;
  const [cx, tipY, w, h] = BD[id];
  const pathEl = blob.querySelector('path');

  blob.classList.add('flying-js');
  blob.style.animation = 'none';

  const DURATION = 1550;
  const rect = blob.getBoundingClientRect();
  // Calculate travel so tip reaches y=0 exactly at impact (prog=0.78)
  const totalTravel = rect.top / eIO(0.78) + 60;

  const start = performance.now();

  function frame(now) {
    const prog = Math.min((now - start) / DURATION, 1);

    blob.style.transform = `translateY(-${eIO(prog) * totalTravel}px)`;
    if (prog > .88) blob.style.opacity = String(1 - (prog - .88) / .12);

    let pts;
    if (prog < .06) {
      const t = Math.sin((prog / .06) * Math.PI);
      pts = lerpPts(
        mkPts(cx,  tipY,    w,       w,       h),
        mkPts(cx,  tipY+8,  w*1.13,  w*1.13,  h*.86),
        t
      );
    } else if (prog < .70) {
      const t = eOut((prog - .06) / .64);
      pts = lerpPts(
        mkPts(cx,  tipY,         w,     w,     h),
        mkPts(cx,  tipY-h*.11,   w*.68, w*.68, h*1.27),
        t
      );
    } else if (prog < .80) {
      const t = eIn((prog - .70) / .10);
      pts = lerpPts(
        mkPts(cx,  tipY-h*.11,   w*.68,  w*.68,  h*1.27),
        mkPts(cx,  tipY+h*.39,   w*2.25, w*2.25, h*.13),
        t
      );
    } else if (prog < .88) {
      const t = eOut((prog - .80) / .08);
      pts = lerpPts(
        mkPts(cx,  tipY+h*.39,   w*2.25, w*2.25, h*.13),
        mkPts(cx,  tipY+h*.23,   w*1.55, w*1.55, h*.46),
        t
      );
    } else {
      const t = (prog - .88) / .12;
      pts = lerpPts(
        mkPts(cx,  tipY+h*.23,   w*1.55, w*1.55, h*.46),
        mkPts(cx,  tipY+h*.44,   w*2.90, w*2.90, h*.015),
        t
      );
    }

    pathEl.setAttribute('d', toPath(pts));

    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      blob.style.visibility = 'hidden';
    }
  }

  requestAnimationFrame(frame);
  setTimeout(() => panel.classList.add('active'), DURATION * .80);
}

// ── Blob click ────────────────────────────────────────────────
document.querySelectorAll('.blob').forEach(blob => {
  blob.addEventListener('click', () => {
    if (blob.classList.contains('flying-js')) return;
    activeBlob = blob;

    const category = blob.dataset.category;
    const color    = blob.dataset.color;
    const works    = JSON.parse(blob.dataset.works);

    panelTitle.textContent = category;
    panelCount.textContent = String(works.length).padStart(2, '0') + ' Works';
    panelStrip.style.background = color;
    worksGrid.innerHTML = works.map((w, i) => `
      <div class="work-card">
        <div class="work-card-ghost">${String(i+1).padStart(2,'0')}</div>
        <div class="work-card-title">${w.title}</div>
        <div class="work-card-year">${w.year}</div>
      </div>`
    ).join('');

    flyBlob(blob);
  });
});

// ── Close panel ───────────────────────────────────────────────
closeBtn.addEventListener('click', () => {
  panel.classList.remove('active');
  setTimeout(() => {
    if (!activeBlob) return;
    const id = activeBlob.id;
    const [cx, tipY, w, h] = BD[id];
    // Reset to neutral before idleMorph takes over
    activeBlob.querySelector('path').setAttribute('d', toPath(mkPts(cx, tipY, w, w, h)));
    activeBlob.style.visibility = '';
    activeBlob.style.transform  = '';
    activeBlob.style.opacity    = '';
    activeBlob.style.animation  = FLOAT_ANIM[id] || '';
    activeBlob.classList.remove('flying-js');
    activeBlob = null;
  }, 900);
});

closeBtn.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; });
closeBtn.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; });
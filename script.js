// ── Cursor ───────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
(function rafCursor() {
  rx += (mx-rx)*.11; ry += (my-ry)*.11;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(rafCursor);
})();

// ── Blob geometry ─────────────────────────────────────────────
const BD = {
  'blob-photography': {cx:89, cy:124, r:78},
  'blob-design':      {cx:107,cy:110, r:88},
  'blob-film':        {cx:79, cy:128, r:68},
  'blob-game':        {cx:100,cy:115, r:83}
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
const f = n => Math.round(n*10)/10;
function blobPts(cx,cy,r,noise,t,sx=1,sy=1) {
  return Array.from({length:N_PTS},(_,i)=>{
    const angle=(i/N_PTS)*Math.PI*2-Math.PI/2;
    const dr=noise.reduce((s,[a,f,p])=>s+a*Math.sin(t*f+p+i*1.09),0);
    return [cx+Math.cos(angle)*(r+dr)*sx, cy+Math.sin(angle)*(r+dr)*sy];
  });
}
function smoothPath(pts) {
  const N=pts.length;
  let d=`M${f(pts[0][0])},${f(pts[0][1])}`;
  for(let i=0;i<N;i++){
    const p1=pts[i],p2=pts[(i+1)%N],p0=pts[(i-1+N)%N],p3=pts[(i+2)%N];
    const c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6;
    const c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=`C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d+'Z';
}

// ── Idle morph ────────────────────────────────────────────────
function idleMorph(ts) {
  const t=ts/1000;
  document.querySelectorAll('.blob:not(.flying-js)').forEach(blob=>{
    const bd=BD[blob.id]; if(!bd) return;
    const idx=['blob-photography','blob-design','blob-film','blob-game'].indexOf(blob.id);
    const [spd,ph]=[[1.8,0.0],[2.1,1.4],[1.5,2.8],[2.4,0.7]][idx];
    const s=t*spd+ph;
    const {cx,cy,r}=bd, n=NOISE[blob.id];
    const dw=Math.sin(s*.90)*r*.09, dh=Math.cos(s*.70+1.2)*r*.04;
    const dcx=Math.sin(s*.50+.8)*5, dty=Math.cos(s*.60)*3;
    const asy=Math.sin(s*1.1+2.0)*r*.08;
    blob.querySelector('path').setAttribute('d',
      smoothPath(blobPts(cx+dcx,cy+dty,r+dw+asy,n,t,1,1)));
  });
  requestAnimationFrame(idleMorph);
}
requestAnimationFrame(idleMorph);

document.querySelectorAll('.blob').forEach(b=>{
  b.addEventListener('mouseenter',()=>{ring.style.width='58px';ring.style.height='58px';});
  b.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';});
});

// ── Canvas Flood System ───────────────────────────────────────
// Each frame: 4 tide-fronts drawn with a 3-harmonic sine wave boundary.
// Completely bypasses CSS interpolation — every frame is independently
// computed, giving genuinely fluid, organic motion.
const floodCanvas = document.getElementById('color-flood');
const floodCtx    = floodCanvas.getContext('2d');
let   floodRaf    = null;

function resizeFlood() {
  floodCanvas.width  = window.innerWidth;
  floodCanvas.height = window.innerHeight;
}
resizeFlood();
window.addEventListener('resize', resizeFlood);

function clearFlood() {
  if (floodRaf) { cancelAnimationFrame(floodRaf); floodRaf = null; }
  floodCtx.clearRect(0, 0, floodCanvas.width, floodCanvas.height);
}

// Each edge has its own wave phase so the four fronts are never identical.
const EDGES = [
  {side:'left',   ph:0.0},
  {side:'right',  ph:2.65},
  {side:'top',    ph:1.3},
  {side:'bottom', ph:3.85}
];

// Draw one tide strip from one edge.
// prog 0→1: edge fully retracted → fully advanced.
// t: elapsed time in seconds (drives the wave phase).
function drawTideStrip(side, prog, t, ph, bgColor) {
  const W = floodCanvas.width, H = floodCanvas.height;
  const maxInset = (side==='left'||side==='right') ? W*0.54 : H*0.54;
  const inset = maxInset * prog;

  // Amplitude: grows with inset, so thin bands have small ripples.
  const amp = Math.min(72, inset * 0.48);

  // Three harmonics: low-freq swell + mid-freq chop + high-freq ripple.
  // Different speeds and signs so the wave is never periodic/repeating.
  function w(u) {
    return amp*(
      0.50*Math.sin(u*0.0038 + t*1.15 + ph) +
      0.33*Math.sin(u*0.0105 - t*0.78 + ph + 1.9) +
      0.17*Math.sin(u*0.0222 + t*2.05 + ph + 4.1)
    );
  }

  const STEP = 3;
  floodCtx.fillStyle = bgColor;
  floodCtx.beginPath();

  if (side === 'left') {
    floodCtx.moveTo(0, 0);
    for (let y=0; y<=H; y+=STEP) floodCtx.lineTo(Math.max(0, inset+w(y)), y);
    floodCtx.lineTo(0, H);
  } else if (side === 'right') {
    floodCtx.moveTo(W, 0);
    for (let y=0; y<=H; y+=STEP) floodCtx.lineTo(Math.min(W, W-inset+w(y)), y);
    floodCtx.lineTo(W, H);
  } else if (side === 'top') {
    floodCtx.moveTo(0, 0);
    for (let x=0; x<=W; x+=STEP) floodCtx.lineTo(x, Math.max(0, inset+w(x)));
    floodCtx.lineTo(W, 0);
  } else {
    floodCtx.moveTo(0, H);
    for (let x=0; x<=W; x+=STEP) floodCtx.lineTo(x, Math.min(H, H-inset+w(x)));
    floodCtx.lineTo(W, H);
  }
  floodCtx.closePath();
  floodCtx.fill();
}

function drawAllTide(prog, t, bgColor) {
  floodCtx.clearRect(0, 0, floodCanvas.width, floodCanvas.height);
  EDGES.forEach(({side, ph}) => drawTideStrip(side, prog, t, ph, bgColor));
}

// Animate tide IN (edges advance to cover screen).
// onPanel() called once at ~45% fill (both coverage & visual connection).
function animateTideIn(bgColor, duration, onPanel) {
  clearFlood();
  const startT = performance.now();
  let panelFired = false;
  const eIO = p => p<.5 ? 2*p*p : -1+(4-2*p)*p;

  function frame(now) {
    const elapsed = now - startT;
    const raw  = Math.min(elapsed/duration, 1);
    const prog = eIO(raw);
    drawAllTide(prog, elapsed/1000, bgColor);

    if (!panelFired && raw >= 0.46) {
      panelFired = true;
      if (onPanel) onPanel();
    }

    if (raw < 1) {
      floodRaf = requestAnimationFrame(frame);
    } else {
      floodRaf = null;
      // Solid fill — tide animation is done, hold colour under panel
      floodCtx.fillStyle = bgColor;
      floodCtx.fillRect(0, 0, floodCanvas.width, floodCanvas.height);
    }
  }
  floodRaf = requestAnimationFrame(frame);
}

// Animate tide OUT (edges retreat back to screen edges then vanish).
function animateTideOut(bgColor, duration, onDone) {
  if (floodRaf) { cancelAnimationFrame(floodRaf); floodRaf = null; }
  const startT = performance.now();
  // ease-out: tide rushes back fast, slows as it nears screen edge
  const eOut3 = p => 1 - Math.pow(1-p, 3);

  function frame(now) {
    const elapsed = now - startT;
    const raw  = Math.min(elapsed/duration, 1);
    // prog: 1 (full coverage) → 0 (gone), fast exit, slow near edge
    const prog = 1 - eOut3(raw);
    drawAllTide(prog, elapsed/1000, bgColor);

    if (raw < 1) {
      floodRaf = requestAnimationFrame(frame);
    } else {
      clearFlood();
      if (onDone) onDone();
    }
  }
  floodRaf = requestAnimationFrame(frame);
}

// ── Panel refs ────────────────────────────────────────────────
const panel      = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelCount = document.getElementById('panel-count');
const panelStrip = document.getElementById('panel-strip');
const worksGrid  = document.getElementById('works-grid');
const closeBtn   = document.getElementById('close-btn');
let activeBlob   = null;
let lastFlight   = {};

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
  const totalTravel = rectBefore.top + rectBefore.height/2 + 120;

  // Compute bg colour: full category colour, dim yellow only (too bright)
  const color = blob.dataset.color;
  const n = parseInt(color.slice(1),16);
  const r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  const lum = 0.299*r + 0.587*g + 0.114*b;
  const k = lum >= 160 ? 0.74 : 1.0;
  const bgColor = `rgb(${Math.round(r*k)},${Math.round(g*k)},${Math.round(b*k)})`;

  lastFlight = {id, floatDy, totalTravel, bgColor};
  // panel-bg stays transparent — the flood canvas (z:480) is the colour background.
  // Setting panel-bg to bgColor caused a full-screen colour flash the moment
  // panel.active fired, interrupting the still-running tide animation.
  panelStrip.style.background = 'rgba(255,255,255,.38)';

  const eIO  = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
  const eOut = t => 1-(1-t)*(1-t);
  const eIn  = t => t*t;
  const start = performance.now();
  let floodStarted = false;

  function frame(now) {
    const prog = Math.min((now-start)/DURATION, 1);
    const tSec = (now-start)/1000;

    blob.style.transform = `translateY(${floatDy - eIO(prog)*totalTravel}px)`;
    if (prog > .86) blob.style.opacity = String(1-(prog-.86)/.14);

    let sx,sy;
    if      (prog<.06){const q=Math.sin((prog/.06)*Math.PI);sx=1+q*.14;sy=1-q*.11;}
    else if (prog<.68){const q=eOut((prog-.06)/.62);sx=1-q*.25;sy=1+q*.32;}
    else if (prog<.78){const q=eIn((prog-.68)/.10);sx=0.75+q*2.0;sy=1.32-q*1.20;}
    else if (prog<.86){const q=eOut((prog-.78)/.08);sx=2.75-q*1.25;sy=0.12+q*.38;}
    else              {const q=(prog-.86)/.14;sx=1.5+q*1.5;sy=0.50-q*.49;}

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx,bd.cy,bd.r,NOISE[id],tSec+8,sx,sy)));

    // Tide starts when blob is ~10% opacity — tide and dissolve overlap
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

// ── Return animation ──────────────────────────────────────────
function returnBlob(blob) {
  const id = blob.id;
  const bd = BD[id];
  const pathEl = blob.querySelector('path');
  const {floatDy, totalTravel} = lastFlight;
  const RDUR = 1450;
  const eOut3 = t => 1-Math.pow(1-t,3);
  const eOut  = t => 1-(1-t)*(1-t);
  const start = performance.now();

  blob.style.visibility = '';
  blob.style.opacity    = '0';
  blob.style.transform  = `translateY(${floatDy-totalTravel}px)`;
  blob.style.zIndex     = '490';

  function frame(now) {
    const prog = Math.min((now-start)/RDUR, 1);
    const tSec = (now-start)/1000;
    blob.style.transform = `translateY(${floatDy-(1-eOut3(prog))*totalTravel}px)`;
    if (prog<.16) blob.style.opacity = String(prog/.16);
    else          blob.style.opacity = '1';

    let sx,sy;
    if      (prog<.14){const q=eOut(prog/.14);sx=2.8-q*2.1;sy=0.02+q*1.26;}
    else if (prog<.82){const q=eOut3((prog-.14)/.68);sx=0.7+q*.30;sy=1.28-q*.28;}
    else if (prog<.93){const q=Math.sin(((prog-.82)/.11)*Math.PI);sx=1+q*.13;sy=1-q*.10;}
    else              {sx=1;sy=1;}

    pathEl.setAttribute('d', smoothPath(blobPts(bd.cx,bd.cy,bd.r,NOISE[id],tSec+20,sx,sy)));

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
    panelCount.textContent = String(JSON.parse(blob.dataset.works).length).padStart(2,'0')+' Works';
    worksGrid.innerHTML = JSON.parse(blob.dataset.works).map((w,i)=>`
      <div class="work-card">
        <div class="work-card-ghost">${String(i+1).padStart(2,'0')}</div>
        <div class="work-card-title">${w.title}</div>
        <div class="work-card-year">${w.year}</div>
      </div>`).join('');
    flyBlob(blob);
  });
});

// ── Close panel ───────────────────────────────────────────────
// t=0    panel content fades out
// t=180  tide starts rushing back from centre → edges (ease-out, 800ms)
// t=820  tide fully gone; blob condenses from top, falls back
closeBtn.addEventListener('click', () => {
  const blob = activeBlob;
  activeBlob = null;
  const {bgColor} = lastFlight;

  panel.classList.remove('active');
  panel.style.color = '';

  setTimeout(() => animateTideOut(bgColor, 800, null), 180);
  setTimeout(() => returnBlob(blob), 820);
});

closeBtn.addEventListener('mouseenter',()=>{ring.style.width='50px';ring.style.height='50px';});
closeBtn.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';});
// ── Cursor tracking ─────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function tick() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(tick);
})();

// Expand ring on blob hover
document.querySelectorAll('.blob').forEach(b => {
  b.addEventListener('mouseenter', () => {
    ring.style.width  = '58px';
    ring.style.height = '58px';
  });
  b.addEventListener('mouseleave', () => {
    ring.style.width  = '34px';
    ring.style.height = '34px';
  });
});

// ── Panel state ─────────────────────────────────────────────
const panel      = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelCount = document.getElementById('panel-count');
const panelStrip = document.getElementById('panel-strip');
const worksGrid  = document.getElementById('works-grid');
const closeBtn   = document.getElementById('close-btn');
let activeBlob   = null;

// ── Blob click ──────────────────────────────────────────────
document.querySelectorAll('.blob').forEach(blob => {
  blob.addEventListener('click', () => {
    if (blob.classList.contains('flying')) return;
    activeBlob = blob;

    const category = blob.dataset.category;
    const color    = blob.dataset.color;
    const works    = JSON.parse(blob.dataset.works);

    // 1. Fly the blob upward
    blob.classList.add('flying');

    // 2. Populate panel content
    panelTitle.textContent = category;
    panelCount.textContent = String(works.length).padStart(2,'0') + ' Works';
    panelStrip.style.background = color;

    worksGrid.innerHTML = works.map((w, i) => `
      <div class="work-card">
        <div class="work-card-ghost">${String(i+1).padStart(2,'0')}</div>
        <div class="work-card-title">${w.title}</div>
        <div class="work-card-year">${w.year}</div>
      </div>
    `).join('');

    // 3. Reveal panel after blob is in flight
    setTimeout(() => panel.classList.add('active'), 700);
  });
});

// ── Close panel ─────────────────────────────────────────────
closeBtn.addEventListener('click', () => {
  panel.classList.remove('active');

  // After panel slides away, restore the blob
  setTimeout(() => {
    if (activeBlob) {
      activeBlob.classList.remove('flying');
      activeBlob = null;
    }
  }, 1100);
});

// Close button cursor expand
closeBtn.addEventListener('mouseenter', () => {
  ring.style.width  = '50px';
  ring.style.height = '50px';
});
closeBtn.addEventListener('mouseleave', () => {
  ring.style.width  = '34px';
  ring.style.height = '34px';
});
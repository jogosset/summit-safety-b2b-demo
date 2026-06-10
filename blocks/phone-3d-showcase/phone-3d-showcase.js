// eslint-disable-next-line import/no-unresolved
import { readBlockConfig } from '../../scripts/aem.js';

// ── DOM helpers ──────────────────────────────────────────────────────────────

function el(tag, classes = [], attrs = {}) {
  const node = document.createElement(tag);
  if (classes.length) node.classList.add(...classes);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function txt(tag, classes, text) {
  const node = el(tag, classes);
  node.textContent = text;
  return node;
}

// ── SVG helpers (static, not user input) ────────────────────────────────────

function svgSignal() {
  const wrap = el('span', ['p3d-scr-signal']);
  for (let i = 0; i < 4; i++) wrap.appendChild(el('i'));
  return wrap;
}

function svgIcon(pathD, strokeWidth = '1.8') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('stroke', '#fff');
  path.setAttribute('stroke-width', strokeWidth);
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);
  return svg;
}

function svgCtrl(viewBox, pathD, strokeWidth = '2') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', strokeWidth);
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  return svg;
}

// ── Build HTML structure ─────────────────────────────────────────────────────

function buildBlock(root, cfg) {
  // Ambient orbs
  const ambient = el('div', ['p3d-ambient']);
  ['p3d-orb-1', 'p3d-orb-2', 'p3d-orb-3'].forEach((c) => ambient.appendChild(el('div', ['p3d-orb', c])));
  root.appendChild(ambient);

  // Particles container
  root.appendChild(el('div', ['p3d-particles']));

  // Hero wrapper
  const hero = el('div', ['p3d-hero']);
  root.appendChild(hero);

  // ── Hero top ──
  const heroTop = el('div', ['p3d-hero-top']);
  hero.appendChild(heroTop);

  const badge = el('div', ['p3d-badge']);
  badge.appendChild(el('span', ['p3d-badge-dot']));
  const badgeTxt = document.createElement('span');
  badgeTxt.textContent = cfg.badge || 'Now on CitiSignal 5G Ultra Network';
  badge.appendChild(badgeTxt);
  heroTop.appendChild(badge);

  const h2 = document.createElement('h2');
  h2.textContent = cfg.heading || 'Feel Every Frequency.';
  heroTop.appendChild(h2);

  const desc = document.createElement('p');
  desc.textContent = cfg.description || 'Drag to rotate. Scroll to zoom. Tap hotspots to explore every detail of the device.';
  heroTop.appendChild(desc);

  // ── 3D Viewport ──
  const vp = el('div', ['p3d-viewport']);
  hero.appendChild(vp);

  const persp = el('div', ['p3d-perspective']);
  vp.appendChild(persp);

  const phone = el('div', ['p3d-phone']);
  persp.appendChild(phone);

  // Edges
  ['left', 'right', 'top', 'bottom'].forEach((s) => phone.appendChild(el('div', ['p3d-edge', `p3d-edge-${s}`])));
  [1, 2, 3, 4].forEach((n) => phone.appendChild(el('div', ['p3d-side-btn', `p3d-side-btn-${n}`])));

  // Front face
  const front = el('div', ['p3d-face', 'p3d-face-front']);
  const screen = el('div', ['p3d-screen']);
  front.appendChild(screen);

  screen.appendChild(el('div', ['p3d-screen-island']));

  const status = el('div', ['p3d-screen-status']);
  const timeSpan = txt('span', [], '9:41');
  status.appendChild(timeSpan);
  const sigWrap = el('span', []);
  sigWrap.style.display = 'flex';
  sigWrap.style.alignItems = 'center';
  sigWrap.style.gap = '4px';
  const fgLabel = txt('span', [], '5G+');
  fgLabel.style.fontSize = '8px';
  fgLabel.style.fontWeight = '700';
  sigWrap.appendChild(fgLabel);
  sigWrap.appendChild(svgSignal());
  status.appendChild(sigWrap);
  screen.appendChild(status);

  screen.appendChild(txt('span', ['p3d-screen-brand'], 'CITISIGNAL'));
  screen.appendChild(txt('span', ['p3d-screen-time'], '9:41'));
  screen.appendChild(txt('span', ['p3d-screen-date'], 'Monday, April 6'));
  screen.appendChild(txt('span', ['p3d-screen-subtitle'], 'Expanded nationwide 5G'));

  const notif = el('div', ['p3d-screen-notif']);
  const notifIco = el('div', ['p3d-notif-icon']);
  notifIco.appendChild(svgIcon('M4 12V8M8 12V4M12 12V6'));
  notif.appendChild(notifIco);
  const notifBody = el('div', ['p3d-notif-body']);
  notifBody.appendChild(txt('div', ['p3d-nb-app'], 'CitiSignal'));
  notifBody.appendChild(txt('div', ['p3d-nb-msg'], 'Your 5G speed just hit 4.2 Gbps ⚡'));
  notifBody.appendChild(txt('div', ['p3d-nb-time'], 'now'));
  notif.appendChild(notifBody);
  screen.appendChild(notif);
  screen.appendChild(el('div', ['p3d-screen-home-bar']));
  phone.appendChild(front);

  // Back face
  const back = el('div', ['p3d-face', 'p3d-face-back']);
  const backInner = el('div', ['p3d-back']);
  back.appendChild(backInner);

  const camModule = el('div', ['p3d-cam-module']);
  camModule.appendChild(el('div', ['p3d-cam-lens', 'p3d-cam-lens-lg']));
  camModule.appendChild(el('div', ['p3d-cam-lens', 'p3d-cam-lens-md']));
  camModule.appendChild(el('div', ['p3d-cam-lens', 'p3d-cam-lens-sm']));
  camModule.appendChild(el('div', ['p3d-cam-flash']));
  backInner.appendChild(camModule);
  backInner.appendChild(el('div', ['p3d-cam-lidar']));
  backInner.appendChild(el('div', ['p3d-cam-mic']));
  backInner.appendChild(txt('div', ['p3d-back-logo'], 'CITISIGNAL'));
  backInner.appendChild(txt('div', ['p3d-back-spec', 'p3d-bs-1'], 'Model CS-X1 Ultra'));
  backInner.appendChild(txt('div', ['p3d-back-spec', 'p3d-bs-2'], 'Designed in California'));
  backInner.appendChild(txt('div', ['p3d-back-spec', 'p3d-bs-3'], 'IMEI 35-XXXXXX'));
  const backReg = el('div', ['p3d-back-reg']);
  ['FCC', 'CE', '♾'].forEach((s) => backReg.appendChild(txt('span', [], s)));
  backInner.appendChild(backReg);
  phone.appendChild(back);

  // ── Spec cards ──
  const specs = [
    { id: 'display', pos: { top: '20%', left: '4%' }, ico: '📱', icoClass: 'p3d-ico-purple', lbl: 'Display', ttl: '6.7" AMOLED', desc: 'ProMotion 120Hz adaptive refresh. 2600 nits peak. Always-On display with dynamic wallpapers.', big: '120Hz', fill: '96%' },
    { id: 'chip', pos: { top: '50%', right: '4%' }, ico: '⚡', icoClass: 'p3d-ico-amber', lbl: 'Processor', ttl: 'Titan X1 Chip', desc: '4nm architecture. 6-core GPU, 16-core Neural Engine, hardware ray tracing.', big: '4nm', fill: '89%' },
    { id: '5g', pos: { bottom: '12%', left: '4%' }, ico: '📡', icoClass: 'p3d-ico-green', lbl: 'Connectivity', ttl: '5G Ultra+', desc: 'mmWave + Sub-6GHz dual. Wi-Fi 7, UWB, Satellite SOS. On CitiSignal\'s edge network.', big: '2.4 Gbps', fill: '97%', liveSpeed: true },
    { id: 'battery', pos: { bottom: '12%', right: '4%' }, ico: '🔋', icoClass: 'p3d-ico-green', lbl: 'Battery', ttl: '5000 mAh', desc: 'All-day battery. 45W wired fast charge. 15W MagSafe wireless. Reverse charging.', big: '33hrs', fill: '91%' },
    { id: 'main-cam', pos: { top: '8%', right: '4%' }, ico: '📷', icoClass: 'p3d-ico-cyan', lbl: 'Main Camera', ttl: '200MP Wide', desc: 'f/1.7 aperture. Sensor-shift OIS. 8K video at 30fps. Computational RAW.', big: 'f/1.7', fill: '94%' },
    { id: 'ultra-cam', pos: { top: '38%', left: '4%' }, ico: '🌿', icoClass: 'p3d-ico-cyan', lbl: 'Ultra Wide', ttl: '48MP 120°', desc: 'Macro mode to 2cm. f/2.2 aperture. Night mode. Spatial video capture.', big: '120°', fill: '86%' },
    { id: 'tele-cam', pos: { top: '38%', right: '4%' }, ico: '🔭', icoClass: 'p3d-ico-cyan', lbl: 'Telephoto', ttl: '12MP 5x Zoom', desc: 'Tetraprism design. 120mm focal length. Up to 25x digital zoom.', big: '5x', fill: '90%' },
    { id: 'lidar', pos: { bottom: '18%', left: '4%' }, ico: '💡', icoClass: 'p3d-ico-rose', lbl: 'Sensor', ttl: 'LiDAR Scanner', desc: 'Measures depth up to 5m. AR anchoring. Night portraits with depth mapping.', big: '5m', fill: '78%' },
    { id: 'build', pos: { bottom: '18%', right: '4%' }, ico: '🛡', icoClass: 'p3d-ico-amber', lbl: 'Build', ttl: 'Grade 5 Titanium', desc: 'Ceramic Shield front. Textured matte glass back. IP68 water resistance to 6m.', big: 'IP68', fill: '95%' },
  ];

  specs.forEach((s) => {
    const card = el('div', ['p3d-spec-card']);
    card.dataset.specId = s.id;
    Object.entries(s.pos).forEach(([k, v]) => { card.style[k] = v; });

    const head = el('div', ['p3d-sc-head']);
    const ico = txt('div', ['p3d-sc-ico', s.icoClass], s.ico);
    const meta = el('div', []);
    meta.appendChild(txt('div', ['p3d-sc-lbl'], s.lbl));
    meta.appendChild(txt('div', ['p3d-sc-ttl'], s.ttl));
    head.appendChild(ico);
    head.appendChild(meta);
    card.appendChild(head);
    card.appendChild(txt('div', ['p3d-sc-desc'], s.desc));

    const big = txt('div', ['p3d-sc-big'], s.big);
    if (s.liveSpeed) big.dataset.liveSpeed = '1';
    card.appendChild(big);

    const bar = el('div', ['p3d-sc-bar']);
    const fill = el('div', ['p3d-sc-bar-fill']);
    fill.style.setProperty('--p3d-fill', s.fill);
    bar.appendChild(fill);
    card.appendChild(bar);

    vp.appendChild(card);
  });

  // ── Controls ──
  const controls = el('div', ['p3d-controls']);
  hero.appendChild(controls);

  const flipHint = el('div', ['p3d-flip-hint']);
  flipHint.appendChild(svgCtrl('0 0 24 24', 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15'));
  flipHint.appendChild(document.createTextNode(' Drag to rotate · Scroll to zoom'));
  controls.appendChild(flipHint);

  const ctrlRow = el('div', ['p3d-ctrl-row']);
  const zoomOut = el('button', ['p3d-ctrl-btn']);
  zoomOut.textContent = '−';
  zoomOut.dataset.action = 'zoomOut';
  const zoomLabel = txt('span', ['p3d-zoom-label'], '100%');
  zoomLabel.dataset.role = 'zoomLabel';
  const zoomIn = el('button', ['p3d-ctrl-btn']);
  zoomIn.textContent = '+';
  zoomIn.dataset.action = 'zoomIn';
  const flipBtn = el('button', ['p3d-ctrl-btn']);
  flipBtn.textContent = '⟳';
  flipBtn.style.marginLeft = '8px';
  flipBtn.dataset.action = 'flip';
  const resetBtn = el('button', ['p3d-ctrl-btn']);
  resetBtn.textContent = '↺';
  resetBtn.dataset.action = 'reset';
  [zoomOut, zoomLabel, zoomIn, flipBtn, resetBtn].forEach((n) => ctrlRow.appendChild(n));
  controls.appendChild(ctrlRow);

  const chipDefs = [
    { spec: 'display', svg: 'M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2z', label: 'Display' },
    { spec: 'chip', svg: 'M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4', label: 'Titan X1' },
    { spec: '5g', svg: 'M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01', label: '5G Ultra+' },
    { spec: 'battery', svg: 'M23 7h-1V5a1 1 0 00-1-1H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1v-2h1a1 1 0 000-2v-6a1 1 0 000-2z', label: 'Battery' },
    { spec: 'main-cam', svg: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 13m-3 0a3 3 0 106 0 3 3 0 00-6 0', label: '200MP Camera' },
    { spec: 'build', svg: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Titanium' },
  ];

  const chips = el('div', ['p3d-ctrl-chips']);
  chipDefs.forEach(({ spec, svg, label }) => {
    const chip = el('div', ['p3d-ctrl-chip']);
    chip.dataset.spec = spec;
    chip.appendChild(svgCtrl('0 0 24 24', svg));
    chip.appendChild(document.createTextNode(label));
    chips.appendChild(chip);
  });
  controls.appendChild(chips);

  const ctaRow = el('div', ['p3d-cta-row']);
  const btnPrimary = el('button', ['p3d-btn-primary']);
  btnPrimary.textContent = cfg['cta-primary'] || 'Pre-Order Now';
  if (cfg['cta-primary-href']) {
    btnPrimary.addEventListener('click', () => { window.location.href = cfg['cta-primary-href']; });
  }
  const btnGhost = el('button', ['p3d-btn-ghost']);
  btnGhost.textContent = cfg['cta-secondary'] || 'Explore Plans';
  if (cfg['cta-secondary-href']) {
    btnGhost.addEventListener('click', () => { window.location.href = cfg['cta-secondary-href']; });
  }
  ctaRow.appendChild(btnPrimary);
  ctaRow.appendChild(btnGhost);
  controls.appendChild(ctaRow);

  // ── Face indicator ──
  const faceInd = el('div', ['p3d-face-indicator']);
  const dotFront = el('div', ['p3d-fi-dot', 'active']);
  dotFront.dataset.face = 'front';
  const fiLabel = txt('div', ['p3d-fi-label'], 'Front');
  const dotBack = el('div', ['p3d-fi-dot']);
  dotBack.dataset.face = 'back';
  faceInd.appendChild(dotFront);
  faceInd.appendChild(fiLabel);
  faceInd.appendChild(dotBack);
  root.appendChild(faceInd);

  return {
    vp, phone, faceInd, fiLabel, notif,
  };
}

// ── Interactivity ────────────────────────────────────────────────────────────

function initInteractivity(root, refs) {
  const { vp, phone, faceInd, fiLabel, notif } = refs;

  const FRONT_SPECS = ['display', 'chip', '5g', 'battery'];
  const BACK_SPECS = ['main-cam', 'ultra-cam', 'tele-cam', 'lidar', 'build'];

  let rotY = 0;
  let rotX = 0;
  let zoom = 1;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let momentum = { x: 0, y: 0 };
  let animFrame;

  const zoomLabel = root.querySelector('[data-role="zoomLabel"]');

  function isFrontFacing() {
    const y = ((rotY % 360) + 360) % 360;
    return y < 90 || y > 270;
  }

  function updateTransform() {
    phone.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`;
    const front = isFrontFacing();
    const dots = faceInd.querySelectorAll('.p3d-fi-dot');
    dots[0].classList.toggle('active', front);
    dots[1].classList.toggle('active', !front);
    fiLabel.textContent = front ? 'Front' : 'Back';
    updateVisibleSpecs(front);
  }

  function updateVisibleSpecs(front) {
    root.querySelectorAll('.p3d-spec-card').forEach((c) => {
      const id = c.dataset.specId;
      if (c.classList.contains('show')) {
        if ((front && BACK_SPECS.includes(id)) || (!front && FRONT_SPECS.includes(id))) {
          c.classList.remove('show');
        }
      }
    });
    root.querySelectorAll('.p3d-ctrl-chip').forEach((ch) => {
      const spec = ch.dataset.spec;
      ch.style.display = (front ? FRONT_SPECS : BACK_SPECS).includes(spec) ? '' : 'none';
    });
  }

  // Drag
  vp.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.p3d-spec-card') || e.target.closest('.p3d-ctrl-btn') || e.target.closest('.p3d-ctrl-chip') || e.target.closest('button')) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    momentum = { x: 0, y: 0 };
    cancelAnimationFrame(animFrame);
    vp.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    rotY += dx * 0.5;
    rotX -= dy * 0.3;
    rotX = Math.max(-40, Math.min(40, rotX));
    momentum = { x: dx * 0.5, y: -dy * 0.3 };
    lastX = e.clientX;
    lastY = e.clientY;
    updateTransform();
  });

  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    vp.style.cursor = 'grab';
    function glide() {
      if (Math.abs(momentum.x) < 0.1 && Math.abs(momentum.y) < 0.1) return;
      momentum.x *= 0.92;
      momentum.y *= 0.92;
      rotY += momentum.x;
      rotX += momentum.y;
      rotX = Math.max(-40, Math.min(40, rotX));
      updateTransform();
      animFrame = requestAnimationFrame(glide);
    }
    glide();
  });

  // Scroll zoom
  vp.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom += e.deltaY * -0.001;
    zoom = Math.max(0.5, Math.min(2.2, zoom));
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    updateTransform();
  }, { passive: false });

  // Touch pinch zoom
  let touchDist = 0;
  vp.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      touchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  });
  vp.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      zoom *= d / touchDist;
      zoom = Math.max(0.5, Math.min(2.2, zoom));
      touchDist = d;
      if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
      updateTransform();
    }
  });

  // Button controls
  root.querySelector('[data-action="zoomIn"]').addEventListener('click', () => {
    zoom = Math.min(2.2, zoom + 0.15);
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    updateTransform();
  });

  root.querySelector('[data-action="zoomOut"]').addEventListener('click', () => {
    zoom = Math.max(0.5, zoom - 0.15);
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    updateTransform();
  });

  root.querySelector('[data-action="flip"]').addEventListener('click', () => {
    cancelAnimationFrame(animFrame);
    rotY = isFrontFacing() ? 180 : 0;
    rotX = 0;
    phone.style.transition = 'transform .7s cubic-bezier(.23,1,.32,1)';
    updateTransform();
    setTimeout(() => { phone.style.transition = 'transform .08s linear'; }, 700);
  });

  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    cancelAnimationFrame(animFrame);
    rotY = 0; rotX = 0; zoom = 1;
    if (zoomLabel) zoomLabel.textContent = '100%';
    phone.style.transition = 'transform .6s cubic-bezier(.23,1,.32,1)';
    updateTransform();
    root.querySelectorAll('.p3d-spec-card').forEach((c) => c.classList.remove('show'));
    root.querySelectorAll('.p3d-ctrl-chip').forEach((c) => c.classList.remove('active'));
    setTimeout(() => { phone.style.transition = 'transform .08s linear'; }, 600);
  });

  // Face indicator dots
  faceInd.querySelectorAll('.p3d-fi-dot').forEach((d) => {
    d.addEventListener('click', () => {
      cancelAnimationFrame(animFrame);
      rotY = d.dataset.face === 'front' ? 0 : 180;
      rotX = 0;
      phone.style.transition = 'transform .7s cubic-bezier(.23,1,.32,1)';
      updateTransform();
      setTimeout(() => { phone.style.transition = 'transform .08s linear'; }, 700);
    });
  });

  // Spec chips
  let activeSpec = null;
  function showSpec(id) {
    root.querySelectorAll('.p3d-spec-card').forEach((c) => c.classList.remove('show'));
    root.querySelectorAll('.p3d-ctrl-chip').forEach((c) => c.classList.remove('active'));
    if (activeSpec === id) { activeSpec = null; return; }
    activeSpec = id;
    const card = root.querySelector(`.p3d-spec-card[data-spec-id="${id}"]`);
    const chip = root.querySelector(`.p3d-ctrl-chip[data-spec="${id}"]`);
    if (card) card.classList.add('show');
    if (chip) chip.classList.add('active');

    const isFront = FRONT_SPECS.includes(id);
    const needsFlip = (isFront && !isFrontFacing()) || (!isFront && isFrontFacing());
    if (needsFlip) {
      cancelAnimationFrame(animFrame);
      rotY = isFront ? 0 : 180;
      rotX = 0;
      phone.style.transition = 'transform .7s cubic-bezier(.23,1,.32,1)';
      updateTransform();
      setTimeout(() => { phone.style.transition = 'transform .08s linear'; }, 700);
    }
  }

  root.querySelectorAll('.p3d-ctrl-chip').forEach((ch) => {
    ch.addEventListener('click', () => showSpec(ch.dataset.spec));
  });

  vp.addEventListener('click', (e) => {
    if (!e.target.closest('.p3d-spec-card') && !e.target.closest('.p3d-ctrl-chip') && !dragging) {
      if (Math.abs(momentum.x) < 1 && Math.abs(momentum.y) < 1) {
        root.querySelectorAll('.p3d-spec-card').forEach((c) => c.classList.remove('show'));
        root.querySelectorAll('.p3d-ctrl-chip').forEach((c) => c.classList.remove('active'));
        activeSpec = null;
      }
    }
  });

  // Init
  updateTransform();

  // Clock
  function tick() {
    const d = new Date();
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    h = h > 12 ? h - 12 : h || 12;
    const timeEls = root.querySelectorAll('.p3d-screen-time');
    timeEls.forEach((el2) => { el2.textContent = `${h}:${m}`; });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateEls = root.querySelectorAll('.p3d-screen-date');
    dateEls.forEach((el2) => { el2.textContent = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`; });
  }
  tick();
  setInterval(tick, 15000);

  // Notification
  setTimeout(() => { notif.classList.add('show'); }, 2000);

  // Particles
  const pc = root.querySelector('.p3d-particles');
  if (pc) {
    for (let i = 0; i < 30; i++) {
      const p = el('div', ['p3d-particle']);
      p.style.left = `${Math.random() * 100}%`;
      const s = 1 + Math.random() * 2;
      p.style.width = `${s}px`;
      p.style.height = `${s}px`;
      p.style.background = Math.random() > 0.5 ? 'var(--p3d-purple-light)' : 'var(--p3d-cyan)';
      p.style.animationDuration = `${10 + Math.random() * 16}s`;
      p.style.animationDelay = `${Math.random() * 12}s`;
      pc.appendChild(p);
    }
  }

  // Live speed counter
  setInterval(() => {
    root.querySelectorAll('[data-live-speed]').forEach((el2) => {
      el2.textContent = `${(2.0 + Math.random() * 1.2).toFixed(1)} Gbps`;
    });
  }, 3000);

  // Auto demo cycle
  const demoSequence = ['display', 'chip', '5g', 'main-cam', 'ultra-cam', 'build'];
  let demoIdx = 0;
  let demoTimer = null;

  function runDemo() {
    demoTimer = setInterval(() => {
      showSpec(demoSequence[demoIdx]);
      demoIdx = (demoIdx + 1) % demoSequence.length;
    }, 3200);
  }

  setTimeout(runDemo, 2800);

  vp.addEventListener('pointerdown', () => {
    if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
  });
}

// ── Block entry point ────────────────────────────────────────────────────────

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const refs = buildBlock(block, cfg);
  initInteractivity(block, refs);
}

(() => {
  const key = "shredly-site-theme";
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-toggle]");
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  function updateButton() {
    if (!button) return;
    const dark = currentTheme() === "dark";
    button.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
    button.setAttribute("title", `Switch to ${dark ? "light" : "dark"} mode`);
    button.setAttribute("aria-pressed", String(dark));
  }

  button?.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(key, next); } catch (_) { /* Browsing stays usable. */ }
    updateButton();
  });

  media.addEventListener?.("change", updateButton);
  updateButton();
})();

// Short paper strips emerge only while the page moves into the shredder mouth.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'shred-particles';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return;
  header.append(canvas);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colorMode = window.matchMedia('(prefers-color-scheme: dark)');
  const height = 112;
  let width = 0;
  let previousScroll = Math.max(0, window.scrollY);
  let pending = 0;
  let frame = 0;
  let lastTime = 0;
  let strips = [];
  let colors = [];

  function updateColors() {
    const style = getComputedStyle(document.documentElement);
    colors = ['#efe6d5', '--orange', '--green', '--orange-soft'].map(color =>
      color.startsWith('--') ? style.getPropertyValue(color).trim() : color
    );
  }

  function resize() {
    width = header.clientWidth;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    pending = 0;
    strips = [];
    context.clearRect(0, 0, width, height);
  }

  function draw(time) {
    frame = 0;
    const step = Math.min((time - lastTime) / 1000 || 1 / 60, 0.032);
    lastTime = time;
    const count = Math.min(Math.floor(pending), 10, 120 - strips.length);
    pending -= count;
    for (let i = 0; i < count; i++) {
      strips.push({
        x: 24 + Math.random() * Math.max(0, width - 48), y: -8,
        vx: (Math.random() - 0.5) * 32, vy: 35 + Math.random() * 35,
        width: 2 + Math.random() * 3, length: 8 + Math.random() * 12,
        angle: (Math.random() - 0.5) * 0.5,
        spin: (Math.random() - 0.5) * 3,
        age: 0, life: 0.65 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    context.clearRect(0, 0, width, height);
    strips = strips.filter(strip => strip.age < strip.life && strip.y < height);
    for (const strip of strips) {
      strip.age += step;
      strip.vy += 95 * step;
      strip.x += strip.vx * step;
      strip.y += strip.vy * step;
      strip.angle += strip.spin * step;
      context.save();
      context.translate(strip.x, strip.y);
      context.rotate(strip.angle);
      context.globalAlpha = 0.85 * Math.max(0, Math.min(1, (strip.life - strip.age) / 0.3));
      context.fillStyle = strip.color;
      context.fillRect(-strip.width / 2, 0, strip.width, strip.length);
      context.restore();
    }
    if (strips.length || pending >= 1) frame = requestAnimationFrame(draw);
    else context.clearRect(0, 0, width, height);
  }

  window.addEventListener('scroll', () => {
    const current = Math.max(0, window.scrollY);
    const distance = current - previousScroll;
    previousScroll = current;
    if (reducedMotion.matches || document.hidden) return;
    if (distance <= 0) { pending = 0; return; }
    pending = Math.min(48, pending + Math.min(distance, 180) / 6);
    if (!frame && pending >= 1) {
      lastTime = performance.now();
      frame = requestAnimationFrame(draw);
    }
  }, { passive: true });

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    previousScroll = Math.max(0, window.scrollY);
    if (document.hidden) stop();
  });
  reducedMotion.addEventListener('change', stop);
  colorMode.addEventListener('change', updateColors);
  new MutationObserver(updateColors).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme']
  });
  resize();
  updateColors();
})();

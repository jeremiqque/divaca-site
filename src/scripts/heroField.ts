// Hero background: a field of plain characters that drifts like slow weather.
// The pointer pulls it denser and brighter, and a click sends a ring through it.
const RAMP = [' ', '-', '+', '=', '*', '#'];
const CELL_W = 15;
const CELL_H = 19;

let stopPrev: (() => void) | null = null;

export function initHeroField() {
  stopPrev?.();
  stopPrev = null;
  const canvas = document.getElementById('hero-field') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const section = canvas.parentElement as HTMLElement;

  let w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
  let px = -9999, py = -9999, tx = -9999, ty = -9999, hover = 0;
  const ripples: { x: number; y: number; t0: number }[] = [];
  let raf = 0, visible = true, last = 0, alive = true;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL_W); rows = Math.ceil(h / CELL_H);
    ctx.font = `600 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  };

  const draw = (now: number) => {
    const t = now / 1000;
    ctx.clearRect(0, 0, w, h);
    px += (tx - px) * 0.16; py += (ty - py) * 0.16;
    const live = ripples.filter((r) => t - r.t0 < 1.6);
    ripples.length = 0; ripples.push(...live);

    // bucket cells by (level, hot) so we change fillStyle a handful of times, not thousands
    const buckets = new Map<string, number[]>();
    for (let j = 0; j < rows; j++) {
      const y = j * CELL_H + CELL_H / 2;
      const fall = 1 - 0.75 * Math.min(1, y / h); // fade toward the chips at the bottom
      for (let i = 0; i < cols; i++) {
        const x = i * CELL_W + CELL_W / 2;
        const wv = Math.sin(x * 0.011 + t * 0.55) + Math.sin(y * 0.016 - t * 0.42) + Math.sin((x + y) * 0.007 + t * 0.28) + Math.sin(x * 0.004 - y * 0.006 + t * 0.2);
        let v = ((wv + 4) / 8) ** 2.2 * fall * 1.7;
        let hot = 0;
        if (hover > 0.01) {
          const dx = x - px, dy = y - py;
          const g = Math.exp(-(dx * dx + dy * dy) / (2 * 120 * 120)) * hover;
          v += g * 1.2; hot = g;
        }
        for (const r of ripples) {
          const age = t - r.t0, dx = x - r.x, dy = y - r.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const ring = Math.exp(-((d - age * 520) ** 2) / (2 * 34 * 34)) * (1 - age / 1.6);
          v += ring * 1.3; hot = Math.max(hot, ring);
        }
        const lvl = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
        if (lvl <= 0) continue;
        const key = `${lvl}|${hot > 0.35 ? 2 : hot > 0.08 ? 1 : 0}`;
        let b = buckets.get(key);
        if (!b) buckets.set(key, (b = []));
        b.push(x, y);
      }
    }
    buckets.forEach((pts, key) => {
      const [l, hh] = key.split('|').map(Number);
      const a = 0.1 + l * 0.055;
      ctx.fillStyle = hh === 2 ? `rgba(31,138,79,${Math.min(0.95, a + 0.45)})` : hh === 1 ? `rgba(31,138,79,${a + 0.2})` : `rgba(16,94,52,${a})`;
      const ch = RAMP[l];
      for (let n = 0; n < pts.length; n += 2) ctx.fillText(ch, pts[n], pts[n + 1]);
    });
  };

  const frame = (now: number) => {
    if (!alive || !canvas.isConnected) return;
    raf = requestAnimationFrame(frame);
    if (!visible || now - last < 40) return; // about 25 fps is plenty and kind to laptops
    last = now;
    hover += ((tx > -9000 ? 1 : 0) - hover) * 0.1;
    draw(now);
  };

  size();
  const ro = new ResizeObserver(() => { size(); if (reduce) draw(performance.now()); });
  ro.observe(canvas);

  if (reduce) {
    draw(2000); // one calm still frame
  } else {
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 });
    io.observe(section);
    if (fine) {
      const rel = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
      section.addEventListener('pointermove', (e) => { const [x, y] = rel(e); if (tx < -9000) { px = x; py = y; } tx = x; ty = y; });
      section.addEventListener('pointerleave', () => { tx = ty = -9999; });
      section.addEventListener('pointerdown', (e) => {
        if ((e.target as Element).closest('a,button,.chip')) return;
        const [x, y] = rel(e); ripples.push({ x, y, t0: performance.now() / 1000 });
      });
    }
    raf = requestAnimationFrame(frame);
  }

  stopPrev = () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); };
}

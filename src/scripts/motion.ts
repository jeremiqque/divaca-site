import { initHeroField } from './heroField';
// Scroll reveals + page-load progress. No libraries; runs once, re-arms on every page view.
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let io: IntersectionObserver | null = null;
let group = new Map<Element, HTMLElement[]>();

function tagSections() {
  const sections = document.querySelectorAll<HTMLElement>('main > section, main > div > section');
  sections.forEach((section, si) => {
    if (si === 0 && section.querySelector('h1')) return; // hero animates on load instead
    const root = section.querySelector<HTMLElement>(':scope > .wrap') ?? section;
    const items: HTMLElement[] = [];
    const collect = (el: HTMLElement) => {
      if (el.hasAttribute('aria-hidden') || el.hasAttribute('data-reveal')) return;
      if (['SCRIPT', 'STYLE'].includes(el.tagName)) return;
      const cs = getComputedStyle(el);
      if (cs.position === 'absolute' || cs.display === 'none') return;
      if (cs.display === 'contents') { Array.from(el.children).forEach((c) => c instanceof HTMLElement && collect(c)); return; }
      const isList = el.matches('ul, ol, .grid') && el.children.length > 2 && !el.matches('.surface-card');
      if (isList) Array.from(el.children).forEach((c) => c instanceof HTMLElement && collect(c));
      else items.push(el);
    };
    Array.from(root.children).forEach((c) => c instanceof HTMLElement && collect(c));
    // Stagger siblings that share a parent, capped so late items never lag
    const seen = new Map<Element, number>();
    items.forEach((el) => {
      const p = el.parentElement!;
      const n = seen.get(p) ?? 0;
      seen.set(p, n + 1);
      el.setAttribute('data-reveal', 'up');
      el.style.setProperty('--i', String(Math.min(n, 5)));
    });
  });
}

// Illustration scenes only run while on screen
let sceneIo: IntersectionObserver | null = null;
function armScenes() {
  sceneIo?.disconnect();
  if (reduce() || !('IntersectionObserver' in window)) return;
  sceneIo = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('live', e.isIntersecting)), { threshold: 0.25 });
  document.querySelectorAll('.scene').forEach((el) => sceneIo!.observe(el));
}

function arm() {
  if (reduce()) document.querySelectorAll('svg').forEach((v) => (v as SVGSVGElement).pauseAnimations?.());
  io?.disconnect();
  armScenes();
  initHeroField();
  if (reduce() || !('IntersectionObserver' in window)) return;
  tagSections();
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io!.unobserve(e.target);
      (group.get(e.target) ?? []).forEach((el) => {
        el.classList.add('in');
        // After it has played, drop the attribute so hover transitions are not delayed
        window.setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('in'); el.style.removeProperty('--i'); }, 1600);
      });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // A clipped element has no visible area, so watch its parent instead
  const watch = new Map<Element, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const target = el.dataset.reveal === 'wipe' ? el.parentElement! : el;
    watch.set(target, [...(watch.get(target) ?? []), el]);
  });
  group = watch;
  watch.forEach((_, t) => io!.observe(t));
}

// Progress line during navigation
function bar() {
  let el = document.getElementById('nav-progress');
  if (!el) { el = document.createElement('div'); el.id = 'nav-progress'; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el); }
  return el;
}
document.addEventListener('astro:before-preparation', () => {
  const el = bar(); el.className = ''; void el.offsetWidth; el.className = 'run';
});
document.addEventListener('astro:page-load', () => {
  const el = bar(); if (el.className === 'run') el.className = 'done';
  arm();
});
document.addEventListener('astro:after-swap', () => { document.documentElement.classList.add('js'); });
arm();

// Pointer effects: dot glow in the hero, parallax on illustration panels. Fine pointers only.
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('pointermove', (e) => {
    if (reduce()) return;
    const t = e.target as Element | null;
    const tilt = t?.closest<HTMLElement>('[data-tilt]');
    if (tilt) {
      const r = tilt.getBoundingClientRect();
      tilt.style.setProperty('--mx', String(((e.clientX - r.left) / r.width - 0.5) * 2));
      tilt.style.setProperty('--my', String(((e.clientY - r.top) / r.height - 0.5) * 2));
    }
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-tilt]');
    if (el && !el.contains(e.relatedTarget as Node | null)) { el.style.removeProperty('--mx'); el.style.removeProperty('--my'); }
  });
}

// Hero chips: drag them around. Position is kept where you drop it.
let drag: { chip: HTMLElement; inner: HTMLElement; sx: number; sy: number; ox: number; oy: number; id: number } | null = null;
document.addEventListener('pointerdown', (e) => {
  const chip = (e.target as Element | null)?.closest<HTMLElement>('.chip');
  const inner = chip?.querySelector<HTMLElement>('.chip-in');
  if (!chip || !inner || e.button !== 0) return;
  drag = { chip, inner, sx: e.clientX, sy: e.clientY, ox: parseFloat(inner.style.getPropertyValue('--dx')) || 0, oy: parseFloat(inner.style.getPropertyValue('--dy')) || 0, id: e.pointerId };
  chip.classList.add('drag');
  inner.setPointerCapture?.(e.pointerId);
  e.preventDefault();
});
document.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  drag.inner.style.setProperty('--dx', `${drag.ox + e.clientX - drag.sx}px`);
  drag.inner.style.setProperty('--dy', `${drag.oy + e.clientY - drag.sy}px`);
});
const endDrag = () => { drag?.chip.classList.remove('drag'); drag = null; };
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);

import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { ArrowRight, Bell, CaretDown, Code, GameController, Heartbeat, List, Rocket, X } from '@phosphor-icons/react';
import { products } from '@/lib/products';

const icons: Record<string, typeof Bell> = { 'campus-update': Bell, 'divaca-tech': Code, 'divaca-health': Heartbeat, playsphere: GameController, 'innovative-hub': Rocket };
const links = [
  { label: 'About', href: '/about' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ pathname: initial = '/' }: { pathname?: string }) {
  const [pathname, setPathname] = useState(initial);
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The nav stays mounted between pages (view transitions), so follow the URL ourselves
  useEffect(() => {
    const onPage = () => { setPathname(window.location.pathname); setMenu(false); setMobile(false); };
    document.addEventListener('astro:page-load', onPage);
    return () => document.removeEventListener('astro:page-load', onPage);
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = mobile ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [mobile]);

  useEffect(() => {
    if (!menu && !mobile) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); setMobile(false); } };
    const onClick = (e: MouseEvent) => { if (menu && box.current && !box.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [menu, mobile]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const link = 'relative flex h-9 transition-colors items-center px-4 text-sm font-semibold text-ink/75 hover:text-green aria-[current=page]:bg-white aria-[current=page]:text-green aria-[current=page]:shadow-field';

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-6">
     <div className={'wrap !px-0 border border-line bg-white/95 transition-shadow ' + (scrolled ? 'shadow-deep' : 'shadow-nav')}>
      <div className="grid h-14 grid-cols-[1fr_auto] items-center px-4 md:grid-cols-[1fr_auto_1fr] md:pl-5 md:pr-2">
        <a href="/" aria-label="Divaca, home" className="text-xl font-extrabold tracking-[0.2em] text-green">DIVACA</a>

        <nav className="hidden items-center gap-1 border border-line bg-paper p-1 md:flex" aria-label="Main">
          <div ref={box} className="relative">
            <button type="button" aria-expanded={menu} aria-controls="products-menu" onClick={() => setMenu(!menu)}
              aria-current={active('/products') ? 'page' : undefined} className={link + ' gap-1.5'}>
              Products <CaretDown size={12} weight="bold" className={'transition-transform ' + (menu ? 'rotate-180' : '')} />
            </button>
            {(
              <div id="products-menu" inert={!menu} data-open={menu}
                className={'absolute left-1/2 top-[calc(100%+22px)] w-[34rem] -translate-x-1/2 border border-line bg-white p-2 shadow-deep transition-[opacity,transform,visibility] duration-200 ease-out ' + (menu ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1.5 opacity-0')}>
                <ul className="grid grid-cols-2 gap-1">
                  {products.map((p) => {
                    const I = icons[p.slug] ?? Rocket;
                    return (
                      <li key={p.slug}>
                        <a href={`/products/${p.slug}`} onClick={() => setMenu(false)} className="group flex gap-3 p-3 transition-colors hover:bg-mist/70">
                          <span className="grid size-9 shrink-0 place-items-center bg-mist text-green transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"><I size={18} weight="duotone" /></span>
                          <span className="text-sm leading-snug"><b className="block font-semibold">{p.name}</b><span className="text-muted">{p.category}</span></span>
                        </a>
                      </li>
                    );
                  })}
                  <li>
                    <a href="/products" onClick={() => setMenu(false)} className="group flex h-full items-center justify-between bg-ink p-3 text-sm font-semibold text-white transition-colors hover:bg-green-deep">
                      All products <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {links.map((n) => (
            <a key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined} className={link}>{n.label}</a>
          ))}
        </nav>

        <div className="hidden justify-self-end md:block">
          <a href="/partners#enquiry" className="btn group inline-flex items-center gap-3 bg-ink py-1 pr-1 pl-4 text-sm font-semibold text-white shadow-btn hover:bg-green-deep">
            Partner with us
            <span className="grid size-8 place-items-center bg-pistachio text-ink"><ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" /></span>
          </a>
        </div>

        <button type="button" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} aria-controls="mobile-menu"
          onClick={() => setMobile(!mobile)}
          className="burger btn grid size-10 place-items-center justify-self-end gap-1 rounded border border-line bg-white shadow-field md:hidden">
          <span className="grid gap-1" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>

      <nav id="mobile-menu" aria-label="Mobile" data-open={mobile} inert={!mobile} className="menu-panel md:hidden">
        <div>
          <div className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-line px-4 pb-5 pt-5">
            <p className="menu-item label text-green" style={{ '--i': 0 } as React.CSSProperties}>Products</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {products.map((p, i) => {
                const I = icons[p.slug] ?? Rocket;
                return (
                  <li key={p.slug} className="menu-item" style={{ '--i': i + 1 } as React.CSSProperties}>
                    <a href={`/products/${p.slug}`} onClick={() => setMobile(false)}
                      className="flex h-full flex-col gap-3 border border-line bg-[linear-gradient(180deg,#ffffff,#f4f8f1)] p-3 shadow-card transition-transform active:scale-[0.98]">
                      <span className="grid size-9 place-items-center bg-mist text-green"><I size={18} weight="duotone" /></span>
                      <span className="text-[0.95rem] font-semibold leading-tight">{p.name}</span>
                    </a>
                  </li>
                );
              })}
              <li className="menu-item" style={{ '--i': products.length + 1 } as React.CSSProperties}>
                <a href="/products" onClick={() => setMobile(false)} className="flex h-full min-h-[5.5rem] items-end justify-between bg-ink p-3 text-[0.95rem] font-semibold text-white transition-transform active:scale-[0.98]">
                  All products <ArrowRight size={16} weight="bold" />
                </a>
              </li>
            </ul>

            <ul className="mt-5 border-t border-line">
              {links.map((n, i) => (
                <li key={n.href} className="menu-item" style={{ '--i': products.length + 2 + i } as React.CSSProperties}>
                  <a href={n.href} onClick={() => setMobile(false)} aria-current={active(n.href) ? 'page' : undefined}
                    className="flex items-center justify-between border-b border-line py-4 text-lg font-semibold aria-[current=page]:text-green">
                    {n.label}<ArrowRight size={16} weight="bold" className="text-green" />
                  </a>
                </li>
              ))}
            </ul>

            <a href="/partners#enquiry" onClick={() => setMobile(false)}
              className="menu-item btn mt-5 flex h-12 items-center justify-between bg-ink py-1 pr-1 pl-5 font-semibold text-white shadow-btn"
              style={{ '--i': products.length + 2 + links.length } as React.CSSProperties}>
              Partner with us
              <span className="grid size-10 place-items-center bg-pistachio text-ink"><ArrowRight size={16} weight="bold" /></span>
            </a>
          </div>
        </div>
      </nav>
     </div>
    </header>
  );
}

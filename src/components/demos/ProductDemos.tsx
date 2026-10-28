import { useEffect, useRef, useState } from 'react';
import type { ComponentType, KeyboardEvent } from 'react';
import { ArrowCounterClockwise, Bell, Browser, Check, Code, DeviceMobile, GameController, Heartbeat, IdentificationCard, Rocket, SealCheck, Stethoscope, Trophy, WifiHigh, WifiSlash } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------
   Small working demos. Everything here is sample data held in memory:
   nothing is sent or saved. They show how each product behaves.
   ------------------------------------------------------------------ */

const chip = 'inline-flex h-9 items-center gap-1.5 rounded border px-3 text-sm font-semibold transition-[background-color,color,border-color,translate,box-shadow] duration-200 active:translate-y-px';
const chipOff = 'border-line bg-white text-ink shadow-field hover:border-ink/40';
const chipOn = 'border-green bg-green text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]';
const panel = 'border border-line bg-white shadow-card';

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200', on ? 'border-green bg-green' : 'border-ink/25 bg-white shadow-field')}>
      <span className={cn('absolute left-0.5 top-0.5 size-4 rounded-full shadow transition-transform duration-200', on ? 'translate-x-5 bg-white' : 'translate-x-0 bg-ink/50')} />
    </button>
  );
}

/* ---------------------------- Campus Update ---------------------------- */
type NoticeType = 'official' | 'alert' | 'event';
const notices: { id: number; type: NoticeType; title: string; by: string; to: string; when: string }[] = [
  { id: 1, type: 'official', title: 'Exam timetable released', by: 'The registry', to: 'All 200 level students', when: 'Today' },
  { id: 2, type: 'alert', title: 'Lecture moved to 2pm', by: 'Department admin', to: 'Computer Science, 300 level', when: '10 min ago' },
  { id: 3, type: 'event', title: 'Course registration closes Friday', by: 'Academic office', to: 'All students', when: 'Yesterday' },
  { id: 4, type: 'official', title: 'Library hours extended', by: 'The library', to: 'Whole school', when: 'Monday' },
];
const typeLabel: Record<NoticeType, string> = { official: 'Official', alert: 'Alert', event: 'Calendar' };

function CampusDemo() {
  const [filter, setFilter] = useState<'all' | NoticeType>('all');
  const [open, setOpen] = useState<number | null>(2);
  const [toast, setToast] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const shown = notices.filter((n) => filter === 'all' || n.type === filter);
  const preview = () => { setToast(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(false), 3400); };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className={cn(panel, 'relative overflow-hidden')}>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="flex items-center gap-2 font-semibold"><span className="grid size-7 place-items-center bg-green text-white"><Bell size={15} weight="fill" /></span>Campus Update</span>
          <span className="text-xs text-muted">{shown.length} {shown.length === 1 ? 'notice' : 'notices'}</span>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-line bg-paper/60 px-4 py-3" role="group" aria-label="Filter notices">
          {(['all', 'official', 'alert', 'event'] as const).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={cn(chip, 'h-8 px-2.5 text-[0.8125rem]', filter === f ? chipOn : chipOff)}>
              {f === 'all' ? 'All' : typeLabel[f] + (f === 'alert' ? 's' : '')}
            </button>
          ))}
        </div>
        <ul>
          {shown.map((n) => {
            const isOpen = open === n.id;
            return (
              <li key={n.id} className="border-b border-line last:border-b-0">
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : n.id)} className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-mist/40">
                  <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center', n.type === 'alert' ? 'bg-green text-white' : 'bg-mist text-green')}>
                    {n.type === 'official' ? <SealCheck size={15} weight="fill" /> : n.type === 'alert' ? <Bell size={15} weight="fill" /> : <Check size={15} weight="bold" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] font-semibold leading-snug">{n.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{typeLabel[n.type]} · {n.when}</span>
                    <span className={cn('grid transition-[grid-template-rows] duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                      <span className="overflow-hidden">
                        <span className="mt-2.5 block border-l-2 border-green/40 pl-3 text-[0.8125rem] leading-relaxed text-muted">
                          <b className="font-semibold text-ink">Published by:</b> {n.by}<br />
                          <b className="font-semibold text-ink">Sent to:</b> {n.to}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {toast && (
          <div role="status" className="absolute inset-x-3 top-3 z-10 flex animate-[pop-in_0.3s_var(--ease-out)] items-center gap-3 border border-line bg-white p-3 shadow-deep">
            <span className="grid size-8 place-items-center bg-green text-white"><Bell size={16} weight="fill" /></span>
            <span className="text-sm leading-tight"><b className="block">Campus Update</b>Lecture moved to 2pm</span>
          </div>
        )}
      </div>
      <button type="button" onClick={preview} className={cn(chip, chipOff, 'mx-auto mt-4 flex')}><Bell size={14} weight="bold" /> Preview a phone alert</button>
    </div>
  );
}

/* ----------------------------- Divaca Health ---------------------------- */
const visitKinds = ['Check-up', 'Follow-up', 'Lab visit', 'Vaccination'];
function HealthDemo() {
  const [online, setOnline] = useState(true);
  const [visits, setVisits] = useState([{ id: 1, kind: 'Check-up', synced: true }, { id: 2, kind: 'Follow-up', synced: true }]);
  const [msg, setMsg] = useState('');
  const record = () => {
    setVisits((v) => [...v, { id: v.length + 1, kind: visitKinds[v.length % visitKinds.length], synced: online }].slice(-6));
    setMsg(online ? 'Visit recorded and saved.' : 'Visit saved on this device. It will sync when you are back online.');
  };
  const toggle = (on: boolean) => {
    setOnline(on);
    if (on) {
      const n = visits.filter((v) => !v.synced).length;
      setVisits((v) => v.map((x) => ({ ...x, synced: true })));
      setMsg(n ? `Back online. ${n} ${n === 1 ? 'visit' : 'visits'} synced.` : 'Back online.');
    } else setMsg('You are offline. You can keep working.');
  };
  return (
    <div className="mx-auto w-full max-w-md">
      <div className={cn(panel, 'p-4 md:p-5')}>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center bg-green text-white"><IdentificationCard size={24} weight="fill" /></span>
          <div className="flex-1"><p className="font-semibold leading-tight">Sample patient</p><p className="text-xs uppercase tracking-wider text-muted">Health card</p></div>
          <span className={cn('inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold transition-colors', online ? 'border-green/30 bg-mist text-green' : 'border-ink/20 bg-ink text-white')}>
            {online ? <WifiHigh size={13} weight="bold" /> : <WifiSlash size={13} weight="bold" />}{online ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-y border-line py-3">
          <span className="text-sm font-semibold" id="net-label">Connection</span>
          <span className="flex items-center gap-3 text-sm text-muted"><span aria-hidden="true">{online ? 'On' : 'Off'}</span><Switch on={online} onChange={toggle} label="Connection: online" /></span>
        </div>
        <ul className="mt-3 space-y-1.5" aria-label="Visits">
          {visits.map((v) => (
            <li key={v.id} className="flex animate-[pop-in_0.3s_var(--ease-out)] items-center gap-3 bg-paper/70 px-3 py-2 text-sm">
              <Stethoscope size={16} weight="fill" className="shrink-0 text-green" />
              <span className="flex-1 font-semibold">{v.kind}</span>
              <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', v.synced ? 'text-green' : 'text-muted')}>
                {v.synced ? <><Check size={12} weight="bold" /> Synced</> : <><span className="size-1.5 rounded-full bg-ink/50" /> Saved on device</>}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden="true">
          {visits.map((v) => <span key={v.id} className={cn('w-3 origin-bottom animate-[grow-up_0.5s_var(--ease-out)] transition-colors', v.synced ? 'bg-green/70' : 'bg-ink/30')} style={{ height: 12 + ((v.id * 7) % 5) * 6 }} />)}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={record} className={cn(chip, chipOn)}><Stethoscope size={14} weight="bold" /> Record a visit</button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-muted">{msg}</p>
    </div>
  );
}

/* ------------------------------- PlaySphere ------------------------------ */
const teams = ['Lions', 'Eagles', 'Titans', 'Wolves'];
function Team({ name, state, onClick, label }: { name?: string | null; state: 'idle' | 'won' | 'out' | 'empty'; onClick?: () => void; label?: string }) {
  return (
    <button type="button" disabled={!name || !onClick} onClick={onClick} aria-label={name ? label : 'Waiting for a winner'} aria-pressed={state === 'won'}
      className={cn('flex h-10 w-36 items-center justify-between gap-2 rounded border px-3 text-sm font-semibold transition-all duration-300 disabled:cursor-default',
        state === 'won' ? 'border-green bg-green text-white shadow-[0_6px_14px_-6px_rgba(16,94,52,0.6)]' : state === 'out' ? 'border-line bg-white/60 text-muted' : state === 'empty' ? 'border-dashed border-ink/25 bg-white/40 text-muted' : 'border-line bg-white shadow-field hover:border-green hover:text-green')}>
      <span className="truncate">{name ?? 'TBD'}</span>
      {state === 'won' && <Check size={14} weight="bold" />}
    </button>
  );
}
function PlayDemo() {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [champ, setChamp] = useState<string | null>(null);
  const st = (pick: string | null, t: string) => (pick === null ? 'idle' : pick === t ? 'won' : 'out') as 'idle' | 'won' | 'out';
  const pickA = (t: string) => { setA(t); if (champ && champ !== t && champ !== b) setChamp(null); };
  const pickB = (t: string) => { setB(t); if (champ && champ !== t && champ !== a) setChamp(null); };
  const reset = () => { setA(null); setB(null); setChamp(null); };
  const line = 'hidden h-px w-6 bg-green/40 sm:block';
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className={cn(panel, 'p-4 md:p-6')}>
        <p className="mb-4 text-sm text-muted">Pick a winner in each match and watch them move up.</p>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Team name={teams[0]} state={st(a, teams[0])} onClick={() => pickA(teams[0])} label={`Advance ${teams[0]}`} />
              <Team name={teams[1]} state={st(a, teams[1])} onClick={() => pickA(teams[1])} label={`Advance ${teams[1]}`} />
            </div>
            <div className="flex flex-col gap-2">
              <Team name={teams[2]} state={st(b, teams[2])} onClick={() => pickB(teams[2])} label={`Advance ${teams[2]}`} />
              <Team name={teams[3]} state={st(b, teams[3])} onClick={() => pickB(teams[3])} label={`Advance ${teams[3]}`} />
            </div>
          </div>
          <span className={line} />
          <div className="flex flex-col gap-2">
            <Team name={a} state={a && b ? (champ === null ? 'idle' : champ === a ? 'won' : 'out') : a ? 'out' : 'empty'} onClick={a && b ? () => setChamp(a) : undefined} label={`Crown ${a}`} />
            <Team name={b} state={a && b ? (champ === null ? 'idle' : champ === b ? 'won' : 'out') : b ? 'out' : 'empty'} onClick={a && b ? () => setChamp(b) : undefined} label={`Crown ${b}`} />
          </div>
          <span className={line} />
          <div className={cn('grid size-24 place-items-center text-center transition-all duration-500', champ ? 'scale-100 opacity-100' : 'scale-90 opacity-50')}>
            <span className={cn('grid size-14 place-items-center rounded-full border transition-colors duration-500', champ ? 'border-green bg-green text-white shadow-[0_0_0_6px_rgba(34,139,34,0.18)]' : 'border-line bg-white text-green')}><Trophy size={26} weight="fill" /></span>
            <span className="text-xs font-semibold">{champ ?? 'Champion'}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={reset} className={cn(chip, chipOff)}><ArrowCounterClockwise size={14} weight="bold" /> Reset</button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{champ ? `${champ} are the champions.` : ''}</p>
    </div>
  );
}

/* --------------------------- Divaca Innovative Hub ----------------------- */
const roles = ['Product', 'UI/UX design', 'Development', 'Data analysis'];
function HubDemo() {
  const [on, setOn] = useState<string[]>(['Product']);
  const flip = (r: string) => setOn((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));
  const n = on.length;
  return (
    <div className="mx-auto w-full max-w-md">
      <div className={cn(panel, 'p-4 md:p-6')}>
        <p className="text-sm text-muted">Add the roles your project needs.</p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Roles">
          {roles.map((r) => <button key={r} type="button" aria-pressed={on.includes(r)} onClick={() => flip(r)} className={cn(chip, on.includes(r) ? chipOn : chipOff)}>{on.includes(r) && <Check size={13} weight="bold" />}{r}</button>)}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <span className={cn('grid size-16 shrink-0 place-items-center rounded-full border text-white transition-colors duration-500', n === 4 ? 'border-green bg-green shadow-[0_0_0_6px_rgba(34,139,34,0.18)]' : 'border-line bg-ink/80')}><Rocket size={28} weight="fill" /></span>
          <div className="flex-1">
            <p className="text-sm font-semibold">{n === 0 ? 'No team yet' : n === 4 ? 'Full team. Ready to build.' : `${n} of 4 roles`}</p>
            <div className="mt-2 h-2 bg-mist" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={n} aria-label="Team roles filled">
              <div className="h-full origin-left bg-green transition-[width] duration-500" style={{ width: `${(n / 4) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Divaca Tech ------------------------------ */
function TechDemo() {
  const [view, setView] = useState<'web' | 'phone' | 'both'>('both');
  const web = view !== 'phone', phone = view !== 'web';
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className={cn(panel, 'p-4 md:p-6')}>
        <div className="flex justify-center gap-2" role="group" aria-label="Screen">
          {([['web', 'Browser', Browser], ['phone', 'Phone', DeviceMobile], ['both', 'Both', Code]] as const).map(([k, l, I]) => (
            <button key={k} type="button" aria-pressed={view === k} onClick={() => setView(k)} className={cn(chip, view === k ? chipOn : chipOff)}><I size={14} weight="bold" />{l}</button>
          ))}
        </div>
        <div className="mt-6 flex min-h-[170px] items-end justify-center gap-4">
          <div className={cn('w-56 origin-bottom border border-line bg-white shadow-card transition-all duration-500', web ? 'scale-100 opacity-100' : 'hidden')}>
            <div className="flex gap-1 border-b border-line px-2.5 py-1.5"><i className="size-1.5 rounded-full bg-[#cfe3c5]" /><i className="size-1.5 rounded-full bg-[#cfe3c5]" /><i className="size-1.5 rounded-full bg-[#cfe3c5]" /></div>
            <div className="space-y-1.5 p-3"><div className="h-1.5 w-1/2 bg-green/60" /><div className="h-1.5 w-5/6 bg-[#cfe3c5]" /><div className="h-1.5 w-2/3 bg-[#cfe3c5]" /><div className="h-1.5 w-3/4 bg-[#cfe3c5]" /></div>
          </div>
          <div className={cn('h-36 w-20 origin-bottom border border-line bg-white p-2 shadow-card transition-all duration-500', phone ? 'scale-100 opacity-100' : 'hidden')}>
            <div className="mx-auto h-1 w-6 bg-[#cfe3c5]" /><div className="mt-3 h-1.5 bg-[#cfe3c5]" /><div className="mt-1.5 h-1.5 w-2/3 bg-[#cfe3c5]" />
            <div className="mt-3 grid h-10 place-items-center bg-mist text-green"><DeviceMobile size={18} weight="fill" /></div>
          </div>
        </div>
        <p className="mt-5 text-center text-sm font-semibold" role="status" aria-live="polite">{view === 'web' ? 'Software for institutions, in the browser.' : view === 'phone' ? 'Software for institutions, on a phone.' : 'Software for institutions, on every screen.'}</p>
      </div>
    </div>
  );
}

/* ----------------------------------- Shell ---------------------------------- */
type Demo = { slug: string; name: string; icon: ComponentType<{ size?: number; weight?: 'fill' | 'bold' | 'duotone' }>; hint: string; C: ComponentType };
const demos: Demo[] = [
  { slug: 'campus-update', name: 'Campus Update', icon: Bell, hint: 'Filter the notices, open one to see who sent it, then preview a phone alert.', C: CampusDemo },
  { slug: 'divaca-health', name: 'Divaca Health', icon: Heartbeat, hint: 'Go offline and record a visit. It is kept on the device, then synced when you are back.', C: HealthDemo },
  { slug: 'playsphere', name: 'PlaySphere', icon: GameController, hint: 'Run a small tournament. Pick the winner of each match.', C: PlayDemo },
  { slug: 'divaca-innovative-hub', name: 'Innovative Hub', icon: Rocket, hint: 'Build a project team by adding the roles it needs.', C: HubDemo },
  { slug: 'divaca-tech', name: 'Divaca Tech', icon: Code, hint: 'Switch between screens to see one product on web and on phone.', C: TechDemo },
];

export default function ProductDemos({ only }: { only?: string }) {
  const list = only ? demos.filter((d) => d.slug === only) : demos;
  const [active, setActive] = useState(list[0].slug);
  const cur = list.find((d) => d.slug === active) ?? list[0];
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const key = (e: KeyboardEvent, i: number) => {
    const go = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!go) return;
    e.preventDefault();
    const next = list[(i + go + list.length) % list.length];
    setActive(next.slug);
    refs.current[next.slug]?.focus();
  };
  if (!list.length) return null;
  return (
    <div className="overflow-hidden border border-line bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true"><i className="size-2.5 rounded-full bg-ink/15" /><i className="size-2.5 rounded-full bg-ink/15" /><i className="size-2.5 rounded-full bg-ink/15" /></span>
        <span className="text-xs font-semibold text-muted">Sample data. Nothing here is saved.</span>
      </div>
      <div className={only ? '' : 'md:grid md:grid-cols-[220px_1fr]'}>
        {!only && (
          <div role="tablist" aria-label="Divaca products" aria-orientation="vertical" className="flex gap-1 overflow-x-auto border-b border-line bg-paper/60 p-2 md:flex-col md:border-b-0 md:border-r">
            {list.map((d, i) => {
              const I = d.icon;
              const on = d.slug === active;
              return (
                <button key={d.slug} ref={(el) => { refs.current[d.slug] = el; }} type="button" role="tab" id={`tab-${d.slug}`} aria-selected={on} aria-controls={`panel-${d.slug}`} tabIndex={on ? 0 : -1}
                  onClick={() => setActive(d.slug)} onKeyDown={(e) => key(e, i)}
                  className={cn('flex h-11 shrink-0 items-center gap-2.5 rounded px-3 text-sm font-semibold transition-colors duration-200', on ? 'bg-white text-green shadow-field' : 'text-ink/70 hover:bg-white/70 hover:text-green')}>
                  <span className={cn('grid size-6 place-items-center transition-colors', on ? 'bg-green text-white' : 'bg-mist text-green')}><I size={14} weight="fill" /></span>
                  <span className="whitespace-nowrap">{d.name}</span>
                </button>
              );
            })}
          </div>
        )}
        <div role="tabpanel" id={`panel-${cur.slug}`} aria-labelledby={only ? undefined : `tab-${cur.slug}`} aria-label={only ? `${cur.name} demo` : undefined} className="grad-mist relative min-h-[440px] px-4 py-8 md:px-8 md:py-10">
          <div className="relative">
            <p className="mx-auto mb-6 max-w-md text-center text-sm text-ink/75">{cur.hint}</p>
            <div key={cur.slug} className="animate-[pop-in_0.35s_var(--ease-out)]"><cur.C /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { products } from '@/lib/products';

type Kind = 'updates' | 'contact' | 'partner';
type State = 'idle' | 'sending' | 'sent' | 'error';

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

const copy: Record<Kind, { button: string; sent: string; sentText: string }> = {
  updates: { button: 'Send me updates', sent: 'You are on the list.', sentText: 'We will email you when there is news.' },
  contact: { button: 'Send message', sent: 'Message sent.', sentText: 'Thank you. We will reply by email.' },
  partner: { button: 'Send enquiry', sent: 'Enquiry sent.', sentText: 'Thank you. We will reply by email.' },
};

export default function SignupForm({ kind = 'updates', defaultInterest = 'all', bare = false }: { kind?: Kind; defaultInterest?: string; bare?: boolean }) {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const f = (n: string) => `${id}-${n}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company_website) return; // honeypot: bots fill this in
    if (!ENDPOINT) {
      setState('error');
      setError('This form is not connected yet, so your message was not sent. Please try again later.');
      return;
    }
    setState('sending');
    setError('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, form: kind }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      form.reset();
    } catch {
      setState('error');
      setError('Something went wrong and your message was not sent. Please check your connection and try again.');
    }
  }

  if (state === 'sent')
    return (
      <div role="status" className="grad-mist border-l-4 border-green px-6 py-8 shadow-card">
        <p className="text-xl font-bold text-green">{copy[kind].sent}</p>
        <p className="mt-1 text-ink/80">{copy[kind].sentText}</p>
      </div>
    );

  const field = 'grid gap-2';
  const lab = 'text-sm font-semibold';

  return (
    <form ref={formRef} onSubmit={onSubmit} className={bare ? 'grid gap-5' : 'surface-card grid gap-5 p-6 md:p-8'} noValidate={false}>
      <div className={field}>
        <label htmlFor={f('name')} className={lab}>Full name</label>
        <Input id={f('name')} name="name" required autoComplete="name" />
      </div>
      <div className={field}>
        <label htmlFor={f('email')} className={lab}>Email</label>
        <Input id={f('email')} name="email" type="email" required autoComplete="email" />
      </div>

      {kind === 'updates' && (
        <div className={field}>
          <label htmlFor={f('interest')} className={lab}>I am interested in</label>
          <Select id={f('interest')} name="interest" defaultValue={defaultInterest}
            options={[{ value: 'all', label: 'All Divaca products' }, ...products.map((p) => ({ value: p.slug, label: p.name }))]} />
        </div>
      )}
      {kind === 'updates' && defaultInterest === 'campus-update' && (
        <div className={field}>
          <label htmlFor={f('role')} className={lab}>I am a</label>
          <Select id={f('role')} name="role" defaultValue="student"
            options={[{ value: 'student', label: 'Student' }, { value: 'staff', label: 'Staff' }, { value: 'school-admin', label: 'School admin' }]} />
        </div>
      )}
      {kind === 'partner' && (
        <>
          <div className={field}>
            <label htmlFor={f('org')} className={lab}>Organisation <span className="font-normal text-muted">(optional)</span></label>
            <Input id={f('org')} name="organisation" autoComplete="organization" />
          </div>
          <div className={field}>
            <label htmlFor={f('type')} className={lab}>I am writing as</label>
            <Select id={f('type')} name="type" defaultValue="partner"
              options={[{ value: 'partner', label: 'A potential partner' }, { value: 'investor', label: 'An investor' }, { value: 'other', label: 'Something else' }]} />
          </div>
        </>
      )}
      {kind !== 'updates' && (
        <div className={field}>
          <label htmlFor={f('message')} className={lab}>Message</label>
          <Textarea id={f('message')} name="message" required />
        </div>
      )}

      {/* Honeypot: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Website <input name="company_website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div aria-live="polite">
        {state === 'error' && <p role="alert" className="border-l-4 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>}
      </div>

      <div>
        <Button type="submit" size="lg" disabled={state === 'sending'} className="w-full sm:w-auto">
          {state === 'sending' ? 'Sending…' : copy[kind].button}
        </Button>
        <p className="mt-3 text-sm text-muted">We use your details only to reply to you or send Divaca updates.</p>
      </div>
    </form>
  );
}

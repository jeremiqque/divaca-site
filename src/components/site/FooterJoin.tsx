import { useState } from 'react';
import { Envelope } from '@phosphor-icons/react';

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

export default function FooterJoin() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company_website) return;
    if (!ENDPOINT) return setState('error');
    setState('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: data.email, interest: 'all', form: 'updates' }),
      });
      if (!res.ok) throw new Error();
      setState('sent');
      form.reset();
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md">
      <div className="flex items-center gap-2 border border-line bg-white p-1.5 shadow-field">
        <Envelope size={20} weight="duotone" className="ml-2 shrink-0 text-green" aria-hidden="true" />
        <input type="email" name="email" required autoComplete="email" aria-label="Email address" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted/70" />
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={state === 'sending'} className="btn shrink-0 bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-btn disabled:opacity-60">
          {state === 'sending' ? 'Sending' : 'Get updates'}
        </button>
      </div>
      <p role="status" className="mt-2 min-h-5 text-xs text-muted">
        {state === 'sent' && 'You are on the list. We will email you when there is news.'}
        {state === 'error' && 'Not sent. The form is not connected yet or the connection failed. Please try again later.'}
        {state === 'idle' && 'Product news only. We write when there is something worth saying.'}
      </p>
    </form>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

const base =
  'h-12 w-full rounded border border-ink/25 bg-white px-4 text-base shadow-field outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 hover:border-ink/45 focus-visible:border-green focus-visible:shadow-focus aria-[invalid=true]:border-red-700';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(base, className)} {...props} />
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(base, 'h-auto min-h-32 py-3', className)} {...props} />
);
Textarea.displayName = 'Textarea';

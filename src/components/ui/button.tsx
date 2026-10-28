import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Use `buttonVariants()` for links (<a>) and <Button> for real buttons.
export const buttonVariants = cva(
  'btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-semibold disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-[linear-gradient(180deg,#1f8a4f_0%,#105e34_100%)] text-white shadow-btn',
        accent: 'bg-[linear-gradient(180deg,#a2dd83_0%,#8ed06c_100%)] text-ink shadow-[inset_0_2px_0_1.5px_rgba(255,255,255,0.45),0_5px_2px_rgba(60,120,40,0.25),0_14px_18px_-6px_rgba(60,120,40,0.3)]',
        outline: 'border border-ink/80 bg-transparent text-ink hover:bg-ink hover:text-white',
        'outline-light': 'border border-white/70 text-white hover:bg-white hover:text-green',
      },
      size: { md: 'h-[42px] px-5 text-[0.95rem]', lg: 'h-12 px-6 text-base' },
    },
    compoundVariants: [{ variant: 'primary', size: 'lg', className: 'shadow-btn-lg' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-t border-line first:border-t-0', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref}
      className={cn('group flex flex-1 items-center justify-between gap-6 py-5 text-left text-lg font-semibold hover:text-green', className)} {...props}>
      <span className="flex items-baseline gap-4">{children}</span>
      <span className="grid size-8 shrink-0 place-items-center bg-mist text-green transition-colors group-data-[state=open]:bg-green group-data-[state=open]:text-white">
        <Plus size={16} weight="bold" className="transition-transform duration-200 group-data-[state=open]:rotate-45" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref}
    className="overflow-hidden text-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
    <div className={cn('max-w-2xl pb-6 pr-12', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="surface-card w-full px-5 md:px-8">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`item-${i}`}>
          <AccordionTrigger><span className="w-7 shrink-0 text-xs font-bold tracking-widest text-green">{String(i + 1).padStart(2, '0')}</span><span>{f.q}</span></AccordionTrigger>
          <AccordionContent className="pl-11">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

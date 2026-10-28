import * as React from 'react';
import * as S from '@radix-ui/react-select';
import { CaretDown, Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export type Option = { value: string; label: string };

/** Styled dropdown that matches the form fields. Submits its value with the form via `name`. */
export function Select({ id, name, value, defaultValue, onValueChange, options, className, 'aria-label': ariaLabel }: {
  id?: string; name?: string; value?: string; defaultValue?: string; onValueChange?: (v: string) => void;
  options: Option[]; className?: string; 'aria-label'?: string;
}) {
  return (
    <S.Root name={name} value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
      <S.Trigger id={id} aria-label={ariaLabel}
        className={cn('select-trigger group flex h-12 w-full items-center justify-between gap-3 rounded border border-ink/25 bg-white px-4 text-left text-base shadow-field outline-none transition-[border-color,box-shadow] duration-200 hover:border-ink/45 focus-visible:border-green focus-visible:shadow-focus data-[state=open]:border-green data-[state=open]:shadow-focus', className)}>
        <span className="truncate"><S.Value /></span>
        <S.Icon asChild>
          <span className="grid size-6 shrink-0 place-items-center rounded-[3px] bg-mist text-green transition-transform duration-200 group-data-[state=open]:rotate-180">
            <CaretDown size={12} weight="bold" />
          </span>
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content position="popper" sideOffset={6} collisionPadding={12}
          className="select-content z-[70] w-[var(--radix-select-trigger-width)] overflow-hidden rounded border border-line bg-white p-1.5 shadow-deep">
          <S.Viewport>
            {options.map((o) => (
              <S.Item key={o.value} value={o.value}
                className="relative flex h-11 cursor-pointer select-none items-center justify-between gap-3 rounded-[3px] px-3 text-[0.95rem] outline-none transition-colors data-[highlighted]:bg-mist/70 data-[highlighted]:text-green data-[state=checked]:font-semibold">
                <S.ItemText>{o.label}</S.ItemText>
                <S.ItemIndicator className="grid size-5 place-items-center rounded-[3px] bg-green text-white"><Check size={12} weight="bold" /></S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}

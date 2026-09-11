import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant =
  | 'display-lg'
  | 'headline-lg'
  | 'title-md'
  | 'body-md'
  | 'label-sm';

interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  "display-lg": "text-display-lg font-bold tracking-[-2.8px] text-neutral-dark",
  "headline-lg": "text-headline-lg font-semibold tracking-normal text-neutral-dark",
  "title-md": "text-title-md font-medium tracking-normal text-neutral-dark",
  "body-md": "text-body-md font-normal tracking-normal text-neutral-muted",
  "label-sm": "text-label-sm font-bold tracking-[1.1px] uppercase text-neutral-dark",
};

export function Typography({ variant, children, className }: TypographyProps) {
  const Component =
    variant === 'display-lg'
      ? 'h1'
      : variant === 'headline-lg'
        ? 'h2'
        : variant === 'title-md'
          ? 'h3'
          : variant === 'label-sm'
            ? 'span'
            : 'p';

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
}
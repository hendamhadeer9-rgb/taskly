import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TypographyVariant =
  "display-lg" | "headline-lg" | "title-md" | "body-md" | "label-sm";

interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  "display-lg": "text-[56px] leading-[56px] font-bold text-neutral-dark",
  "headline-lg": "text-[32px] leading-[40px] font-semibold text-neutral-dark",
  "title-md": "text-[18px] leading-[27px] font-medium text-neutral-dark",
  "body-md": "text-[14px] leading-[22.75px] font-normal text-neutral-muted",
  "label-sm":
    "text-[11px] leading-[16.5px] font-bold uppercase text-neutral-dark",
};

export function Typography({ variant, children, className }: TypographyProps) {
  const Component =
    variant === "display-lg"
      ? "h1"
      : variant === "headline-lg"
        ? "h2"
        : variant === "title-md"
          ? "h3"
          : variant === "label-sm"
            ? "span"
            : "p";

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
}

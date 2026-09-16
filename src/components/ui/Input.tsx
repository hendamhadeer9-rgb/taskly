import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, id, ...props }, ref) => {
    const inputId = id;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-neutral-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md bg-surface-highest px-4 py-3.5 text-sm text-neutral-dark focus:outline-none ",
            error && " bg-surface-highest text-error",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

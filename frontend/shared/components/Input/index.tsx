"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/shared/utils/utils";
import { IInputProps } from "./types";

const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      className,
      type = "text",
      label,
      id,
      errors,
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    const inputId = useId();

    const hasError = errors && errors.length > 0;

    return (
      <div className={cn("w-full px-2 pb-5", className)}>
        {label && (
          <label htmlFor={id ?? inputId} className="text-base text-zinc-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground md:text-sm",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "border border-zinc-300 bg-transparent focus-visible:outline-none focus-visible:ring-1 ring-indigo-500",
            hasError
              ? "border-red-500 focus-visible:border-input focus-visible:ring-red-500"
              : "focus-visible:ring-brand-500",
            className
          )}
          ref={ref}
          onChange={onChange}
          {...props}
        />
        {hasError && (
          <span className="absolute pt-0.5 text-xs text-red-500">
            {errors[0]}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

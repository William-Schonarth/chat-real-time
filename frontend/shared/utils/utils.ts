import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getError(errors: Record<string, any>, label: string) {
  const splitLabel = label.split(".");

  if (splitLabel.length > 1) {
    let nestedError = errors;
    for (const key of splitLabel) {
      nestedError = nestedError[key];
      if (!nestedError) break;
    }
    return [nestedError?.message ?? undefined].filter(Boolean);
  }

  return [errors[label]?.message ?? undefined].filter(Boolean);
}

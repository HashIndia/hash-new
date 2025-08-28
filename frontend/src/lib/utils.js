import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for conditional classNames (shadcn/ui standard)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
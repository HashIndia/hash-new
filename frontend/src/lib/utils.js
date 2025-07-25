// Utility function for conditional classNames (shadcn/ui standard)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
} 
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-muted)] text-[var(--color-text)] border border-[var(--color-border)]",
        accent:
          "bg-[color-mix(in_oklch,var(--color-accent)_10%,white)] text-[var(--color-accent)] border border-[color-mix(in_oklch,var(--color-accent)_26%,transparent)]",
        positive:
          "bg-[color-mix(in_oklch,var(--color-positive)_12%,white)] text-[var(--color-positive)] border border-[color-mix(in_oklch,var(--color-positive)_28%,transparent)]",
        warning:
          "bg-[color-mix(in_oklch,var(--color-warning)_16%,white)] text-[oklch(0.5_0.14_75)] border border-[color-mix(in_oklch,var(--color-warning)_30%,transparent)]",
        negative:
          "bg-[color-mix(in_oklch,var(--color-negative)_10%,white)] text-[var(--color-negative)] border border-[color-mix(in_oklch,var(--color-negative)_26%,transparent)]",
        outline:
          "bg-white/70 text-[var(--color-text-muted)] border border-[var(--color-border)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

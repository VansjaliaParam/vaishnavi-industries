import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "brass" | "muted" | "outline";
  className?: string;
}

export default function Badge({ children, variant = "muted", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "brass" && "bg-brass/15 text-brass",
        variant === "muted" && "bg-raised text-muted",
        variant === "outline" && "border border-line text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import MagneticButton from "./MagneticButton";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variants: Record<Variant, string> = {
  primary:
    "bg-brass-sheen text-bg font-semibold shadow-brass-glow hover:shadow-[0_0_60px_-8px_rgba(198,161,91,0.65)] hover:scale-[1.03]",
  outline:
    "border border-brass text-brass hover:bg-brass/10",
  ghost: "text-text hover:text-brass hover:bg-text/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-sm",
  md: "h-11 px-7 text-sm",
  lg: "h-13 px-9 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  magnetic = false,
  children,
  className,
  as,
  ...rest
}: ButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 cursor-pointer select-none",
    variants[variant],
    sizes[size],
    className
  );

  const inner =
    as === "a" ? (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    ) : (
      <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );

  if (magnetic && variant === "primary") {
    return <MagneticButton>{inner}</MagneticButton>;
  }
  return inner;
}

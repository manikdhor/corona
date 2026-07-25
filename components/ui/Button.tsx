import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "gold" | "navy" | "outline" | "outline-light" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  gold: "btn-gold",
  navy: "btn-navy",
  outline: "btn-outline",
  "outline-light": "btn-outline-light",
  ghost:
    "relative inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-navy hover:text-gold-600 transition-colors duration-300",
};

export default function Button({
  children,
  variant = "gold",
  href,
  onClick,
  className,
  showArrow = false,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {showArrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
      {/* Shimmer overlay on hover for premium buttons */}
      {(variant === "gold" || variant === "navy") && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </>
  );

  const classes = cn(
    "group",
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
}

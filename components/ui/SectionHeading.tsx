import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("mb-5 flex", align === "center" ? "justify-center" : "justify-start")}>
          <span className="eyebrow">
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={cn(
          "font-serif text-display-md font-bold leading-tight",
          light ? "text-cream" : "text-navy"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            light ? "text-cream/70" : "text-navy-400"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

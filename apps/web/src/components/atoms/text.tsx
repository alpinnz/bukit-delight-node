import type { HTMLAttributes, ElementType } from "react";

type TextProps = HTMLAttributes<HTMLElement> & {
  component?: ElementType;
  variant?: string;
  align?: "left" | "center" | "right" | "justify";
  color?: "textSecondary";
};

const Text = ({
  children,
  component,
  variant,
  align,
  color,
  className = "",
  ...props
}: TextProps) => {
  const Component = component ?? (variant?.match(/^h[1-6]$/) ? variant : "p");
  const sizeClass: Record<string, string> = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-semibold",
    h4: "text-lg font-semibold",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
    body2: "text-sm",
    caption: "text-xs",
    subtitle2: "text-sm font-medium",
  };
  const alignmentClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : align === "justify"
          ? "text-justify"
          : align === "left"
            ? "text-left"
            : "";
  return (
    <Component
      {...props}
      className={`${sizeClass[variant ?? ""] ?? ""} ${alignmentClass} ${color === "textSecondary" ? "text-slate-500" : ""} ${className}`}
    >
      {children || "label"}
    </Component>
  );
};

export default Text;

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
}

export function Button({
  variant = "default",
  size = "medium",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx("btn", `btn-${variant}`, `btn-${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}

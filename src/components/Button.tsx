import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex min-h-[52px] items-center justify-center rounded-2xl px-6 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 select-none";

  const variantClasses =
    variant === "primary"
      ? "bg-[#5B4BDB] text-white shadow-lg shadow-[#5B4BDB]/25 hover:bg-[#5041c7] active:bg-[#463ab5]"
      : variant === "secondary"
      ? "border border-black/10 bg-white text-[#171717] hover:bg-black/[0.03] active:bg-black/[0.06]"
      : "text-[#5B4BDB] hover:bg-[#5B4BDB]/[0.06] active:bg-[#5B4BDB]/[0.1]";

  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...(props as object)}
    >
      {children}
    </motion.button>
  );
}

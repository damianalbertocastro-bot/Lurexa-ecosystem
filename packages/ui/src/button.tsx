import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", isLoading = false, disabled, className = "", ...props }) => {
  const baseStyles = "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl font-bold tracking-[-.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5add] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none";
  const variants = {
    primary: "bg-gradient-to-br from-[#592bd6] to-[#1d5add] text-white shadow-[0_12px_24px_rgba(50,63,184,.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(50,63,184,.3)] active:translate-y-0",
    secondary: "border border-[#dbe4fa] bg-white text-[#071d67] shadow-sm hover:-translate-y-0.5 hover:border-[#9fb1ef] hover:shadow-md active:translate-y-0",
    ghost: "bg-transparent text-[#3155b6] hover:bg-[#eef3ff] active:bg-[#e2eaff]",
    destructive: "bg-[#c62d48] text-white shadow-[0_10px_22px_rgba(198,45,72,.2)] hover:-translate-y-0.5 hover:bg-[#a91f39] active:translate-y-0",
  };
  const sizes = { sm: "px-3.5 py-2 text-sm", md: "px-4.5 py-2.5 text-sm", lg: "px-6 py-3.5 text-base" };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <span aria-hidden="true" className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />}
      {children}
    </button>
  );
};

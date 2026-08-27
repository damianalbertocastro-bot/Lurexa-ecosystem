import React from "react";

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

export function getAvatarInitials(name?: string | null): string {
  if (!name) return "L";
  const cleaned = name.trim();
  if (cleaned.includes("@")) {
    const username = cleaned.split("@")[0] || "L";
    return username.slice(0, 2).toUpperCase();
  }
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  online,
  className = "",
}) => {
  const initials = getAvatarInitials(name);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs rounded-xl",
    md: "h-11 w-11 text-sm rounded-xl",
    lg: "h-14 w-14 text-base rounded-2xl",
    xl: "h-16 w-16 text-lg rounded-2xl",
  };

  const badgeSizeClasses = {
    sm: "h-3 w-3 -bottom-0.5 -right-0.5 border",
    md: "h-3.5 w-3.5 -bottom-0.5 -right-0.5 border-2",
    lg: "h-4 w-4 -bottom-1 -right-1 border-2",
    xl: "h-5 w-5 -bottom-1 -right-1 border-2 text-[10px]",
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name ? `${name}'s avatar` : "User avatar"}
          className={`${sizeClasses[size]} border-2 border-indigo-100 object-cover shadow-md shadow-indigo-100/50`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] font-black text-white shadow-md shadow-indigo-500/20 ${sizeClasses[size]}`}
          aria-label={name ? `${name}'s avatar initials: ${initials}` : `Avatar initials: ${initials}`}
        >
          {initials}
        </div>
      )}
      {typeof online === "boolean" && (
        <span
          className={`absolute flex items-center justify-center rounded-full border-white shadow-sm ${badgeSizeClasses[size]} ${
            online ? "bg-emerald-500 text-white" : "bg-slate-300"
          }`}
          title={online ? "Online" : "Offline"}
          aria-hidden="true"
        >
          {online && size === "xl" ? "✓" : null}
        </span>
      )}
    </div>
  );
};

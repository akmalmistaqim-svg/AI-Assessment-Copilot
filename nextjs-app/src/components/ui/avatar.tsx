interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm font-semibold",
  };

  return (
    <div
      className={`rounded-full bg-light-green text-dark-green font-bold flex items-center justify-center border border-emerald-200 shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}

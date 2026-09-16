import type React from "react";

interface CardMetaItemProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

export function CardMetaItem({ icon, text, className = "" }: CardMetaItemProps) {
  return (
    <div className={`flex items-center gap-1.5 text-xs text-text-secondary ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

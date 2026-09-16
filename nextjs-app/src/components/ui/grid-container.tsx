import type React from "react";

interface GridContainerProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function GridContainer({ children, columns = 3, className = "" }: GridContainerProps) {
  const colClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : columns === 4
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5";

  return <div className={`${colClass} ${className}`}>{children}</div>;
}

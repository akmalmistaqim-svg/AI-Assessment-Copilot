interface DividerProps {
  className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return <hr className={`border-t border-border-color my-4 ${className}`} />;
}

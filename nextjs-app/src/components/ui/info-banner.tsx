import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface InfoBannerProps {
  title?: string;
  message: string;
  variant?: "info" | "warning" | "success" | "danger";
  className?: string;
}

export function InfoBanner({ title, message, variant = "info", className = "" }: InfoBannerProps) {
  const styles = {
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    success: {
      bg: "bg-light-green border-emerald-200 text-dark-green",
      icon: <CheckCircle className="w-5 h-5 text-primary-green shrink-0" />,
    },
    danger: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    },
  };

  const current = styles[variant];

  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 ${current.bg} ${className}`}>
      {current.icon}
      <div className="space-y-0.5 text-xs">
        {title && <p className="font-bold">{title}</p>}
        <p className="leading-relaxed opacity-95">{message}</p>
      </div>
    </div>
  );
}

import { CheckCheck } from "lucide-react";

interface BrandLogoProps {
  size?: "sm" | "md";
  tagline?: string;
}

export function BrandLogo({
  size = "md",
  tagline = "Smarter Assessment, Better Feedback.",
}: BrandLogoProps) {
  const iconSize = size === "sm" ? "w-[38px] h-[38px]" : "w-11 h-11";
  const iconStroke = size === "sm" ? 20 : 22;
  const nameSize = size === "sm" ? "text-base" : "text-[19px]";

  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`${iconSize} rounded-[10px] bg-light-green text-primary-green flex items-center justify-center font-bold shadow-xs shrink-0`}
      >
        <CheckCheck size={iconStroke} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col text-left">
        <span className={`${nameSize} font-bold text-text-primary tracking-tight leading-tight`}>
          AI Assessment Copilot
        </span>
        <span className="text-xs text-text-secondary font-normal mt-0.5">{tagline}</span>
      </div>
    </div>
  );
}

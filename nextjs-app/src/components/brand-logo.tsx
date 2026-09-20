interface BrandLogoProps {
  size?: "sm" | "md";
  tagline?: string;
}

export function BrandLogo({
  size = "md",
  tagline = "Smarter Assessment, Better Feedback.",
}: BrandLogoProps) {
  const imgSize = size === "sm" ? "w-[38px] h-[38px]" : "w-11 h-11";
  const nameSize = size === "sm" ? "text-base" : "text-[19px]";

  return (
    <div className="flex items-center justify-center gap-3">
      <img
        src="/dexa-logo.png"
        alt="DeXa Assessment Logo"
        className={`${imgSize} rounded-xl object-contain shadow-xs shrink-0`}
      />
      <div className="flex flex-col text-left">
        <span className={`${nameSize} font-bold text-text-primary tracking-tight leading-tight`}>
          DeXa Assessment
        </span>
        <span className="text-xs text-text-secondary font-normal mt-0.5">{tagline}</span>
      </div>
    </div>
  );
}

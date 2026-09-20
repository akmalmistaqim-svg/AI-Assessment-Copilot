import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
  tagline?: string;
}

export function BrandLogo({
  size = "md",
  tagline = "Smarter Assessment, Better Feedback.",
}: BrandLogoProps) {
  const imgSize = size === "sm" ? 38 : 44;
  const nameSize = size === "sm" ? "text-base" : "text-[19px]";

  return (
    <div className="flex items-center justify-center gap-3">
      <Image
        src="/dexa-logo.png"
        alt="DeXa Assessment Logo"
        width={imgSize}
        height={imgSize}
        className="rounded-xl object-contain shadow-xs shrink-0"
        priority
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

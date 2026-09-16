interface ModalHeaderProps {
  title: string;
  description?: string;
}

export function ModalHeader({ title, description }: ModalHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-text-primary">{title}</h3>
      {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
    </div>
  );
}

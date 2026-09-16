interface StatusBadgeProps {
  status:
    | "active"
    | "draft"
    | "in-review"
    | "finalized"
    | "archived"
    | "submitted"
    | "pending"
    | "graded"
    | string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  let style = "bg-slate-100 text-slate-700 border-slate-200";
  let text = label || status;

  switch (status) {
    case "active":
    case "graded":
    case "finalized":
      style = "bg-light-green text-dark-green border-emerald-200";
      if (!label) text = status === "active" ? "Aktif" : status === "graded" ? "Dinilai" : "Final";
      break;
    case "in-review":
    case "submitted":
      style = "bg-blue-50 text-blue-700 border-blue-200";
      if (!label) text = status === "in-review" ? "In Review" : "Terkumpul";
      break;
    case "draft":
    case "pending":
      style = "bg-amber-50 text-amber-700 border-amber-200";
      if (!label) text = status === "draft" ? "Draft" : "Belum Dikumpul";
      break;
    case "archived":
      style = "bg-slate-100 text-slate-600 border-slate-200";
      if (!label) text = "Arsip";
      break;
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}
    >
      {text}
    </span>
  );
}

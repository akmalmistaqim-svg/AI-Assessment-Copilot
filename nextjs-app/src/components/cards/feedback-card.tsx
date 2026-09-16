import { Sparkles } from "lucide-react";
import type { FeedbackItem } from "@/lib/data";

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-text-primary text-base">{feedback.assignmentTitle}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{feedback.course}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-primary-green">{feedback.score}</span>
          <span className="text-xs text-text-muted">/{feedback.maxScore}</span>
        </div>
      </div>

      <div className="bg-light-green/60 border border-emerald-200/80 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-dark-green">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ulasan AI Copilot:</span>
        </div>
        <p className="text-xs text-dark-green/90 italic leading-relaxed">
          &ldquo;{feedback.comment}&rdquo;
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-text-muted">
        <span>Penguji: {feedback.assessor}</span>
        <span>{feedback.gradedDate}</span>
      </div>
    </div>
  );
}

import { Sparkles } from "lucide-react";
import { FeedbackCard } from "@/components/cards/feedback-card";
import { type FeedbackItem, fetchFeedback } from "@/lib/data";

export async function LatestFeedbackSection() {
  const fb: FeedbackItem = await fetchFeedback();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Feedback AI Terbaru</h2>
        <Sparkles className="w-4 h-4 text-primary-green animate-pulse" />
      </div>

      <FeedbackCard feedback={fb} />
    </div>
  );
}

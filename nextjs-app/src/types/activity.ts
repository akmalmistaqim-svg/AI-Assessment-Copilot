import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string(),
  type: z.enum(["submission", "assignment", "assessment", "feedback"]),
  actor: z.string(),
  action: z.string(),
  context: z.string(),
  timeAgo: z.string(),
  icon: z.string(),
  color: z.string(),
});

export type ActivityItem = z.infer<typeof ActivitySchema>;

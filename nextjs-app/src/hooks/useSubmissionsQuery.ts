import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubmission, fetchSubmissions } from "@/services/submissionApi";
import type { CreateSubmissionInput } from "@/types/submission";

export function useSubmissionsQuery() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSubmitAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSubmission: CreateSubmissionInput) => createSubmission(newSubmission),
    onSuccess: () => {
      // Invalidate both assignments and submissions so lists refresh immediately
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

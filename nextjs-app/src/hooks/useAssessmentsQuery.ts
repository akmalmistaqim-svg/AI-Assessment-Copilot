import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssessment,
  deleteAssessment,
  fetchAssessments,
  updateAssessment,
} from "@/services/assessmentApi";
import type { CreateAssessmentInput, UpdateAssessmentInput } from "@/types/assessment";

export function useAssessmentsQuery() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAssessments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAssessment: CreateAssessmentInput) => createAssessment(newAssessment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

export function useUpdateAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssessmentInput }) =>
      updateAssessment({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

export function useDeleteAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

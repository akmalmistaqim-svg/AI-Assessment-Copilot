import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRubric, deleteRubric, fetchRubrics, updateRubric } from "@/services/rubricApi";
import type { CreateRubricInput, UpdateRubricInput } from "@/types/rubric";

export function useRubricsQuery() {
  return useQuery({
    queryKey: ["rubrics"],
    queryFn: fetchRubrics,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateRubricMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newRubric: CreateRubricInput) => createRubric(newRubric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rubrics"] });
    },
  });
}

export function useUpdateRubricMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRubricInput }) =>
      updateRubric({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rubrics"] });
    },
  });
}

export function useDeleteRubricMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRubric(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rubrics"] });
    },
  });
}

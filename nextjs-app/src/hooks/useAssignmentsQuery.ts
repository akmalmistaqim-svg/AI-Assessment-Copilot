import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  deleteAssignment,
  fetchAssignmentById,
  fetchAssignments,
  updateAssignment,
} from "@/services/assignmentApi";
import type { CreateAssignmentInput, UpdateAssignmentInput } from "@/types/assignment";

export function useAssignmentsQuery() {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: fetchAssignments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAssignmentQuery(id: string) {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => fetchAssignmentById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAssignment: CreateAssignmentInput) => createAssignment(newAssignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useUpdateAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentInput }) =>
      updateAssignment({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useDeleteAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

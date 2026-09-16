import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClass, deleteClass, fetchClasses, updateClass } from "@/services/classApi";
import type { CreateClassInput, UpdateClassInput } from "@/types/class";

export function useClassesQuery() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newClass: CreateClassInput) => createClass(newClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useUpdateClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassInput }) => updateClass({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useDeleteClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

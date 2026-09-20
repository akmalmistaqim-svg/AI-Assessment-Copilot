import { useQuery } from "@tanstack/react-query";
import { fetchGrades } from "@/services/gradeApi";

export function useGradesQuery() {
  return useQuery({
    queryKey: ["grades"],
    queryFn: fetchGrades,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

import { MahasiswaAssignmentCard } from "@/components/cards/mahasiswa-assignment-card";
import { type AssignmentItem, fetchAssignments } from "@/lib/data";

export async function AssignmentsListSectionServer() {
  const assignments = await fetchAssignments();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Tugas Saya</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Daftar tugas dari seluruh mata kuliah
          </p>
        </div>
        <span className="text-xs text-primary-green font-medium cursor-pointer hover:underline">
          Lihat Semua
        </span>
      </div>

      <div className="bg-card-bg rounded-xl border border-border-color divide-y divide-border-color shadow-sm">
        {assignments.map((asg: AssignmentItem) => (
          <MahasiswaAssignmentCard key={asg.id} assignment={asg} />
        ))}
      </div>
    </div>
  );
}

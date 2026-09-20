import {
  getClassesStore,
  addClassToStore,
  updateClassInStore,
  deleteClassFromStore,
} from "../src/lib/classStore";
import {
  getRubricsStore,
  addRubricToStore,
  updateRubricInStore,
  deleteRubricFromStore,
} from "../src/lib/rubricStore";
import {
  getAssignmentsStore,
  addAssignmentToStore,
  updateAssignmentInStore,
  deleteAssignmentFromStore,
} from "../src/lib/assignmentStore";
import {
  getAssessmentsStore,
  addAssessmentToStore,
  updateAssessmentInStore,
  deleteAssessmentFromStore,
} from "../src/lib/assessmentStore";

import { CreateClassInputSchema, ClassItem } from "../src/types/class";
import { CreateRubricInputSchema, RubricItem } from "../src/types/rubric";
import { CreateAssignmentInputSchema, AssignmentItem } from "../src/types/assignment";
import { CreateAssessmentInputSchema, AssessmentItem } from "../src/types/assessment";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log("=== 1. TESTING CLASSES CRUD + ZOD ===");
const initialClasses = getClassesStore();
assert(Array.isArray(initialClasses) && initialClasses.length > 0, `Initial classes count: ${initialClasses.length}`);

const classInput = {
  name: "Machine Learning",
  studentsCount: 38,
  assignmentsCount: 4,
  semester: "Ganjil 2024/2025",
  status: "active" as const,
};
const parsedClass = CreateClassInputSchema.safeParse(classInput);
assert(parsedClass.success, `Zod validation for CreateClassInput`);

const newCls: ClassItem = {
  id: `cls-test-${Date.now()}`,
  ...classInput,
  lecturerName: "Dr. Budi Santoso, M.Kom",
  enrolledStudentIds: [2],
};
addClassToStore(newCls);
assert(getClassesStore().some(c => c.id === newCls.id), `Added class to store: ${newCls.name}`);

const updatedCls = updateClassInStore(newCls.id, { name: "Advanced Machine Learning" });
assert(Boolean(updatedCls && updatedCls.name === "Advanced Machine Learning"), `Updated class: ${updatedCls?.name}`);

const deletedCls = deleteClassFromStore(newCls.id);
assert(deletedCls === true, `Deleted class id: ${newCls.id}`);
assert(!getClassesStore().some(c => c.id === newCls.id), `Confirmed class no longer exists in store`);

console.log("\n=== 2. TESTING RUBRICS CRUD + ZOD ===");
const initialRubrics = getRubricsStore();
assert(Array.isArray(initialRubrics) && initialRubrics.length > 0, `Initial rubrics count: ${initialRubrics.length}`);

const rubricInput = {
  name: "Rubrik Evaluasi Model AI",
  course: "Machine Learning",
  criteriaCount: 4,
  totalWeight: 100,
  status: "active" as const,
};
const parsedRubric = CreateRubricInputSchema.safeParse(rubricInput);
assert(parsedRubric.success, `Zod validation for CreateRubricInput`);

const newRubric: RubricItem = {
  id: `rub-test-${Date.now()}`,
  ...rubricInput,
};
addRubricToStore(newRubric);
assert(getRubricsStore().some(r => r.id === newRubric.id), `Added rubric to store: ${newRubric.name}`);

const updatedRubric = updateRubricInStore(newRubric.id, { criteriaCount: 5 });
assert(Boolean(updatedRubric && updatedRubric.criteriaCount === 5), `Updated rubric criteria: ${updatedRubric?.criteriaCount}`);

const deletedRubric = deleteRubricFromStore(newRubric.id);
assert(deletedRubric === true, `Deleted rubric id: ${newRubric.id}`);
assert(!getRubricsStore().some(r => r.id === newRubric.id), `Confirmed rubric no longer exists in store`);

console.log("\n=== 3. TESTING ASSIGNMENTS CRUD + ZOD ===");
const initialAssignments = getAssignmentsStore();
assert(Array.isArray(initialAssignments) && initialAssignments.length > 0, `Initial assignments count: ${initialAssignments.length}`);

const assignmentInput = {
  title: "Implementasi Deep Learning PyTorch",
  course: "Deep Learning",
  deadline: "2026-10-15",
  description: "Membangun pipeline CNN dengan CIFAR-10.",
  status: "pending" as const,
};
const parsedAssignment = CreateAssignmentInputSchema.safeParse(assignmentInput);
assert(parsedAssignment.success, `Zod validation for CreateAssignmentInput`);

const newAssignment: AssignmentItem = {
  id: `asg-test-${Date.now()}`,
  ...assignmentInput,
};
addAssignmentToStore(newAssignment);
assert(getAssignmentsStore().some(a => a.id === newAssignment.id), `Added assignment to store: ${newAssignment.title}`);

const updatedAssignment = updateAssignmentInStore(newAssignment.id, { title: "Implementasi Transformer & PyTorch" });
assert(Boolean(updatedAssignment && updatedAssignment.title === "Implementasi Transformer & PyTorch"), `Updated assignment: ${updatedAssignment?.title}`);

const deletedAssignment = deleteAssignmentFromStore(newAssignment.id);
assert(deletedAssignment === true, `Deleted assignment id: ${newAssignment.id}`);
assert(!getAssignmentsStore().some(a => a.id === newAssignment.id), `Confirmed assignment no longer exists in store`);

console.log("\n=== 4. TESTING ASSESSMENTS CRUD + ZOD ===");
const initialAssessments = getAssessmentsStore();
assert(Array.isArray(initialAssessments) && initialAssessments.length > 0, `Initial assessments count: ${initialAssessments.length}`);

const assessmentInput = {
  name: "Penilaian Proyek Akhir ML",
  course: "Machine Learning",
  status: "draft" as const,
  gradedSubmissionsCount: 0,
};
const parsedAssessment = CreateAssessmentInputSchema.safeParse(assessmentInput);
assert(parsedAssessment.success, `Zod validation for CreateAssessmentInput`);

const newAssessment: AssessmentItem = {
  id: `asm-test-${Date.now()}`,
  ...assessmentInput,
};
addAssessmentToStore(newAssessment);
assert(getAssessmentsStore().some(a => a.id === newAssessment.id), `Added assessment to store: ${newAssessment.name}`);

const updatedAssessment = updateAssessmentInStore(newAssessment.id, { status: "in-review", gradedSubmissionsCount: 12 });
assert(Boolean(updatedAssessment && updatedAssessment.status === "in-review" && updatedAssessment.gradedSubmissionsCount === 12), `Updated assessment status & submissions`);

const deletedAssessment = deleteAssessmentFromStore(newAssessment.id);
assert(deletedAssessment === true, `Deleted assessment id: ${newAssessment.id}`);
assert(!getAssessmentsStore().some(a => a.id === newAssessment.id), `Confirmed assessment no longer exists in store`);

console.log(`\n========================================`);
console.log(`CRUD VERIFICATION RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);

if (failed > 0) process.exit(1);

const { classStore } = require("../src/lib/classStore");
const { rubricStore } = require("../src/lib/rubricStore");
const { assignmentStore } = require("../src/lib/assignmentStore");
const { assessmentStore } = require("../src/lib/assessmentStore");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log("=== 1. TESTING CLASSES CRUD ===");
const initialClasses = classStore.getAll();
assert(
  Array.isArray(initialClasses) && initialClasses.length > 0,
  `Initial classes count: ${initialClasses.length}`,
);

const newCls = classStore.create({
  name: "Machine Learning",
  studentsCount: 38,
  assignmentsCount: 4,
  semester: "Ganjil 2024/2025",
  status: "active",
});
assert(
  newCls && newCls.id && newCls.name === "Machine Learning",
  `Created class: ${newCls.name} (id: ${newCls.id})`,
);

const updatedCls = classStore.update(newCls.id, { name: "Advanced Machine Learning" });
assert(
  updatedCls && updatedCls.name === "Advanced Machine Learning",
  `Updated class: ${updatedCls?.name}`,
);

const deletedCls = classStore.delete(newCls.id);
assert(deletedCls === true, `Deleted class id: ${newCls.id}`);
assert(!classStore.getById(newCls.id), `Confirmed class no longer exists`);

console.log("\n=== 2. TESTING RUBRICS CRUD ===");
const initialRubrics = rubricStore.getAll();
assert(
  Array.isArray(initialRubrics) && initialRubrics.length > 0,
  `Initial rubrics count: ${initialRubrics.length}`,
);

const newRubric = rubricStore.create({
  name: "Rubrik Evaluasi Model AI",
  course: "Machine Learning",
  criteriaCount: 4,
  totalWeight: 100,
  status: "active",
});
assert(
  newRubric && newRubric.id && newRubric.name === "Rubrik Evaluasi Model AI",
  `Created rubric: ${newRubric.name} (id: ${newRubric.id})`,
);

const updatedRubric = rubricStore.update(newRubric.id, { criteriaCount: 5 });
assert(
  updatedRubric && updatedRubric.criteriaCount === 5,
  `Updated rubric criteria: ${updatedRubric?.criteriaCount}`,
);

const deletedRubric = rubricStore.delete(newRubric.id);
assert(deletedRubric === true, `Deleted rubric id: ${newRubric.id}`);
assert(!rubricStore.getById(newRubric.id), `Confirmed rubric no longer exists`);

console.log("\n=== 3. TESTING ASSIGNMENTS CRUD ===");
const initialAssignments = assignmentStore.getAll();
assert(
  Array.isArray(initialAssignments) && initialAssignments.length > 0,
  `Initial assignments count: ${initialAssignments.length}`,
);

const newAssignment = assignmentStore.create({
  title: "Implementasi Deep Learning PyTorch",
  course: "Deep Learning",
  deadline: "2026-10-15",
  description: "Membangun pipeline CNN dengan CIFAR-10.",
  status: "pending",
});
assert(
  newAssignment && newAssignment.id && newAssignment.title === "Implementasi Deep Learning PyTorch",
  `Created assignment: ${newAssignment.title} (id: ${newAssignment.id})`,
);

const updatedAssignment = assignmentStore.update(newAssignment.id, {
  title: "Implementasi Transformer & PyTorch",
});
assert(
  updatedAssignment && updatedAssignment.title === "Implementasi Transformer & PyTorch",
  `Updated assignment: ${updatedAssignment?.title}`,
);

const deletedAssignment = assignmentStore.delete(newAssignment.id);
assert(deletedAssignment === true, `Deleted assignment id: ${newAssignment.id}`);
assert(!assignmentStore.getById(newAssignment.id), `Confirmed assignment no longer exists`);

console.log("\n=== 4. TESTING ASSESSMENTS CRUD ===");
const initialAssessments = assessmentStore.getAll();
assert(
  Array.isArray(initialAssessments) && initialAssessments.length > 0,
  `Initial assessments count: ${initialAssessments.length}`,
);

const newAssessment = assessmentStore.create({
  name: "Penilaian Proyek Akhir ML",
  course: "Machine Learning",
  status: "draft",
  gradedSubmissionsCount: 0,
});
assert(
  newAssessment && newAssessment.id && newAssessment.name === "Penilaian Proyek Akhir ML",
  `Created assessment: ${newAssessment.name} (id: ${newAssessment.id})`,
);

const updatedAssessment = assessmentStore.update(newAssessment.id, {
  status: "in-review",
  gradedSubmissionsCount: 12,
});
assert(
  updatedAssessment &&
    updatedAssessment.status === "in-review" &&
    updatedAssessment.gradedSubmissionsCount === 12,
  `Updated assessment status & submissions`,
);

const deletedAssessment = assessmentStore.delete(newAssessment.id);
assert(deletedAssessment === true, `Deleted assessment id: ${newAssessment.id}`);
assert(!assessmentStore.getById(newAssessment.id), `Confirmed assessment no longer exists`);

console.log(`\nCRUD VERIFICATION SUMMARY: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);

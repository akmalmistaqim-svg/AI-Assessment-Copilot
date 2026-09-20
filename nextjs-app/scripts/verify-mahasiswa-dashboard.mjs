import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING FULL E2E TEST: MAHASISWA DASHBOARD');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const htmlContent = fs.readFileSync(path.join(rootDir, 'dashboard', 'mahasiswa.html'), 'utf8');
  const authJs = fs.readFileSync(path.join(rootDir, 'js', 'auth.js'), 'utf8');
  const apiJs = fs.readFileSync(path.join(rootDir, 'js', 'services', 'api.js'), 'utf8');
  const dashboardJs = fs.readFileSync(path.join(rootDir, 'js', 'dashboard.js'), 'utf8');

  // Strip external CDN scripts for clean headless node execution
  const cleanHtml = htmlContent
    .replace(/<script src="https:\/\/cdn\.jsdelivr\.net[^"]*"><\/script>/g, '')
    .replace(/<script src="https:\/\/unpkg\.com[^"]*"><\/script>/g, '');

  // Setup DOM environment
  const dom = new JSDOM(cleanHtml, {
    url: 'http://localhost:8080/dashboard/mahasiswa.html',
    runScripts: 'dangerously'
  });

  const { window } = dom;
  const { document, localStorage } = window;

  // Mock global window objects needed
  window.lucide = {
    createIcons: () => {}
  };
  window.scrollTo = () => {};

  // Mock student session in localStorage
  localStorage.setItem('currentUser', JSON.stringify({
    id: 2,
    name: 'Andi Pratama',
    email: 'mahasiswa@example.com',
    role: 'mahasiswa'
  }));

  // Execute scripts in window context
  window.eval(authJs);
  window.eval(apiJs);
  window.eval(dashboardJs);

  // Initialize Dashboard
  window.initDashboard('mahasiswa');

  // Wait a moment for async loads
  await new Promise(r => setTimeout(r, 600));

  console.log('--- TEST GROUP 1: Absence of Coming Soon ("Got it") Links ---');
  const futureFeatureEls = document.querySelectorAll('.js-future-feature');
  assert(futureFeatureEls.length === 0, `Zero .js-future-feature elements on page (found: ${futureFeatureEls.length})`);

  console.log('\n--- TEST GROUP 2: User Profile & Session Rendering ---');
  const userNameEls = document.querySelectorAll('.js-user-name');
  assert(userNameEls.length > 0 && userNameEls[0].textContent.includes('Andi Pratama'), 'User name correctly populated as "Andi Pratama"');
  const userAvatar = document.querySelector('.js-user-avatar');
  assert(userAvatar && userAvatar.textContent === 'AP', 'User initials avatar correctly rendered as "AP"');

  console.log('\n--- TEST GROUP 3: Navigation Views Switching (SPA Router) ---');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewAssignments = document.getElementById('view-assignments');
  const viewGrades = document.getElementById('view-grades');
  const viewFeedback = document.getElementById('view-feedback');
  const viewSettings = document.getElementById('view-settings');
  const viewHelp = document.getElementById('view-help');

  assert(viewDashboard && !viewDashboard.classList.contains('hidden'), 'Dashboard view is active by default');

  // Switch to My Assignments
  const linkAssignments = document.querySelector('a[data-view="assignments"]');
  linkAssignments.click();
  assert(!viewAssignments.classList.contains('hidden') && viewDashboard.classList.contains('hidden'), 'Navigated to My Assignments view (#view-assignments)');
  assert(linkAssignments.classList.contains('active'), 'My Assignments sidebar item marked active');

  // Switch to My Grades
  const linkGrades = document.querySelector('a[data-view="grades"]');
  linkGrades.click();
  assert(!viewGrades.classList.contains('hidden') && viewAssignments.classList.contains('hidden'), 'Navigated to My Grades view (#view-grades)');
  assert(linkGrades.classList.contains('active'), 'My Grades sidebar item marked active');

  // Switch to Feedback
  const linkFeedback = document.querySelector('a[data-view="feedback"]');
  linkFeedback.click();
  assert(!viewFeedback.classList.contains('hidden') && viewGrades.classList.contains('hidden'), 'Navigated to Feedback view (#view-feedback)');

  // Switch to Settings
  const linkSettings = document.querySelector('a[data-view="settings"]');
  linkSettings.click();
  assert(!viewSettings.classList.contains('hidden') && viewFeedback.classList.contains('hidden'), 'Navigated to Settings view (#view-settings)');

  // Switch to Help
  const linkHelp = document.querySelector('a[data-view="help"]');
  linkHelp.click();
  assert(!viewHelp.classList.contains('hidden') && viewSettings.classList.contains('hidden'), 'Navigated to Help view (#view-help)');

  // Return to Dashboard
  const linkDashboard = document.querySelector('a[data-view="dashboard"]');
  linkDashboard.click();
  assert(!viewDashboard.classList.contains('hidden') && viewHelp.classList.contains('hidden'), 'Returned to Dashboard view (#view-dashboard)');

  console.log('\n--- TEST GROUP 4: Assignments Filter Tabs & Search ---');
  linkAssignments.click();
  const filterPendingBtn = document.querySelector('button[data-filter="pending"]');
  const filterGradedBtn = document.querySelector('button[data-filter="graded"]');
  const filterAllBtn = document.querySelector('button[data-filter="all"]');

  filterPendingBtn.click();
  const fullAsgContainer = document.getElementById('fullAssignmentsContainer');
  assert(fullAsgContainer.textContent.includes('Website CRUD'), 'Pending filter displays pending assignment "Website CRUD"');

  filterGradedBtn.click();
  assert(fullAsgContainer.textContent.includes('Database Design'), 'Graded filter displays graded assignment "Database Design"');

  filterAllBtn.click();
  assert(fullAsgContainer.textContent.includes('Website CRUD') && fullAsgContainer.textContent.includes('Database Design'), 'All filter displays all assignments');

  // Search input
  const asgSearchInput = document.getElementById('assignmentsSearchInput');
  asgSearchInput.value = 'CRUD';
  asgSearchInput.dispatchEvent(new window.Event('input'));
  assert(fullAsgContainer.textContent.includes('Website CRUD'), 'Search input successfully filters assignments by keyword');

  console.log('\n--- TEST GROUP 5: Submit Assignment Modal & Flow ---');
  const openSubmitBtn = document.getElementById('openSubmitModalBtn');
  const submitModal = document.getElementById('submitAssignmentModal');
  openSubmitBtn.click();
  assert(!submitModal.classList.contains('hidden'), 'Submit Assignment modal opens on button click');

  const submitForm = document.getElementById('submitAssignmentForm');
  const submitSelect = document.getElementById('submitAssignmentSelect');
  submitSelect.value = 'asg-002'; // Website CRUD
  const submitNotes = document.getElementById('submitNotes');
  submitNotes.value = 'Tugas telah selesai dikerjakan sesuai spesifikasi.';

  submitForm.dispatchEvent(new window.Event('submit'));
  assert(submitModal.classList.contains('hidden'), 'Submit Assignment modal closes after form submission');

  const toastContainer = document.getElementById('toastContainer');
  assert(toastContainer.textContent.includes('Tugas berhasil dikumpulkan'), 'Success toast notification displayed');

  // Verify status in DOM
  assert(fullAsgContainer.textContent.includes('Terkumpul'), 'Assignment item shows "Terkumpul" status badge in DOM');

  console.log('\n--- TEST GROUP 6: Calendar & Schedule Modal ---');
  const calendarBtn = document.getElementById('calendarBtn');
  const calendarModal = document.getElementById('calendarModal');
  const closeCalendarBtn = document.getElementById('closeCalendarModalBtn');

  calendarBtn.click();
  assert(!calendarModal.classList.contains('hidden'), 'Calendar modal opens on "Jadwal / Kalender" click');
  assert(calendarModal.textContent.includes('Laporan Sistem'), 'Calendar modal lists deadlines');

  closeCalendarBtn.click();
  assert(calendarModal.classList.contains('hidden'), 'Calendar modal closes on close button click');

  console.log('\n--- TEST GROUP 7: Grade & Rubric Detail Modal ---');
  linkGrades.click();
  const detailRubricBtn = document.querySelector('.js-open-grade-detail');
  const gradeDetailModal = document.getElementById('gradeDetailModal');
  const closeGradeModalBtn = document.getElementById('closeGradeModalBtn');

  detailRubricBtn.click();
  assert(!gradeDetailModal.classList.contains('hidden'), 'Grade detail modal opens on "Detail Rubrik" click');
  assert(gradeDetailModal.textContent.includes('Arsitektur & Kualitas Kode'), 'Rubric criteria loaded inside modal');

  closeGradeModalBtn.click();
  assert(gradeDetailModal.classList.contains('hidden'), 'Grade detail modal closes on close button click');

  console.log('\n--- TEST GROUP 8: Notifications Dropdown ---');
  const notifTrigger = document.getElementById('notificationsTrigger');
  const notifMenu = document.getElementById('notificationsMenu');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const notifBadgeDot = document.getElementById('notifBadgeDot');

  notifTrigger.click();
  assert(notifMenu.classList.contains('show'), 'Notifications dropdown menu opens on bell click');

  markAllReadBtn.click();
  assert(notifBadgeDot.classList.contains('hidden'), 'Unread notification badge dot cleared after "Tandai Dibaca"');

  console.log('\n--- TEST GROUP 9: Student Settings Form Update ---');
  linkSettings.click();
  const profileForm = document.getElementById('studentProfileForm');
  const nameInput = document.getElementById('settingStudentName');
  nameInput.value = 'Andi Pratama Putra';
  profileForm.dispatchEvent(new window.Event('submit'));

  const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
  assert(updatedUser && updatedUser.name === 'Andi Pratama Putra', 'User name in localStorage updated to "Andi Pratama Putra"');
  const headerName = document.querySelector('.js-user-name');
  assert(headerName.textContent === 'Andi Pratama Putra', 'Live UI updated with new student name');

  console.log('\n--- TEST GROUP 10: Help FAQ Accordion ---');
  linkHelp.click();
  const firstFaqQuestion = document.querySelector('.faq-question');
  const firstFaqAnswer = firstFaqQuestion.nextElementSibling;
  assert(firstFaqAnswer.classList.contains('hidden'), 'FAQ answer hidden initially');
  firstFaqQuestion.click();
  assert(!firstFaqAnswer.classList.contains('hidden'), 'FAQ answer expands on question click');

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});

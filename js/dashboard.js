/**
 * AI Assessment Copilot - Dashboard Shared Script
 * Handles role-based protection, profile rendering, sidebar drawer,
 * coming-soon handlers, and logout.
 */

function initDashboard(expectedRole) {
  if (window.__dashboardInitialized) return;
  window.__dashboardInitialized = true;

  // 1. Route guard - Verify authentication and role
  const currentUser = protectDashboard(expectedRole);
  if (!currentUser) return; // redirected

  // 2. Populate user information across UI elements
  populateUserProfile(currentUser);

  // 3. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 4. Setup Interactive Listeners
  setupNavigationInteractions();
  setupSidebarDrawer();
  setupProfileDropdown();
  setupLogoutButtons();

  // 5. Initialize Async Dynamic Features (Langkah 4 & 5)
  if (expectedRole === 'dosen') {
    initDosenFeatures();
  } else if (expectedRole === 'mahasiswa') {
    initMahasiswaFeatures();
  }
}

/**
 * Render user info (name, initials, role, email) into placeholders
 */
function populateUserProfile(user) {
  const nameDisplayElements = document.querySelectorAll('.js-user-name');
  nameDisplayElements.forEach(el => {
    el.textContent = user.name;
  });

  const emailDisplayElements = document.querySelectorAll('.js-user-email');
  emailDisplayElements.forEach(el => {
    el.textContent = user.email;
  });

  const roleDisplayElements = document.querySelectorAll('.js-user-role');
  roleDisplayElements.forEach(el => {
    el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  });

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'U';

  const avatarElements = document.querySelectorAll('.js-user-avatar');
  avatarElements.forEach(el => {
    el.textContent = initials;
  });
}

/**
 * Handle non-dashboard navigation links with Phase 2 alert
 */
function setupNavigationInteractions() {
  const futureFeatureElements = document.querySelectorAll('.js-future-feature');
  futureFeatureElements.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const featureTitle = item.getAttribute('data-title') || item.innerText.trim();
      showComingSoonModal(featureTitle);
    });
  });
}

/**
 * Focus Trap Utility for Menus and Drawers
 */
function trapFocusHelper(element, onEscape) {
  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (typeof onEscape === 'function') onEscape();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(element.querySelectorAll(focusableSelector));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  return function removeTrap() {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Responsive mobile sidebar drawer with ARIA, Focus Trap & Escape Handler
 */
function setupSidebarDrawer() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('drawerBackdrop');

  if (!toggleBtn || !sidebar || !backdrop) return;

  toggleBtn.setAttribute('aria-expanded', 'false');
  sidebar.setAttribute('aria-label', 'Main Navigation');
  let drawerTrapCleanup = null;

  function openDrawer() {
    sidebar.classList.add('drawer-open');
    backdrop.classList.add('show');
    toggleBtn.setAttribute('aria-expanded', 'true');

    if (drawerTrapCleanup) drawerTrapCleanup();
    drawerTrapCleanup = trapFocusHelper(sidebar, closeDrawer);

    const firstLink = sidebar.querySelector('a, button');
    if (firstLink) setTimeout(() => firstLink.focus(), 60);
  }

  function closeDrawer() {
    sidebar.classList.remove('drawer-open');
    backdrop.classList.remove('show');
    toggleBtn.setAttribute('aria-expanded', 'false');

    if (drawerTrapCleanup) {
      drawerTrapCleanup();
      drawerTrapCleanup = null;
    }
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('drawer-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('drawer-open')) {
      closeDrawer();
    }
  });
}

/**
 * User Profile Dropdown Menu in Topbar with Dynamic ARIA, Escape & Focus Trap
 */
function setupProfileDropdown() {
  const profileTrigger = document.getElementById('profileDropdownTrigger');
  const dropdownMenu = document.getElementById('profileDropdownMenu');

  if (!profileTrigger || !dropdownMenu) return;

  profileTrigger.setAttribute('aria-expanded', 'false');
  let dropdownTrapCleanup = null;

  function openDropdown() {
    dropdownMenu.classList.add('show');
    profileTrigger.setAttribute('aria-expanded', 'true');

    if (dropdownTrapCleanup) dropdownTrapCleanup();
    dropdownTrapCleanup = trapFocusHelper(dropdownMenu, closeDropdown);

    const firstItem = dropdownMenu.querySelector('button, a');
    if (firstItem) setTimeout(() => firstItem.focus(), 50);
  }

  function closeDropdown() {
    dropdownMenu.classList.remove('show');
    profileTrigger.setAttribute('aria-expanded', 'false');

    if (dropdownTrapCleanup) {
      dropdownTrapCleanup();
      dropdownTrapCleanup = null;
    }
    profileTrigger.focus();
  }

  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.classList.contains('show');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  document.addEventListener('click', (e) => {
    if (!profileTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
      if (dropdownMenu.classList.contains('show')) {
        closeDropdown();
      }
    }
  });
}

/**
 * Logout Button Binding
 */
function setupLogoutButtons() {
  const logoutButtons = document.querySelectorAll('.js-logout-btn');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        logout();
      }
    });
  });
}

// =========================================================================
// LANGKAH 4 & 5: DYNAMIC FETCH RENDERING, SKELETON, ERROR STATE & REAL CRUD
// =========================================================================

let cachedClasses = [];
let cachedActivities = [];
let cachedAssignments = [];
let cachedRubrics = [];
let cachedAssessments = [];
let cachedDosenAssignments = [];

const RUBRICS_STORAGE_KEY = 'aiac_rubrics';
const ASSESSMENTS_STORAGE_KEY = 'aiac_assessments';
const DOSEN_ASSIGNMENTS_STORAGE_KEY = 'aiac_dosen_assignments';

/**
 * DOSEN DASHBOARD FEATURES
 * Halaman dosen (dosen.html, classes.html, rubrics.html, dst) berbagi
 * satu file JS ini. Setiap fitur di-init HANYA jika container-nya
 * memang ada di halaman yang sedang dibuka, supaya tidak saling bentrok
 * (misalnya rebutan #topbarSearchInput).
 */
async function initDosenFeatures() {
  const tasks = [];

  if (document.getElementById('classesListContainer')) {
    tasks.push(loadClassesData());
  }
  if (document.getElementById('activitiesListContainer')) {
    tasks.push(loadActivitiesData());
  }
  if (document.getElementById('rubricsListContainer')) {
    tasks.push(loadRubricsData());
  }
  if (document.getElementById('assessmentsListContainer')) {
    tasks.push(loadAssessmentsData());
  }
  if (document.getElementById('dosenAssignmentsListContainer')) {
    tasks.push(loadDosenAssignmentsData());
  }

  await Promise.all(tasks);

  if (document.getElementById('classesListContainer') || document.getElementById('createClassBtn')) {
    setupClassCrud();
  }
  if (document.getElementById('rubricsListContainer') || document.getElementById('createRubricBtn')) {
    setupRubricCrud();
  }
  if (document.getElementById('assessmentsListContainer') || document.getElementById('createAssessmentBtn')) {
    setupAssessmentCrud();
  }
  if (document.getElementById('dosenAssignmentsListContainer') || document.getElementById('createAssignmentBtn')) {
    setupDosenAssignmentCrud();
  }

  setupDosenSearchFilter();
}

/**
 * Load and render Classes with Skeleton & Error Handling
 */
async function loadClassesData() {
  const container = document.getElementById('classesListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-3" aria-busy="true" aria-label="Loading classes">
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>
  `;

  try {
    const classes = await window.apiService.fetchClasses();
    cachedClasses = classes;
    renderClassesList(classes);
    updateTotalClassesStat(classes.length);
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <i data-lucide="alert-circle" style="width: 18px; height: 18px; shrink: 0;"></i>
          <span>${error.message || 'Gagal memuat data kelas.'}</span>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadClassesData()">Coba Lagi</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
  }
}

function renderClassesList(classes) {
  const container = document.getElementById('classesListContainer');
  if (!container) return;

  if (classes.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-text-secondary bg-slate-50 rounded-lg border border-dashed border-border-color">
        <i data-lucide="folder-open" style="width: 32px; height: 32px; margin: 0 auto 8px; color: var(--text-muted);"></i>
        <p class="font-medium text-sm">Belum ada kelas yang dibuat.</p>
        <p class="text-xs text-text-muted mt-1">Klik tombol "Create Class" di atas untuk menambahkan kelas pertama Anda.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
    return;
  }

  container.innerHTML = classes
    .map((cls) => {
      const badgeHtml = window.badgeVariants 
        ? `<span class="${window.badgeVariants({ variant: cls.status || 'active', size: 'md' })}">${cls.status === 'active' ? 'Active' : cls.status}</span>`
        : `<span class="badge badge-active">${cls.status}</span>`;

      return `
        <div class="list-item flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border-light bg-slate-50/50 hover:bg-slate-50 transition gap-3" data-id="${cls.id}">
          <div class="item-main flex flex-col">
            <div class="flex items-center gap-2">
              <span class="item-title text-sm font-semibold text-text-primary">${escapeHtml(cls.name)}</span>
              ${badgeHtml}
            </div>
            <div class="item-meta flex items-center gap-4 text-xs text-text-secondary mt-1">
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="users" style="width: 14px; height: 14px;"></i>
                ${cls.studentsCount} Students
              </span>
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="files" style="width: 14px; height: 14px;"></i>
                ${cls.assignmentsCount} Assignments
              </span>
              <span class="hidden md:inline-flex text-[11px] text-text-muted">
                ${escapeHtml(cls.semester || '')}
              </span>
            </div>
          </div>
          <div class="item-actions flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button type="button" class="js-edit-class p-1.5 text-text-secondary hover:text-primary-green hover:bg-white rounded transition" title="Edit Kelas" aria-label="Edit Kelas ${escapeHtml(cls.name)}" data-id="${cls.id}">
              <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
            </button>
            <button type="button" class="js-delete-class p-1.5 text-text-secondary hover:text-status-danger-text hover:bg-white rounded transition" title="Hapus Kelas" aria-label="Hapus Kelas ${escapeHtml(cls.name)}" data-id="${cls.id}">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }
}

function updateTotalClassesStat(count) {
  const statEl = document.querySelector('.stat-card .stat-value');
  if (statEl) {
    statEl.textContent = count;
  }
}

/**
 * Load and render Activities (Dosen)
 */
async function loadActivitiesData() {
  const container = document.getElementById('activitiesListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-4" aria-busy="true">
      <div class="h-12 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-12 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-12 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>
  `;

  try {
    const activities = await window.apiService.fetchActivities();
    cachedActivities = activities;
    container.innerHTML = activities
      .map(
        (act) => `
        <div class="timeline-item flex items-start gap-3.5">
          <div class="timeline-icon w-8 h-8 rounded-full bg-light-green text-primary-green flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="${act.icon || 'activity'}" style="width: 15px; height: 15px;"></i>
          </div>
          <div class="timeline-content flex flex-col">
            <div class="timeline-text text-sm text-text-primary">
              <strong>${escapeHtml(act.actor)}</strong> ${escapeHtml(act.action)}
            </div>
            <div class="timeline-time text-xs text-text-muted mt-0.5">${escapeHtml(act.timeAgo)} • ${escapeHtml(act.context)}</div>
          </div>
        </div>
      `
      )
      .join('');

    if (window.lucide) window.lucide.createIcons({ root: container });
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex items-center justify-between">
        <span>${error.message || 'Gagal memuat aktivitas terkini.'}</span>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadActivitiesData()">Coba Lagi</button>
      </div>
    `;
  }
}

/**
 * CRUD Event Delegation & Modal for Classes (LANGKAH 5)
 */
function setupClassCrud() {
  const container = document.getElementById('classesListContainer');
  const createClassBtn = document.getElementById('createClassBtn');
  const classModal = document.getElementById('classModal');
  const classForm = document.getElementById('classForm');
  const closeBtn = document.getElementById('closeClassModalBtn');
  const cancelBtn = document.getElementById('cancelClassModalBtn');
  const modalTitle = document.getElementById('classModalTitle');
  const classIdInput = document.getElementById('classIdInput');
  const classNameInput = document.getElementById('classNameInput');
  const classStudentsInput = document.getElementById('classStudentsInput');
  const classAssignmentsInput = document.getElementById('classAssignmentsInput');
  const classSemesterInput = document.getElementById('classSemesterInput');
  const nameFeedback = document.getElementById('classNameFeedback');
  const studentsFeedback = document.getElementById('classStudentsFeedback');
  const assignmentsFeedback = document.getElementById('classAssignmentsFeedback');

  if (!classModal || !classForm) return;

  function showFieldError(input, feedbackEl, msg) {
    if (input) input.classList.add('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = msg;
      feedbackEl.classList.add('show');
    }
  }

  function clearFieldError(input, feedbackEl) {
    if (input) input.classList.remove('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('show');
    }
  }

  let classModalTrap = null;
  let modalTrigger = null;

  function openClassModal(mode = 'create', classData = null) {
    modalTrigger = document.activeElement;
    if (mode === 'edit' && classData) {
      modalTitle.textContent = 'Edit Kelas';
      classIdInput.value = classData.id;
      classNameInput.value = classData.name;
      classStudentsInput.value = classData.studentsCount;
      classAssignmentsInput.value = classData.assignmentsCount;
      classSemesterInput.value = classData.semester || 'Semester Genap 2025/2026';
    } else {
      modalTitle.textContent = 'Create New Class';
      classForm.reset();
      classIdInput.value = '';
      classStudentsInput.value = '';
      classAssignmentsInput.value = '';
      classSemesterInput.value = 'Semester Genap 2025/2026';
    }

    clearFieldError(classNameInput, nameFeedback);
    clearFieldError(classStudentsInput, studentsFeedback);
    clearFieldError(classAssignmentsInput, assignmentsFeedback);

    classModal.classList.add('show');
    if (window.lucide) window.lucide.createIcons({ root: classModal });

    if (classModalTrap) classModalTrap();
    classModalTrap = trapFocusHelper(classModal, closeClassModal);
    setTimeout(() => classNameInput.focus(), 60);
  }

  function closeClassModal() {
    classModal.classList.remove('show');
    if (classModalTrap) {
      classModalTrap();
      classModalTrap = null;
    }
    if (modalTrigger) modalTrigger.focus();
  }

  if (createClassBtn) {
    createClassBtn.addEventListener('click', () => openClassModal('create'));
  }

  if (closeBtn) closeBtn.addEventListener('click', closeClassModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeClassModal);

  if (classModal) {
    classModal.addEventListener('click', (e) => {
      if (e.target === classModal) closeClassModal();
    });
  }

  if (container) {
    container.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.js-edit-class');
      const deleteBtn = e.target.closest('.js-delete-class');

      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const targetClass = cachedClasses.find((c) => c.id === id);
        if (targetClass) {
          openClassModal('edit', targetClass);
        }
      } else if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        const targetClass = cachedClasses.find((c) => c.id === id);
        const className = targetClass ? targetClass.name : 'kelas ini';

        if (confirm(`Apakah Anda yakin ingin menghapus "${className}"? Data akan dihapus permanen.`)) {
          try {
            await window.apiService.deleteClass(id);
            cachedClasses = cachedClasses.filter((c) => c.id !== id);
            renderClassesList(cachedClasses);
            updateTotalClassesStat(cachedClasses.length);
            showToast(`Kelas "${className}" berhasil dihapus.`, 'success');
          } catch (err) {
            showToast(err.message || 'Gagal menghapus kelas.', 'error');
          }
        }
      }
    });
  }

  if (classForm) {
    classForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = classNameInput.value.trim();
      const studentsRaw = classStudentsInput.value.trim();
      const assignmentsRaw = classAssignmentsInput.value.trim();
      const semester = classSemesterInput.value.trim();
      const editId = classIdInput.value;

      let hasError = false;

      if (!name) {
        showFieldError(classNameInput, nameFeedback, 'Nama kelas wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(classNameInput, nameFeedback);
      }

      const studentsCount = parseInt(studentsRaw, 10);
      if (!studentsRaw || isNaN(studentsCount) || studentsCount < 1) {
        showFieldError(classStudentsInput, studentsFeedback, 'Masukkan angka positif (min. 1).');
        hasError = true;
      } else {
        clearFieldError(classStudentsInput, studentsFeedback);
      }

      const assignmentsCount = parseInt(assignmentsRaw, 10);
      if (!assignmentsRaw || isNaN(assignmentsCount) || assignmentsCount < 1) {
        showFieldError(classAssignmentsInput, assignmentsFeedback, 'Masukkan angka positif (min. 1).');
        hasError = true;
      } else {
        clearFieldError(classAssignmentsInput, assignmentsFeedback);
      }

      if (hasError) {
        if (classNameInput.classList.contains('input-error')) classNameInput.focus();
        else if (classStudentsInput.classList.contains('input-error')) classStudentsInput.focus();
        else if (classAssignmentsInput.classList.contains('input-error')) classAssignmentsInput.focus();
        return;
      }

      try {
        if (editId) {
          const updated = await window.apiService.updateClass(editId, {
            name,
            studentsCount,
            assignmentsCount,
            semester,
          });
          const idx = cachedClasses.findIndex((c) => c.id === editId);
          if (idx !== -1) cachedClasses[idx] = updated;
          showToast(`Kelas "${name}" berhasil diperbarui.`, 'success');
        } else {
          const created = await window.apiService.createClass({
            name,
            studentsCount,
            assignmentsCount,
            semester,
          });
          cachedClasses.unshift(created);
          showToast(`Kelas "${name}" berhasil ditambahkan.`, 'success');
        }

        renderClassesList(cachedClasses);
        updateTotalClassesStat(cachedClasses.length);
        closeClassModal();
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan kelas.', 'error');
      }
    });
  }
}

// =========================================================================
// RUBRICS CRUD (localStorage) — pola SAMA PERSIS dengan Classes
// =========================================================================

function readRubricsFromStorage() {
  try {
    const raw = localStorage.getItem(RUBRICS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeRubricsToStorage(rubrics) {
  localStorage.setItem(RUBRICS_STORAGE_KEY, JSON.stringify(rubrics));
}

function getSeedRubrics() {
  return [
    {
      id: 'rub-001',
      name: 'Rubrik Penilaian Tugas Akhir',
      course: 'Pemrograman Web',
      criteriaCount: 5,
      totalWeight: 100,
    },
    {
      id: 'rub-002',
      name: 'Rubrik Presentasi Proyek',
      course: 'Basis Data',
      criteriaCount: 4,
      totalWeight: 100,
    },
  ];
}

function generateRubricId() {
  return 'rub-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Simulasi async "API" ke localStorage supaya konsisten dengan pola
 * apiService (fetch/create/update/delete) yang dipakai Classes.
 */
const rubricStorageService = {
  async fetchAll() {
    let rubrics = readRubricsFromStorage();
    if (rubrics === null) {
      rubrics = getSeedRubrics();
      writeRubricsToStorage(rubrics);
    }
    return rubrics;
  },
  async create(data) {
    const rubrics = readRubricsFromStorage() || [];
    const newRubric = { id: generateRubricId(), ...data };
    rubrics.unshift(newRubric);
    writeRubricsToStorage(rubrics);
    return newRubric;
  },
  async update(id, data) {
    const rubrics = readRubricsFromStorage() || [];
    const idx = rubrics.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Rubrik tidak ditemukan.');
    rubrics[idx] = { ...rubrics[idx], ...data };
    writeRubricsToStorage(rubrics);
    return rubrics[idx];
  },
  async remove(id) {
    const rubrics = readRubricsFromStorage() || [];
    const filtered = rubrics.filter((r) => r.id !== id);
    writeRubricsToStorage(filtered);
    return true;
  },
};

async function loadRubricsData() {
  const container = document.getElementById('rubricsListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-3" aria-busy="true" aria-label="Loading rubrics">
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>
  `;

  try {
    const rubrics = await rubricStorageService.fetchAll();
    cachedRubrics = rubrics;
    renderRubricsList(rubrics);
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <i data-lucide="alert-circle" style="width: 18px; height: 18px; shrink: 0;"></i>
          <span>${error.message || 'Gagal memuat data rubrik.'}</span>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadRubricsData()">Coba Lagi</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
  }
}

function renderRubricsList(rubrics) {
  const container = document.getElementById('rubricsListContainer');
  if (!container) return;

  if (rubrics.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-text-secondary bg-slate-50 rounded-lg border border-dashed border-border-color">
        <i data-lucide="file-check-2" style="width: 32px; height: 32px; margin: 0 auto 8px; color: var(--text-muted);"></i>
        <p class="font-medium text-sm">Belum ada rubrik yang dibuat.</p>
        <p class="text-xs text-text-muted mt-1">Klik tombol "Create Rubric" di atas untuk menambahkan rubrik pertama Anda.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
    return;
  }

  container.innerHTML = rubrics
    .map((rub) => {
      return `
        <div class="list-item flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border-light bg-slate-50/50 hover:bg-slate-50 transition gap-3" data-id="${rub.id}">
          <div class="item-main flex flex-col">
            <div class="flex items-center gap-2">
              <span class="item-title text-sm font-semibold text-text-primary">${escapeHtml(rub.name)}</span>
            </div>
            <div class="item-meta flex items-center gap-4 text-xs text-text-secondary mt-1">
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="book" style="width: 14px; height: 14px;"></i>
                ${escapeHtml(rub.course)}
              </span>
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="list-checks" style="width: 14px; height: 14px;"></i>
                ${rub.criteriaCount} Kriteria
              </span>
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="percent" style="width: 14px; height: 14px;"></i>
                Bobot ${rub.totalWeight}%
              </span>
            </div>
          </div>
          <div class="item-actions flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button type="button" class="js-edit-rubric p-1.5 text-text-secondary hover:text-primary-green hover:bg-white rounded transition" title="Edit Rubrik" aria-label="Edit Rubrik ${escapeHtml(rub.name)}" data-id="${rub.id}">
              <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
            </button>
            <button type="button" class="js-delete-rubric p-1.5 text-text-secondary hover:text-status-danger-text hover:bg-white rounded transition" title="Hapus Rubrik" aria-label="Hapus Rubrik ${escapeHtml(rub.name)}" data-id="${rub.id}">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }
}

function setupRubricCrud() {
  const container = document.getElementById('rubricsListContainer');
  const createRubricBtn = document.getElementById('createRubricBtn');
  const rubricModal = document.getElementById('rubricModal');
  const rubricForm = document.getElementById('rubricForm');
  const closeBtn = document.getElementById('closeRubricModalBtn');
  const cancelBtn = document.getElementById('cancelRubricModalBtn');
  const modalTitle = document.getElementById('rubricModalTitle');
  const rubricIdInput = document.getElementById('rubricIdInput');
  const rubricNameInput = document.getElementById('rubricNameInput');
  const rubricCourseInput = document.getElementById('rubricCourseInput');
  const rubricCriteriaInput = document.getElementById('rubricCriteriaInput');
  const rubricWeightInput = document.getElementById('rubricWeightInput');
  const nameFeedback = document.getElementById('rubricNameFeedback');
  const courseFeedback = document.getElementById('rubricCourseFeedback');
  const criteriaFeedback = document.getElementById('rubricCriteriaFeedback');
  const weightFeedback = document.getElementById('rubricWeightFeedback');

  if (!rubricModal || !rubricForm) return;

  function showFieldError(input, feedbackEl, msg) {
    if (input) input.classList.add('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = msg;
      feedbackEl.classList.add('show');
    }
  }

  function clearFieldError(input, feedbackEl) {
    if (input) input.classList.remove('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('show');
    }
  }

  let rubricModalTrap = null;
  let modalTrigger = null;

  function openRubricModal(mode = 'create', rubricData = null) {
    modalTrigger = document.activeElement;
    if (mode === 'edit' && rubricData) {
      modalTitle.textContent = 'Edit Rubrik';
      rubricIdInput.value = rubricData.id;
      rubricNameInput.value = rubricData.name;
      rubricCourseInput.value = rubricData.course;
      rubricCriteriaInput.value = rubricData.criteriaCount;
      rubricWeightInput.value = rubricData.totalWeight;
    } else {
      modalTitle.textContent = 'Create New Rubric';
      rubricForm.reset();
      rubricIdInput.value = '';
      rubricCriteriaInput.value = '';
      rubricWeightInput.value = '';
    }

    clearFieldError(rubricNameInput, nameFeedback);
    clearFieldError(rubricCourseInput, courseFeedback);
    clearFieldError(rubricCriteriaInput, criteriaFeedback);
    clearFieldError(rubricWeightInput, weightFeedback);

    rubricModal.classList.add('show');
    if (window.lucide) window.lucide.createIcons({ root: rubricModal });

    if (rubricModalTrap) rubricModalTrap();
    rubricModalTrap = trapFocusHelper(rubricModal, closeRubricModal);
    setTimeout(() => rubricNameInput.focus(), 60);
  }

  function closeRubricModal() {
    rubricModal.classList.remove('show');
    if (rubricModalTrap) {
      rubricModalTrap();
      rubricModalTrap = null;
    }
    if (modalTrigger) modalTrigger.focus();
  }

  if (createRubricBtn) {
    createRubricBtn.addEventListener('click', () => openRubricModal('create'));
  }

  if (closeBtn) closeBtn.addEventListener('click', closeRubricModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeRubricModal);

  if (rubricModal) {
    rubricModal.addEventListener('click', (e) => {
      if (e.target === rubricModal) closeRubricModal();
    });
  }

  if (container) {
    container.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.js-edit-rubric');
      const deleteBtn = e.target.closest('.js-delete-rubric');

      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const targetRubric = cachedRubrics.find((r) => r.id === id);
        if (targetRubric) {
          openRubricModal('edit', targetRubric);
        }
      } else if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        const targetRubric = cachedRubrics.find((r) => r.id === id);
        const rubricName = targetRubric ? targetRubric.name : 'rubrik ini';

        if (confirm(`Apakah Anda yakin ingin menghapus "${rubricName}"? Data akan dihapus permanen.`)) {
          try {
            await rubricStorageService.remove(id);
            cachedRubrics = cachedRubrics.filter((r) => r.id !== id);
            renderRubricsList(cachedRubrics);
            showToast(`Rubrik "${rubricName}" berhasil dihapus.`, 'success');
          } catch (err) {
            showToast(err.message || 'Gagal menghapus rubrik.', 'error');
          }
        }
      }
    });
  }

  if (rubricForm) {
    rubricForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = rubricNameInput.value.trim();
      const course = rubricCourseInput.value.trim();
      const criteriaRaw = rubricCriteriaInput.value.trim();
      const weightRaw = rubricWeightInput.value.trim();
      const editId = rubricIdInput.value;

      let hasError = false;

      if (!name) {
        showFieldError(rubricNameInput, nameFeedback, 'Nama rubrik wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(rubricNameInput, nameFeedback);
      }

      if (!course) {
        showFieldError(rubricCourseInput, courseFeedback, 'Mata kuliah wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(rubricCourseInput, courseFeedback);
      }

      const criteriaCount = parseInt(criteriaRaw, 10);
      if (!criteriaRaw || isNaN(criteriaCount) || criteriaCount < 1) {
        showFieldError(rubricCriteriaInput, criteriaFeedback, 'Masukkan angka positif (min. 1).');
        hasError = true;
      } else {
        clearFieldError(rubricCriteriaInput, criteriaFeedback);
      }

      const totalWeight = parseInt(weightRaw, 10);
      if (!weightRaw || isNaN(totalWeight) || totalWeight < 1 || totalWeight > 100) {
        showFieldError(rubricWeightInput, weightFeedback, 'Masukkan angka 1 - 100.');
        hasError = true;
      } else {
        clearFieldError(rubricWeightInput, weightFeedback);
      }

      if (hasError) {
        if (rubricNameInput.classList.contains('input-error')) rubricNameInput.focus();
        else if (rubricCourseInput.classList.contains('input-error')) rubricCourseInput.focus();
        else if (rubricCriteriaInput.classList.contains('input-error')) rubricCriteriaInput.focus();
        else if (rubricWeightInput.classList.contains('input-error')) rubricWeightInput.focus();
        return;
      }

      try {
        if (editId) {
          const updated = await rubricStorageService.update(editId, {
            name,
            course,
            criteriaCount,
            totalWeight,
          });
          const idx = cachedRubrics.findIndex((r) => r.id === editId);
          if (idx !== -1) cachedRubrics[idx] = updated;
          showToast(`Rubrik "${name}" berhasil diperbarui.`, 'success');
        } else {
          const created = await rubricStorageService.create({
            name,
            course,
            criteriaCount,
            totalWeight,
          });
          cachedRubrics.unshift(created);
          showToast(`Rubrik "${name}" berhasil ditambahkan.`, 'success');
        }

        renderRubricsList(cachedRubrics);
        closeRubricModal();
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan rubrik.', 'error');
      }
    });
  }
}

// =========================================================================
// ASSESSMENTS CRUD (localStorage) — pola SAMA PERSIS dengan Classes/Rubrics
// =========================================================================

function readAssessmentsFromStorage() {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeAssessmentsToStorage(assessments) {
  localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
}

function getSeedAssessments() {
  return [
    {
      id: 'asm-001',
      name: 'UAS Pemrograman Web',
      course: 'Pemrograman Web',
      status: 'in-review',
      gradedCount: 18,
    },
    {
      id: 'asm-002',
      name: 'UTS Basis Data',
      course: 'Basis Data',
      status: 'finalized',
      gradedCount: 28,
    },
  ];
}

function generateAssessmentId() {
  return 'asm-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Simulasi async "API" ke localStorage supaya konsisten dengan pola
 * apiService (fetch/create/update/delete) yang dipakai Classes & Rubrics.
 */
const assessmentStorageService = {
  async fetchAll() {
    let assessments = readAssessmentsFromStorage();
    if (assessments === null) {
      assessments = getSeedAssessments();
      writeAssessmentsToStorage(assessments);
    }
    return assessments;
  },
  async create(data) {
    const assessments = readAssessmentsFromStorage() || [];
    const newAssessment = { id: generateAssessmentId(), ...data };
    assessments.unshift(newAssessment);
    writeAssessmentsToStorage(assessments);
    return newAssessment;
  },
  async update(id, data) {
    const assessments = readAssessmentsFromStorage() || [];
    const idx = assessments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Assessment tidak ditemukan.');
    assessments[idx] = { ...assessments[idx], ...data };
    writeAssessmentsToStorage(assessments);
    return assessments[idx];
  },
  async remove(id) {
    const assessments = readAssessmentsFromStorage() || [];
    const filtered = assessments.filter((a) => a.id !== id);
    writeAssessmentsToStorage(filtered);
    return true;
  },
};

function assessmentStatusLabel(status) {
  if (status === 'draft') return 'Draft';
  if (status === 'in-review') return 'In Review';
  if (status === 'finalized') return 'Finalized';
  return status;
}

function assessmentStatusBadgeVariant(status) {
  // Dipetakan ke variant badge yang sudah ada di sistem badge lain
  if (status === 'finalized') return 'graded';
  if (status === 'in-review') return 'pending';
  return 'submitted'; // draft
}

async function loadAssessmentsData() {
  const container = document.getElementById('assessmentsListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-3" aria-busy="true" aria-label="Loading assessments">
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>
  `;

  try {
    const assessments = await assessmentStorageService.fetchAll();
    cachedAssessments = assessments;
    renderAssessmentsList(assessments);
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <i data-lucide="alert-circle" style="width: 18px; height: 18px; shrink: 0;"></i>
          <span>${error.message || 'Gagal memuat data assessment.'}</span>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadAssessmentsData()">Coba Lagi</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
  }
}

function renderAssessmentsList(assessments) {
  const container = document.getElementById('assessmentsListContainer');
  if (!container) return;

  if (assessments.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-text-secondary bg-slate-50 rounded-lg border border-dashed border-border-color">
        <i data-lucide="clipboard-check" style="width: 32px; height: 32px; margin: 0 auto 8px; color: var(--text-muted);"></i>
        <p class="font-medium text-sm">Belum ada assessment yang dibuat.</p>
        <p class="text-xs text-text-muted mt-1">Klik tombol "Create Assessment" di atas untuk menambahkan assessment pertama Anda.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
    return;
  }

  container.innerHTML = assessments
    .map((asm) => {
      const badgeHtml = window.badgeVariants
        ? `<span class="${window.badgeVariants({ variant: assessmentStatusBadgeVariant(asm.status), size: 'md' })}">${assessmentStatusLabel(asm.status)}</span>`
        : `<span class="badge badge-${asm.status}">${assessmentStatusLabel(asm.status)}</span>`;

      return `
        <div class="list-item flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border-light bg-slate-50/50 hover:bg-slate-50 transition gap-3" data-id="${asm.id}">
          <div class="item-main flex flex-col">
            <div class="flex items-center gap-2">
              <span class="item-title text-sm font-semibold text-text-primary">${escapeHtml(asm.name)}</span>
              ${badgeHtml}
            </div>
            <div class="item-meta flex items-center gap-4 text-xs text-text-secondary mt-1">
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="book" style="width: 14px; height: 14px;"></i>
                ${escapeHtml(asm.course)}
              </span>
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>
                ${asm.gradedCount} Submission Dinilai
              </span>
            </div>
          </div>
          <div class="item-actions flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button type="button" class="js-edit-assessment p-1.5 text-text-secondary hover:text-primary-green hover:bg-white rounded transition" title="Edit Assessment" aria-label="Edit Assessment ${escapeHtml(asm.name)}" data-id="${asm.id}">
              <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
            </button>
            <button type="button" class="js-delete-assessment p-1.5 text-text-secondary hover:text-status-danger-text hover:bg-white rounded transition" title="Hapus Assessment" aria-label="Hapus Assessment ${escapeHtml(asm.name)}" data-id="${asm.id}">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }
}

function setupAssessmentCrud() {
  const container = document.getElementById('assessmentsListContainer');
  const createAssessmentBtn = document.getElementById('createAssessmentBtn');
  const assessmentModal = document.getElementById('assessmentModal');
  const assessmentForm = document.getElementById('assessmentForm');
  const closeBtn = document.getElementById('closeAssessmentModalBtn');
  const cancelBtn = document.getElementById('cancelAssessmentModalBtn');
  const modalTitle = document.getElementById('assessmentModalTitle');
  const assessmentIdInput = document.getElementById('assessmentIdInput');
  const assessmentNameInput = document.getElementById('assessmentNameInput');
  const assessmentCourseInput = document.getElementById('assessmentCourseInput');
  const assessmentStatusInput = document.getElementById('assessmentStatusInput');
  const assessmentGradedInput = document.getElementById('assessmentGradedInput');
  const nameFeedback = document.getElementById('assessmentNameFeedback');
  const courseFeedback = document.getElementById('assessmentCourseFeedback');
  const statusFeedback = document.getElementById('assessmentStatusFeedback');
  const gradedFeedback = document.getElementById('assessmentGradedFeedback');

  if (!assessmentModal || !assessmentForm) return;

  function showFieldError(input, feedbackEl, msg) {
    if (input) input.classList.add('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = msg;
      feedbackEl.classList.add('show');
    }
  }

  function clearFieldError(input, feedbackEl) {
    if (input) input.classList.remove('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('show');
    }
  }

  let assessmentModalTrap = null;
  let modalTrigger = null;

  function openAssessmentModal(mode = 'create', assessmentData = null) {
    modalTrigger = document.activeElement;
    if (mode === 'edit' && assessmentData) {
      modalTitle.textContent = 'Edit Assessment';
      assessmentIdInput.value = assessmentData.id;
      assessmentNameInput.value = assessmentData.name;
      assessmentCourseInput.value = assessmentData.course;
      assessmentStatusInput.value = assessmentData.status || 'draft';
      assessmentGradedInput.value = assessmentData.gradedCount;
    } else {
      modalTitle.textContent = 'Create New Assessment';
      assessmentForm.reset();
      assessmentIdInput.value = '';
      assessmentStatusInput.value = 'draft';
      assessmentGradedInput.value = '';
    }

    clearFieldError(assessmentNameInput, nameFeedback);
    clearFieldError(assessmentCourseInput, courseFeedback);
    clearFieldError(assessmentStatusInput, statusFeedback);
    clearFieldError(assessmentGradedInput, gradedFeedback);

    assessmentModal.classList.add('show');
    if (window.lucide) window.lucide.createIcons({ root: assessmentModal });

    if (assessmentModalTrap) assessmentModalTrap();
    assessmentModalTrap = trapFocusHelper(assessmentModal, closeAssessmentModal);
    setTimeout(() => assessmentNameInput.focus(), 60);
  }

  function closeAssessmentModal() {
    assessmentModal.classList.remove('show');
    if (assessmentModalTrap) {
      assessmentModalTrap();
      assessmentModalTrap = null;
    }
    if (modalTrigger) modalTrigger.focus();
  }

  if (createAssessmentBtn) {
    createAssessmentBtn.addEventListener('click', () => openAssessmentModal('create'));
  }

  if (closeBtn) closeBtn.addEventListener('click', closeAssessmentModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeAssessmentModal);

  if (assessmentModal) {
    assessmentModal.addEventListener('click', (e) => {
      if (e.target === assessmentModal) closeAssessmentModal();
    });
  }

  if (container) {
    container.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.js-edit-assessment');
      const deleteBtn = e.target.closest('.js-delete-assessment');

      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const targetAssessment = cachedAssessments.find((a) => a.id === id);
        if (targetAssessment) {
          openAssessmentModal('edit', targetAssessment);
        }
      } else if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        const targetAssessment = cachedAssessments.find((a) => a.id === id);
        const assessmentName = targetAssessment ? targetAssessment.name : 'assessment ini';

        if (confirm(`Apakah Anda yakin ingin menghapus "${assessmentName}"? Data akan dihapus permanen.`)) {
          try {
            await assessmentStorageService.remove(id);
            cachedAssessments = cachedAssessments.filter((a) => a.id !== id);
            renderAssessmentsList(cachedAssessments);
            showToast(`Assessment "${assessmentName}" berhasil dihapus.`, 'success');
          } catch (err) {
            showToast(err.message || 'Gagal menghapus assessment.', 'error');
          }
        }
      }
    });
  }

  if (assessmentForm) {
    assessmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = assessmentNameInput.value.trim();
      const course = assessmentCourseInput.value.trim();
      const status = assessmentStatusInput.value;
      const gradedRaw = assessmentGradedInput.value.trim();
      const editId = assessmentIdInput.value;

      let hasError = false;

      if (!name) {
        showFieldError(assessmentNameInput, nameFeedback, 'Nama assessment wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(assessmentNameInput, nameFeedback);
      }

      if (!course) {
        showFieldError(assessmentCourseInput, courseFeedback, 'Mata kuliah wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(assessmentCourseInput, courseFeedback);
      }

      const validStatuses = ['draft', 'in-review', 'finalized'];
      if (!status || !validStatuses.includes(status)) {
        showFieldError(assessmentStatusInput, statusFeedback, 'Pilih status yang valid.');
        hasError = true;
      } else {
        clearFieldError(assessmentStatusInput, statusFeedback);
      }

      const gradedCount = parseInt(gradedRaw, 10);
      if (gradedRaw === '' || isNaN(gradedCount) || gradedCount < 0) {
        showFieldError(assessmentGradedInput, gradedFeedback, 'Masukkan angka 0 atau lebih.');
        hasError = true;
      } else {
        clearFieldError(assessmentGradedInput, gradedFeedback);
      }

      if (hasError) {
        if (assessmentNameInput.classList.contains('input-error')) assessmentNameInput.focus();
        else if (assessmentCourseInput.classList.contains('input-error')) assessmentCourseInput.focus();
        else if (assessmentStatusInput.classList.contains('input-error')) assessmentStatusInput.focus();
        else if (assessmentGradedInput.classList.contains('input-error')) assessmentGradedInput.focus();
        return;
      }

      try {
        if (editId) {
          const updated = await assessmentStorageService.update(editId, {
            name,
            course,
            status,
            gradedCount,
          });
          const idx = cachedAssessments.findIndex((a) => a.id === editId);
          if (idx !== -1) cachedAssessments[idx] = updated;
          showToast(`Assessment "${name}" berhasil diperbarui.`, 'success');
        } else {
          const created = await assessmentStorageService.create({
            name,
            course,
            status,
            gradedCount,
          });
          cachedAssessments.unshift(created);
          showToast(`Assessment "${name}" berhasil ditambahkan.`, 'success');
        }

        renderAssessmentsList(cachedAssessments);
        closeAssessmentModal();
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan assessment.', 'error');
      }
    });
  }
}

// =========================================================================
// ASSIGNMENTS CRUD — DOSEN (localStorage) — pola SAMA PERSIS dengan lainnya
// Catatan: sengaja diberi nama berbeda dari loadAssignmentsData/
// renderAssignmentsList/cachedAssignments milik halaman mahasiswa (read-only,
// via apiService) supaya tidak saling menimpa karena berbagi 1 file JS.
// =========================================================================

function readDosenAssignmentsFromStorage() {
  try {
    const raw = localStorage.getItem(DOSEN_ASSIGNMENTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeDosenAssignmentsToStorage(assignments) {
  localStorage.setItem(DOSEN_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
}

function getSeedDosenAssignments() {
  return [
    {
      id: 'dasg-001',
      title: 'Tugas Besar 1 - CRUD API',
      course: 'Pemrograman Web',
      deadline: '2026-10-15',
      description: 'Membangun REST API sederhana dengan operasi CRUD lengkap.',
    },
    {
      id: 'dasg-002',
      title: 'Normalisasi Database',
      course: 'Basis Data',
      deadline: '2026-10-20',
      description: 'Menormalisasi skema database studi kasus hingga 3NF.',
    },
  ];
}

function generateDosenAssignmentId() {
  return 'dasg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Simulasi async "API" ke localStorage supaya konsisten dengan pola
 * apiService (fetch/create/update/delete) yang dipakai fitur lain.
 */
const dosenAssignmentStorageService = {
  async fetchAll() {
    let assignments = readDosenAssignmentsFromStorage();
    if (assignments === null) {
      assignments = getSeedDosenAssignments();
      writeDosenAssignmentsToStorage(assignments);
    }
    return assignments;
  },
  async create(data) {
    const assignments = readDosenAssignmentsFromStorage() || [];
    const newAssignment = { id: generateDosenAssignmentId(), ...data };
    assignments.unshift(newAssignment);
    writeDosenAssignmentsToStorage(assignments);
    return newAssignment;
  },
  async update(id, data) {
    const assignments = readDosenAssignmentsFromStorage() || [];
    const idx = assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Tugas tidak ditemukan.');
    assignments[idx] = { ...assignments[idx], ...data };
    writeDosenAssignmentsToStorage(assignments);
    return assignments[idx];
  },
  async remove(id) {
    const assignments = readDosenAssignmentsFromStorage() || [];
    const filtered = assignments.filter((a) => a.id !== id);
    writeDosenAssignmentsToStorage(filtered);
    return true;
  },
};

function formatDeadlineDisplay(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

async function loadDosenAssignmentsData() {
  const container = document.getElementById('dosenAssignmentsListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-3" aria-busy="true" aria-label="Loading assignments">
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>
  `;

  try {
    const assignments = await dosenAssignmentStorageService.fetchAll();
    cachedDosenAssignments = assignments;
    renderDosenAssignmentsList(assignments);
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <i data-lucide="alert-circle" style="width: 18px; height: 18px; shrink: 0;"></i>
          <span>${error.message || 'Gagal memuat data tugas.'}</span>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadDosenAssignmentsData()">Coba Lagi</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
  }
}

function renderDosenAssignmentsList(assignments) {
  const container = document.getElementById('dosenAssignmentsListContainer');
  if (!container) return;

  if (assignments.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-text-secondary bg-slate-50 rounded-lg border border-dashed border-border-color">
        <i data-lucide="file-text" style="width: 32px; height: 32px; margin: 0 auto 8px; color: var(--text-muted);"></i>
        <p class="font-medium text-sm">Belum ada tugas yang dibuat.</p>
        <p class="text-xs text-text-muted mt-1">Klik tombol "Create Assignment" di atas untuk menambahkan tugas pertama Anda.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
    return;
  }

  container.innerHTML = assignments
    .map((asg) => {
      return `
        <div class="list-item flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border-light bg-slate-50/50 hover:bg-slate-50 transition gap-3" data-id="${asg.id}">
          <div class="item-main flex flex-col">
            <div class="flex items-center gap-2">
              <span class="item-title text-sm font-semibold text-text-primary">${escapeHtml(asg.title)}</span>
            </div>
            <div class="item-meta flex items-center gap-4 text-xs text-text-secondary mt-1">
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="book" style="width: 14px; height: 14px;"></i>
                ${escapeHtml(asg.course)}
              </span>
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                Deadline: ${formatDeadlineDisplay(asg.deadline)}
              </span>
              ${asg.description ? `<span class="hidden md:inline-flex text-[11px] text-text-muted truncate max-w-[240px]">${escapeHtml(asg.description)}</span>` : ''}
            </div>
          </div>
          <div class="item-actions flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button type="button" class="js-edit-dosen-assignment p-1.5 text-text-secondary hover:text-primary-green hover:bg-white rounded transition" title="Edit Tugas" aria-label="Edit Tugas ${escapeHtml(asg.title)}" data-id="${asg.id}">
              <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
            </button>
            <button type="button" class="js-delete-dosen-assignment p-1.5 text-text-secondary hover:text-status-danger-text hover:bg-white rounded transition" title="Hapus Tugas" aria-label="Hapus Tugas ${escapeHtml(asg.title)}" data-id="${asg.id}">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }
}

function setupDosenAssignmentCrud() {
  const container = document.getElementById('dosenAssignmentsListContainer');
  const createAssignmentBtn = document.getElementById('createAssignmentBtn');
  const assignmentModal = document.getElementById('assignmentModal');
  const assignmentForm = document.getElementById('assignmentForm');
  const closeBtn = document.getElementById('closeAssignmentModalBtn');
  const cancelBtn = document.getElementById('cancelAssignmentModalBtn');
  const modalTitle = document.getElementById('assignmentModalTitle');
  const assignmentIdInput = document.getElementById('assignmentIdInput');
  const assignmentTitleInput = document.getElementById('assignmentTitleInput');
  const assignmentCourseInput = document.getElementById('assignmentCourseInput');
  const assignmentDeadlineInput = document.getElementById('assignmentDeadlineInput');
  const assignmentDescriptionInput = document.getElementById('assignmentDescriptionInput');
  const titleFeedback = document.getElementById('assignmentTitleFeedback');
  const courseFeedback = document.getElementById('assignmentCourseFeedback');
  const deadlineFeedback = document.getElementById('assignmentDeadlineFeedback');

  if (!assignmentModal || !assignmentForm) return;

  function showFieldError(input, feedbackEl, msg) {
    if (input) input.classList.add('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = msg;
      feedbackEl.classList.add('show');
    }
  }

  function clearFieldError(input, feedbackEl) {
    if (input) input.classList.remove('input-error');
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('show');
    }
  }

  let assignmentModalTrap = null;
  let modalTrigger = null;

  function openAssignmentModal(mode = 'create', assignmentData = null) {
    modalTrigger = document.activeElement;
    if (mode === 'edit' && assignmentData) {
      modalTitle.textContent = 'Edit Assignment';
      assignmentIdInput.value = assignmentData.id;
      assignmentTitleInput.value = assignmentData.title;
      assignmentCourseInput.value = assignmentData.course;
      assignmentDeadlineInput.value = assignmentData.deadline;
      assignmentDescriptionInput.value = assignmentData.description || '';
    } else {
      modalTitle.textContent = 'Create New Assignment';
      assignmentForm.reset();
      assignmentIdInput.value = '';
    }

    clearFieldError(assignmentTitleInput, titleFeedback);
    clearFieldError(assignmentCourseInput, courseFeedback);
    clearFieldError(assignmentDeadlineInput, deadlineFeedback);

    assignmentModal.classList.add('show');
    if (window.lucide) window.lucide.createIcons({ root: assignmentModal });

    if (assignmentModalTrap) assignmentModalTrap();
    assignmentModalTrap = trapFocusHelper(assignmentModal, closeAssignmentModal);
    setTimeout(() => assignmentTitleInput.focus(), 60);
  }

  function closeAssignmentModal() {
    assignmentModal.classList.remove('show');
    if (assignmentModalTrap) {
      assignmentModalTrap();
      assignmentModalTrap = null;
    }
    if (modalTrigger) modalTrigger.focus();
  }

  if (createAssignmentBtn) {
    createAssignmentBtn.addEventListener('click', () => openAssignmentModal('create'));
  }

  if (closeBtn) closeBtn.addEventListener('click', closeAssignmentModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeAssignmentModal);

  if (assignmentModal) {
    assignmentModal.addEventListener('click', (e) => {
      if (e.target === assignmentModal) closeAssignmentModal();
    });
  }

  if (container) {
    container.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.js-edit-dosen-assignment');
      const deleteBtn = e.target.closest('.js-delete-dosen-assignment');

      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const targetAssignment = cachedDosenAssignments.find((a) => a.id === id);
        if (targetAssignment) {
          openAssignmentModal('edit', targetAssignment);
        }
      } else if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        const targetAssignment = cachedDosenAssignments.find((a) => a.id === id);
        const assignmentTitle = targetAssignment ? targetAssignment.title : 'tugas ini';

        if (confirm(`Apakah Anda yakin ingin menghapus "${assignmentTitle}"? Data akan dihapus permanen.`)) {
          try {
            await dosenAssignmentStorageService.remove(id);
            cachedDosenAssignments = cachedDosenAssignments.filter((a) => a.id !== id);
            renderDosenAssignmentsList(cachedDosenAssignments);
            showToast(`Tugas "${assignmentTitle}" berhasil dihapus.`, 'success');
          } catch (err) {
            showToast(err.message || 'Gagal menghapus tugas.', 'error');
          }
        }
      }
    });
  }

  if (assignmentForm) {
    assignmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = assignmentTitleInput.value.trim();
      const course = assignmentCourseInput.value.trim();
      const deadline = assignmentDeadlineInput.value;
      const description = assignmentDescriptionInput.value.trim();
      const editId = assignmentIdInput.value;

      let hasError = false;

      if (!title) {
        showFieldError(assignmentTitleInput, titleFeedback, 'Judul tugas wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(assignmentTitleInput, titleFeedback);
      }

      if (!course) {
        showFieldError(assignmentCourseInput, courseFeedback, 'Mata kuliah wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(assignmentCourseInput, courseFeedback);
      }

      if (!deadline) {
        showFieldError(assignmentDeadlineInput, deadlineFeedback, 'Deadline wajib diisi.');
        hasError = true;
      } else {
        clearFieldError(assignmentDeadlineInput, deadlineFeedback);
      }

      if (hasError) {
        if (assignmentTitleInput.classList.contains('input-error')) assignmentTitleInput.focus();
        else if (assignmentCourseInput.classList.contains('input-error')) assignmentCourseInput.focus();
        else if (assignmentDeadlineInput.classList.contains('input-error')) assignmentDeadlineInput.focus();
        return;
      }

      try {
        if (editId) {
          const updated = await dosenAssignmentStorageService.update(editId, {
            title,
            course,
            deadline,
            description,
          });
          const idx = cachedDosenAssignments.findIndex((a) => a.id === editId);
          if (idx !== -1) cachedDosenAssignments[idx] = updated;
          showToast(`Tugas "${title}" berhasil diperbarui.`, 'success');
        } else {
          const created = await dosenAssignmentStorageService.create({
            title,
            course,
            deadline,
            description,
          });
          cachedDosenAssignments.unshift(created);
          showToast(`Tugas "${title}" berhasil ditambahkan.`, 'success');
        }

        renderDosenAssignmentsList(cachedDosenAssignments);
        closeAssignmentModal();
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan tugas.', 'error');
      }
    });
  }
}

/**
 * Filter classes/rubrics/assessments/assignments list via topbar search
 * input. Hanya menyaring dataset yang container-nya memang ada di halaman
 * ini, jadi search box yang sama bisa dipakai ulang di setiap halaman dosen
 * tanpa saling menimpa.
 */
function setupDosenSearchFilter() {
  const searchInput = document.getElementById('topbarSearchInput');
  if (!searchInput) return;

  const hasClassesList = !!document.getElementById('classesListContainer');
  const hasRubricsList = !!document.getElementById('rubricsListContainer');
  const hasAssessmentsList = !!document.getElementById('assessmentsListContainer');
  const hasDosenAssignmentsList = !!document.getElementById('dosenAssignmentsListContainer');

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    if (hasClassesList) {
      if (!term) {
        renderClassesList(cachedClasses);
      } else {
        const filtered = cachedClasses.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            (c.semester && c.semester.toLowerCase().includes(term))
        );
        renderClassesList(filtered);
      }
    }

    if (hasRubricsList) {
      if (!term) {
        renderRubricsList(cachedRubrics);
      } else {
        const filtered = cachedRubrics.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            (r.course && r.course.toLowerCase().includes(term))
        );
        renderRubricsList(filtered);
      }
    }

    if (hasAssessmentsList) {
      if (!term) {
        renderAssessmentsList(cachedAssessments);
      } else {
        const filtered = cachedAssessments.filter(
          (a) =>
            a.name.toLowerCase().includes(term) ||
            (a.course && a.course.toLowerCase().includes(term))
        );
        renderAssessmentsList(filtered);
      }
    }

    if (hasDosenAssignmentsList) {
      if (!term) {
        renderDosenAssignmentsList(cachedDosenAssignments);
      } else {
        const filtered = cachedDosenAssignments.filter(
          (a) =>
            a.title.toLowerCase().includes(term) ||
            (a.course && a.course.toLowerCase().includes(term))
        );
        renderDosenAssignmentsList(filtered);
      }
    }
  });
}

/**
 * =========================================================================
 * MAHASISWA DASHBOARD FEATURES (FULL SPA IMPLEMENTATION)
 * =========================================================================
 */
let currentStudentView = 'dashboard';
let currentAssignmentFilter = 'all';
let studentGradesData = [];
let studentFeedbackData = [];

async function initMahasiswaFeatures() {
  initStudentMockData();
  setupMahasiswaViewRouter();
  setupMahasiswaFilterTabs();
  setupMahasiswaSearchFilter();
  setupSubmitAssignmentModal();
  setupCalendarModal();
  setupGradeDetailModal();
  setupNotificationsDropdown();
  setupStudentSettingsForm();
  setupHelpFaqAccordion();

  renderFullAssignmentsList();
  renderGradesTable();
  renderFullFeedbackList();
  updateMahasiswaStatCounters();

  await Promise.all([loadAssignmentsData(), loadFeedbackData()]);
  renderFullAssignmentsList();
  updateMahasiswaStatCounters();
}

/**
 * Initialize extra mock data for Grades and Feedback
 */
function initStudentMockData() {
  studentGradesData = [
    {
      id: 'grd-001',
      assignmentTitle: 'Website CRUD',
      course: 'Pemrograman Web',
      score: 88,
      maxScore: 100,
      grade: 'A',
      assessor: 'Dr. Budi Santoso',
      date: '11 Sep 2026',
      rubrics: [
        { name: 'Arsitektur & Kualitas Kode', score: '90 / 100', desc: 'Kerapian struktur folder, modularitas, dan konvensi penamaan.' },
        { name: 'Fungsionalitas CRUD & Validasi', score: '88 / 100', desc: 'Kelancaran fungsi Create, Read, Update, Delete & penanganan error.' },
        { name: 'Desain Antarmuka & UX', score: '86 / 100', desc: 'Responsivitas tampilan mobile-desktop dan konsistensi warna.' }
      ],
      comment: 'Struktur aplikasi sudah baik dan implementasi fitur utama sudah berjalan dengan lancar.'
    },
    {
      id: 'grd-002',
      assignmentTitle: 'Database Design',
      course: 'Basis Data',
      score: 92,
      maxScore: 100,
      grade: 'A',
      assessor: 'Ir. Siti Aminah, M.Kom',
      date: '18 Sep 2026',
      rubrics: [
        { name: 'Normalisasi Data (3NF)', score: '95 / 100', desc: 'Penghapusan anomali redundansi dan ketergantungan transitif.' },
        { name: 'Relasi & Kunci (PK/FK)', score: '92 / 100', desc: 'Integritas referensial dan penataan indexing yang tepat.' },
        { name: 'Dokumentasi Skema ERD', score: '90 / 100', desc: 'Diagram ERD terstruktur dengan deskripsi kardinalitas lengkap.' }
      ],
      comment: 'Relasi foreign key dan indexing sudah sangat rapi. Struktur ERD memenuhi standar 3NF tanpa anomali data.'
    },
    {
      id: 'grd-003',
      assignmentTitle: 'Algoritma Sorting & Complexity',
      course: 'Struktur Data',
      score: 85,
      maxScore: 100,
      grade: 'B+',
      assessor: 'Prof. Hendra Wijaya',
      date: '08 Sep 2026',
      rubrics: [
        { name: 'Implementasi Algoritma', score: '85 / 100', desc: 'Ketepatan implementasi QuickSort dan MergeSort.' },
        { name: 'Analisis Kompleksitas Waktu', score: '88 / 100', desc: 'Pembuktian matematis notasi Big-O Best & Worst case.' },
        { name: 'Benchmark & Visualisasi', score: '82 / 100', desc: 'Grafik performa pengujian data skala besar.' }
      ],
      comment: 'Analisis Big-O lengkap dan visualisasi runtime sangat jelas. Pertahankan konsistensi dokumentasi kode.'
    },
    {
      id: 'grd-004',
      assignmentTitle: 'UX Wireframe & Prototyping',
      course: 'Interaksi Manusia & Komputer',
      score: 90,
      maxScore: 100,
      grade: 'A',
      assessor: 'Ratna Sari, M.T.',
      date: '02 Sep 2026',
      rubrics: [
        { name: 'Prinsip Desain Gestalt', score: '92 / 100', desc: 'Hierarki visual, proximity, dan penataan ruang putih.' },
        { name: 'Interaktivitas Prototype', score: '88 / 100', desc: 'Alur user journey intuitif dan transisi layar mulus.' },
        { name: 'Aksesibilitas (WCAG)', score: '90 / 100', desc: 'Kontras warna memadai dan navigasi ramah keyboard.' }
      ],
      comment: 'Prinsip gestalt diterapkan dengan baik pada layout dashboard. Hierarki tipografi mudah dipahami user.'
    },
    {
      id: 'grd-005',
      assignmentTitle: 'API Integration & Auth',
      course: 'Pemrograman Web',
      score: 91,
      maxScore: 100,
      grade: 'A',
      assessor: 'Dr. Budi Santoso',
      date: '28 Agu 2026',
      rubrics: [
        { name: 'Keamanan Token JWT', score: '93 / 100', desc: 'Penyimpanan secure token dan mekanisme refresh token.' },
        { name: 'Desain RESTful Endpoint', score: '90 / 100', desc: 'Standar HTTP status code dan validasi payload JSON.' },
        { name: 'Penanganan Error Asinkron', score: '90 / 100', desc: 'Robust try-catch dan error toast ramah pengguna.' }
      ],
      comment: 'Integrasi otentikasi sangat aman dan arsitektur endpoint modular mematuhi standar RESTful modern.'
    }
  ];

  studentFeedbackData = [
    {
      id: 'sf-001',
      assessor: 'Dr. Budi Santoso',
      assessorRole: 'Dosen Pengampu Pemrograman Web',
      assignmentTitle: 'Website CRUD',
      course: 'Pemrograman Web',
      date: '11 Sep 2026',
      score: 88,
      comment: 'Struktur aplikasi sudah baik dan implementasi fitur utama sudah berjalan dengan lancar. Saran untuk perbaikan: tambahkan validasi input pada sisi server untuk keamanan ekstra.'
    },
    {
      id: 'sf-002',
      assessor: 'Ir. Siti Aminah, M.Kom',
      assessorRole: 'Dosen Pengampu Basis Data',
      assignmentTitle: 'Database Design',
      course: 'Basis Data',
      date: '18 Sep 2026',
      score: 92,
      comment: 'Relasi foreign key dan indexing sudah sangat rapi. Struktur ERD memenuhi standar 3NF tanpa anomali data. Kerja bagus!'
    },
    {
      id: 'sf-003',
      assessor: 'Prof. Hendra Wijaya',
      assessorRole: 'Dosen Pengampu Struktur Data',
      assignmentTitle: 'Algoritma Sorting & Complexity',
      course: 'Struktur Data',
      date: '08 Sep 2026',
      score: 85,
      comment: 'Analisis Big-O lengkap dan visualisasi runtime sangat jelas. Pertahankan konsistensi dokumentasi kode pada proyek berikutnya.'
    },
    {
      id: 'sf-004',
      assessor: 'Ratna Sari, M.T.',
      assessorRole: 'Dosen Pengampu IMK',
      assignmentTitle: 'UX Wireframe & Prototyping',
      course: 'Interaksi Manusia & Komputer',
      date: '02 Sep 2026',
      score: 90,
      comment: 'Prinsip gestalt diterapkan dengan baik pada layout dashboard. Hierarki tipografi dan palet warna mint green sangat konsisten.'
    }
  ];
}

/**
 * View Routing for Mahasiswa SPA
 */
function setupMahasiswaViewRouter() {
  function applyView(viewName) {
    const validViews = ['dashboard', 'assignments', 'grades', 'feedback', 'settings', 'help'];
    if (!validViews.includes(viewName)) viewName = 'dashboard';
    currentStudentView = viewName;

    // Toggle views visibility
    const views = document.querySelectorAll('.student-view');
    views.forEach(v => {
      if (v.id === `view-${viewName}`) {
        v.classList.remove('hidden');
        v.classList.add('active');
      } else {
        v.classList.add('hidden');
        v.classList.remove('active');
      }
    });

    // Update sidebar active link
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
      const linkView = link.getAttribute('data-view');
      if (linkView === viewName) {
        link.classList.add('active', 'bg-light-green', 'text-dark-green', 'font-semibold');
        link.classList.remove('text-text-secondary');
        const icon = link.querySelector('.nav-icon');
        if (icon) icon.classList.add('text-primary-green');
      } else if (linkView) {
        link.classList.remove('active', 'bg-light-green', 'text-dark-green', 'font-semibold');
        link.classList.add('text-text-secondary');
        const icon = link.querySelector('.nav-icon');
        if (icon) icon.classList.remove('text-primary-green');
      }
    });

    // Close mobile drawer if open
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('drawerBackdrop');
    if (sidebar && sidebar.classList.contains('drawer-open')) {
      sidebar.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('show');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh icons
    if (window.lucide) window.lucide.createIcons();
  }

  // Handle click on all elements with data-view
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-view]');
    if (trigger) {
      e.preventDefault();
      const targetView = trigger.getAttribute('data-view');
      window.location.hash = targetView;
      applyView(targetView);
    }
  });

  // Handle hashchange
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    applyView(hash);
  });

  // Initial load hash
  const initialHash = window.location.hash.replace('#', '') || 'dashboard';
  applyView(initialHash);
}

/**
 * Update Summary Statistics Cards
 */
function updateMahasiswaStatCounters() {
  const activeCount = cachedAssignments.filter(a => a.status === 'pending').length;
  const submittedCount = cachedAssignments.filter(a => a.status === 'submitted').length;
  const gradedCount = studentGradesData.length;
  const pendingReviewCount = 2;

  const elActive = document.getElementById('statActiveCount');
  const elSubmitted = document.getElementById('statSubmittedCount');
  const elPending = document.getElementById('statPendingCount');
  const elGraded = document.getElementById('statGradedCount');

  if (elActive) elActive.textContent = activeCount;
  if (elSubmitted) elSubmitted.textContent = submittedCount + 6; // reflect overall 7 submitted
  if (elPending) elPending.textContent = pendingReviewCount;
  if (elGraded) elGraded.textContent = gradedCount;

  // Filter tabs count
  const countAll = document.getElementById('countFilterAll');
  const countPending = document.getElementById('countFilterPending');
  const countSubmitted = document.getElementById('countFilterSubmitted');
  const countGraded = document.getElementById('countFilterGraded');

  if (countAll) countAll.textContent = cachedAssignments.length;
  if (countPending) countPending.textContent = cachedAssignments.filter(a => a.status === 'pending').length;
  if (countSubmitted) countSubmitted.textContent = cachedAssignments.filter(a => a.status === 'submitted').length;
  if (countGraded) countGraded.textContent = cachedAssignments.filter(a => a.status === 'graded').length;

  populateSubmitAssignmentDropdown();
}

/**
 * Load and Render Recent Assignments on Overview
 */
async function loadAssignmentsData() {
  const container = document.getElementById('assignmentsListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-3" aria-busy="true">
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
      <div class="h-16 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>
  `;

  try {
    const assignments = await window.apiService.fetchAssignments();
    cachedAssignments = assignments;
    renderAssignmentsList(assignments);
    updateMahasiswaStatCounters();
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex items-center justify-between">
        <span>${error.message || 'Gagal memuat tugas.'}</span>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadAssignmentsData()">Coba Lagi</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
  }
}

function renderAssignmentsList(assignments) {
  const container = document.getElementById('assignmentsListContainer');
  if (!container) return;

  if (assignments.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-text-secondary bg-slate-50 rounded-lg">
        <p class="font-medium text-sm">Tidak ada tugas yang ditemukan.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = assignments
    .map((asg) => {
      const badgeHtml = getStudentBadgeHtml(asg.status);
      return `
        <div class="list-item flex items-center justify-between p-3.5 rounded-lg border border-border-light bg-slate-50/50 hover:bg-slate-50 transition">
          <div class="item-main flex flex-col">
            <span class="item-title text-sm font-semibold text-text-primary">${escapeHtml(asg.title)}</span>
            <div class="item-meta flex items-center gap-4 text-xs text-text-secondary mt-1">
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="book" style="width: 14px; height: 14px;"></i>
                ${escapeHtml(asg.course)}
              </span>
              <span class="item-meta-item inline-flex items-center gap-1">
                <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                Deadline: ${escapeHtml(asg.deadline)}
              </span>
            </div>
          </div>
          ${badgeHtml}
        </div>
      `;
    })
    .join('');

  if (window.lucide) window.lucide.createIcons({ root: container });
}

/**
 * Render Full Assignments View
 */
function renderFullAssignmentsList() {
  const container = document.getElementById('fullAssignmentsContainer');
  if (!container) return;

  let list = cachedAssignments || [];
  if (currentAssignmentFilter !== 'all') {
    list = list.filter(a => a.status === currentAssignmentFilter);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="bg-card-bg p-8 rounded-xl border border-border-color text-center text-text-secondary">
        <div class="w-12 h-12 rounded-full bg-slate-100 text-text-muted flex items-center justify-center mx-auto mb-3">
          <i data-lucide="folder-open" style="width: 24px; height: 24px;"></i>
        </div>
        <h4 class="text-sm font-bold text-text-primary">Tidak Ada Tugas di Kategori Ini</h4>
        <p class="text-xs text-text-muted mt-1">Silakan pilih filter lain atau gunakan pencarian.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
    return;
  }

  container.innerHTML = list.map(asg => {
    const badgeHtml = getStudentBadgeHtml(asg.status);
    let actionBtnHtml = '';
    
    if (asg.status === 'pending') {
      actionBtnHtml = `
        <button type="button" class="btn btn-sm btn-primary flex items-center gap-1.5 js-quick-submit-btn" data-id="${asg.id}">
          <i data-lucide="upload" style="width: 13px; height: 13px;"></i>
          <span>Kirim Tugas</span>
        </button>
      `;
    } else if (asg.status === 'graded') {
      actionBtnHtml = `
        <button type="button" class="btn btn-sm btn-secondary flex items-center gap-1.5 js-view-grade-btn" data-title="${escapeHtml(asg.title)}" data-course="${escapeHtml(asg.course)}">
          <i data-lucide="award" style="width: 13px; height: 13px;"></i>
          <span>Lihat Nilai & Rubrik</span>
        </button>
      `;
    } else {
      actionBtnHtml = `
        <span class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
          <i data-lucide="check-check" style="width: 13px; height: 13px;"></i>
          <span>Terkumpul</span>
        </span>
      `;
    }

    return `
      <div class="bg-card-bg rounded-xl border border-border-color shadow-xs p-5 transition hover:border-primary-green/50">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2.5 flex-wrap">
              <h3 class="text-base font-bold text-text-primary">${escapeHtml(asg.title)}</h3>
              ${badgeHtml}
            </div>
            <div class="flex items-center gap-4 text-xs text-text-secondary flex-wrap">
              <span class="inline-flex items-center gap-1.5 font-medium text-text-primary">
                <i data-lucide="book-open" style="width: 14px; height: 14px;" class="text-primary-green"></i>
                ${escapeHtml(asg.course)}
              </span>
              <span class="inline-flex items-center gap-1.5 text-text-muted">
                <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                Tenggat: ${escapeHtml(asg.deadline)}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            ${actionBtnHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons({ root: container });

  // Attach quick submit listeners
  container.querySelectorAll('.js-quick-submit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const asgId = btn.getAttribute('data-id');
      openSubmitModal(asgId);
    });
  });

  // Attach view grade listeners
  container.querySelectorAll('.js-view-grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const course = btn.getAttribute('data-course');
      openGradeModal(title, course);
    });
  });
}

function getStudentBadgeHtml(status) {
  if (status === 'graded') {
    return `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Graded</span>`;
  }
  if (status === 'submitted') {
    return `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Submitted</span>`;
  }
  return `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>`;
}

/**
 * Filter Tabs for Assignments
 */
function setupMahasiswaFilterTabs() {
  const tabsContainer = document.getElementById('assignmentsFilterTabs');
  if (!tabsContainer) return;

  const buttons = tabsContainer.querySelectorAll('button[data-filter]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.className = 'px-3.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-slate-100 transition cursor-pointer bg-transparent border-0';
      });
      btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer bg-light-green text-dark-green border-0';
      currentAssignmentFilter = btn.getAttribute('data-filter');
      renderFullAssignmentsList();
    });
  });
}

/**
 * Search Filter
 */
function setupMahasiswaSearchFilter() {
  const topbarSearch = document.getElementById('topbarSearchInput');
  const asgSearch = document.getElementById('assignmentsSearchInput');

  function handleSearch(term) {
    if (!term) {
      renderAssignmentsList(cachedAssignments);
      renderFullAssignmentsList();
      return;
    }

    const filtered = cachedAssignments.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.course.toLowerCase().includes(term)
    );
    renderAssignmentsList(filtered);
    
    // Also filter full assignments list
    const container = document.getElementById('fullAssignmentsContainer');
    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="bg-card-bg p-8 rounded-xl border border-border-color text-center text-text-secondary">
            <p class="font-medium text-sm">Tidak ditemukan tugas dengan kata kunci "${escapeHtml(term)}".</p>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(asg => {
          const badgeHtml = getStudentBadgeHtml(asg.status);
          return `
            <div class="bg-card-bg rounded-xl border border-border-color shadow-xs p-5">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-base font-bold text-text-primary">${escapeHtml(asg.title)}</h3>
                    ${badgeHtml}
                  </div>
                  <p class="text-xs text-text-secondary">${escapeHtml(asg.course)} • Deadline: ${escapeHtml(asg.deadline)}</p>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
      if (window.lucide) window.lucide.createIcons({ root: container });
    }
  }

  if (topbarSearch) {
    topbarSearch.addEventListener('input', (e) => {
      handleSearch(e.target.value.toLowerCase().trim());
    });
  }

  if (asgSearch) {
    asgSearch.addEventListener('input', (e) => {
      handleSearch(e.target.value.toLowerCase().trim());
    });
  }
}

/**
 * Load and Render Recent Feedback on Overview
 */
async function loadFeedbackData() {
  const container = document.getElementById('feedbackContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton-wrap flex flex-col gap-3 p-4 bg-slate-50 rounded-lg animate-pulse" aria-busy="true">
      <div class="h-6 w-1/3 bg-slate-200 rounded"></div>
      <div class="h-4 w-1/2 bg-slate-200 rounded"></div>
      <div class="h-12 w-full bg-slate-200 rounded mt-2"></div>
    </div>
  `;

  try {
    const feedback = await window.apiService.fetchFeedback();
    const badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Graded</span>`;

    container.innerHTML = `
      <div class="feedback-card-highlight p-4.5 rounded-lg border border-border-light bg-slate-50/50">
        <div class="feedback-top flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 class="feedback-subject text-sm font-bold text-text-primary">${escapeHtml(feedback.assignmentTitle)}</h3>
            <div class="text-xs text-text-secondary mt-0.5">
              ${escapeHtml(feedback.course)}
            </div>
          </div>
          <span class="feedback-score-pill px-2.5 py-1 rounded-full text-xs font-bold bg-light-green text-dark-green">${feedback.score} / ${feedback.maxScore}</span>
        </div>

        <div class="flex items-center gap-2 mb-3">
          ${badgeHtml}
          <span class="text-[11.5px] text-text-muted">Assessed by ${escapeHtml(feedback.assessor)}</span>
        </div>

        <div class="feedback-quote text-xs text-text-secondary italic border-l-2 border-primary-green pl-3 py-0.5">
          "${escapeHtml(feedback.comment)}"
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: container });
  } catch (error) {
    container.innerHTML = `
      <div class="p-4 rounded-lg bg-red-50 text-status-danger-text border border-red-200 text-sm flex items-center justify-between">
        <span>${error.message || 'Gagal memuat feedback.'}</span>
        <button type="button" class="btn btn-sm btn-secondary" onclick="loadFeedbackData()">Coba Lagi</button>
      </div>
    `;
  }
}

/**
 * Render Grades Table in View Grades
 */
function renderGradesTable() {
  const tbody = document.getElementById('gradesTableBody');
  if (!tbody) return;

  tbody.innerHTML = studentGradesData.map(item => {
    return `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="py-3.5 px-2">
          <span class="font-semibold text-text-primary block">${escapeHtml(item.assignmentTitle)}</span>
          <span class="text-[11px] text-text-muted">Dinilai: ${escapeHtml(item.date)}</span>
        </td>
        <td class="py-3.5 px-2 text-xs text-text-secondary">${escapeHtml(item.course)}</td>
        <td class="py-3.5 px-2 text-xs text-text-primary font-medium">${escapeHtml(item.assessor)}</td>
        <td class="py-3.5 px-2 text-center">
          <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">${item.grade}</span>
        </td>
        <td class="py-3.5 px-2 text-center font-bold text-dark-green">${item.score} <span class="text-[11px] text-text-muted font-normal">/ 100</span></td>
        <td class="py-3.5 px-2 text-right">
          <button type="button" class="btn btn-sm btn-secondary js-open-grade-detail" data-id="${item.id}">
            <span>Detail Rubrik</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.js-open-grade-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const gradeItem = studentGradesData.find(g => g.id === id);
      if (gradeItem) {
        openGradeModal(gradeItem.assignmentTitle, gradeItem.course, gradeItem);
      }
    });
  });
}

/**
 * Render Full Feedback List in View Feedback
 */
function renderFullFeedbackList() {
  const container = document.getElementById('fullFeedbackContainer');
  if (!container) return;

  container.innerHTML = studentFeedbackData.map(fb => {
    return `
      <div class="bg-card-bg rounded-xl border border-border-color shadow-xs p-6 transition hover:border-primary-green/40">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border-light">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-light-green text-primary-green font-bold text-xs flex items-center justify-center shrink-0">
              ${fb.assessor.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h4 class="font-bold text-sm text-text-primary">${escapeHtml(fb.assessor)}</h4>
              <p class="text-[11px] text-text-muted">${escapeHtml(fb.assessorRole)} • ${escapeHtml(fb.date)}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-light-green text-dark-green">Skor: ${fb.score} / 100</span>
          </div>
        </div>
        
        <div class="mb-3">
          <span class="text-xs font-semibold text-text-muted uppercase tracking-wider">Tugas:</span>
          <span class="text-xs font-bold text-text-primary ml-1">${escapeHtml(fb.assignmentTitle)} (${escapeHtml(fb.course)})</span>
        </div>

        <div class="bg-slate-50 p-4 rounded-lg border border-border-light text-xs text-text-secondary leading-relaxed italic border-l-3 border-primary-green">
          "${escapeHtml(fb.comment)}"
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons({ root: container });
}

/**
 * Submit Assignment Modal Logic
 */
function setupSubmitAssignmentModal() {
  const modal = document.getElementById('submitAssignmentModal');
  const openBtns = document.querySelectorAll('#openSubmitModalBtn, .js-open-submit-modal');
  const closeBtn = document.getElementById('closeSubmitModalBtn');
  const cancelBtn = document.getElementById('cancelSubmitModalBtn');
  const form = document.getElementById('submitAssignmentForm');
  const radioInputs = document.querySelectorAll('input[name="submissionType"]');
  const urlContainer = document.getElementById('urlInputContainer');
  const fileContainer = document.getElementById('fileInputContainer');

  if (!modal) return;

  function closeModal() {
    modal.classList.add('hidden');
    if (form) form.reset();
    if (urlContainer) urlContainer.classList.remove('hidden');
    if (fileContainer) fileContainer.classList.add('hidden');
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openSubmitModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  radioInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'url') {
        if (urlContainer) urlContainer.classList.remove('hidden');
        if (fileContainer) fileContainer.classList.add('hidden');
      } else {
        if (urlContainer) urlContainer.classList.add('hidden');
        if (fileContainer) fileContainer.classList.remove('hidden');
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const select = document.getElementById('submitAssignmentSelect');
      const selectedId = select ? select.value : null;

      // Find assignment and mark submitted
      const targetAsg = cachedAssignments.find(a => a.id === selectedId);
      if (targetAsg) {
        targetAsg.status = 'submitted';
      }

      closeModal();
      updateMahasiswaStatCounters();
      renderAssignmentsList(cachedAssignments);
      renderFullAssignmentsList();
      showStudentToast('Tugas berhasil dikumpulkan! Status diperbarui menjadi Terkumpul.', 'success');
    });
  }
}

function openSubmitModal(preselectedId = null) {
  const modal = document.getElementById('submitAssignmentModal');
  if (!modal) return;

  populateSubmitAssignmentDropdown(preselectedId);
  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons({ root: modal });
}

function populateSubmitAssignmentDropdown(selectedId = null) {
  const select = document.getElementById('submitAssignmentSelect');
  if (!select) return;

  select.innerHTML = cachedAssignments.map(asg => {
    const isSelected = selectedId ? asg.id === selectedId : asg.status === 'pending';
    const statusNote = asg.status === 'submitted' ? ' (Sudah dikumpulkan)' : asg.status === 'graded' ? ' (Sudah dinilai)' : '';
    return `
      <option value="${asg.id}" ${isSelected ? 'selected' : ''}>
        ${escapeHtml(asg.title)} - ${escapeHtml(asg.course)}${statusNote}
      </option>
    `;
  }).join('');
}

/**
 * Calendar Modal Logic
 */
function setupCalendarModal() {
  const modal = document.getElementById('calendarModal');
  const trigger = document.getElementById('calendarBtn');
  const closeBtn = document.getElementById('closeCalendarModalBtn');
  const closeBtn2 = document.getElementById('closeCalendarBtn2');

  if (!modal) return;

  function openCal() {
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons({ root: modal });
  }

  function closeCal() {
    modal.classList.add('hidden');
  }

  if (trigger) trigger.addEventListener('click', openCal);
  if (closeBtn) closeBtn.addEventListener('click', closeCal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeCal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCal();
  });
}

/**
 * Grade Detail Modal Logic
 */
function setupGradeDetailModal() {
  const modal = document.getElementById('gradeDetailModal');
  const closeBtn = document.getElementById('closeGradeModalBtn');
  const closeBtn2 = document.getElementById('closeGradeModalBtn2');

  if (!modal) return;

  function closeGrade() {
    modal.classList.add('hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeGrade);
  if (closeBtn2) closeBtn2.addEventListener('click', closeGrade);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGrade();
  });
}

function openGradeModal(title, course, gradeObj = null) {
  const modal = document.getElementById('gradeDetailModal');
  if (!modal) return;

  const titleEl = document.getElementById('gradeModalTitle');
  const courseEl = document.getElementById('gradeModalCourse');
  const scoreEl = document.getElementById('gradeModalScore');
  const gradeEl = document.getElementById('gradeModalGrade');
  const commentEl = document.getElementById('gradeModalComment');
  const rubricList = document.getElementById('gradeModalRubricList');

  const data = gradeObj || studentGradesData.find(g => g.assignmentTitle === title) || studentGradesData[0];

  if (titleEl) titleEl.textContent = data.assignmentTitle;
  if (courseEl) courseEl.textContent = data.course;
  if (scoreEl) scoreEl.textContent = `${data.score} / ${data.maxScore || 100}`;
  if (gradeEl) gradeEl.textContent = data.grade || 'A';
  if (commentEl) commentEl.textContent = `"${data.comment}"`;

  if (rubricList && data.rubrics) {
    rubricList.innerHTML = data.rubrics.map(r => `
      <div class="p-3 rounded-lg border border-border-light bg-slate-50 flex items-center justify-between">
        <div>
          <span class="font-semibold text-text-primary">${escapeHtml(r.name)}</span>
          <p class="text-[11px] text-text-muted">${escapeHtml(r.desc)}</p>
        </div>
        <span class="font-bold text-primary-green">${escapeHtml(r.score)}</span>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons({ root: modal });
}

/**
 * Notifications Dropdown Logic
 */
function setupNotificationsDropdown() {
  const trigger = document.getElementById('notificationsTrigger');
  const menu = document.getElementById('notificationsMenu');
  const markReadBtn = document.getElementById('markAllReadBtn');
  const badgeDot = document.getElementById('notifBadgeDot');
  const notifCount = document.getElementById('notifCount');

  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
    const isExpanded = menu.classList.contains('show');
    trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#notificationsTrigger') || menu.contains(e.target)) {
      return;
    }
    menu.classList.remove('show');
    trigger.setAttribute('aria-expanded', 'false');
  });

  if (markReadBtn) {
    markReadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (badgeDot) badgeDot.classList.add('hidden');
      if (notifCount) notifCount.textContent = '0';
      const unreadDots = document.querySelectorAll('.notif-unread-dot');
      unreadDots.forEach(d => d.classList.replace('bg-primary-green', 'bg-slate-300'));
      showStudentToast('Semua notifikasi telah ditandai dibaca.', 'info');
    });
  }
}

/**
 * Student Settings Form Logic
 */
function setupStudentSettingsForm() {
  const form = document.getElementById('studentProfileForm');
  const prefBtn = document.getElementById('savePrefBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('settingStudentName');
      const emailInput = document.getElementById('settingStudentEmail');

      const user = getCurrentUser() || { role: 'mahasiswa' };
      if (nameInput) user.name = nameInput.value.trim();
      if (emailInput) user.email = emailInput.value.trim();

      setCurrentUser(user);
      populateUserProfile(user);
      showStudentToast('Profil mahasiswa berhasil disimpan!', 'success');
    });
  }

  if (prefBtn) {
    prefBtn.addEventListener('click', () => {
      showStudentToast('Preferensi pemberitahuan berhasil diperbarui!', 'success');
    });
  }
}

/**
 * Help FAQ Accordion Logic
 */
function setupHelpFaqAccordion() {
  const container = document.getElementById('helpFaqContainer');
  if (!container) return;

  const questions = container.querySelectorAll('.faq-question');
  questions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('svg, i');
      if (!answer) return;

      const isClosed = answer.classList.contains('hidden');
      // Close other answers
      container.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
      container.querySelectorAll('.faq-question svg, .faq-question i').forEach(ic => {
        try { if (ic && ic.style) ic.style.transform = 'rotate(0deg)'; } catch (err) {}
      });

      if (isClosed) {
        answer.classList.remove('hidden');
        try { if (icon && icon.style) icon.style.transform = 'rotate(180deg)'; } catch (err) {}
      }
    });
  });
}

/**
 * Toast Notification Helper
 */
function showStudentToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-dark-green text-white' : 'bg-slate-800 text-white';
  const iconName = type === 'success' ? 'check-circle' : 'info';

  toast.className = `p-3.5 px-4 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2.5 transition-all transform duration-300 translate-y-2 opacity-0 ${bgColor} pointer-events-auto`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons({ root: toast });

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 20);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
/**
 * AI Assessment Copilot - Dashboard Shared Script
 * Handles role-based protection, profile rendering, sidebar drawer,
 * coming-soon handlers, and logout.
 */

function initDashboard(expectedRole) {
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
  // Name in header
  const nameDisplayElements = document.querySelectorAll('.js-user-name');
  nameDisplayElements.forEach(el => {
    el.textContent = user.name;
  });

  // Email in dropdown
  const emailDisplayElements = document.querySelectorAll('.js-user-email');
  emailDisplayElements.forEach(el => {
    el.textContent = user.email;
  });

  // Role in dropdown / topbar
  const roleDisplayElements = document.querySelectorAll('.js-user-role');
  roleDisplayElements.forEach(el => {
    el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  });

  // User Initials for Avatar
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

    // Auto focus first link in drawer
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

  // Close drawer if screen resizes to desktop width
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

  // Close on outside click
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

/**
 * DOSEN DASHBOARD FEATURES
 */
async function initDosenFeatures() {
  await Promise.all([loadClassesData(), loadActivitiesData()]);
  setupClassCrud();
  setupDosenSearchFilter();
}

/**
 * Load and render Classes with Skeleton & Error Handling
 */
async function loadClassesData() {
  const container = document.getElementById('classesListContainer');
  if (!container) return;

  // 1. Render Skeleton Loading State
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

  // Helper: show / clear inline field error
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

    // Clear all error states
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

  // EVENT DELEGATION: Edit and Delete buttons on dynamically rendered list
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

  // Form Submit (Create or Update)
  if (classForm) {
    classForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = classNameInput.value.trim();
      const studentsRaw = classStudentsInput.value.trim();
      const assignmentsRaw = classAssignmentsInput.value.trim();
      const semester = classSemesterInput.value.trim();
      const editId = classIdInput.value;

      // --- Inline Validation ---
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
        // Focus the first invalid field
        if (classNameInput.classList.contains('input-error')) classNameInput.focus();
        else if (classStudentsInput.classList.contains('input-error')) classStudentsInput.focus();
        else if (classAssignmentsInput.classList.contains('input-error')) classAssignmentsInput.focus();
        return;
      }

      try {
        if (editId) {
          // Update existing
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
          // Create new
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

/**
 * Filter classes list via topbar search input
 */
function setupDosenSearchFilter() {
  const searchInput = document.getElementById('topbarSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      renderClassesList(cachedClasses);
      return;
    }

    const filtered = cachedClasses.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.semester && c.semester.toLowerCase().includes(term))
    );
    renderClassesList(filtered);
  });
}

/**
 * MAHASISWA DASHBOARD FEATURES
 */
async function initMahasiswaFeatures() {
  await Promise.all([loadAssignmentsData(), loadFeedbackData()]);
  setupMahasiswaSearchFilter();
}

/**
 * Load and render Assignments (Mahasiswa) with Skeleton & Error Handling
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
      const badgeHtml = window.badgeVariants 
        ? `<span class="${window.badgeVariants({ variant: asg.status || 'submitted', size: 'md' })}">${asg.status.charAt(0).toUpperCase() + asg.status.slice(1)}</span>`
        : `<span class="badge badge-${asg.status}">${asg.status}</span>`;

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
 * Load and render Feedback (Mahasiswa)
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
    const badgeHtml = window.badgeVariants 
      ? `<span class="${window.badgeVariants({ variant: feedback.status || 'graded', size: 'sm' })}">Graded</span>`
      : `<span class="badge badge-graded">Graded</span>`;

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
 * Filter assignments list via topbar search input
 */
function setupMahasiswaSearchFilter() {
  const searchInput = document.getElementById('topbarSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      renderAssignmentsList(cachedAssignments);
      return;
    }

    const filtered = cachedAssignments.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.course.toLowerCase().includes(term)
    );
    renderAssignmentsList(filtered);
  });
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


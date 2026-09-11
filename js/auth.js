/**
 * AI Assessment Copilot - Core Authentication & Storage Module
 * Manages localStorage for users & session, seeds default accounts,
 * and handles route protection.
 */

const STORAGE_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser'
};

// Seed default dummy accounts if no users exist in localStorage
function seedInitialUsers() {
  const existing = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existing || JSON.parse(existing).length === 0) {
    const defaultUsers = [
      {
        id: 1,
        name: "Dr. Budi Santoso, M.Kom",
        email: "dosen@example.com",
        password: "password123",
        role: "dosen"
      },
      {
        id: 2,
        name: "Andi Pratama",
        email: "mahasiswa@example.com",
        password: "password123",
        role: "mahasiswa"
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
}

// Get all registered users
function getUsers() {
  seedInitialUsers();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  } catch (e) {
    console.error("Error reading users from localStorage", e);
    return [];
  }
}

// Save users list
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Get current active session
function getCurrentUser() {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Error reading currentUser", e);
    return null;
  }
}

// Set active session
function setCurrentUser(user) {
  // Store session without exposing password in session object
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));
}

// Logout session
function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  // Detect if we are inside dashboard/ or at root
  const isInDashboard = window.location.pathname.includes('/dashboard/');
  window.location.href = isInDashboard ? '../login.html' : 'login.html';
}

/**
 * Route Guard for protected dashboard pages
 * @param {string} expectedRole - 'dosen' or 'mahasiswa'
 */
function protectDashboard(expectedRole) {
  const user = getCurrentUser();
  const isInDashboard = window.location.pathname.includes('/dashboard/');
  const loginPath = isInDashboard ? '../login.html' : 'login.html';

  // 1. Not logged in -> redirect to login
  if (!user) {
    window.location.replace(loginPath);
    return null;
  }

  // 2. Logged in, but unauthorized for this specific dashboard
  if (user.role !== expectedRole) {
    if (user.role === 'dosen') {
      window.location.replace(isInDashboard ? 'dosen.html' : 'dashboard/dosen.html');
    } else if (user.role === 'mahasiswa') {
      window.location.replace(isInDashboard ? 'mahasiswa.html' : 'dashboard/mahasiswa.html');
    } else {
      window.location.replace(loginPath);
    }
    return null;
  }

  return user;
}

/**
 * Guard for guest pages (login, register)
 * If already logged in, directly redirect to user's dashboard
 */
function redirectIfLoggedIn() {
  const user = getCurrentUser();
  if (user) {
    if (user.role === 'dosen') {
      window.location.replace('dashboard/dosen.html');
    } else if (user.role === 'mahasiswa') {
      window.location.replace('dashboard/mahasiswa.html');
    }
  }
}

/**
 * Global Toast Alert System
 */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons({ root: toast });
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Focus Trap Helper for Dialogs and Modals
 */
function createFocusTrap(container, onEscape) {
  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (typeof onEscape === 'function') onEscape();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(container.querySelectorAll(focusableSelector));
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

  container.addEventListener('keydown', handleKeyDown);
  const focusables = container.querySelectorAll(focusableSelector);
  if (focusables.length > 0) {
    setTimeout(() => focusables[0].focus(), 50);
  }

  return function removeTrap() {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

let modalFocusTrapCleanup = null;
let modalTriggerElement = null;

/**
 * Global Coming Soon Modal for Phase 2 placeholders with ARIA & Focus Trap
 */
function showComingSoonModal(featureName = 'Fitur') {
  modalTriggerElement = document.activeElement;
  let modalBackdrop = document.getElementById('comingSoonModal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'comingSoonModal';
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-labelledby', 'modalFeatureTitle');
    modalBackdrop.setAttribute('aria-describedby', 'modalFeatureDesc');
    modalBackdrop.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon-wrap" aria-hidden="true">
          <i data-lucide="sparkles" style="width: 28px; height: 28px;"></i>
        </div>
        <h3 class="modal-title" id="modalFeatureTitle">Coming Soon</h3>
        <p class="modal-desc" id="modalFeatureDesc">This feature will be available in the next phase.</p>
        <button type="button" id="modalCloseBtn" class="btn btn-primary btn-block" aria-label="Close dialog">Got it</button>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    // Close on clicking backdrop
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeComingSoonModal();
      }
    });

    const closeBtn = modalBackdrop.querySelector('#modalCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeComingSoonModal);
    }
  }

  const titleEl = document.getElementById('modalFeatureTitle');
  if (titleEl && featureName) {
    titleEl.textContent = featureName;
  }

  modalBackdrop.classList.add('show');
  if (window.lucide) {
    window.lucide.createIcons({ root: modalBackdrop });
  }

  if (modalFocusTrapCleanup) {
    modalFocusTrapCleanup();
  }
  modalFocusTrapCleanup = createFocusTrap(modalBackdrop, closeComingSoonModal);
}

function closeComingSoonModal() {
  const modalBackdrop = document.getElementById('comingSoonModal');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('show');
    if (modalFocusTrapCleanup) {
      modalFocusTrapCleanup();
      modalFocusTrapCleanup = null;
    }
    if (modalTriggerElement && typeof modalTriggerElement.focus === 'function') {
      modalTriggerElement.focus();
      modalTriggerElement = null;
    }
  }
}

// Pre-initialize seed on file load
seedInitialUsers();

/**
 * =========================================================================
 * AI ASSESSMENT COPILOT - ASYNCHRONOUS API SERVICE (Phase 1 / Module 4)
 * =========================================================================
 * Mengimplementasikan pemanggilan REST API asinkron simulatif dengan:
 * - fetch() ke file JSON lokal
 * - Async / await dengan try-catch block
 * - Simulasi latency jaringan (delay via Promise + setTimeout)
 * - Dukungan error simulation untuk pengujian UI error state
 * - Integrasi localStorage untuk mutasi data (CRUD Classes)
 * =========================================================================
 */

const API_STORAGE_KEY_CLASSES = 'aiassessment_classes';
const SIMULATED_LATENCY_MS = 500;

/**
 * Utility delay helper
 */
function delay(ms = SIMULATED_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fallback static seed data if fetch is restricted by browser security policies
 */
const DEFAULT_CLASSES = [
  { id: 'cls-001', name: 'Pemrograman Web', studentsCount: 32, assignmentsCount: 4, status: 'active', semester: 'Semester Genap 2025/2026' },
  { id: 'cls-002', name: 'Basis Data', studentsCount: 28, assignmentsCount: 3, status: 'active', semester: 'Semester Genap 2025/2026' },
  { id: 'cls-003', name: 'Object Oriented Programming', studentsCount: 30, assignmentsCount: 5, status: 'active', semester: 'Semester Genap 2025/2026' },
  { id: 'cls-004', name: 'Kecerdasan Buatan', studentsCount: 25, assignmentsCount: 2, status: 'active', semester: 'Semester Genap 2025/2026' },
];

const DEFAULT_ACTIVITIES = [
  { id: 'act-001', type: 'submission', actor: 'Andi Pratama', action: 'submitted an assignment', context: 'Pemrograman Web', timeAgo: '10 minutes ago', icon: 'upload' },
  { id: 'act-002', type: 'assignment', actor: 'Siti', action: 'uploaded a new assignment', context: 'Basis Data', timeAgo: '45 minutes ago', icon: 'file-plus' },
  { id: 'act-003', type: 'assessment', actor: 'System AI', action: 'Assessment completed for Tugas 2 OOP', context: 'Object Oriented Programming', timeAgo: '2 hours ago', icon: 'check' },
  { id: 'act-004', type: 'feedback', actor: 'Dr. Budi Santoso', action: 'Feedback approved for 12 submissions', context: 'Basis Data', timeAgo: 'Yesterday', icon: 'message-square' },
];

const DEFAULT_ASSIGNMENTS = [
  { id: 'asg-001', title: 'Laporan Sistem', course: 'Analisis Sistem', deadline: '12 Sep 2026', status: 'submitted' },
  { id: 'asg-002', title: 'Website CRUD', course: 'Pemrograman Web', deadline: '15 Sep 2026', status: 'pending' },
  { id: 'asg-003', title: 'Database Design', course: 'Basis Data', deadline: '18 Sep 2026', status: 'graded' },
  { id: 'asg-004', title: 'OOP Design Patterns', course: 'Object Oriented Programming', deadline: '22 Sep 2026', status: 'pending' },
];

const DEFAULT_FEEDBACK = {
  id: 'fb-001',
  assignmentTitle: 'Website CRUD',
  course: 'Pemrograman Web • Tugas Akhir',
  score: 88,
  maxScore: 100,
  status: 'graded',
  assessor: 'Dr. Budi Santoso',
  comment: 'Struktur aplikasi sudah baik dan implementasi fitur utama sudah berjalan.',
  submittedDate: '10 Sep 2026',
  gradedDate: '11 Sep 2026',
};

/**
 * Check if error simulation is requested via window flag or query param
 */
function shouldSimulateError() {
  if (typeof window !== 'undefined') {
    if (window.__SIMULATE_API_ERROR === true) return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('sim_error') === '1';
  }
  return false;
}

/**
 * Fetch Classes (Dosen) - Async with delay, localStorage sync, and error handling
 */
async function fetchClasses() {
  await delay();

  if (shouldSimulateError()) {
    throw new Error('Gagal memuat data kelas dari server (500 Internal Server Error simulasi).');
  }

  try {
    // 1. Check local storage first for persisted CRUD changes
    const stored = localStorage.getItem(API_STORAGE_KEY_CLASSES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Invalid JSON in localStorage for classes, fetching fresh data.');
      }
    }

    // 2. Fetch from static JSON file
    const jsonPath = window.location.pathname.includes('/dashboard/') ? '../data/classes.json' : 'data/classes.json';
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem(API_STORAGE_KEY_CLASSES, JSON.stringify(data));
      return data;
    } catch (fetchErr) {
      // Fallback to in-memory defaults if running on restricted file:// protocol
      localStorage.setItem(API_STORAGE_KEY_CLASSES, JSON.stringify(DEFAULT_CLASSES));
      return DEFAULT_CLASSES;
    }
  } catch (error) {
    console.error('[API Service] Error in fetchClasses:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat memuat daftar kelas.');
  }
}

/**
 * Fetch Recent Activities (Dosen)
 */
async function fetchActivities() {
  await delay();

  if (shouldSimulateError()) {
    throw new Error('Gagal memuat aktivitas terkini dari server.');
  }

  try {
    const jsonPath = window.location.pathname.includes('/dashboard/') ? '../data/activities.json' : 'data/activities.json';
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (fetchErr) {
      return DEFAULT_ACTIVITIES;
    }
  } catch (error) {
    console.error('[API Service] Error in fetchActivities:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat memuat aktivitas.');
  }
}

/**
 * Fetch Recent Assignments (Mahasiswa)
 */
async function fetchAssignments() {
  await delay();

  if (shouldSimulateError()) {
    throw new Error('Gagal memuat daftar tugas (500 Server Error simulasi).');
  }

  try {
    const jsonPath = window.location.pathname.includes('/dashboard/') ? '../data/assignments.json' : 'data/assignments.json';
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (fetchErr) {
      return DEFAULT_ASSIGNMENTS;
    }
  } catch (error) {
    console.error('[API Service] Error in fetchAssignments:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat memuat daftar tugas.');
  }
}

/**
 * Fetch Recent Feedback (Mahasiswa)
 */
async function fetchFeedback() {
  await delay();

  if (shouldSimulateError()) {
    throw new Error('Gagal memuat review umpan balik dari server.');
  }

  try {
    const jsonPath = window.location.pathname.includes('/dashboard/') ? '../data/feedback.json' : 'data/feedback.json';
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (fetchErr) {
      return DEFAULT_FEEDBACK;
    }
  } catch (error) {
    console.error('[API Service] Error in fetchFeedback:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat memuat umpan balik.');
  }
}

/**
 * CRUD Operations for Classes (Stored in localStorage)
 */
async function createClass(classData) {
  await delay(300);
  try {
    const classes = await fetchClasses();
    const newClass = {
      id: `cls-${Date.now()}`,
      name: classData.name.trim(),
      studentsCount: parseInt(classData.studentsCount, 10) || 0,
      assignmentsCount: parseInt(classData.assignmentsCount, 10) || 0,
      status: classData.status || 'active',
      semester: classData.semester || 'Semester Genap 2025/2026',
    };
    classes.unshift(newClass);
    localStorage.setItem(API_STORAGE_KEY_CLASSES, JSON.stringify(classes));
    return newClass;
  } catch (err) {
    console.error('[API Service] Error in createClass:', err);
    throw new Error(err.message || 'Gagal menyimpan kelas baru.');
  }
}

async function updateClass(id, updatedFields) {
  await delay(300);
  try {
    const classes = await fetchClasses();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Kelas dengan ID "${id}" tidak ditemukan.`);
    }

    classes[index] = {
      ...classes[index],
      ...updatedFields,
      name: updatedFields.name !== undefined ? updatedFields.name.trim() : classes[index].name,
      studentsCount: updatedFields.studentsCount !== undefined ? parseInt(updatedFields.studentsCount, 10) : classes[index].studentsCount,
      assignmentsCount: updatedFields.assignmentsCount !== undefined ? parseInt(updatedFields.assignmentsCount, 10) : classes[index].assignmentsCount,
    };

    localStorage.setItem(API_STORAGE_KEY_CLASSES, JSON.stringify(classes));
    return classes[index];
  } catch (err) {
    console.error('[API Service] Error in updateClass:', err);
    throw new Error(err.message || 'Gagal memperbarui kelas.');
  }
}

async function deleteClass(id) {
  await delay(250);
  try {
    const classes = await fetchClasses();
    const filtered = classes.filter((c) => c.id !== id);
    localStorage.setItem(API_STORAGE_KEY_CLASSES, JSON.stringify(filtered));
    return { success: true, id };
  } catch (err) {
    console.error('[API Service] Error in deleteClass:', err);
    throw new Error(err.message || 'Gagal menghapus kelas.');
  }
}

// Global and Module Export
if (typeof window !== 'undefined') {
  window.apiService = {
    fetchClasses,
    fetchActivities,
    fetchAssignments,
    fetchFeedback,
    createClass,
    updateClass,
    deleteClass,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchClasses,
    fetchActivities,
    fetchAssignments,
    fetchFeedback,
    createClass,
    updateClass,
    deleteClass,
  };
}

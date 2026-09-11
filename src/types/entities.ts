/**
 * =========================================================================
 * AI ASSESSMENT COPILOT - STRICT TYPES & BRANDED TYPES (LANGKAH 6)
 * =========================================================================
 * - Model entitas menggunakan Branded Types (Nominal Typing pattern)
 * - Model state asynchronous dengan Discriminated Union
 * - Bebas dari tipe 'any'
 * =========================================================================
 */

// 1. Branded Types untuk entity IDs
export type UserId = string & { readonly __brand: 'UserId' };
export type ClassId = string & { readonly __brand: 'ClassId' };
export type AssignmentId = string & { readonly __brand: 'AssignmentId' };
export type SubmissionId = string & { readonly __brand: 'SubmissionId' };

// Helper constructor untuk safe brand casting
export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createClassId(id: string): ClassId {
  return id as ClassId;
}

export function createAssignmentId(id: string): AssignmentId {
  return id as AssignmentId;
}

export function createSubmissionId(id: string): SubmissionId {
  return id as SubmissionId;
}

// 2. Discriminated Union untuk Async Request State
export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

// 3. User Roles & Status Types
export type UserRole = 'dosen' | 'mahasiswa';
export type ClassStatus = 'active' | 'archived';
export type AssignmentStatus = 'active' | 'submitted' | 'pending' | 'graded';

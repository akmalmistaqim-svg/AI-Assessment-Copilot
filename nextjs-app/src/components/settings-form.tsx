"use client";

import { Bell, Check, CheckCircle2, Lock, Save, User } from "lucide-react";
import { useState } from "react";

interface SettingsFormProps {
  initialUser: {
    id: number;
    name: string;
    email: string;
    role: "dosen" | "mahasiswa";
  };
}

export function SettingsForm({ initialUser }: SettingsFormProps) {
  const [name, setName] = useState(initialUser.name);
  const [emailNotification, setEmailNotification] = useState(true);
  const [systemNotification, setSystemNotification] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving settings (or local update)
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Success Notification */}
      {isSaved && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-light-green border border-emerald-200 text-dark-green text-xs font-semibold animate-[toastIn_0.2s_ease]">
          <CheckCircle2 size={18} className="text-primary-green shrink-0" />
          <span>Pengaturan profil dan preferensi notifikasi berhasil diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border-color pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-light-green text-primary-green flex items-center justify-center font-bold">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">Profil Pengguna</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Kelola informasi identitas akun Anda di platform
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-text-secondary border border-border-color capitalize">
              {initialUser.role === "dosen" ? "Dosen Pengampu" : "Mahasiswa"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-semibold text-text-primary">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-border-color rounded-lg focus:outline-none focus:border-primary-green focus:bg-white transition"
              />
            </div>

            {/* Email Read-only */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-xs font-semibold text-text-primary">
                  Alamat Email (Akun Utama)
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                  <Lock size={11} /> Read-only
                </span>
              </div>
              <input
                id="email"
                type="email"
                value={initialUser.email}
                disabled
                className="w-full px-3.5 py-2.5 text-xs bg-slate-100/70 border border-border-color/80 rounded-lg text-text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Preferences Card */}
        <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border-color pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Preferensi Notifikasi</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Atur pemberitahuan pembaruan kelas, tugas, dan ulasan penilaian
              </p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border-color/60">
            {/* Toggle 1: Email Notification */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-text-primary block">
                  Terima Notifikasi Email
                </span>
                <p className="text-[11.5px] text-text-muted">
                  Kirim salinan pengumuman tugas dan hasil asesmen ke alamat email Anda
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailNotification}
                onClick={() => setEmailNotification(!emailNotification)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  emailNotification ? "bg-primary-green" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    emailNotification ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: System AI Alerts */}
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-text-primary block">
                  Notifikasi Ulasan AI Assessment
                </span>
                <p className="text-[11.5px] text-text-muted">
                  Pemberitahuan otomatis saat AI Copilot menyelesaikan asesmen pengerjaan tugas
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={systemNotification}
                onClick={() => setSystemNotification(!systemNotification)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  systemNotification ? "bg-primary-green" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    systemNotification ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-xl transition shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Menyimpan...</span>
            ) : isSaved ? (
              <>
                <Check size={14} />
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import {
  Award,
  Bell,
  Calendar,
  CheckCheck,
  FileCheck2,
  FileUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NotificationButtonProps {
  role?: "dosen" | "mahasiswa";
}

export function NotificationButton({ role = "dosen" }: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const dosenNotifications = [
    {
      id: "notif-1",
      title: "3 tugas baru dikumpulkan",
      desc: "Andi Pratama dan 2 mahasiswa lainnya mengumpulkan tugas Website CRUD",
      time: "10 menit yang lalu",
      icon: FileUp,
      color: "text-primary-green bg-light-green",
    },
    {
      id: "notif-2",
      title: "AI Assessment Selesai",
      desc: "Sistem AI telah menyelesaikan analisis asesmen kode untuk Tugas 2 OOP",
      time: "2 jam yang lalu",
      icon: Sparkles,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "notif-3",
      title: "Rubrik Siap Digunakan",
      desc: "Rubrik Penilaian Proyek Akhir telah terverifikasi dan aktif di sistem",
      time: "Kemarin",
      icon: FileCheck2,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const mahasiswaNotifications = [
    {
      id: "notif-1",
      title: "Tugas Anda sudah dinilai!",
      desc: "Penilaian Tugas 1 HTML/CSS telah difinalisasi dosen (Skor: 92/100)",
      time: "10 menit yang lalu",
      icon: Award,
      color: "text-primary-green bg-light-green",
    },
    {
      id: "notif-2",
      title: "Feedback Baru Dosen & AI",
      desc: "Dr. Budi Santoso memberikan catatan evaluasi pada proyek basis data",
      time: "2 jam yang lalu",
      icon: MessageSquare,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "notif-3",
      title: "Pengingat Tenggat Tugas",
      desc: "Tenggat tugas Website CRUD Next.js tersisa 2 hari lagi",
      time: "1 hari yang lalu",
      icon: Calendar,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const notifications = role === "dosen" ? dosenNotifications : mahasiswaNotifications;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[38px] h-[38px] rounded-full border border-border-color text-text-secondary flex items-center justify-center cursor-pointer relative transition ${
          isOpen
            ? "bg-slate-100 text-text-primary"
            : "bg-transparent hover:bg-slate-50 hover:text-text-primary"
        }`}
        aria-label="Buka notifikasi"
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full bg-primary-green border-[1.5px] border-white" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-xl border border-border-color overflow-hidden z-[1000] animate-[toastIn_0.2s_ease]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-color bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">Notifikasi</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-light-green text-dark-green">
                {notifications.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-primary-green hover:underline cursor-pointer flex items-center gap-1"
            >
              <CheckCheck size={13} />
              <span>Tandai dibaca</span>
            </button>
          </div>

          {/* List of notifications */}
          <div className="divide-y divide-border-color/60 max-h-[340px] overflow-y-auto">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  className="w-full text-left p-3.5 hover:bg-slate-50/80 transition flex items-start gap-3 cursor-pointer border-none bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.color}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-text-primary leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <span className="text-[10px] text-text-muted block pt-0.5">{item.time}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/80 border-t border-border-color text-center text-[11px] text-text-muted">
            Pusat Pemberitahuan Akademik
          </div>
        </div>
      )}
    </div>
  );
}

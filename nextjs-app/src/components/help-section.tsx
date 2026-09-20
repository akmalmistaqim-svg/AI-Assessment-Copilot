import { ChevronDown, FileQuestion, Headphones, Mail, MessageCircle } from "lucide-react";

interface HelpSectionProps {
  userRole: "dosen" | "mahasiswa";
}

export function HelpSection({ userRole }: HelpSectionProps) {
  const dosenFaqs = [
    {
      q: "Bagaimana cara membuat kelas perkuliahan baru?",
      a: "Buka menu 'Classes' di sidebar, lalu klik tombol hijau '+ Tambah Kelas' di pojok kanan atas. Masukkan nama mata kuliah dan semester, lalu simpan. Mahasiswa yang terdaftar akan langsung terhubung ke kelas tersebut.",
    },
    {
      q: "Bagaimana cara merancang rubrik penilaian asesmen?",
      a: "Pilih menu 'Rubrics' di sidebar, lalu klik '+ Tambah Rubrik'. Tentukan kriteria capaian, bobot persentase, dan skala skor yang akan menjadi panduan evaluasi AI dan dosen.",
    },
    {
      q: "Bagaimana alur kerja evaluasi AI Assessment Copilot?",
      a: "Saat mahasiswa mengumpulkan berkas atau repositori kode, sistem AI Copilot menganalisis pengerjaan berdasarkan rubrik dan memberikan saran skor serta evaluasi otomatis. Dosen dapat meninjau, merevisi, dan memfinalisasi penilaian.",
    },
    {
      q: "Apakah nilai draft dapat langsung dilihat oleh mahasiswa?",
      a: "Tidak. Mahasiswa hanya dapat melihat penilaian yang telah berstatus 'finalized'. Penilaian berstatus draft hanya terlihat oleh dosen pengampu untuk menjaga kerahasiaan proses evaluasi.",
    },
  ];

  const mahasiswaFaqs = [
    {
      q: "Bagaimana cara mengumpulkan tugas perkuliahan?",
      a: "Klik tombol hijau '+ Kumpul Tugas' di header dashboard atau buka menu 'My Assignments'. Pilih tugas yang berstatus 'Belum Dikumpul', masukkan tautan repositori/berkas tugas Anda, lalu klik 'Kumpul Sekarang'.",
    },
    {
      q: "Kapan hasil penilaian dan nilai saya ditampilkan?",
      a: "Nilai akan muncul di halaman 'My Grades' segera setelah dosen pengampu memfinalisasi asesmen. Anda juga dapat melihat ringkasan rata-rata nilai pada dashboard utama.",
    },
    {
      q: "Di mana saya bisa melihat catatan evaluasi dan masukan perbaikan?",
      a: "Buka menu 'Feedback' pada sidebar. Di sana Anda dapat membaca ulasan mendalam dari AI Copilot beserta catatan langsung dari dosen penguji.",
    },
    {
      q: "Bagaimana cara melihat daftar mata kuliah yang saya ikuti?",
      a: "Buka menu 'Kelas Saya' di sidebar. Anda dapat melihat daftar seluruh kelas aktif, dosen pengampu, dan daftar tugas yang terasosiasi dengan mata kuliah tersebut.",
    },
  ];

  const faqs = userRole === "dosen" ? dosenFaqs : mahasiswaFaqs;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* FAQ Cards */}
      <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border-color pb-4">
          <div className="w-10 h-10 rounded-xl bg-light-green text-primary-green flex items-center justify-center font-bold">
            <FileQuestion size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Pertanyaan Umum (FAQ)</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Jawaban cepat untuk pertanyaan yang sering diajukan mengenai sistem
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={faq.q}
              open={idx === 0}
              className="group bg-slate-50 border border-border-color/70 rounded-xl p-4 transition-all [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-xs md:text-sm text-text-primary select-none list-none">
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className="text-text-muted group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2"
                />
              </summary>
              <p className="text-xs text-text-secondary leading-relaxed mt-3 pt-3 border-t border-border-color/50">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Support Contact Card */}
      <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border-color pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Headphones size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Bantuan & Layanan Kontak</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Hubungi tim teknis kami jika membutuhkan bantuan lebih lanjut
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-border-color/60 space-y-1.5">
            <div className="flex items-center gap-2 text-primary-green font-semibold">
              <Mail size={16} />
              <span>Email Layanan Dukungan</span>
            </div>
            <p className="text-text-primary font-bold">support@aiassessment.ac.id</p>
            <p className="text-text-muted text-[11px]">Respon dalam 1x24 jam kerja</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-border-color/60 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <MessageCircle size={16} />
              <span>Jam Operasional Layanan</span>
            </div>
            <p className="text-text-primary font-bold">Senin – Jumat, 08:00 – 17:00 WIB</p>
            <p className="text-text-muted text-[11px]">Biro Akademik & Pusat Teknologi Informasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

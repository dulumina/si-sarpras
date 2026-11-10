# TODO — SI-Sarpras

>Status implementasi terhadap [docs/Rancangan_Sistem_Informasi_Sarpras.md](docs/Rancangan_Sistem_Informasi_Sarpras.md) (v0.1, Bagian 14: 5 tahap).
>Pembaruan terakhir: 2026-11-10 — setelah selesainya Tahap 3a (peminjaman) dan audit kesesuaian modul.

## Progress singkat

- Tahap 1 Fondasi ✅ — users/roles/permissions, teams, notifikasi, layout.
- Tahap 2 Inventaris aset ✅ — master kategori/lokasi, CRUD aset, kode inventaris, QR label, foto, histori, scan.
- Tahap 3 Operasional 🔨 — peminjaman selesai; kerusakan/jadwal/pengingat belum.
- Tahap 4 Tata kelola ❌ belum mulai.
- Tahap 5 Penyempurnaan ❌ belum mulai.
- **±6 dari 12 modul berfungsi** (Bagian 2.1 dokumen).

## Tahap 3b — Perawatan & Pengingat (prioritas berikutnya)

- [ ] **Laporan kerusakan** (`maintenance_reports`, §6.5): pelapor membuat laporan (aset, urgensi, deskripsi, foto lampiran); status menunggu → dalam proses → selesai/dibatalkan; penugasan petugas teknis; catat tindakan, biaya, suku cadang.
- [ ] **Jadwal pemelihraan** (`maintenance_schedules`, §6.6): frekuensi harian/mingguan/bulan/semester/tahun; petugas penanggung jawab; realisasi pelaksanaan + tanggal jadwal berikutnya; tampilan jatuh tempo & terlambat.
- [ ] **Role `petugas-teknis`** (§3): mengambil tugas perawatan/perbaikan, memperbarui progres.
- [ ] **Scheduler** (`routes/console.php` + `Schedule::`): job harian pengecekan jadwal & tenggat → notifikasi.
- [ ] **Pengingat tenggat peminjaman** (§6.4): notifikasi sebelum jatuh tempo + keterlambatan (job harian, table notifications).
- [ ] **Pemicu notifikasi modul sarpras** (§6.10): pengajuan dibuat/disetujui/ditolak/di-serah terima/di-kembalikan → notifikasi ke pihak terkait (pemohon/penyetuju).
- [ ] **Aturan bisnis #7**: aset dengan laporan rusak ditandai otomatis tidak tersedia/dalam perbaikan.
- [ ] **Test** modul perawatan + scheduler.
- [ ] pint, `wayfinder:generate --with-form`, `npm run build`, migrasi + seed DB dev, full test suite.

## Tahap 3c — Laporan Modul (jika diminta)

- [ ] Riwayat peminjaman & keterlambatan (§12) — ekspor/print.
- [ ] Rekap laporan kerusakan & biaya perbaikan.

## Tahap 4 — Tata Kelola Aset

- [ ] **Pengadaan** (`procurements` + `procurement_items`, §6.7): usulan multi-item + alasan + estimasi; verifikasi/persetujuan (alur berjenjang `approval_flows` module `procurement`); penerimaan → barang menjadi aset inventaris.
- [ ] **Penghapusan** (`disposals`, §6.8): usulan dengan alasan + bukti; persetujuan; metode + tanggal realisasi + dokumen; aset berstatus `dihapus` tanpa menghilangkan histori.
- [ ] **Audit log global** (`audit_logs`, §6.10): aktor, waktu, aksi, jenis objek, ID objek, ringkasan; read-only bagi pengguna biasa.
- [ ] **Role `auditor`** (§3): baca semua data + audit log.
- [ ] **Laporan pengadaan/penghapusan** (§12).
- [ ] Test, pint, wayfinder, build, migrasi, seed.

## Tahap 5 — Penyempurnaan

- [ ] **Dashboard sarpras** (§6.1): ringkasan aset per kategori/lokasi/status/kondisi; peminjaman aktif & mendekati tenggat; kerusakan belum selesai; jadwal jatuh tempo; ringkasan pengadaan & penghapusan.
- [ ] **Scan via kamera** (§6.3): integrasi pemindai kamera HP (BarcodeDetector API / lib) → buka detail aset.
- [ ] Laporan lengkap §12 (daftar aset per kategori/lokasi, rekap kondisi, aset tanpa kode/foto, audit per pengguna/rentang).
- [ ] Laporan "aset belum memiliki kode/foto lengkap" (laporan dcd proses data).

## Belum diputuskan (Bagian 15 dokumen — perlu konfirmasi pemilik proses)

- [ ] Format kode inventaris (apakah per tahun/kategori/unit) — sekarang bebas teks unik.
- [ ] Frekuensi & aturan pengingat pemeliharaan/pengembalian (mis. H-1/H-3).
- [ ] Kanal notifikasi: aplikasi saja atau + email/WhatsApp (§15.11).
- belum: prosedur resmi pengadaan/penghapusan + dokumen bukti, format ekspor laporan, volume aset/pengguna, hosting/backup.

## Konvensi proyek (jangan sampai terlewat)

- wayfinder: `php artisan wayfinder:generate --with-form` (tanpa --with-form merusak TS).
- pint: `vendor/bin/pint --dirty --format agent` setelah ubah PHP.
- test: `php artisan test --compact` (149 test saat ini, semua lulus).
- Dev DB: `docker compose exec laravel.test php artisan migrate --force` + `db:seed --force` (seeder idempoten, DemoDataSeeder skip produksi).
- tsc/build: 6 error TS pre-existing di file admin lama — tidak disentuh.

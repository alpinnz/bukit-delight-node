# Rencana Implementasi Bukit Delight

Dokumen ini merencanakan penyesuaian repository agar selaras dengan target arsitektur README.md, dengan menjaga perilaku aplikasi yang sudah ada.

## Kondisi awal

- Backend saat ini menggunakan Express dan JavaScript, dengan MongoDB/Mongoose.
- Frontend berada di direktori frontend/.
- Domain backend mencakup autentikasi, akun, peran, kategori, menu, pelanggan, meja, pesanan, item pesanan, dan transaksi.
- Target README adalah monorepo pnpm: React/TypeScript untuk web, Express/TypeScript untuk API, package bersama, PostgreSQL/Prisma, Redis, Docker, dokumentasi, dan CI.

## Prinsip pelaksanaan

1. Petakan kontrak dan perilaku sebelum memindahkan kode.
2. Kerjakan dalam perubahan kecil yang dapat diperiksa dan diverifikasi.
3. Pertahankan kompatibilitas API selama migrasi kecuali ada keputusan eksplisit untuk mengubah kontrak.
4. Jangan menambahkan layanan atau abstraksi tanpa kebutuhan nyata.
5. Migrasikan database dengan rencana pemindahan data, validasi, dan rollback sebelum cutover produksi.

## Phase 1 — Inventarisasi dan keputusan teknis

**Tujuan:** memahami batas migrasi serta menetapkan keputusan yang berpengaruh pada data dan kompatibilitas.

- Inventarisasi route, controller, model, relasi, autentikasi, validasi, upload, email, socket, dan pemanggil frontend.
- Identifikasi fitur aktif, data penting, dan kontrak API yang perlu dipertahankan.
- Petakan model MongoDB ke rancangan relasional PostgreSQL/Prisma.
- Putuskan strategi transisi database, migrasi data, validasi, cutover, dan rollback.
- Tetapkan versi Node.js/pnpm, aturan TypeScript, strategi pengujian, dan kebutuhan nyata Redis.

**Keluar dari phase ini bila:** tersedia peta modul/API dan keputusan migrasi database sebelum perubahan skema atau cutover.

## Phase 2 — Fondasi monorepo

**Tujuan:** membentuk workspace tanpa mengubah perilaku fitur.

- Siapkan apps/web, apps/api, packages/shared, dan package konfigurasi yang diperlukan.
- Pindahkan frontend dan backend bertahap; perbarui konfigurasi, import, dan skrip.
- Tambahkan pnpm workspace serta skrip root untuk dev, build, lint, format, typecheck, dan test.
- Siapkan konfigurasi TypeScript bersama dan konfigurasi spesifik aplikasi.
- Pastikan web dan API masih dapat dijalankan setelah pemindahan.

**Keluar dari phase ini bila:** workspace terpasang dan web/API berjalan melalui skrip monorepo.

## Phase 3 — Migrasi dan pembenahan API

**Tujuan:** menyelaraskan backend dengan struktur modul dan kontrak README sambil menjaga endpoint yang sudah digunakan.

- Susun modul API berdasarkan domain hasil inventarisasi.
- Migrasikan JavaScript ke TypeScript secara bertahap.
- Terapkan validasi request, middleware error/not-found, autentikasi, otorisasi, dan format respons secara konsisten.
- Tambahkan GET /health dan logging terstruktur tanpa mencatat kredensial atau token.
- Pertahankan endpoint lama selama masih digunakan konsumen.
- Tambahkan test untuk autentikasi, validasi, kontrak API, dan alur bisnis prioritas.

**Keluar dari phase ini bila:** endpoint prioritas terverifikasi dan format error/sukses konsisten.

## Phase 4 — PostgreSQL, Prisma, dan migrasi data

**Tujuan:** berpindah dari MongoDB/Mongoose ke PostgreSQL/Prisma jika keputusan Phase 1 menetapkannya.

- Implementasikan skema Prisma dan constraint berdasarkan pemetaan domain.
- Buat migrasi database yang dapat ditinjau; siapkan pemulihan untuk perubahan destruktif.
- Bangun proses pemindahan data yang dapat diulang atau dilanjutkan dengan aman.
- Pindahkan operasi API dari Mongoose ke Prisma per domain dan pertahankan kontrak HTTP selama transisi.
- Jaga agar satu request tidak membaca dan menulis ke dua database; alihkan runtime setelah kelompok persistence yang saling bergantung selesai.
- Validasi jumlah record, relasi, nilai penting, dan hasil query sebelum cutover.
- Rencanakan cutover, pemantauan, backup, dan rollback.
- Hapus Mongoose/MongoDB hanya setelah tidak ada jalur aplikasi/operasional yang bergantung padanya.

**Keluar dari phase ini bila:** data dan alur penting tervalidasi di PostgreSQL serta prosedur rollback terdokumentasi.

## Phase 5 — Frontend dan kontrak bersama

**Tujuan:** menyelaraskan web dengan struktur target dan mengurangi perbedaan kontrak web/API.

- Pindahkan frontend ke apps/web dan migrasikan ke TypeScript sesuai prioritas.
- Pertahankan alur pengguna saat mengadopsi struktur feature-based.
- Bagikan tipe/skema hanya untuk kontrak yang benar-benar digunakan kedua aplikasi.
- Integrasikan client API, autentikasi, status loading/error/empty, dan validasi form.
- Verifikasi alur utama dari antarmuka hingga API.

**Keluar dari phase ini bila:** alur web prioritas berjalan terhadap API baru tanpa perubahan kontrak tak terencana.

## Phase 6 — Infrastruktur dan kesiapan produksi

**Tujuan:** menyediakan setup lokal dan pipeline pemeriksaan yang konsisten.

- Tambahkan .env.example tanpa rahasia dan validasi konfigurasi saat startup.
- Siapkan Docker Compose untuk layanan yang dipilih, termasuk PostgreSQL dan Redis bila digunakan.
- Buat Dockerfile web/API dan reverse proxy bila dibutuhkan deployment.
- Tambahkan CI untuk install workspace, lint, typecheck, test, dan build.
- Dokumentasikan setup, migrasi/seed, deployment, health check, dan pemulihan.
- Pastikan logging dan health check tidak membocorkan informasi sensitif.

**Keluar dari phase ini bila:** setup bersih dapat dijalankan dari dokumentasi dan pipeline memeriksa aplikasi sebelum rilis.

## Phase 7 — Cutover dan penutupan migrasi

**Tujuan:** merilis perubahan bertahap dan menghapus komponen lama setelah aman.

- Jalankan validasi akhir seluruh alur bisnis dan integrasi.
- Rilis dengan strategi cutover yang disepakati; pantau error, latensi, dan kesehatan database.
- Pertahankan periode pemulihan sebelum menghapus sumber data atau kode lama.
- Hapus konfigurasi/dependensi lama yang tidak digunakan.
- Perbarui dokumentasi arsitektur dan keputusan teknis.

**Selesai bila:** aplikasi berjalan pada arsitektur target, data/kontrak terverifikasi, pipeline hijau, dan proses rollback telah ditinjau.

## Risiko dan pengendalian

| Risiko                                                | Pengendalian                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| Kehilangan/perubahan makna data MongoDB ke PostgreSQL | Pemetaan skema, dry run, rekonsiliasi, backup, rollback sebelum cutover       |
| Perubahan API memutus frontend/konsumen               | Inventarisasi konsumen, test kontrak, kompatibilitas endpoint selama transisi |
| Perubahan besar sekaligus menyulitkan diagnosis       | Pisahkan workspace, API, database, frontend, dan infrastruktur                |
| Kompleksitas Redis/Docker tidak dibutuhkan            | Tambahkan layanan setelah use case dan operasionalnya ditentukan              |

## Urutan dependensi

Inventarisasi/keputusan → monorepo → API → migrasi database → frontend/kontrak bersama → infrastruktur/CI → cutover.

Cutover bergantung pada verifikasi API, database, frontend, dan infrastruktur.

## Checkpoint implementasi

- Phase 1–2 selesai; workspace berjalan dengan pnpm dan frontend Vite.
- Phase 3 selesai: seluruh source API, komposisi Express, konfigurasi/service/model, route, dan controller kini TypeScript. Endpoint clustering Machine diuji dengan fixture empat menu; tes API mencakup 40 kontrak termasuk autentikasi/otorisasi, menu, order, transaksi, serta regresi error. Typecheck, build, lint JS/JSX, Prettier pada file terkait, dan `git diff --check` lulus. Tes berjalan dengan model stubs; ukuran bundle web masih memunculkan peringatan Vite.
- Phase 4 runtime lokal dialihkan langsung ke PostgreSQL setelah operator mengonfirmasi MongoDB sudah tidak tersedia. Database target `bukit-delight` pada `127.0.0.1:5432` kosong saat preflight; initial migration dan role seed diterapkan. Seluruh route, autentikasi, startup, serta readiness kini Prisma-only; health, readiness, dan login admin/cashier lulus. Tidak ada data legacy yang diimpor. Controller/model Mongoose dan dependency package sudah dihapus; test support menggunakan stub biasa dan importer snapshot tetap dapat membaca Extended JSON.
- Phase 5 selesai: seluruh source frontend TypeScript, route aktif memakai `features/*`, dan kontrak request/response lintas API-web yang digunakan bersama berada di shared package. Typecheck API/web dan formatter lulus pada perubahan kontrak terbaru. Suite web terbaru yang tercatat lulus 178 tes; bundle JavaScript terakhir tercatat 1,104.81 kB (gzip 296.19 kB), dengan peringatan Vite dan banner-2 sebesar 874.51 kB.
- Kontrak shared kini mencakup status pembayaran/update order, payload create/update order, payload create/update customer/meja/kategori/menu/akun, record role/meja/kategori/menu/pesanan/transaksi/akun serta item dan kategori pesanan, payload transaksi, bentuk respons customer dan analisis favorit, serta envelope respons generik yang diterapkan pada daftar menu, customer, role, dan analisis favorit; validator API serta action/reducer web memakai tipe/konstanta kontrak tersebut. Record akun response tidak memuat password; nilai masking tetap menjadi state tampilan reducer. Typecheck API/web lulus, dan endpoint item-order MongoDB telah ditambahkan ke pengikatan kontrak dengan typecheck API serta Prettier lulus.
- Phase 6 siap untuk runtime PostgreSQL: environment template memakai `bukit-delight`, host PostgreSQL 5432, dan Prisma sebagai default; Compose menyediakan instance terisolasi pada port 5433. Docker image API/web berhasil dibangun, config Compose tervalidasi, PostgreSQL/Redis lokal sehat, dan workspace bersih lulus install frozen/typecheck/build. Runtime API health/readiness terhadap target PostgreSQL lulus. Panduan deployment telah diperbarui; rilis produksi tetap memerlukan validasi target production, backup/restore PostgreSQL, secrets, ingress, dan upload persistence. Lint masih mengecualikan controller legacy.
- Phase 7 lokal telah menghapus dependency lama, memperbarui README/arsitektur, menambahkan PostgreSQL ephemeral pada CI, dan mendokumentasikan pemantauan serta recovery. Build/typecheck/lint API lulus; 12 API tests berjalan tanpa skip pada PostgreSQL disposable dan 178 web tests lulus. Rehearsal dump/list/restore lokal berhasil; seluruh 12 API tests lulus pula pada hasil restore. Runtime mengembalikan `/healthz=ok` dan `/readyz=ready`. GitHub Actions belum memiliki run untuk perubahan lokal, dan production backup/restore serta observability rehearsal menunggu deployment. Snapshot MongoDB bukan prasyarat runtime lokal karena operator mengonfirmasi MongoDB sudah tidak tersedia; tidak ada data legacy yang diimpor.

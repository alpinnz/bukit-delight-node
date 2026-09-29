# Rencana Implementasi Bukit Delight

## Rencana lanjutan — Migrasi UI ke Tailwind CSS v4

Bagian ini merinci migrasi UI web dari Material UI ke Tailwind CSS v4, Headless UI, dan Heroicons. Rencana ini menjadi kelanjutan frontend dan tidak mengubah scope backend, API, maupun database.

### Kondisi awal dan target

- Aplikasi web React menggunakan Material UI v4 (`@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`) di berbagai komponen bersama, template admin/kasir, halaman admin, kasir, dan pelanggan.
- Tailwind CSS v4/plugin Vite, Headless UI, dan Heroicons sudah ditambahkan; stylesheet global memakai `@import "tailwindcss"`. React telah dinaikkan ke v18 karena versi Headless UI yang digunakan mensyaratkannya.
- Implementasi migrasi sudah mengganti komponen bersama, template, halaman admin/kasir/customer, autentikasi, test mocks, dan dependensi Material UI. Navigasi route kasir/customer memakai tautan semantik dengan state aktif dari URL; typecheck serta build API/web lulus. Verifikasi browser mencakup halaman admin/kasir/customer/auth, validasi serta error/loading state, keyboard/fokus, dan viewport mobile/desktop. Alur customer cart/payment juga telah diuji; lima file test terkait lulus (7 test).
- Target akhir: seluruh UI menggunakan class utilities Tailwind v4 dan elemen HTML semantik; Headless UI menangani interaksi kompleks yang memerlukan perilaku aksesibel; Heroicons menggantikan seluruh ikon Material UI. Tidak ada dependensi, import, mock, konfigurasi, atau istilah implementasi Material UI yang tersisa.

### Prinsip migrasi

1. Pertahankan alur pengguna, kontrak data, validasi, dan perilaku responsive yang ada.
2. Pakai HTML + utility Tailwind untuk tampilan sederhana; gunakan Headless UI untuk dialog, menu, disclosure/accordion, tabs, dan listbox saat interaksinya sesuai.
3. Gunakan ikon dari `@heroicons/react`; sediakan nama aksesibel atau tandai dekoratif dengan `aria-hidden`.

### Catatan kompatibilitas data kosong

- Pemeriksaan browser menemukan `/api/v1/machine/favorite` mengembalikan 500 saat kurang dari tiga titik transaksi, sehingga halaman Favorites tidak dapat menampilkan empty state.
- K-Means menggunakan tiga centroid awal; API kini mengembalikan payload `FavoriteAnalysis` kosong untuk input di bawah ambang tersebut. Ini perubahan perilaku terbatas pada kondisi tanpa data analisis, dicatat sebagai pengecualian kecil dari scope migrasi UI.

4. Hindari membuat lapisan pembungkus yang meniru API Material UI. Hapus `makeStyles` dan pindahkan styling ke `className` Tailwind ou CSS global yang benar-benar diperlukan.
5. Migrasikan per area, pastikan area tersebut tidak lagi mengimpor Material UI, lalu lanjut ke area berikutnya.
6. Jangan menghapus paket Material UI sebelum seluruh source, test, dan tooling tidak lagi merujuk padanya.

### Phase UI-1 — Audit dan pemetaan

- Inventarisasi semua import Material UI, ikon, `makeStyles`/`withStyles`, komponen yang dipakai, serta mock test yang terkait.
- Kelompokkan pemakaian ke common UI, template/navigasi, admin, cashier, customer/auth, dan test.
- Catat perilaku, status UI, ukuran layar, label aksesibel, dan dependensi setiap komponen yang akan diganti.
- Tetapkan pola class Tailwind dan aturan penggunaan Headless UI/Heroicons agar tidak membuat design system berlebihan.

**Kriteria keluar:** inventaris lengkap dan setiap pemakaian Material UI mempunyai tujuan pengganti yang jelas.

### Phase UI-2 — Fondasi dan komponen bersama

- Rapikan integrasi Tailwind v4 dan theme token CSS `@theme`; pastikan plugin hanya dipasang sekali dan entry stylesheet hanya diimpor sekali.
- Tambahkan `@heroicons/react` dan konsistenkan versi/dependensi React 18 serta tipe React yang dibutuhkan.
- Migrasikan tombol, field/form, typography menjadi HTML semantik, container, loading, notifikasi, tabel bersama, dan navigasi.
- Migrasikan dialog bersama ke Headless UI dengan fokus, escape, backdrop, scroll, dan penutupan yang sesuai.
- Hapus helper/adapter sementara yang meniru props Material UI setelah seluruh pemakainya dipindahkan.

**Kriteria keluar:** komponen bersama tidak mengimpor Material UI; Tailwind v4 dan Headless UI menangani styling/interaksi sesuai tanggung jawabnya.

### Phase UI-3 — Template, layout, dan navigasi

- Migrasikan app bar, drawer/sidebar, menu akun, menu notifikasi, tabs kasir, bottom navigation, copyright, dan template admin/kasir/customer.
- Gunakan Headless UI untuk menu/tabs/disclosure yang interaktif dan Heroicons untuk ikon.
- Pastikan breakpoint, overlay, keyboard navigation, focus visible, dan nama aksesibel tetap berfungsi.

**Kriteria keluar:** seluruh template dan navigasi bebas Material UI dan dapat dipakai dengan keyboard serta ukuran layar utama.

### Phase UI-4 — Halaman admin dan kasir

- Migrasikan form akun, kategori, menu, meja; tabel, pagination, sorting, filter, favorites/analytics.
- Migrasikan order, transaksi, timeline, status/review/payment dialogs, dan seluruh aksi ikon.
- Pertahankan validasi, disabled/loading state, format data, izin aksi, dan perilaku submit yang ada.

**Kriteria keluar:** seluruh halaman admin/kasir bebas Material UI dan seluruh aksi utama tetap tercakup verifikasi.

### Phase UI-5 — Halaman customer dan autentikasi

- Migrasikan login, onboarding customer, kategori, daftar/menu, halaman home, layout mobile/desktop, cart, invoice, serta dialog menu/pembayaran.
- Ganti `Hidden`, `Grid`, `GridList`, `ButtonBase`, Pagination, timeline, dan accordion Material UI dengan layout Tailwind, HTML semantik, dan komponen Headless UI yang sesuai.
- Pertahankan navigasi, pemilihan menu, jumlah pesanan, catatan, pembayaran, responsive layout, dan state loading/error/empty.

**Kriteria keluar:** seluruh halaman customer/auth dan seluruh source web bebas Material UI.

### Phase UI-6 — Penghapusan Material UI dan verifikasi akhir

- Migrasikan mock/stub test dari modul Material UI ke perilaku/komponen baru.
- Hapus `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab` dan dependensi transitif tak terpakai; perbarui lockfile.
- Cari ulang pola `@material-ui`, `makeStyles`, `withStyles`, `MuiThemeProvider`, `createMuiTheme`, dan API Material UI pada source, test, konfigurasi, dokumentasi aktif, serta lockfile.
- Jalankan format/lint, typecheck, test UI yang relevan, build web, dan verifikasi manual alur penting pada viewport mobile/desktop serta keyboard.
- Perbarui dokumentasi stack UI dan catat hasil pemeriksaan.

**Selesai bila:** tidak ada jejak Material UI di project, build/typecheck/lint dan tes relevan lulus, alur utama serta aksesibilitas dasar telah diverifikasi.

### Urutan dan risiko

Urutan wajib: UI-1 → UI-2 → UI-3 → UI-4 → UI-5 → UI-6. Penghapusan dependensi menunggu UI-3 sampai UI-5 selesai. Risiko utama adalah regresi layout/responsive, perubahan interaksi dialog/menu, serta ketidakcocokan tipe karena React dinaikkan ke v18; tangani per area dengan verifikasi sebelum pindah phase.

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
- Siapkan Compose development/production untuk aplikasi; hubungkan ke infrastruktur PostgreSQL eksternal yang sudah dikelola terpisah.
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
- Phase 3 selesai: seluruh source API, komposisi Express, konfigurasi/service, route, dan controller kini TypeScript. Endpoint clustering Machine diuji dengan fixture empat menu; tes API mencakup 40 kontrak termasuk autentikasi/otorisasi, menu, order, transaksi, serta regresi error. Typecheck, build, lint API test support, Prettier pada file terkait, dan `git diff --check` lulus. Tes berjalan dengan model stubs; ukuran bundle web masih memunculkan peringatan Vite.
- Phase 4 runtime lokal dialihkan langsung ke PostgreSQL setelah operator mengonfirmasi MongoDB sudah tidak tersedia. Database target `bukit-delight` pada `127.0.0.1:5432` kosong saat preflight; initial migration dan role seed diterapkan. Seluruh route, autentikasi, startup, serta readiness kini Prisma-only; health, readiness, dan login admin/cashier lulus. Tidak ada data legacy yang diimpor. Controller/model Mongoose, dependency package, dan importer snapshot telah dihapus; test support menggunakan stub biasa.
- Phase 5 selesai: seluruh source frontend TypeScript, route aktif memakai `features/*`, dan kontrak request/response lintas API-web yang digunakan bersama berada di shared package. Typecheck API/web dan formatter lulus pada perubahan kontrak terbaru. Suite web terbaru yang tercatat lulus 178 tes; bundle JavaScript terakhir tercatat 1,104.81 kB (gzip 296.19 kB), dengan peringatan Vite dan banner-2 sebesar 874.51 kB.
- Kontrak shared kini mencakup status pembayaran/update order, payload create/update order, payload create/update customer/meja/kategori/menu/akun, record role/meja/kategori/menu/pesanan/transaksi/akun serta item dan kategori pesanan, payload transaksi, bentuk respons customer dan analisis favorit, serta envelope respons generik yang diterapkan pada daftar menu, customer, role, dan analisis favorit; validator API serta action/reducer web memakai tipe/konstanta kontrak tersebut. Record akun response tidak memuat password; nilai masking tetap menjadi state tampilan reducer. Typecheck API/web lulus, dan endpoint item-order MongoDB telah ditambahkan ke pengikatan kontrak dengan typecheck API serta Prettier lulus.
- Phase 6 memakai PostgreSQL eksternal pada network aktual `local-infra_local-infra` (project Compose `local-infra`); nama dapat dioverride melalui `LOCAL_INFRA_NETWORK`. Compose aplikasi tidak lagi mendefinisikan PostgreSQL/Redis atau volume database duplikat. Mode development menyediakan API watch dan web HMR; production memakai image build serta volume upload. Rehearsal production Compose lokal lulus: migrasi/seed keluar 0, API `/readyz` 200, API/web healthcheck healthy. Rilis ke target production sebenarnya tetap memerlukan backup/restore, secrets, ingress, upload persistence, dan monitoring periode pemulihan. Lint masih mengecualikan controller legacy.
- Phase 7 selesai dalam scope Docker yang diminta. Seluruh 12 API tests berjalan tanpa skip pada PostgreSQL disposable dan 178 web tests lulus. Rehearsal dump/list/restore lokal berhasil; seluruh 12 API tests lulus pula pada hasil restore. Backup database yang dipakai production Compose lokal kemudian dipulihkan ke database terpisah; tabel dan jumlah role, akun, serta migrasi cocok. Observability lokal juga diperiksa: API/web healthy, `/readyz=200`, serta statistik transaksi PostgreSQL terbaca. CI pada draft PR #2 lulus install, Prisma generate/migrate/seed, build, typecheck, lint, dan test. Production Compose lokal berjalan dan menjadi target deployment dalam scope ini. Belum ada cutover traffic publik atau deployment ke server eksternal; ulangi rehearsal pada target itu bila nanti disediakan. Snapshot MongoDB bukan prasyarat runtime lokal karena operator mengonfirmasi MongoDB sudah tidak tersedia; tidak ada data legacy yang diimpor.

# Checklist Implementasi Bukit Delight

## Checklist lanjutan — Migrasi UI Material UI ke Tailwind v4

Checklist ini khusus untuk migrasi UI web dan dijalankan berurutan mengikuti `plan.md` Phase UI-1 sampai UI-6. Tandai selesai hanya setelah implementasi di area terkait sudah diperiksa.

### Phase UI-1 — Audit dan pemetaan

- [x] Buat daftar setiap import Material UI di `apps/web/src`, termasuk import multiline dan default imports.
- [x] Catat semua ikon `@material-ui/icons`, `makeStyles`/`withStyles`, theme provider, dan komponen layout yang dipakai.
- [x] Temukan seluruh mock/stub Material UI di file test dan konfigurasi.
- [x] Petakan file dan perilaku UI berdasarkan common, template/navigation, admin, cashier, customer, dan auth.
- [x] Cocokkan API komponen lama dengan target HTML + Tailwind, Headless UI, atau Heroicons.

### Phase UI-2 — Fondasi dan komponen bersama

- [x] Tambahkan Tailwind CSS v4 dan plugin Vite ke workspace web.
- [x] Tambahkan stylesheet entry dengan `@import "tailwindcss"`.
- [x] Tambahkan Headless UI dan naikkan React/ReactDOM ke v18 untuk kompatibilitas.
- [x] Tambahkan `@heroicons/react`; tetapkan pola penggunaan ikon aksesibel ketika mengganti setiap ikon.
- [x] Tetapkan token warna utama, surface, dan font CSS melalui `@theme` berdasarkan tampilan aplikasi yang ada.
- [x] Migrasikan `button.custom.tsx`, `form.control.custom.tsx`, `text.custom.tsx`, `container.custom.tsx`, dan `loading.custom.tsx` sepenuhnya ke Tailwind + HTML semantik.
- [x] Migrasikan `dialog.custom.tsx` ke Headless UI dan periksa fokus awal, Escape, pemulihan fokus, serta interaksi di luar dialog.
- [x] Migrasikan `notification.custom.tsx` dan `table.custom.tsx`; row action memakai Headless UI Menu.
- [x] Migrasikan semua pemakaian `Grid`/adapter sementara ke utility Tailwind langsung dan hapus `tailwind-ui.tsx`.
- [x] Pastikan tidak ada `makeStyles`, `withStyles`, atau theme Material UI di komponen bersama.

### Phase UI-3 — Template, layout, dan navigasi

- [x] Migrasikan template app bar admin, drawer admin, serta template kasir dan customer.
- [x] Migrasikan menu akun/notifikasi ke Headless UI Menu dan ikon ke Heroicons.
- [x] Migrasikan navigasi route kasir/customer ke tautan `<nav>` semantik dengan state aktif dari URL dan ikon Heroicons.
- [x] Migrasikan sidebar, accordion kategori, breakpoint `Hidden`, dan copyright.
- [x] Periksa navigasi keyboard, focus visible, label aksesibel, overlay, dan breakpoint mobile/desktop.

### Phase UI-4 — Halaman admin dan kasir

- [x] Migrasikan form akun, kategori, menu, dan meja ke kontrol HTML/Tailwind yang konsisten.
- [x] Migrasikan tabel admin, favorites, cluster/K-means tables, sorting, pagination, pencarian, dan row actions.
- [x] Migrasikan daftar order/transaksi, filter, timeline/status, dan dialog review/payment.
- [x] Ganti ikon halaman admin/kasir dengan Heroicons atau markup semantik.
- [x] Verifikasi submit kosong kategori, menu, dan meja mempertahankan dialog serta menolak request; cek error validasi username, role, dan repeat password akun.
- [x] Verifikasi update akun menampilkan username/email/role tersimpan dan tidak meminta password; batalkan aksi Delete, pastikan dialog tutup, fokus pulih, dan tidak ada request DELETE.
- [x] Verifikasi cashier yang membuka route admin diarahkan ke `/kasir/home`; bootstrap cashier hanya memuat resource staff yang diizinkan dan tidak mendapat 403.
- [x] Verifikasi kegagalan API saat create akun menampilkan notifikasi, mempertahankan dialog/input, mengaktifkan kembali tombol retry, dan tidak mengubah tiga akun seed.
- [x] Verifikasi form meja menonaktifkan Submit selama request tertunda, lalu mengaktifkannya kembali setelah 500; dialog tetap terbuka dan tabel tetap kosong.
- [x] Verifikasi error create kategori saat API tidak tersedia.
- [x] Pastikan request awal menu/favorites menyalakan loading dan semua cabang gagal mematikannya kembali.
- [x] Tinjau catch transaksi: notifikasi error dan reset loading tersedia pada fetch serta aksi mutasi.
- [x] Pastikan refresh token gagal tidak menahan seluruh aplikasi pada splash “Loading”.
- [x] Verifikasi request awal menu yang gagal menampilkan aplikasi login dan notifikasi error.
- [x] Verifikasi initial-load error favorites saat sesi admin masih valid.
- [x] Verifikasi validasi email/password akun tanpa autofill browser.

### Phase UI-5 — Halaman customer dan autentikasi

- [x] Migrasikan login dan form inisialisasi customer.
- [x] Migrasikan home, banner/slides, kategori, menu list, menu desktop, dan pagination.
- [x] Migrasikan cart mobile/desktop, jumlah item, invoice/recipe, dan dialog menu/pembayaran.
- [x] Ganti komponen layout Material UI dengan markup semantik serta utility Tailwind.
- [x] Periksa alur pilih menu → cart → pembayaran, layout mobile/desktop, serta loading/error/empty states.
- [x] Ganti ikon customer/auth dengan Heroicons atau markup semantik.

### Phase UI-6 — Hapus Material UI dan verifikasi

- [x] Audit mock test: tidak ditemukan mock atau referensi Material UI yang tersisa di `apps/web`.
- [x] Pastikan pencarian source/test/config tidak menemukan `@material-ui`, `makeStyles`, `withStyles`, `MuiThemeProvider`, atau `createMuiTheme`.
- [x] Pastikan test tidak bergantung pada selector class CSS Material UI yang sudah dihapus.
- [x] Audit sisa CSS-in-JS, stylesheet framework, dan inline style; pertahankan hanya nilai inline yang dinamis.
- [x] Hapus `@material-ui/core`, `@material-ui/icons`, dan `@material-ui/lab` dari `apps/web/package.json`.
- [x] Perbarui `pnpm-lock.yaml` dan pastikan paket Material UI tidak lagi ada sebagai dependency project.
- [x] Jalankan formatter pada file migrasi dan rapikan hasilnya. Lint frontend tidak tersedia sebagai skrip workspace aktif.
- [x] Jalankan typecheck web dan perbaiki semua error, termasuk kompatibilitas tipe React 18.
- [x] Jalankan test UI terkait cart/payment: 5 file dan 7 test lulus.
- [x] Jalankan build web.
- [x] Verifikasi manual halaman admin, cashier, customer, auth, modal/menu, keyboard, dan viewport mobile/desktop.
- [x] Perbarui dokumentasi stack frontend di `apps/web/README.md`.

**Status migrasi saat ini:** Implementasi source dan penghapusan dependency Material UI selesai. Typecheck workspace dan build API/web lulus; pencarian source `apps/web` tidak menemukan Material UI, adapter, theme, atau mock lama. Navigasi kasir/customer memakai tautan route semantik dan index aktif yang diduplikasi telah dihapus. Spot check browser mencakup login admin/cashier, drawer/menu admin, form dan tabel kategori/menu/meja/akun, navigasi/filter kasir, Favorites, customer cart/payment, validasi, loading/error/empty state, keyboard/fokus, serta viewport mobile/desktop. Test terfokus cart/payment lulus (5 file, 7 test). Tidak ada checklist migrasi UI yang belum selesai; validasi deployment ke server production eksternal tetap berada di luar scope lokal.

**Pemeriksaan lanjutan (2026-09-28):** Aksi menu Accounts membuka update form dengan username, email, dan role seed terisi serta tanpa field password; dialog delete dibatalkan tanpa mengubah tiga akun, fokus kembali ke tombol aksi, dan tidak ada request DELETE. Submit kosong form menu dan meja mempertahankan dialog serta menandai field wajib invalid; kategori/menu tidak mengirim POST. Customer initialization pada lebar 390 px tidak overflow, label dan pesan error terhubung ke username/table, submit kosong menandai keduanya invalid, dan tidak ada request pembuatan customer. Form akun sempat terhalang autofill browser; pemeriksaan validasi lanjutan memastikan field email/password tetap kosong, validasi bekerja, dan tidak ada POST. Audit role/error, loading, serta cart/payment diselesaikan pada checkpoint lanjutan di bawah.

**Lanjutan berurutan (2026-09-28):** Seluruh route halaman kini lazy-loaded agar role/page chunks tidak seluruhnya masuk ke entry awal. Build host menghasilkan entry 520.93 kB (gzip 158.05 kB); build Docker dari instalasi frozen menghasilkan entry 302.07 kB (gzip 96.06 kB), sehingga peringatan batas chunk 500 kB hilang pada image production. Banner-2 874.51 kB masih berupa aset gambar terpisah. `corepack pnpm test` lulus: web 178/178 dan API 6 lulus; 6 API integration test diskip karena koneksi PostgreSQL disposable tidak dikonfigurasi. `corepack pnpm typecheck`, lint API test support, Prettier pada file terkait, dan `git diff --check` lulus. Production web lokal dibangun dan diperbarui tanpa restart API/database; web/API sehat, `/healthz`, `/readyz`, dan landing page semuanya HTTP 200. Tidak ada phase migrasi UI tersisa.

**Verifikasi integrasi lanjutan (2026-09-28):** Menjalankan PostgreSQL 16 disposable terisolasi pada port 5434, menerapkan dua migrasi dan seed, lalu `corepack pnpm test:api` lulus 12/12 tanpa skip (termasuk enam test Prisma integration). Container disposable dihentikan dan dihapus sesudah test; production Compose tetap sehat dan tidak disentuh.

**Optimasi pemuatan banner (2026-09-28):** Banner pertama carousel dimuat eager, banner berikutnya lazy, dan semua gambar memakai decoding async. Typecheck dan 178 web tests lulus; Prettier lulus. Docker production web dibangun dari install frozen (entry 302.07 kB, gzip 96.05 kB) dan diperbarui tanpa restart API/database; web/API readiness serta health dan landing page merespons HTTP 200. File gambar banner-2 tetap 874.51 kB dan tampilannya tidak diubah.

**Pemeriksaan console production (2026-09-28):** Browser menemukan Redux logger aktif di production dan mencetak state/action. Middleware logger kini dipasang hanya ketika `import.meta.env.DEV`; production build Docker selesai (entry 302.05 kB, gzip 96.05 kB) dan web diperbarui tanpa restart API. Setelah route customer dibuka, browser mencatat 0 pesan, 0 warning, dan 0 error; web health serta API readiness HTTP 200. Typecheck dan 178 web tests lulus.

**Tindak lanjut audit kesesuaian (2026-09-28):** `.env` dihapus dari index Git tetapi tetap dipertahankan lokal dan tercakup `.gitignore`; file tersebut berisi kredensial lokal, jadi rotasi diperlukan bila nilainya pernah digunakan di luar development. Build web menetapkan `NODE_ENV=production` sebelum Vite dimuat, sehingga `pnpm build:web` tanpa override host menghasilkan entry 302.05 kB tanpa chunk warning meskipun `.env` lokal menyetel development. Empat file source yang gagal pemeriksaan format telah diformat; `.prettierignore` mengecualikan petunjuk lokal, artefak build, dan lockfile. Nama `costumers.route.tsx` diperbaiki menjadi `customers.route.tsx` beserta import. Verifikasi akhir dijalankan setelah perubahan.

**Hasil verifikasi tindak lanjut:** `pnpm format:check`, `pnpm build`, `pnpm typecheck`, dan `pnpm lint` lulus. Dengan PostgreSQL disposable port 5434, migrasi/seed berhasil dan `pnpm test` lulus 12 tes API serta 178 tes web tanpa skip; container test dihapus. Production Docker web dibangun ulang (entry 302.05 kB, gzip 96.05 kB) dan sehat. Development API/web serta production API/web aktif; readiness/health dan halaman web HTTP 200. Browser production membuka route customer dengan 0 console messages, warnings, atau errors.

**Pemeriksaan role/error API (2026-09-28):** Sesi cashier yang membuka `/admin/categories` diarahkan ke `/kasir/home`. Bootstrap cashier hanya meminta refresh token, tables, menus, categories, transactions, dan orders; endpoint accounts, roles, dan favorites tidak dipanggil, sehingga tidak ada 403/error console. Saat API dihentikan setelah form create akun valid disiapkan, POST gagal 500; UI menampilkan notifikasi, mempertahankan input/dialog, mengaktifkan tombol retry, dan daftar tetap tiga akun. Typecheck web, build web, Prettier, dan `git diff --check` lulus. Build memperingatkan chunk JavaScript 926.48 kB dan banner-2 874.51 kB. Test UI cart/payment telah dijalankan dan hasil terbarunya dicatat di bawah.

**Verifikasi UI cart/payment (2026-09-28):** Lima file test terkait lulus (7 test), mencakup pemilihan menu, penambahan ke cart, pembukaan opsi pembayaran, komponen cart mobile/desktop, dan dialog pembayaran. `typecheck` web dan `git diff --check` lulus. Formatter diperiksa kembali pada test alur customer setelah koreksi assertion.

**Pemeriksaan loading (2026-09-28):** Request create meja ditunda satu detik dan diarahkan ke API yang dihentikan. Submit langsung disabled saat pending, kemudian aktif kembali setelah error 500; dialog tetap terbuka, notifikasi error tampil, dan tabel masih menunjukkan “No records available.”

**Pemeriksaan navigasi mobile (2026-09-28):** Pada viewport 390 × 844, drawer memiliki judul dialog `Navigation`, tautan berada di dalam nav `Admin navigation`, dan fokus kembali ke tombol `Open navigation` setelah drawer ditutup. Menambahkan indikator `focus-visible` berwarna indigo pada seluruh tautan admin dan tombol tutup drawer. Navigasi desktop tetap memakai sidebar pada breakpoint `sm`; drawer mobile memakai overlay dan Headless UI Dialog.

**Audit sisa Material UI (2026-09-28):** Pencarian seluruh source/config aktif tidak menemukan dependency/API Material UI dan `pnpm-lock.yaml` tidak memuat paket Material UI. Satu test accordion masih memeriksa selector `.MuiAccordion-root`; assertion diganti menjadi elemen semantik `<section>` yang dipakai komponen sekarang.

**Pemeriksaan dialog Headless UI (2026-09-28):** Dialog kategori memberi fokus ke dalam dialog saat dibuka. Escape menutup dialog dan memulihkan fokus ke tombol `Add Categories`. Klik tautan Dashboard di luar dialog menutup dialog dan membuka halaman Dashboard. Tidak ada data kategori yang diubah.

**Pemeriksaan validasi akun (2026-09-28):** Browser sebelumnya mengisi kredensial `cashier` ke field Email dan Password saat dialog akun dibuat. Field email kini bertipe `email` dengan `autoComplete="off"`; password dan repeat password memakai `autoComplete="new-password"`. Setelah reload, seluruh field tersebut tetap kosong. Submit kosong menandai username, role, email, password, dan repeat password invalid tanpa POST; email berformat salah menampilkan `Email not valid` dan tidak mengirim POST. API lokal berjalan pada port 3000 untuk pemeriksaan ini.

**Pemeriksaan error kategori (2026-09-28):** Dengan form kategori valid disiapkan dan API lokal dihentikan, POST create menerima HTTP 500. UI menampilkan notifikasi error, mempertahankan dialog serta input, mengaktifkan kembali tombol Submit, dan tabel tetap “No records available.” Tidak ada kategori yang tersimpan.

**Audit loading/error menu dan favorites (2026-09-28):** Review menemukan request initial load menu/favorites tidak mengaktifkan loading; cabang response tidak valid, response gagal, dan catch juga tidak selalu mengembalikan loading ke `false`. Kedua thunk kini selalu mengaktifkan loading saat request dimulai dan membersihkannya pada seluruh jalur gagal; transaksi telah melakukan reset loading pada fetch/mutasi. Typecheck web dan Prettier lulus.

**Pemeriksaan startup tanpa API (2026-09-28):** Browser mereproduksi refresh token gagal ketika API mati. Sebelumnya autentikasi menghapus sesi tanpa mengirim action `MOUNT`, sehingga `InitCheck` mempertahankan splash “Loading” dan menutupi notifikasi. Jalur refresh tanpa account, response tanpa account, response gagal, dan catch kini menandai bootstrap selesai. Setelah perbaikan, browser diarahkan ke Login, splash hilang, dan notifikasi HTTP 500 terlihat; GET menus juga tercatat gagal HTTP 500. Pengujian favorite initial-load dengan admin valid dicatat terpisah.

**Pemeriksaan loading menu/transaksi/favorites (2026-09-28):** Dengan sesi admin aktif dan API dihentikan, thunk initial-load masing-masing dijalankan di store aplikasi. Ketiganya memulai dengan `loading=true`, lalu setelah HTTP 500 mengembalikan `loading=false`, menampilkan notifikasi error, dan mempertahankan tabel pada “No records available.” Tidak ada operasi tulis yang dikirim.

**Pemeriksaan customer cart/payment (2026-09-28):** Karena DB kosong, menu/customer/meja probe hanya dimasukkan ke Redux browser sementara; API mati dan tidak ada data bisnis yang dibuat. Pada lebar 390 px, menu promo dipilih, jumlah ditambah, dan Add menghasilkan satu item cart dengan total promo 9.000; halaman cart tidak overflow. Menekan Pesan sebelumnya membuka dua payment dialog karena mobile dan desktop merender dialog yang sama melalui portal. PaymentDialog kini dimiliki sekali oleh route cart; HMR/browser mengonfirmasi hanya satu dialog terbuka. Menekan Tunai saat API mati menerima HTTP 500, menampilkan error, mempertahankan dialog/cart, mengembalikan Orders.loading ke false, dan jumlah order tetap nol. Pada lebar 1440 px cart tetap tampil tanpa overflow dan dialog tetap satu.

**Verifikasi manual lintas UI (2026-09-28):** Spot check kumulatif mencakup login/auth, halaman admin dan kasir, route/role, form dan tabel admin, drawer/menu/dialog, keyboard/focus, customer init/menu/cart/payment, loading/error/empty states, serta viewport mobile 390 px dan desktop 1440 px. Test otomatis terfokus cart/payment lulus (5 file, 7 test); full suite web tidak dijalankan pada pemeriksaan ini.

**Checkpoint browser (2026-09-28):** Vite development proxy sekarang mengutamakan `API_PORT` dari environment process sehingga dapat diarahkan ke API lokal yang berbeda tanpa mengubah `.env`. Pada localhost:5173, landing/login/customer initialization berhasil dirender; endpoint tables/menus/categories memberi HTTP 200 setelah proxy diarahkan ke API lokal port 8080. Login dan customer initialization pada viewport 390 px tidak overflow; label field terbaca dan tombol dapat dicapai dengan Tab. CSS browser memuat token `--color-brand-primary` dan utility warna turunannya; console tidak melaporkan error pada pemeriksaan terakhir. Alur autentikasi, drawer/menu interaktif, customer cart/payment, dan test UI belum diperiksa.

**Checkpoint verifikasi akhir (2026-09-28):** Layout statis pada komponen bersama, halaman admin/kasir, customer accordion, kategori, menu, cart, invoice, dan countdown dipindahkan ke utility Tailwind. Warna brand/font kini memakai token `@theme`; inline style tersisa hanya untuk nilai runtime/native. Typecheck seluruh workspace, build web, Prettier untuk file berubah, pencarian Material UI, dan `git diff --check` lulus. Build masih memperingatkan bundle JS sekitar 941.77 kB dan banner terbesar 874.51 kB. Pada checkpoint ini, UI test dan alur autentikasi/keranjang/pembayaran belum diverifikasi; verifikasi terfokus dan penutupan Phase UI-6 tercatat pada checkpoint berikutnya.

**Checkpoint verifikasi (2026-09-25):** Root build, typecheck, test (35 API + 3 web), lint, pemeriksaan Prettier untuk file yang disentuh, dan `git diff --check` lulus. Build Vite masih memberi peringatan chunk JavaScript sekitar 963 kB. Lint API belum mencakup controller legacy dan `src/config/cors.js`; TypeScript diperiksa oleh typecheck.

**Checkpoint browser tambahan (2026-09-28):** Dengan seed `admin/admin` dan `cashier/cashier`, drawer admin dibuka dengan Enter, fokus Tab berpindah dari tombol tutup ke link navigasi, lalu Escape menutup drawer dan mengembalikan fokus ke pemicu. Menu akun dan dialog/form kategori, menu, meja, serta akun dapat dibuka; Escape menutup dialog dan mengembalikan fokus. Submit kosong pada form kategori menandai nama/deskripsi/gambar invalid, mempertahankan dialog, dan tidak mengirim POST. Input gambar kategori kini memiliki label yang terhubung, `aria-invalid`, dan `aria-describedby` ke pesan error; atribut `required` mengikuti mode create/edit. Selector form kategori, menu, akun, dan meja kini memilih slice state secara spesifik; tab browser baru pada halaman meja tidak mereproduksi warning selector Redux. Submit kosong pada form menu menandai field wajib invalid dan tidak mengirim POST; submit kosong pada form meja juga menandai nama invalid. Form akun menandai username/role/email/repeat password invalid dan tetap terbuka; pada checkpoint ini browser autofill menghalangi konfirmasi email/password kosong, lalu atribut autocomplete diperbaiki dan validasi tersebut diverifikasi pada pemeriksaan berikutnya di atas. Daftar kategori/menu/meja menampilkan state kosong; daftar akun menampilkan tiga seed role serta menu aksi Update/Delete. Kasir home/orders/transactions dan filter ter-render. Navigasi route kasir/customer kini menggunakan link semantik dengan `aria-current`, focus ring, Heroicons, dan fokus dipindahkan ke link aktif sesudah route berubah; index aktif yang diduplikasi dihapus dari halaman. Pada viewport 390 px halaman kategori, menu, meja, akun, orders, transactions, dan Favorites tidak overflow horizontal; halaman akun juga tidak overflow pada 1440 px. Customer-init menampilkan validasi username/meja kosong dan tidak mengirim POST; GET tables 200. Database tidak berisi meja/menu untuk menguji customer cart/payment saat checkpoint ini; alur itu kemudian diverifikasi dengan state Redux sementara pada pemeriksaan cart/payment di atas. API base URL kosong sebelumnya membuat endpoint relatif salah pada deep link; default `BASE_URL` diubah ke `/`, dan refresh token/logout kini HTTP 200. Analisis favorit mengembalikan hasil kosong untuk data kurang dari tiga titik; browser menerima HTTP 200, menampilkan enam tabel “No records available.”, console tanpa error/warning. Typecheck workspace, build API/web, Prettier terkait, dan `git diff --check` lulus; bundle web 926.32 kB masih melewati ambang 500 kB. Tindak lanjut test UI dan customer cart/payment diselesaikan pada catatan verifikasi yang lebih baru.

Tandai [x] setelah item selesai dan diverifikasi. Catat keputusan atau blocker pada bagian catatan tiap phase.

**Status akhir:** Phase 1–7 dan Phase UI-1–UI-6 selesai; seluruh checklist telah ditandai setelah implementasi dan verifikasi. PostgreSQL/Prisma menjadi runtime aplikasi, Material UI telah dihapus, dan Compose development/production, CI, backup/restore, serta observability sudah direhearse secara lokal. Deployment yang masih di luar scope hanya cutover traffic publik atau server production eksternal; belum ada target eksternal yang ditentukan.

**Checkpoint (2026-09-27):** Operator menetapkan PostgreSQL lokal `bukit-delight` (`localhost:5432`, user `postgres`) sebagai database aktif dan mengonfirmasi MongoDB sudah tidak tersedia. Target database kosong sebelum inisialisasi; initial migration dan seed role berhasil, tanpa impor data legacy. API langsung menggunakan Prisma tanpa `API_STORAGE`/`AUTH_STORAGE`; `/healthz`, `/readyz`, dan login admin/cashier lulus. Controller/model lama dihapus, test support tidak memakai Mongoose, dan package Mongoose dilepas.

**Checkpoint role (2026-09-27):** Role PostgreSQL diseragamkan menjadi `admin`, `cashier`, dan `customer`. Migrasi memindahkan referensi akun dari `kasir`/`user`, kemudian seed membuat akun lokal `admin` dan `cashier` tanpa menimpa password akun yang sudah ada. Login API berhasil mengembalikan role baru untuk keduanya; typecheck API/web dan status migrasi lulus.

**Checkpoint (2026-09-26):** Semua source API dan controller Machine/helper agregasinya sudah TypeScript. Seluruh controller API kini dapat dipilih sebagai satu kelompok lewat `API_STORAGE=prisma`; default tetap MongoDB dan `AUTH_STORAGE=prisma` tetap tersedia untuk transisi staff auth/account/role saja. Suite API dengan `PRISMA_TEST_DATABASE_URL` loopback lulus 47 tes tanpa skip, termasuk alur HTTP customer/order/item-order/transaksi pada `API_STORAGE=prisma`; suite tanpa URL melewati tes PostgreSQL opsional. Prisma runtime belum diaktifkan pada environment lokal atau production karena rekonsiliasi snapshot dan latihan restore/rollback belum dilakukan.

## Phase 1 — Inventarisasi dan keputusan teknis

- [x] Daftar semua route prefix dan metode HTTP backend.
- [x] Petakan controller, model, relasi, otorisasi route, dan pemanggil frontend per domain.
- [x] Inventarisasi upload, email, socket, autentikasi, refresh token, dan environment.
- [x] Identifikasi kontrak API yang dikonsumsi frontend atau klien lain.
- [x] Petakan koleksi MongoDB dan aturan integritas ke calon tabel/relasi PostgreSQL.
- [x] Putuskan strategi migrasi snapshot, cutover, rekonsiliasi, backup, dan rollback.
- [x] Tetapkan pnpm 12.6, runtime Node.js 22+, cakupan TypeScript bertahap, dan strategi pengujian.
- [x] Tentukan Redis sebagai infrastruktur lokal; integrasi aplikasi menunggu use case.
- [x] Catat keputusan arsitektur dan kriteria penerimaan.

Dokumentasi hasil: docs/architecture/overview.md dan docs/architecture/decisions.md.

**Catatan / keputusan:**

-

## Phase 2 — Fondasi monorepo

- [x] Buat konfigurasi pnpm workspace untuk apps/* dan packages/*.
- [x] Siapkan apps/api dan pindahkan backend tanpa mengubah perilaku.
- [x] Siapkan apps/web dan pindahkan frontend tanpa mengubah alur pengguna.
- [x] Siapkan package bersama/konfigurasi hanya jika diperlukan.
- [x] Tambahkan skrip root untuk dev, build, lint, format, typecheck, dan test.
- [x] Perbarui import, konfigurasi, ignore files, dan dokumentasi terkait.
- [x] Verifikasi web dan API berjalan dari root workspace.

**Catatan / blocker:**

- ESLint aktif untuk file JavaScript/JSX yang tersisa dan tes API; source TypeScript diperiksa melalui typecheck.

## Phase 3 — Migrasi dan pembenahan API

- [x] Kelompokkan endpoint ke modul domain yang jelas.
- [x] Migrasikan source API ke TypeScript secara bertahap.
  - [x] Migrasikan entry point API/server, middleware response, validasi environment, serta route/controller autentikasi, kategori, dan menu.
  - [x] Migrasikan route/controller roles dan tables.
  - [x] Migrasikan middleware autentikasi dan otorisasi token ke TypeScript.
  - [x] Migrasikan middleware validasi ObjectId ke TypeScript.
  - [x] Migrasikan logger Pino ke TypeScript dengan kompatibilitas CommonJS untuk pemanggil legacy.
  - [x] Migrasikan barrel konfigurasi dan model ke TypeScript tanpa mengubah bentuk ekspor CommonJS.
  - [x] Migrasikan konfigurasi email Nodemailer ke TypeScript dengan ekspor kompatibel.
  - [x] Migrasikan konfigurasi upload Multer ke TypeScript dengan opsi dan format nama file tetap kompatibel.
  - [x] Migrasikan konfigurasi koneksi Mongoose dan inisialisasi role ke TypeScript dengan ekspor kompatibel.
  - [x] Migrasikan model Roles ke TypeScript tanpa mengubah schema dan validasi unik.
  - [x] Migrasikan model Categories dan Tables ke TypeScript dengan schema yang tetap kompatibel.
  - [x] Migrasikan model Accounts, Customers, Menus, ItemOrders, dan Transactions ke TypeScript.
  - [x] Migrasikan model Orders dan RefreshTokens beserta virtual dan transform serialisasi.
  - [x] Migrasikan komposisi aplikasi Express ke TypeScript tanpa mengubah middleware, health/readiness, socket, dan lifecycle server.
  - [x] Migrasikan service token/password Authentication ke TypeScript sambil mempertahankan ekspor dan perilaku token.
  - [x] Hapus helper CORS lama yang tidak memiliki pemanggil dan memakai variabel `app` tak terdefinisi; CORS aktif tetap pada app Express.
  - [x] Migrasikan route dan controller Machine ke TypeScript.
  - [x] Migrasikan policy route v1 ke TypeScript.
  - [x] Migrasikan controller dan route item-pesanan.
  - [x] Migrasikan route dan controller pesanan.
  - [x] Migrasikan route dan controller transaksi.
  - [x] Migrasikan route dan controller pelanggan.
  - [x] Migrasikan route dan controller akun.
  - [x] Migrasikan route v1 dan terapkan pengujian lintas token customer/staff.
  - [x] Pindahkan agregasi transaksi/menu dari controller Machine ke TypeScript dan verifikasi error storage lewat HTTP.
  - [x] Migrasikan algoritme clustering Machine ke TypeScript dengan bentuk response yang sama.
  - [x] Migrasikan route dan controller domain ke TypeScript dengan kontrak yang tetap kompatibel.
  - [x] Verifikasi hasil clustering Machine memakai fixture yang mencakup menu dengan transaksi.
- [x] Terapkan validasi request pada batas API dan petakan kegagalannya menjadi HTTP 400.
- [x] Tambahkan envelope sukses/error README dengan field legacy untuk kompatibilitas.
- [x] Tambahkan middleware error dan 404 dengan pesan aman.
- [x] Verifikasi autentikasi dan otorisasi tiap endpoint terlindungi memakai matriks route/token/role.
  - [x] Uji akses tanpa token, tipe token tak dikenal, serta role admin/kasir pada route terlindungi.
  - [x] Uji bahwa setiap kelompok route terlindungi menolak request tanpa kredensial.
  - [x] Uji token customer pada endpoint staff dan token staff pada pembuatan order customer.
  - [x] Uji tanpa token pada seluruh method/path terlindungi dan token customer pada setiap method staff-only.
  - [x] Uji akses customer dan isolasi kepemilikan record; uji role kasir/admin pada operasi prioritas.
  - [x] Verifikasi matriks akses seluruh method/path terlindungi, route publik, dan kebijakan role customer/staff.
- [x] Tambahkan GET /health.
- [x] Terapkan logging terstruktur tanpa password, token, atau rahasia.
- [x] Tambahkan test health check, 404, envelope sukses, dan dry-run importer.
- [x] Tambahkan test kontrak autentikasi, menu/kategori, pesanan, dan transaksi.
  - [x] Tambahkan test autentikasi untuk input invalid, login, register, refresh token, lupa-password, dan role route.
  - [x] Uji respons baca menu/kategori serta validasi write kategori, pesanan customer, transaksi staff, dan item-pesanan kasir.
  - [x] Tambahkan test happy-path pembuatan dan pembaruan menu.
  - [x] Tambahkan test happy-path pembuatan dan pembaruan pesanan serta transaksi.
- [x] Verifikasi kontrak autentikasi, menu/kategori, pesanan, dan transaksi melalui endpoint HTTP dengan model stubs.

**Catatan / blocker:**

- Validasi Joi sudah dipakai di endpoint yang menerimanya. Respons validasi invalid sekarang memakai HTTP 400 dan error code `BAD_REQUEST`; kontrak ini diuji pada endpoint register.
- Error internal pada controller tidak lagi dipetakan menjadi HTTP 200; test memastikan kegagalan storage memberi HTTP 500 tanpa membocorkan detail.
- Token selain tipe `staff`/`customer` ditolak. Tes HTTP memakai model stubs memverifikasi matriks seluruh route dan alur prioritas menu, pesanan, transaksi, serta Machine; verifikasi koneksi dan query pada database nyata tetap berada di Phase 4.
- Test transaksi menemukan dan memperbaiki urutan middleware: route transaksi/item-pesanan sekarang memvalidasi token staff sebelum role; akses admin/kasir dan customer pada endpoint prioritas diuji.
- Controller autentikasi kini memakai tipe Express. Login/refresh memakai status autentikasi yang benar, duplikasi register memakai 409, dan lupa-password tidak membocorkan keberadaan email.
- Migrasi TypeScript mencakup entry point/server, response middleware, validasi environment, route/controller autentikasi, controller roles, serta route/controller kategori dan menu. Domain API lain masih JavaScript.
- Migrasi lanjutan mencakup route/controller tables dan item-pesanan. `ItemOrders` dan `Tables` sekarang memakai tipe Express, validasi write tetap menghasilkan HTTP 400, dan typecheck/build memeriksa hasil kompilasinya.
- Checkpoint sebelumnya lulus: build/typecheck/test/lint root, tes API 26/26, tes web 3/3, format file TypeScript yang disentuh, dan `git diff --check`. Peringatan ukuran bundle Vite tetap ada.
- Memperbaiki `Orders.Delete` yang sebelumnya memakai variabel tak terdefinisi saat storage gagal; tes regresi memverifikasi HTTP 500 aman tanpa detail internal. Uji otorisasi tambahan memastikan kasir ditolak pada penulisan Categories dan Tables. Checkpoint sekarang 28 tes API dan 3 tes web lulus, dengan build/typecheck/lint/format dan `git diff --check` lulus.
- Controller `Orders` sekarang TypeScript dengan tipe request autentikasi dan socket. Akses model Mongoose lama masih perlu tipe domain saat migrasi menyeluruh; typecheck tetap lulus.
- Route `Transactions` telah dipindahkan ke TypeScript dengan seluruh metode dan middleware ObjectId/Multer tetap dipertahankan. Controller transaksi dan domain API lain masih perlu dimigrasikan.
- Controller `Transactions` kini TypeScript dengan tipe request/socket. Migrasi juga menemukan referensi `resError` yang tidak didefinisikan; jalur tersebut sekarang meneruskan HTTP 404 melalui middleware error. Build/typecheck/test/lint root tetap lulus (28 API + 3 web).
- Controller dan route `Customers` kini TypeScript. Migrasi memperbaiki pemetaan error storage yang sebelumnya memakai status 200 dan validasi update yang salah membentuk error; tes memastikan invalid update customer menghasilkan 400.
- Controller dan route `Accounts` kini TypeScript. Validasi update menghasilkan HTTP 400, duplikasi username/email menghasilkan 409, dan error storage diteruskan sebagai 500; tes regresi untuk update invalid lulus.
- Route `Roles` dan `Machine` serta policy `routes/v1` kini memakai TypeScript. Controller `Machine` masih JavaScript karena algoritma clustering memakai record dinamis; helper analisis yang memiliki referensi `resError`/`next` di luar scope sudah diperbaiki agar melempar error ke handler endpoint.
- Tes lintas peran mengonfirmasi token customer pada route staff dan token staff saat membuat order customer ditolak sebagai `403 FORBIDDEN`. Regresi kegagalan storage Machine mengonfirmasi error 500 aman. Checkpoint root kini 31 tes API dan 3 tes web lulus.
- Tes HTTP happy-path menu membuat menu dengan upload gambar, lalu memperbarui field tanpa mengganti gambar. Tes memakai model stubs dan membersihkan file upload sementara. Checkpoint root kini 32 tes API + 3 tes web lulus; build/typecheck/lint/format dan `git diff --check` lulus.
- Tes happy-path baru untuk update order menghitung kembali subtotal item/promo dan mengganti item lama; update status transaksi memverifikasi status tersimpan. Semua happy-path create/update pada checklist API kini diuji lewat HTTP dengan model stubs. Checkpoint root: 34 tes API + 3 tes web lulus beserta build/typecheck/lint/format dan `git diff --check`.
- Middleware autentikasi dan role guard kini TypeScript dengan tipe union untuk sesi staff/customer. Pemeriksaan root setelah migrasi lulus; tidak ada perubahan kontrak status pada tes autentikasi yang ada.
- Middleware pemeriksaan ObjectId kini TypeScript. Tes HTTP memastikan ID malformed menghasilkan `400 BAD_REQUEST` sebelum controller/model diakses. Checkpoint root: 35 tes API + 3 tes web lulus beserta build/typecheck/lint/format dan `git diff --check`.
- Utilitas logger Pino kini TypeScript dan tetap diekspor sebagai CommonJS agar pemanggil JavaScript lama tidak berubah. Build, typecheck, 35 tes API + 3 tes web, lint, serta `git diff --check` lulus; ukuran bundle web tetap menghasilkan peringatan Vite.
- Barrel konfigurasi dan model kini TypeScript serta mempertahankan objek ekspor yang digunakan pemanggil. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier untuk file terkait, dan `git diff --check` lulus.
- Konfigurasi Nodemailer kini TypeScript dan mengekspor `sendActivate`/`sendForgotPassword` dengan bentuk yang kompatibel dengan konsumen yang ada. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier untuk file terkait, dan `git diff --check` lulus.
- Konfigurasi Multer kini TypeScript; batas ukuran, daftar ekstensi, path tujuan, dan pola nama file dipertahankan. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier, dan `git diff --check` lulus.
- Konfigurasi Mongoose kini TypeScript; opsi koneksi, seed role, ObjectId, dan ekspor koneksi tetap tersedia untuk pemanggil yang ada. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier, dan `git diff --check` lulus. Koneksi ke MongoDB hidup belum diuji.
- Model Roles kini TypeScript dengan schema, timestamp, dan unique validator yang sama. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier, dan `git diff --check` lulus.
- Model Categories dan Tables kini TypeScript dengan field, timestamp, dan unique validator yang sama. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier, dan `git diff --check` lulus.
- Model Accounts, Customers, Menus, ItemOrders, dan Transactions kini TypeScript dengan definisi field, relasi, enum, opsi seleksi, dan unique validator yang sama. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier, dan `git diff --check` lulus.
- Model Orders dan RefreshTokens kini TypeScript; virtual `isExpired`/`isActive` dan transform JSON dipertahankan. Semua model MongoDB sekarang TypeScript. Build, typecheck, 35 tes API + 3 tes web, lint, Prettier, dan `git diff --check` lulus.
- Matriks HTTP kini mencoba seluruh method/path terlindungi tanpa token serta token customer pada seluruh method staff-only. Uji customer-owned order memastikan staff ditolak, dan tes kepemilikan customer tetap mencakup record sendiri/lain. Root build, typecheck, lint, 36 tes API + 3 tes web, Prettier, dan `git diff --check` lulus. Matriks positif per role pada setiap operasi belum seluruhnya diverifikasi.
- Komposisi Express `app` kini TypeScript. Test loader `tsx` tetap memuat `app.ts` melalui import ekstensi implisit, dan endpoint health/error serta lifecycle yang ada lulus. Root build, typecheck, lint, 36 tes API + 3 tes web, Prettier, dan `git diff --check` lulus. Ukuran bundle web masih menampilkan peringatan Vite.
- Service Authentication kini TypeScript dengan nama ekspor token, hash password, refresh/revoke, dan cookie tetap kompatibel. Helper `config/cors.js` yang tak direferensikan dihapus setelah dipastikan CORS aktif dikonfigurasi pada `app.ts`. API lint kini memeriksa Machine.js yang tersisa, bukan mengecualikan seluruh controllers; enam akumulator memakai penambahan eksplisit yang mempertahankan hasil. Agregasi transaksi/menu Machine dipindah ke `MachineTransactions.ts`; regresi saat storage gagal awalnya mengungkap helper error controller yang ikut terhapus, lalu diperbaiki dan endpoint kembali mengembalikan error aman. API build/typecheck/lint dan 38 tes API lulus; 3 tes web terakhir lulus pada checkpoint sebelumnya. Prettier lolos untuk service/config yang diubah; Machine.js legacy belum diformat menyeluruh.
- Matriks positif dilengkapi per kebijakan: route publik categories/menus/tables/customer creation; customer pada data miliknya dan pembuatan order; admin/kasir pada route administrasi/operasional. Digabung dengan penolakan lintas token dan seluruh path terlindungi tanpa token, checklist matriks otorisasi route ditutup. Build, typecheck, lint, 38 tes API + 3 tes web, Prettier, dan `git diff --check` lulus. Tes endpoint memakai model stubs, bukan koneksi database nyata.

## Phase 4 — PostgreSQL, Prisma, dan migrasi data

- [x] Buat skema Prisma dari pemetaan dan aturan domain.
- [x] Tinjau nullability, constraint, relasi, serta indeks yang diperlukan.
- [x] Buat migrasi database dan terapkan pada database lokal baru.
- [x] Implementasikan pemindahan snapshot yang dapat dilanjutkan tanpa menghapus baris.
- [x] Lakukan dry run pada fixture Extended JSON sintetis.
- [x] Rekonsiliasi jumlah record dan relasi fixture di database shadow lokal.
- [x] Verifikasi relasi dan alur kategori → menu → order/item → transaksi pada PostgreSQL dengan transaksi uji yang di-rollback.
- [x] Pindahkan operasi API dari Mongoose ke Prisma sambil mempertahankan kontrak HTTP; seluruh route runtime memakai Prisma.
  - [x] Sesuaikan penerbitan JWT agar menerima ID Mongoose dan ID string Prisma dengan claim yang sama.
  - [x] Siapkan Prisma lookup akun login, akun/customer untuk validasi token, role, serta pembuatan/rotasi/pencabutan refresh token.
  - [x] Tambahkan operasi Prisma akun/customer/role dengan normalisasi email dan pemeriksaan identitas akun yang aman terhadap request bersamaan; uji create/update/delete dan konflik kapitalisasi dalam transaksi rollback di PostgreSQL lokal.
  - [x] Siapkan jalur Prisma ber-flag untuk auth staff, akun, role, dan middleware staff; pertahankan Mongo sebagai default serta tambahkan koneksi Prisma kondisional dan readiness yang memeriksa PostgreSQL saat flag aktif.
  - [x] Siapkan controller customer Prisma staged dengan kontrak respons lama, token customer, pembatasan akses self, event Socket.IO, dan pemetaan error referensi order; route belum diaktifkan sebelum order ikut cutover.
  - [x] Siapkan controller Prisma staged kategori/menu/meja dengan validasi payload lama, bentuk relasi dan ID kompatibel, URL gambar, event Socket.IO, serta pemetaan konflik constraint.
  - [x] Implementasikan persistence Prisma order/item secara staged: pembuatan dan penggantian item atomik, perhitungan total, status, serta penghapusan yang menolak order dengan transaksi; uji rollback di PostgreSQL lokal.
  - [x] Siapkan controller Prisma staged untuk daftar/detail/pembuatan/pembaruan/status/penghapusan order, termasuk scope customer, grouping kategori, format item, estimasi kedaluwarsa, dan event Socket.IO.
  - [x] Siapkan persistence dan controller Prisma staged untuk endpoint item-order mandiri; seluruh mutasi mengunci order, menolak order yang sudah bertansaksi, menghitung ulang total order secara atomik, dan memetakan data relasi HTTP.
  - [x] Siapkan controller Prisma staged transaksi dengan pemetaan status `proses`/`PROCESS`, otorisasi kasir, struktur order terkelompok, CRUD, dan event Socket.IO.
  - [x] Implementasikan persistence Prisma transaksi secara staged dengan pembaruan pembayaran/order atomik, perhitungan estimasi antrean yang terserialisasi, lifecycle status, dan proteksi order; uji rollback di PostgreSQL lokal.
  - [x] Siapkan query Prisma staged untuk analisis favorit Machine; hitung frekuensi item hanya dari order yang memiliki transaksi dan pertahankan format summary yang menjadi input algoritme clustering.
  - [x] Alihkan customer bersama domain order yang merujuk customer melalui pemilih storage tunggal; jangan pisahkan database untuk pembuatan customer dan pembacaan order.
  - [x] Migrasikan persistence akun/role/customer/token dan middleware autentikasi sebagai satu kelompok dependensi yang dipilih oleh API_STORAGE.
  - [x] Siapkan staged Prisma CRUD kategori/menu/meja dengan penguncian nama case-insensitive dan penolakan penghapusan record yang masih direferensikan; uji pada PostgreSQL lokal dalam rollback.
  - [x] Migrasikan pemilihan operasi katalog kategori/menu/meja ke API_STORAGE.
  - [x] Migrasikan pemilihan alur order/item-order/transaksi secara konsisten ke API_STORAGE.
  - [x] Pindahkan bootstrap, readiness, dan lifecycle koneksi API agar mengikuti API_STORAGE dan kebutuhan auth storage.
- [x] Alihkan seluruh route, autentikasi, startup, dan readiness ke PostgreSQL; hapus pemilih runtime serta konfigurasi koneksi MongoDB.
  - [x] Verifikasi route HTTP mode API_STORAGE=prisma terhadap PostgreSQL lokal untuk customer, catalog read, order, item-order, transaksi, otorisasi staff/customer, konsistensi total, dan rollback fixture.
- [x] Dokumentasikan backup, cutover, pemantauan, dan rollback.
- [x] Alihkan runtime lokal ke Prisma/PostgreSQL setelah migrasi schema, seed, dan readiness tervalidasi.
- [x] Hapus controller/model Mongoose yang tidak lagi dipakai; ganti test support dengan stub tanpa dependency database lama.
- [x] Hapus dependency Mongoose dari manifest dan lockfile; jalur runtime dan test tidak lagi membutuhkan MongoDB.

**Catatan / blocker:**

- Operator mengonfirmasi sumber MongoDB sudah tidak ada; snapshot production tidak tersedia dan tidak dibuat. Target PostgreSQL lokal `bukit-delight` di port 5432 kosong sebelum inisialisasi, jadi migrasi schema/seed dilakukan langsung tanpa import data legacy.
- Runtime API menggunakan Prisma secara langsung; config `.env` lokal dan `.env.example` menunjuk `127.0.0.1:5432/bukit-delight`. Prisma migrate status up-to-date, role kanonik `admin`/`cashier`/`customer` tersimpan, dan startup API berhasil.
- Smoke check lokal 2026-09-27 mengembalikan `/healthz=ok` dan `/readyz=ready`; login admin/cashier berhasil. Typecheck workspace, build API, dan validasi konfigurasi Compose lulus setelah penghapusan pemilih storage.
- Sebelum pemilih storage dihapus, tes HTTP Prisma pada PostgreSQL loopback khusus telah membuat customer, membaca katalog, membuat order, memutasi item, membuat/mengubah transaksi, menguji proteksi status order, dan memastikan fixture dibersihkan.
- Database lama `bukit_delight` di port 5433 tetap merupakan layanan Compose terpisah; target aktif `bukit-delight` di port 5432 memakai nama database yang diminta operator.
- Prisma auth persistence dan jalur HTTP mencakup auth staff/customer, akun, role, normalisasi email, serta refresh-token transaksional. Tes PostgreSQL lokal sebelumnya memverifikasi login, middleware, CRUD akun, role, rotasi satu-kali, logout, dan rollback fixture.
- Operasi order/item, katalog kategori/menu/meja, transaksi, customer, auth, dan role kini berjalan melalui Prisma saja. Mutasi order/item dan transaksi menjaga konsistensi melalui transaksi DB; fixture PostgreSQL sebelumnya memverifikasi CRUD, proteksi referensi, total, dan rollback.
- Panduan operasional: docs/database/mongodb-to-postgres.md.

## Phase 5 — Frontend dan kontrak bersama

- [x] Pindahkan frontend ke Vite dan siapkan TypeScript entry point/typecheck.
- [x] Migrasikan halaman, komponen, dan fitur frontend ke TypeScript.
  - [x] Migrasikan konfigurasi Redux store dan root reducer ke TypeScript; ekspor tipe RootState dan AppDispatch.
  - [x] Migrasikan komposisi React Router ke TSX sambil mempertahankan path, role, dan urutan route.
  - [x] Migrasikan route guard customer/staff ke TSX dengan selector RootState dan pertahankan aturan/redirect akses.
  - [x] Migrasikan root app ke TSX dengan tipe RootState/AppDispatch dan pertahankan bootstrap, loading gate, serta lifecycle Socket.IO.
  - [x] Migrasikan konstanta konfigurasi web ke TypeScript dengan tipe URL API, path, dan header; pertahankan default VITE_API_URL.
  - [x] Migrasikan hook status jaringan ke TypeScript dan uji transisi event online/offline.
  - [x] Migrasikan reducer autentikasi ke TypeScript dengan tipe state/account dan cakupan transisi mount, loading, login, logout.
  - [x] Migrasikan action autentikasi ke TypeScript dengan tipe payload login, akun, response, dan thunk; gunakan AppDispatch di halaman login.
  - [x] Migrasikan action/reducer notifikasi dan dialog service ke TypeScript dengan tipe state dan tes transisinya.
  - [x] Migrasikan reducer role frontend ke TypeScript dengan record bertipe dan tes state mount/loading/data.
  - [x] Migrasikan reducer meja frontend ke TypeScript dengan daftar/meja terpilih bertipe dan tes transisinya.
  - [x] Migrasikan action meja frontend ke TypeScript dengan payload CRUD, response API, kredensial request, dan tes pemuatan meja.
  - [x] Migrasikan reducer kategori frontend ke TypeScript dengan tipe record/state serta tes mount/loading/data.
  - [x] Migrasikan reducer menu frontend ke TypeScript dengan tipe record/state dan penambahan metadata kategori tanpa mutasi payload; sertakan tes transisi/data.
  - [x] Migrasikan reducer akun frontend ke TypeScript dengan tipe record/state, masking password, pemetaan role, dan tes transisi/data.
  - [x] Migrasikan reducer pelanggan frontend ke TypeScript dengan tipe record/state serta tes mount/loading, daftar, dan pelanggan aktif.
  - [x] Migrasikan reducer favorit frontend ke TypeScript dengan tipe state/payload analisis serta tes mount/loading/data.
  - [x] Migrasikan reducer pesanan frontend ke TypeScript dengan record API/state, field tampilan, dialog, dan tes transisi tanpa mutasi payload.
  - [x] Migrasikan reducer transaksi frontend ke TypeScript dengan tipe transaksi ter-populasi, field turunan, dialog, dan tes transisi tanpa mutasi payload.
  - [x] Migrasikan reducer cart frontend ke TypeScript dengan tipe item/seleksi/dialog/order dan tes transisi kuantitas, catatan, total, serta invoice.
  - [x] Migrasikan action cart frontend ke TypeScript dengan tipe action/thunk, pemetaan data local cart, total promo, dan tes payload.
  - [x] Migrasikan action pesanan frontend ke TypeScript dengan tipe payload/thunk, serialisasi multipart, kredensial customer, dan tes create order.
  - [x] Migrasikan action transaksi frontend ke TypeScript dengan kontrak shared payment/status, selector order/customer, multipart, dan tes create/update status.
  - [x] Migrasikan action akun frontend ke TypeScript dengan tipe form/response/thunk, payload CRUD multipart, kredensial, dan tes create/update.
  - [x] Migrasikan action kategori frontend ke TypeScript dengan tipe form/response/thunk, unggah gambar multipart, kredensial, dan tes create/update.
  - [x] Migrasikan action menu frontend ke TypeScript dengan tipe CRUD/thunk, sinkronisasi seleksi cart/favorit, payload multipart, dan tes create/update.
  - [x] Migrasikan action pelanggan frontend ke TypeScript dengan tipe form/response/thunk, penyimpanan sesi customer, kredensial, dan tes create.
  - [x] Migrasikan action favorit frontend ke TypeScript dengan tipe response/thunk, pemetaan menu favorit tanpa mutasi state, kredensial staff, dan tes pemuatan.
  - [x] Migrasikan action role ke TypeScript dengan payload dan response bertipe serta tes pemuatan memakai kredensial staff.
  - [x] Migrasikan barrel action Redux ke TypeScript dengan ekspor modul yang sama.
  - [x] Pindahkan landing page ke `features/landing/pages` dan migrasikan ke TSX tanpa mengubah rute atau konten.
  - [x] Migrasikan template dan app bar landing ke TSX dengan props bertipe; verifikasi judul dan navigasi guest.
  - [x] Migrasikan template/app bar/tab kasir dan hook ukuran jendela ke TypeScript; verifikasi judul dan navigasi tab.
  - [x] Migrasikan template admin, app bar, drawer, dan footer copyright ke TypeScript; verifikasi judul dan konten halaman.
  - [x] Migrasikan helper format harga/tanggal ke TypeScript dengan kontrak pemanggil tetap kompatibel.
  - [x] Migrasikan komponen indikator loading ke TSX dengan props Material UI bertipe.
  - [x] Migrasikan komponen teks dan tombol umum ke TSX dengan props bertipe.
  - [x] Migrasikan notifikasi global ke TSX dengan severity bertipe dan cleanup timer; uji tampilan, auto-hide, serta penggantian timer.
  - [x] Migrasikan container halaman umum ke TSX dengan props Material UI bertipe.
  - [x] Migrasikan shell customer mobile, app bar, dan navigasi bawah ke TSX; pertahankan jalur navigasi serta konten banner/menu.
  - [x] Migrasikan barrel ikon/gambar dan barrel aset frontend ke TypeScript dengan nama ekspor yang sama.
  - [x] Migrasikan countdown cart ke TSX dengan props tanggal bertipe dan satu interval yang dibersihkan saat tanggal berubah/unmount.
  - [x] Migrasikan dialog umum ke TSX dengan tipe callback tutup/kirim dan transisi.
  - [x] Migrasikan kontrol form umum ke TSX dengan tipe untuk field text, select, file, number, dan switch.
  - [x] Pindahkan halaman login ke `features/auth/pages` dan migrasikan ke TSX.
  - [x] Pindahkan form inisialisasi customer ke `features/customer/pages/init` dan migrasikan ke TSX.
  - [x] Pindahkan halaman inisialisasi customer ke fitur customer dengan efek navigasi yang dibersihkan saat komponen dilepas.
  - [x] Pindahkan entry halaman home customer ke `features/customer/pages` dan migrasikan judul halaman ke effect.
  - [x] Pindahkan layout mobile customer home ke feature customer dan beri tipe pada seleksi menu promo/favorit.
  - [x] Pindahkan daftar horizontal menu ke feature customer, gunakan formatter harga bersama, dan beri tipe pada item.
  - [x] Pindahkan dialog pemilihan menu ke komponen feature customer, beri tipe state/handler, dan gunakan formatter harga bersama.
  - [x] Pindahkan banner home customer ke feature customer dan migrasikan slideshow umum dengan deklarasi tipe `Fade` yang dipakai.
  - [x] Pindahkan daftar vertikal dan halaman menu kategori mobile ke feature customer dengan tipe kategori/menu.
  - [x] Pindahkan shell route kategori/menu ke feature customer dan pertahankan breakpoint mobile/desktop.
  - [x] Pindahkan shell route cart ke feature customer, tetapkan judul melalui effect, dan pertahankan breakpoint mobile/desktop.
  - [x] Pindahkan komposisi halaman cart mobile ke feature customer dengan seleksi state invoice/order bertipe.
  - [x] Pindahkan tampilan daftar pesanan cart mobile dan aksi buka pembayaran ke feature customer.
  - [x] Pindahkan ringkasan harga/promo cart mobile ke feature customer dengan total turunan dari state cart.
  - [x] Pindahkan dialog pembayaran cart mobile ke feature customer dengan state loading bertipe dan action lama tetap dipakai.
  - [x] Pindahkan overview cart mobile dengan status order/transaksi dan posisi antrean bertipe.
  - [x] Pindahkan wrapper invoice order dan transaksi mobile ke feature customer dengan tipe state/prop yang eksplisit.
  - [x] Pindahkan ringkasan invoice dan detail kategori/item customer mobile ke komponen TypeScript bertipe.
  - [x] Pindahkan daftar pesanan desktop cart ke feature customer dan pertahankan aksi edit melalui panel desktop.
  - [x] Gunakan overview dan wrapper invoice customer TSX pada kolom kanan desktop.
  - [x] Pindahkan panel edit/pilih-menu desktop ke feature customer dan pertahankan action add/update/delete.
  - [x] Pindahkan shell grid customer laptop ke feature customer dan gunakan dari route home/menu/cart.
  - [x] Pindahkan sidebar kategori/home desktop dengan loading dan navigasi typed.
  - [x] Pindahkan slideshow banner customer laptop ke feature customer.
  - [x] Pindahkan kolom menu desktop untuk kategori dan promo/favorit ke TSX dengan pagination dan pemilihan menu.
  - [x] Pindahkan route Book dan daftar kategori customer ke feature customer dengan layout responsif.
  - [x] Ganti komponen invoice umum legacy dengan shim TSX yang mengekspor ulang komponen customer feature dan mempertahankan path import lama.
  - [x] Ganti modul halaman cart legacy JavaScript (entry, mobile, overview, daftar, invoice, pembayaran, dan resep) dengan shim TSX ke komponen customer feature.
  - [x] Ganti modul Book customer legacy (entry, mobile, daftar kategori, slideshow) dengan shim TSX ke komponen customer feature.
  - [x] Arahkan slideshow pada jalur menu dan laptop legacy ke slideshow customer home TSX bersama.
  - [x] Ganti modul utama laptop customer legacy dengan shim TSX dan hapus dua modul daftar yatim yang tidak lagi memiliki pemanggil.
  - [x] Ganti entry, daftar, dan dialog kasir lama yang memiliki padanan feature dengan shim TSX; hapus lima modul legacy kasir tanpa pemanggil.
  - [x] Ganti halaman, form, tabel, dan panel favorit admin lama dengan shim TSX; hapus tabel perantara favorit yang telah digabung ke feature.
- [x] Susun fitur frontend berdasarkan domain.
  - [x] Tempatkan landing page di feature `landing` dan arahkan route root ke halaman feature.
  - [x] Pindahkan action/reducer autentikasi ke `features/auth` dan pertahankan ekspor barrel yang dipakai aplikasi.
  - [x] Tempatkan halaman login pada `features/auth/pages`.
  - [x] Pindahkan halaman beranda kasir ke `features/kasir/pages` dan arahkan route aktif ke halaman TypeScript.
  - [x] Pindahkan halaman menu, pesanan, dan transaksi kasir ke `features/kasir/pages`; tabel/dialog legacy tetap dipakai sampai migrasi komponennya dilakukan.
  - [x] Migrasikan daftar pesanan kasir ke TSX, pertahankan filter pesanan pending aktif, navigasi review, serta urutan sorting tanpa mutasi state Redux.
  - [x] Migrasikan dialog review order kasir ke TSX dengan tipe order dan gunakan kembali komponen invoice serta detail kategori customer.
  - [x] Migrasikan dialog pembayaran order kasir ke TSX dengan nominal preset/custom bertipe, validasi kembalian, dan action transaksi lama.
  - [x] Migrasikan daftar transaksi kasir ke TSX, pertahankan filter transaksi aktif, nomor antrean, sorting, dan navigasi ke detail.
  - [x] Migrasikan dialog detail transaksi kasir ke TSX dan pertahankan metadata invoice, rincian order, serta alur buka update status.
  - [x] Migrasikan dialog perubahan status transaksi dan timeline ke TSX dengan tipe status serta batas transisi yang sama.
  - [x] Pindahkan dashboard admin ke `features/admin/pages` dan arahkan route aktif ke halaman TypeScript.
  - [x] Pindahkan entry halaman menu, kategori, meja, akun, transaksi, dan analisis favorit admin ke `features/admin/pages`; pertahankan komponen tabel/form yang ada.
  - [x] Migrasikan tabel dan form kategori admin ke TSX dengan tipe state, validasi create/update, dan aksi delete.
  - [x] Migrasikan tabel reusable admin ke TSX dengan row/column generik, sorting stabil, pencarian, paginasi, dan aksi dialog.
  - [x] Migrasikan tabel dan form meja admin ke TSX dengan validasi nama serta aksi create/update/delete.
  - [x] Migrasikan tabel dan form akun admin ke TSX dengan tipe role/field dan validasi akun create/update.
  - [x] Migrasikan helper validasi form ke TypeScript dengan tipe state/rule dan tes validasi required, angka, email valid, serta kecocokan password.
  - [x] Perbarui import dan mock form TSX ke path helper validasi TypeScript tanpa ekstensi legacy `.js`.
  - [x] Migrasikan tabel dan form menu admin ke TSX dengan kategori, promo, gambar, status ketersediaan, dan validasi angka.
  - [x] Migrasikan tabel transaksi admin ke TSX dengan tipe record dan formatter tanggal bersama.
  - [x] Migrasikan tabel dataset analisis favorit admin ke TSX dengan tipe record dan guard data kosong.
  - [x] Migrasikan tabel centroid awal analisis favorit (`c_awal`) ke TSX dengan tipe cluster/menu dan guard state.
  - [x] Migrasikan tabel iterasi K-Means beserta tabel data/jarak dan data koordinat baru ke TSX.
  - [x] Migrasikan tabel cluster akhir C1/C2/C3 ke komponen TSX bertipe.
  - [x] Migrasikan tabel hasil menu favorit ke TSX dengan tipe menu, label ketersediaan, dan durasi.
- [x] Selaraskan tipe/schema request-response yang benar-benar dibagi web dan API.
  - [x] Tambahkan kontrak status dan payload transaksi di package shared; gunakan tipe status/request pada form web dan controller Prisma API.
  - [x] Tambahkan kontrak shared status pembayaran order dan request update; gunakan konstanta yang sama di validator Joi MongoDB/Prisma serta tipe status pada web.
  - [x] Tambahkan kontrak shared payload create/update order; gunakan tipe yang sama pada serialisasi multipart web dan controller API lama/Prisma.
  - [x] Tambahkan kontrak shared generic `ApiResponse<T>` untuk envelope middleware sukses/error API dan semua Redux action web.
  - [x] Tambahkan kontrak shared create/update customer dan gunakan saat klien membuat multipart serta controller memetakan hasil Joi.
  - [x] Tambahkan kontrak shared create/update meja; gunakan tipe yang sama pada serialisasi multipart web dan controller API MongoDB/Prisma.
  - [x] Tambahkan kontrak shared create/update kategori; gunakan tipe yang sama pada action multipart web dan controller API MongoDB/Prisma.
  - [x] Tambahkan kontrak shared create/update menu dengan promo opsional saat create dan wajib saat update; gunakan pada action web serta controller API MongoDB/Prisma.
  - [x] Terapkan `ApiResponse<MenuRecord[]>` pada respons daftar menu web dan pertahankan pemeriksaan runtime untuk data yang diterima.
  - [x] Tambahkan kontrak shared create/update akun; gunakan pada action multipart web serta controller API MongoDB/Prisma, dengan password opsional saat update.
  - [x] Tambahkan kontrak shared respons analisis favorit dan gunakan pada controller clustering API, reducer, serta action web.
  - [x] Tambahkan kontrak shared record customer dan respons pembuatan sesi; gunakan pada reducer/action web serta controller API MongoDB/Prisma.
  - [x] Pindahkan kontrak record role ke shared package dan gunakan pada action/reducer web serta respons controller API MongoDB/Prisma.
  - [x] Pindahkan kontrak record kategori ke shared package dan gunakan pada reducer/action web serta respons controller API MongoDB/Prisma.
  - [x] Pindahkan kontrak record menu ke shared package dan gunakan pada reducer/action web serta respons controller API MongoDB/Prisma.
  - [x] Pindahkan kontrak record pesanan ke shared package dan gunakan pada reducer/action web serta respons controller API MongoDB/Prisma.
  - [x] Pindahkan kontrak record transaksi ke shared package dan gunakan pada reducer/action web serta respons controller API MongoDB/Prisma.
  - [x] Pindahkan kontrak response record akun ke shared package; pisahkan model akun API dari model tampilan reducer yang menambahkan password masking.
  - [x] Tambahkan `ItemOrderRecord` dan `OrderCategoryRecord` ke shared package; gunakan tipe item-order pada serializer Prisma yang dipakai dalam respons pesanan dan endpoint item-order.
- [x] Verifikasi autentikasi dan sesi/token.
  - [x] Jalankan coverage API auth/token dan validasi login form yang sudah tersedia.
  - [x] Buktikan login, refresh/rotasi token, dan logout terhadap database Prisma lokal.
- [x] Verifikasi state loading, sukses, kosong, error, dan validasi di alur utama.
- [x] Verifikasi menu/kategori, pesanan, dan transaksi dari UI ke API.
  - [x] Verifikasi UI memuat meja, menu, dan kategori melalui API Prisma lokal; ketiga GET mengembalikan HTTP 200.
  - [x] Verifikasi route API Prisma customer, order, item-order, dan transaksi melalui tes HTTP dengan cleanup fixture.
  - [x] Jalankan alur browser create order dan transaksi terhadap API beserta data fixture sementara.
- [x] Tambahkan Vitest untuk helper format yang sudah ada.
- [x] Tambahkan tes route guard untuk akses customer/staff yang tervalidasi serta skenario redirect guest/role mismatch.
- [x] Tambahkan tes komponen kontrol form untuk label input dan interaksi state switch.
- [x] Tambahkan tes validasi wajib pada halaman login.
- [x] Tambahkan tes validasi wajib untuk username dan meja pada inisialisasi customer.
- [x] Tambahkan tes pemilihan meja dan navigasi dari QR/table init ke beranda customer.
- [x] Tambahkan tes komposisi layout mobile/desktop dan judul halaman customer home.
- [x] Tambahkan tes filter menu promo dan favorit pada layout mobile customer home.
- [x] Tambahkan tes pemilihan menu dan pembukaan dialog cart dari daftar horizontal.
- [x] Tambahkan tes edit catatan, kuantitas, penambahan menu ke cart, dan penutupan dialog.
- [x] Tambahkan tes slideshow untuk jumlah banner dan tinggi gambar.
- [x] Tambahkan tes route kategori untuk filter menu dan pemilihan item ke cart.
- [x] Tambahkan tes shell menu untuk varian layout mobile/desktop dan judul halaman.
- [x] Tambahkan smoke test halaman beranda/menu/pesanan/transaksi kasir dan halaman admin, termasuk bagian analisis favorit.
- [x] Tambahkan tes validasi form kategori admin serta aksi create, update, dan delete.
- [x] Tambahkan tes validasi dan aksi create/update/delete pada form meja admin.
- [x] Tambahkan tes form akun untuk kecocokan password saat create, pemetaan role saat update, dan delete.
- [x] Tambahkan tes form menu untuk field wajib, create/update tanpa mengganti gambar, serta delete.
- [x] Tambahkan tes tabel transaksi admin untuk record, kolom utama, dan state tanpa data.
- [x] Tambahkan tes dataset favorit untuk data tersedia dan respons belum tersedia.
- [x] Tambahkan tes centroid awal untuk label cluster, koordinat, dan respons belum tersedia.
- [x] Tambahkan tes K-Means untuk iterasi, baris sum/count/avg, presisi rata-rata, dan respons belum tersedia.
- [x] Tambahkan tes tabel cluster akhir untuk tiga cluster, record menu, dan respons belum tersedia.
- [x] Tambahkan tes hasil favorit untuk data menu, format durasi/ketersediaan, gambar, dan respons belum tersedia.
- [x] Tambahkan tes daftar pesanan kasir untuk filter status/kedaluwarsa, pemilihan review, sorting meja, dan preservasi urutan state.
- [x] Tambahkan tes dialog review kasir untuk ringkasan/detail order, pembukaan pembayaran, dan penutupan dialog.
- [x] Tambahkan tes dialog pembayaran kasir untuk nominal wajib, kekurangan pembayaran, dan pembuatan transaksi tunai.
- [x] Tambahkan tes daftar transaksi kasir untuk filter status selesai, urutan antrean, detail transaksi, sorting meja, dan state kosong.
- [x] Tambahkan tes dialog detail transaksi untuk metadata/rincian, pembukaan update status, dan penutupan dialog.
- [x] Tambahkan tes perubahan status transaksi untuk opsi transisi yang tersedia, submit, dan kembali ke detail.
- [x] Tambahkan test frontend untuk alur pengguna penting.
  - [x] Uji alur customer memilih menu, memasukkan catatan/jumlah, menambahkan ke cart, lalu membuka pilihan pembayaran dengan Redux store nyata.
  - [x] Lengkapi verifikasi checkout dengan tes browser UI-ke-API: customer membuat order, kasir membayar dan melihat transaksi.

**Catatan / blocker:**

- Checkpoint 2026-09-26: `helpers/convert`, komponen umum form/loading/text/button/container/dialog/slideshow, halaman login, halaman/form inisialisasi customer, route Book dan kartu kategori, home mobile, shell laptop, sidebar/banner desktop, serta shell/komponen menu customer mobile telah dipindah ke TypeScript/TSX. Login/authentication staff dan sebagian customer berada di `features`. Shell route cart, komposisi cart mobile, daftar pesanan mobile/desktop, item cart, ringkasan harga/promo, dialog pembayaran, overview, wrapper invoice order/transaksi, ringkasan invoice, detail kategori/item, panel edit menu desktop, dan daftar menu desktop kategori/promo/favorit sudah dipindah atau dipakai ulang sebagai TSX di jalur customer. Shell grid desktop digunakan bersama oleh route home/menu/book/cart. Panel menu desktop memfilter kategori atau promo/favorit, menampilkan enam kartu per halaman, dan mempertahankan action pemilihan item. Panel edit desktop mengirim teks catatan serta action add/update/delete. Overview menghitung antrean tanpa memutasi daftar transaksi Redux. Pilihan menu menggunakan tombol yang dapat diakses keyboard; harga memakai formatter bersama. Tes mencakup validasi login/customer, navigasi QR, filter kategori/promo/favorit, pemilihan menu, cart/catatan/kuantitas, empat kondisi state halaman cart, daftar/edit item mobile/desktop, ringkasan harga/promo, dialog pembayaran, overview default/order/transaksi, wrapper invoice, promo dan daftar kategori, panel desktop edit/loading/content, sidebar loading/navigasi, banner, komposisi laptop, filter/paginasi menu desktop, route/kartu kategori Book, layout menu/home/cart, dan slideshow. Typecheck web, 55 tes Vitest, lint, build, Prettier, dan `git diff --check` lulus. Build memberi peringatan chunk di atas 500 kB (1,035.08 kB; gzip 280.16 kB). Fitur customer lain, fitur kasir/admin, kontrak bersama, serta verifikasi UI ujung-ke-ujung masih menjadi pekerjaan Phase 5.
- Beranda kasir dan dashboard admin sekarang memakai entry TSX di `features/kasir/pages` dan `features/admin/pages`; route yang dilindungi tetap sama. Smoke test keduanya lolos. Typecheck, lint root, 57 tes web, pemeriksaan Prettier untuk file terkait, dan build lulus. Bundle terukur 1,035.38 kB (gzip 280.12 kB) dan masih melewati ambang peringatan Vite.
- Halaman menu/pesanan/transaksi kasir juga kini memakai route entry TSX di `features/kasir/pages`; komposisi daftar/dialog lama dipertahankan. Tes smoke meliputi keberadaan daftar dan dialog di halaman pesanan/transaksi.
- Entry halaman admin untuk menu/kategori/meja/akun/transaksi dan analisis favorit kini berada di `features/admin/pages`; route aktif menggunakan TSX dan masih menyusun komponen tabel/form yang sama.
- Kontrak shared `CreateTableRequest` dan `UpdateTableRequest` kini digunakan oleh action web serta controller meja MongoDB/Prisma. Tes action memastikan nama meja tetap terserialisasi pada create/update; typecheck API/web, lint, build API/web, 178 tes web, dan 42 tes API lulus (6 tes PostgreSQL dilewati karena database uji lokal tidak dikonfigurasi). Build web menghasilkan bundle JS 1,104.81 kB (gzip 296.19 kB); peringatan batas chunk Vite dan aset banner-2 874.51 kB masih ada.
- Kontrak shared `CreateCategoryRequest` dan `UpdateCategoryRequest` kini membakukan field `name`/`desc` pada action multipart web serta controller MongoDB/Prisma. Typecheck API dan web serta `git diff --check` lulus; pemeriksaan Prettier awal menemukan format yang perlu dirapikan dan kedua file terkait sudah diformat. Tes tidak dijalankan pada checkpoint ini.
- Kontrak shared `CreateMenuRequest` dan `UpdateMenuRequest` kini membakukan field menu dan mengikuti perbedaan validasi `promo` antara create (opsional) dan update (wajib); action web serta controller MongoDB/Prisma memakai tipe tersebut. Typecheck API/web dan pemeriksaan Prettier lulus. Tes tidak dijalankan pada checkpoint ini.
- Action daftar menu kini menggunakan envelope shared `ApiResponse<MenuRecord[]>`; pemeriksaan runtime daftar tetap menjadi batas validasi respons API. Typecheck web dan pemeriksaan Prettier lulus. Tes tidak dijalankan pada checkpoint ini.
- Kontrak shared `CreateAccountRequest` dan `UpdateAccountRequest` kini dipakai pada action akun web serta controller MongoDB/Prisma; field password/konfirmasi tetap wajib saat create dan opsional saat update sesuai validasi Joi. Typecheck API/web dan pemeriksaan Prettier lulus. Tes tidak dijalankan pada checkpoint ini.
- Bentuk `FavoriteAnalysis`/`FavoriteMenuRecord` kini didefinisikan di shared package dan dipakai oleh hasil controller Machine, reducer, serta envelope `ApiResponse<FavoriteAnalysis>` action web. Audit route memastikan seluruh halaman yang dirender router memakai entry dalam `features/*`; susunan fitur domain dicentang selesai. Typecheck API/web dan pemeriksaan Prettier lulus; tes tidak dijalankan.
- Record customer kini bersumber dari shared package. Action web mengetikkan daftar customer dengan `ApiResponse<CustomerRecord[]>` dan respons create dengan `ApiResponse<CreateCustomerResponse>`; kedua controller customer membentuk respons sesi sesuai kontrak. Typecheck API/web serta pemeriksaan Prettier lulus; tes tidak dijalankan.
- Dua komponen invoice umum JavaScript kini menjadi shim TSX bertipe ke komponen `features/customer`; import halaman lama tetap dapat memakai path yang sama. Typecheck web dan pemeriksaan Prettier lulus. Route aktif sebelumnya sudah mengarah ke feature pages; file legacy lain masih perlu ditinjau/dimigrasikan bertahap.
- Modul cart customer pada jalur halaman lama kini seluruhnya shim TSX ke implementasi `features/customer/pages/cart` (entry, mobile, overview, item, invoice, pembayaran, resep); import sibling extensionless tetap terselesaikan dan folder tersebut tidak lagi memiliki file `.js`. Typecheck web dan Prettier lulus. Tes tidak dijalankan.
- Modul Book customer pada jalur lama kini shim TSX ke halaman feature Book (entry, mobile, daftar kategori), dan slideshow memakai slideshow feature home. Folder lama Book tidak lagi memiliki file `.js`. Typecheck web serta pemeriksaan Prettier pada folder Book/cart lulus; tes tidak dijalankan.
- Slideshow pada jalur menu dan laptop lama kini shim TSX ke slideshow feature customer home; pengulangan daftar banner JavaScript dihapus. Typecheck web dan pemeriksaan Prettier pada folder customer yang disentuh lulus. Tes tidak dijalankan.
- Entry, banner, cart pesanan desktop, panel menu, dan sidebar laptop lama kini shim TSX ke feature customer. Dua daftar internal lama dihapus setelah pencarian pemanggil memastikan keduanya tidak lagi direferensikan; folder laptop customer tidak lagi memiliki file `.js`. Typecheck web dan pemeriksaan Prettier pada file terkait lulus. Tes tidak dijalankan.
- Entry kasir home/menu/orders/transactions dan daftar/dialog dengan padanan feature kini shim TSX ke `features/kasir`. Lima modul overview/form/list/mobile lama dihapus setelah pencarian memastikan tidak ada pemanggil. Folder kasir lama tidak lagi memiliki file `.js`; typecheck web dan pemeriksaan Prettier pada file shim lulus. Tes tidak dijalankan.
- Dashboard, entry CRUD, form, tabel, dan panel analisis favorit admin lama kini shim TSX ke `features/admin`; tabel perantara favorit yang tidak lagi dipanggil sudah dihapus. Folder admin lama tidak lagi memiliki file `.js`; typecheck web dan Prettier lulus. Tes tidak dijalankan.
- Sisa tes helper format dan autentikasi diubah dari JavaScript ke TypeScript; entry `src/index.js` yang tidak direferensikan dihapus karena Vite memakai `/src/main.tsx`. Pemindaian `apps/web/src` kini tidak menemukan file `.js`/`.jsx`; typecheck dan Prettier lulus. Tes tidak dijalankan. Checklist migrasi halaman/komponen frontend ditutup.
- `RoleRecord` kini menjadi kontrak shared yang digunakan reducer/action web dan response controller MongoDB/Prisma. Prisma memetakan ID ke `_id`; MongoDB mempertahankan serialisasi record lamanya sambil mengikat hasil ke tipe bersama. Typecheck API/web dan Prettier lulus; tes tidak dijalankan.
- Modul tabel/form kategori admin kini TSX dan dipakai oleh halaman kategori aktif. Validasi tetap mewajibkan nama/deskripsi, serta gambar hanya saat create; update dan delete mempertahankan action kategori yang sama. Tes mencakup validasi dan tiga operasi.
- Modul tabel/form meja admin kini TSX. Form mempertahankan validasi nama dan aksi CRUD lama; input dikopi sebelum state updater dipanggil untuk menghindari event React yang sudah dilepas. Tes mencakup validasi, create, update, dan delete.
- Modul tabel/form akun admin kini TSX. Role dari record update dinormalisasi ke ID string; create tetap memvalidasi email dan kecocokan password, sedangkan update tidak meminta password. Action akun lama tetap dipakai dan tes mencakup create/update/delete.
- Modul tabel/form menu admin kini TSX. Payload/action lama tetap digunakan, kategori terserialisasi sebagai ID, gambar wajib saat create dan opsional saat update, serta validasi harga/durasi/promo dipertahankan.
- Tabel transaksi admin kini TSX dengan tipe untuk ringkasan order/customer/kasir dan formatter tanggal bersama. Migrasi juga menghapus kolom Table duplikat yang sebelumnya memakai ID sama dan menampilkan nilai meja dua kali.
- Tabel DataSet analisis favorit kini TSX dengan tipe koordinat/menu dan guard optional chaining saat respons/data belum tersedia; sebelumnya guard dapat dereference `Favorites.data` ketika nilainya null.
- Tabel C Awal analisis favorit kini TSX dengan tipe label centroid/menu dan koordinat, memakai guard optional chaining untuk state sebelum data tersedia.
- Komposisi K-Means favorit kini TSX dengan tipe iterasi, jarak, koordinat centroid, sum/count/avg; nilai rata-rata tetap ditampilkan tiga desimal dan baris ringkasan ditambahkan ke salinan data.
- Tabel cluster akhir C1/C2/C3 kini disajikan dari satu komponen TSX bertipe yang mempertahankan kolom nama menu, transaksi, dan harga beserta tata letak tiga kolom responsif.
- Tabel hasil menu favorit kini TSX dengan tipe record, kolom gambar, promo, durasi, dan ketersediaan; keseluruhan panel analisis favorit aktif sekarang menyusun komponen feature TSX.
- Helper validasi form kini TypeScript dengan state/rule dan setter React bertipe; rule legacy `match-passowrd` serta pesan validasi dipertahankan. Tes baru mencakup required, angka, email valid, kecocokan password, dan pembersihan error lama. Perbaikan tes tabel admin memilih salah satu dari dua input placeholder pencarian. Typecheck, lint web, build, dan 168 tes web lulus; peringatan chunk Vite tetap ada.
- Countdown cart kini TSX dengan tipe tanggal dan interval tunggal yang dibersihkan saat tanggal berubah atau komponen dilepas; tes mencakup nilai menit/detik, tick, placeholder, dan cleanup. Typecheck, lint web, build, dan suite 170 tes lulus. Bundle JavaScript 1,112.37 kB (gzip 300.35 kB); peringatan chunk di atas 500 kB tetap ada.
- Shell customer mobile, app bar, dan navigasi bawah kini TSX dengan props bertipe; tes memeriksa banner/title, tautan kembali, serta navigasi cart, dan tes halaman home/book/menu tetap lolos. Typecheck, lint web, build, dan 172 tes lulus. Bundle JavaScript 1,115.62 kB (gzip 300.49 kB); peringatan chunk di atas 500 kB tetap ada.
- Barrel ikon, gambar, dan gabungan aset kini TypeScript tanpa mengubah key ekspor yang digunakan fitur customer maupun halaman legacy. Typecheck, lint, build, 172 tes, dan `git diff --check` lulus; peringatan ukuran bundle tetap sama.
- Kontrak `OrderPaymentStatus` dan `UpdateOrderStatusRequest` kini berada di package shared. Validator Joi kedua backend (MongoDB dan Prisma) memakai konstanta status yang sama; status pada reducer/list web dan enum uppercase service Prisma diturunkan dari tipe kontrak. Tes HTTP menolak status invalid. API typecheck/build/lint dan 42 tes lulus (6 tes PostgreSQL dilewati tanpa konfigurasi DB); web typecheck/lint lulus.
- Payload `CreateOrderRequest`, `OrderMenuSelectionRequest`, dan `UpdateOrderRequest` kini dibagi dari package shared. Action web membangun tipe kanonik sebelum menserialisasi `FormData`; controller MongoDB/Prisma mengikat hasil Joi ke kontrak yang sama tanpa mengganti nama field. Typecheck/build/lint API dan web lulus; tes payload action web lulus, suite API lulus 42 tes (6 tes PostgreSQL dilewati tanpa database lokal). Bundle web 1,104.74 kB (gzip 296.14 kB), dengan peringatan Vite yang sama.
- Envelope respons `ApiResponse<T>` kini menjadi tipe shared untuk middleware respons API dan seluruh action Redux web, dengan payload data generik serta metadata/error legacy tetap tersedia. Typecheck/build/lint API dan typecheck/lint serta 176 tes web lulus; suite API lulus 42 tes dan melewati 6 tes PostgreSQL karena DB lokal tidak dikonfigurasi.
- `CreateCustomerRequest` dan `UpdateCustomerRequest` kini membakukan field `username` pada action customer web dan controller MongoDB/Prisma; format multipart tetap sama. Typecheck kedua aplikasi, lint kedua aplikasi, tes action customer, serta 42 tes API lulus; 6 tes PostgreSQL dilewati tanpa database lokal.
- Route guard customer/staff kini TSX dengan selector `RootState`; aturan customer+meja, pencocokan role, dan redirect guest/role dipertahankan serta dicakup empat tes. Typecheck, lint, build, dan suite web 176 tes lulus. Bundle JavaScript 1,104.58 kB (gzip 296.03 kB), masih mendapat peringatan chunk Vite.
- Konfigurasi konstanta web kini TypeScript dengan field bertipe dan tetap membaca `VITE_API_URL` dengan default kosong. Typecheck, lint, build, 176 tes, dan pemeriksaan diff lulus.
- Import helper validasi pada halaman/form login, customer, dan admin serta mock tesnya kini mengarah ke modul TypeScript tanpa ekstensi `.js`. Typecheck web dan 13 tes form terkait lulus.
- Verifikasi setelah migrasi entry kasir: typecheck web, lint root, 60 tes web, Prettier pada file kasir/task, `git diff --check`, dan build web lulus. Bundle Vite 1,036.80 kB (gzip 280.18 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi entry admin: typecheck web, lint root, 66 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,040.80 kB (gzip 280.33 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel/form kategori: typecheck web, lint root, 69 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,042.15 kB (gzip 280.74 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel/form meja: typecheck web, lint root, 71 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,042.93 kB (gzip 280.76 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel/form akun: typecheck web, lint root, 74 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,044.98 kB (gzip 281.03 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel/form menu: typecheck web, lint root, 77 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,046.64 kB (gzip 281.07 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel transaksi: typecheck web, lint root, 79 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,046.89 kB (gzip 281.08 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel dataset favorit: typecheck web, lint root, 81 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,047.03 kB (gzip 281.11 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel centroid awal favorit: typecheck web, lint root, 83 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,047.18 kB (gzip 281.12 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel K-Means favorit: typecheck web, lint root, 85 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,055.31 kB (gzip 281.50 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel cluster akhir favorit: typecheck web, lint root, 87 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,054.85 kB (gzip 281.48 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi tabel hasil favorit: typecheck web, lint root, 89 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,055.56 kB (gzip 281.51 kB), masih di atas ambang 500 kB.
- Verifikasi setelah migrasi daftar pesanan kasir: typecheck web, lint root, 91 tes web, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,059.32 kB (gzip 281.88 kB), masih di atas ambang 500 kB.
- Daftar pesanan kasir kini TSX. Sorting memakai salinan daftar dan perbandingan string eksplisit; filter tetap hanya menampilkan order pending yang belum kedaluwarsa, dan pemilihan tetap menyimpan order lalu membuka review.
- Dialog review kasir kini TSX di feature kasir, berbagi komponen invoice/detail customer yang sudah bertipe, menjaga urutan dispatch buka pembayaran lalu tutup review, dan menyediakan tombol tutup berlabel aksesibel. Tes halaman kasir diperbarui agar memock entry dialog yang aktif.
- Verifikasi setelah migrasi dialog review kasir: 93 tes web lulus (49 file), typecheck web, lint root, Prettier, dan `git diff --check` lulus. Build tidak dijalankan pada checkpoint ini.
- Dialog pembayaran order kasir kini TSX di feature kasir. Pilihan uang pas/preset/custom menghasilkan nilai pembayaran turunan, mencegah submit tanpa nominal atau dengan kembalian negatif, dan dispatch action transaksi tunai lama.
- Verifikasi setelah migrasi dialog pembayaran: 96 tes web lulus (50 file), typecheck web, lint root, Prettier, dan `git diff --check` lulus. Build tidak dijalankan pada checkpoint ini.
- Daftar transaksi kasir kini TSX di feature kasir. Transaksi selesai difilter, nomor antrean diturunkan dari waktu pembuatan, sorting meja memakai perbandingan numerik locale, urutan Redux tidak berubah, dan state tanpa transaksi aktif ditampilkan.
- Action meja kini TypeScript dengan tipe record/form/response/thunk. URL CRUD, header kredensial, multipart field `name`, notifikasi, refresh daftar, dan pemilihan meja tetap dipertahankan; tes memverifikasi pemuatan dengan kredensial tersimpan.
- Verifikasi setelah migrasi action meja: typecheck web, lint workspace, 114 tes Vitest, Prettier untuk action dan tes, serta `git diff --check` lulus. Build tidak dijalankan pada checkpoint ini.
- Reducer kategori kini TypeScript dengan record kategori yang mengizinkan field gambar opsional sesuai pemakaian UI; tes mencakup state awal, mount/loading, dan data berhasil dimuat.
- Verifikasi checkpoint Phase 5 setelah action meja dan reducer kategori: typecheck web, lint workspace, 117 tes Vitest, Prettier pada file terkait, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.17 kB (gzip 304.88 kB) dan banner-2 874.51 kB.
- Reducer menu kini TypeScript dengan payload API serta state menu bertipe. Metadata kategori tetap ditambahkan untuk pemanggil lama, tetapi record API disalin agar reducer tidak memutasi state/payload yang diterima.
- Verifikasi setelah migrasi reducer menu: typecheck web, lint workspace, 120 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.17 kB (gzip 304.89 kB) dan banner-2 874.51 kB.
- Reducer akun kini TypeScript; role ter-populasi tetap diturunkan menjadi `role_id`/`role_name`, password tetap dimasking, dan output dibuat dari salinan tanpa mengubah record API.
- Verifikasi setelah migrasi reducer akun: typecheck web, lint workspace, 123 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.18 kB (gzip 304.89 kB) dan banner-2 874.51 kB.
- Reducer pelanggan kini TypeScript dengan tipe record/state; alur set/clear pelanggan aktif dan pemuatan daftar tetap mempertahankan transisi sebelumnya.
- Verifikasi setelah migrasi reducer pelanggan: typecheck web, lint workspace, 127 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.18 kB (gzip 304.89 kB) dan banner-2 874.51 kB.
- Reducer favorit kini TypeScript dengan tipe state/payload analisis untuk menu favorit, dataset, centroid, iterasi K-Means, dan cluster.
- Verifikasi setelah migrasi reducer favorit: typecheck web, lint workspace, 130 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.18 kB (gzip 304.89 kB) dan banner-2 874.51 kB.
- Reducer pesanan kini TypeScript dengan record/state/dialog bertipe. Field tampilan customer/meja dipetakan ke record salinan; pemilihan/pembersihan order dan buka/tutup dialog tetap mencerminkan perilaku sebelumnya.
- Verifikasi setelah migrasi reducer pesanan: typecheck web, lint workspace, 134 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.18 kB (gzip 304.89 kB) dan banner-2 874.51 kB.
- Reducer transaksi kini TypeScript dengan tipe transaksi ter-populasi akun/order, field ringkasan turunan, state transaksi aktif, dan dialog review/status. Field turunan dibuat pada record salinan agar payload API tetap utuh.
- Verifikasi setelah migrasi reducer transaksi: typecheck web, lint workspace, 138 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,105.16 kB (gzip 304.87 kB) dan banner-2 874.51 kB.
- Reducer cart kini TypeScript dengan tipe item, menu, seleksi, invoice, dan dialog. Update item menghasilkan array baru, kuantitas tidak dapat turun di bawah nol, dan ID item diuji dengan jam sistem deterministik. Tipe `AppDispatch` diperjelas untuk menerima thunk.
- Verifikasi setelah migrasi reducer cart: typecheck web, lint workspace, 144 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,104.90 kB (gzip 304.80 kB) dan banner-2 874.51 kB.
- Action cart kini TypeScript dengan payload CRUD/seleksi dan thunk pemuatan ulang local cart. Pemetaan menunggu hasil sinkron, memakai ID menu dari item, menghitung promo, dan mengabaikan item yang menunya sudah tidak ada.
- Verifikasi setelah migrasi action cart: typecheck web, lint workspace, 146 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,104.82 kB (gzip 304.79 kB) dan banner-2 874.51 kB.
- Action pesanan kini TypeScript untuk pemuatan daftar, pemilihan order/customer aktif, pembuatan order, notifikasi, dan action dialog. Tes memastikan customer/table/cart items terserialisasi sesuai multipart API dan token customer dipakai. Dua action CRUD lama yang tak memiliki pemanggil aktif dan justru mengirim request ke endpoint menu dihapus dari barrel internal.
- Verifikasi setelah migrasi action pesanan: typecheck web, lint workspace, 147 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,103.40 kB (gzip 304.77 kB) dan banner-2 874.51 kB.
- Action transaksi kini TypeScript untuk pemuatan, penyelarasan transaksi aktif customer/kasir, create payment, update status, dan action dialog. Status/payment memakai tipe package shared; tes memastikan payload multipart, kredensial kasir, dan URL endpoint status. Action update/delete lama yang tidak memiliki pemanggil aktif dan membawa payload tidak sesuai kontrak transaksi dihapus.
- Verifikasi setelah migrasi action transaksi: typecheck web, lint workspace, 149 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,101.34 kB (gzip 304.61 kB) dan banner-2 874.51 kB.
- Action akun kini TypeScript untuk pemuatan dan CRUD admin. Payload tetap multipart; update tanpa perubahan password tidak mengirim field password/repeat_password kosong. Tes memeriksa create/update serta header kredensial staff.
- Verifikasi setelah migrasi action akun: typecheck web, lint workspace, 151 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,099.92 kB (gzip 304.49 kB) dan banner-2 874.51 kB.
- Action kategori kini TypeScript untuk pemuatan dan CRUD admin. Create mengirim gambar wajib yang tervalidasi UI; update tidak mengirim field gambar bila tidak diganti. Tes memeriksa multipart dan kredensial admin.
- Verifikasi setelah migrasi action kategori: typecheck web, lint workspace, 153 tes Vitest, Prettier, `git diff --check`, dan build web lulus. Vite memperingatkan bundle JS 1,098.55 kB (gzip 304.31 kB) dan banner-2 874.51 kB.
- Verifikasi setelah migrasi daftar transaksi kasir: 99 tes web lulus (51 file), typecheck web, lint root, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,069.27 kB (gzip 282.66 kB), masih di atas ambang 500 kB.
- Dialog detail transaksi kasir kini TSX di feature kasir dan memakai kembali komponen invoice/rincian customer bertipe. Tombol Update Status tetap membuka dialog status lalu menutup detail.
- Verifikasi setelah migrasi dialog detail transaksi: 101 tes web lulus (52 file), typecheck web, lint root, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,067.37 kB (gzip 281.84 kB), masih di atas ambang 500 kB.
- Dialog perubahan status dan timeline transaksi kini TSX. Aturan opsi Pending/Proses/Done dipertahankan; submit mengirim status terpilih dan menutup dialog status mengembalikan pengguna ke detail transaksi.
- Verifikasi setelah migrasi dialog perubahan status: 103 tes web lulus (53 file), typecheck web, lint root, Prettier, `git diff --check`, dan build web lulus. Bundle Vite 1,072.98 kB (gzip 281.93 kB), masih di atas ambang 500 kB.
- Package `@bukit-delight/shared` kini mengekspor tipe status transaksi serta payload create/update/update-status. API Joi tetap menjadi validasi runtime; controller mengikat payload hasil validasi ke tipe bersama, sedangkan UI memakai tipe status/metode pembayaran yang sama.
- Verifikasi kontrak transaksi bersama: typecheck dan build API, typecheck dan build web, test API, test web, lint root, Prettier, serta `git diff --check` lulus. Integrasi API yang memerlukan PostgreSQL tetap dilewati oleh konfigurasi test saat ini; bundle web 1,072.98 kB (gzip 281.93 kB) masih di atas ambang 500 kB.
- Verifikasi autentikasi lengkap: suite web lulus (105 tes); tes integrasi HTTP Prisma terfokus dan suite API lengkap lulus terhadap PostgreSQL proyek pada `localhost:5433/bukit_delight`. Cakupan meliputi login, akses ber-token, refresh/rotasi, penolakan pemakaian ulang token, logout, CRUD akun, dan cleanup fixture. `PRISMA_TEST_DATABASE_URL` hanya disetel sementara pada proses test; `.env` tidak dibaca atau diubah.
- Verifikasi state UI: suite web lulus 105 tes. Tes yang ada mencakup loading, data tersedia, state kosong, dan validasi pada fitur utama; tes `NotificationCustom` membuktikan pesan error request di Redux terlihat sebagai alert.
- Pemeriksaan browser menemukan dua masalah yang tidak terdeteksi test/build: asset barrel memakai `require` yang tidak ada di runtime Vite, dan bootstrap auth meminta refresh token walau tidak ada akun tersimpan. Asset gambar/ikon kini memakai import ESM, dan auth melewati request refresh pada sesi anonim sambil menyelesaikan state mount. Browser lokal kemudian merender landing page tanpa alert auth dan menerima HTTP 200 dari endpoint meja/menu/kategori. Masih ada peringatan Material-UI lama.
- Verifikasi API Prisma: suite `@bukit-delight/api` lulus 47 tes tanpa skip, termasuk validasi `ORDERS_TIMEOUT`, route HTTP customer/order/item-order/transaksi, dan test autentikasi/persistensi PostgreSQL.
- Verifikasi UI-ke-API browser: pada database clone disposable, customer memilih meja/menu dan mengirim order dari cart; kasir login melalui UI, membayar tunai, dan melihat transaksi pada daftar kasir. POST order dan POST transaksi serta GET daftar transaksi berhasil. Clone database dibuang setelah test.
- Perbaikan konfigurasi order: alur browser awal menemukan `ORDERS_TIMEOUT` kosong menghasilkan tanggal kedaluwarsa tidak valid dan HTTP 500. Variabel positif kini diwajibkan oleh validasi environment dan didokumentasikan di `.env.example` (60.000 ms); alur order/transaksi berhasil setelah konfigurasi tersedia.
- Cart route kini berada di `features/customer/pages/cart`; breakpoint responsif dan perilaku judul dipertahankan. Grid shell desktop telah berada di `features/customer/pages/laptop.page` dan dipakai oleh route home/menu/cart.
- Komposisi halaman cart mobile kini bertipe dan mempertahankan urutan state order invoice, transaction invoice, cart berisi, lalu kosong. Tes mencakup empat kondisi state.
- Daftar pesanan cart mobile dan desktop serta ringkasan harga/promo sudah menjadi TSX di feature customer. Action pembayaran dipertahankan; edit item desktop tetap membuka panel pilihan menu.
- Dialog pembayaran mobile sudah menjadi TSX dengan state open/loading bertipe. Pilihan tunai tetap dispatch action order yang ada, sedangkan E-Money masih mengikuti placeholder alert yang sudah ada.
- Overview cart mobile sudah menjadi TSX. Pengurutan posisi antrean memakai salinan daftar transaksi agar state Redux tidak termutasi; tes meliputi tampilan default, order, dan transaksi.
- Wrapper invoice order/transaksi kini TSX dan mempertahankan data order, status, kasir, serta kategori. Kolom kanan desktop memakai wrapper dan overview TSX yang sama.
- Ringkasan invoice dan accordion kategori/item kini komponen TSX dengan tipe data order, item, promo, dan total untuk jalur customer desktop/mobile.
- Tes alur customer lintas komponen menjalankan pemilihan menu hingga dialog metode pembayaran menggunakan root reducer nyata; suite web lulus 106 tes.
- Landing page kini TSX di `features/landing/pages`, dan route `/` memakai entry feature tersebut tanpa perubahan konten. React Router juga kini TSX; prop `role` yang tidak dipakai telah dihapus dari route customer. Tes page dan flow customer membuat suite web lulus 107 tes; typecheck, lint, Prettier, diff check, dan build lulus. Build masih memberi peringatan chunk JS sekitar 1.1 MB.
- Reducer autentikasi kini TypeScript dengan tipe `AuthenticationState`/`AuthenticationAccount` dan tes transisi mount, loading, login, serta logout. Suite web lulus 108 tes; typecheck, lint, Prettier, dan `git diff --check` lulus.
- Action autentikasi kini TypeScript dengan payload/form dan response legacy bertipe; halaman login mengirim thunk memakai `AppDispatch`. Suite web lulus 108 tes; typecheck, lint, dan Prettier lulus.
- Action/reducer `Service` kini TypeScript. State notifikasi serta dialog bertipe dan tes mencakup buka/tutup notifikasi/form; suite web lulus 110 tes. Typecheck, lint, build, Prettier, dan `git diff --check` lulus; peringatan chunk 1,106 kB tetap ada.
- Reducer role kini TypeScript dengan tipe record dan tes mount/loading/data. Suite web lulus 111 tes; typecheck, lint, build, Prettier, dan `git diff --check` lulus. Peringatan chunk 1,106 kB tetap ada.
- Action role kini TypeScript dengan record/response bertipe, serta tes request role memakai kredensial tersimpan. Suite web lulus 112 tes; typecheck, lint, build, Prettier, dan `git diff --check` lulus. Peringatan chunk 1,106 kB tetap ada.
- Reducer meja kini TypeScript dengan state daftar/meja aktif bertipe dan tes mount/loading/pilih/bersihkan. Suite web lulus 113 tes; typecheck, lint, build, Prettier, dan `git diff --check` lulus. Peringatan chunk 1,106 kB tetap ada.

## Phase 6 — Infrastruktur dan kesiapan produksi

- [x] Tambahkan URL PostgreSQL host dan Docker ke `.env.example`; hapus konfigurasi koneksi Redis yang tidak digunakan aplikasi.
- [x] Validasi environment API dengan Joi saat aplikasi mulai.
- [x] Hubungkan Compose aplikasi ke PostgreSQL eksternal pada network project `local-infra`; jangan jalankan PostgreSQL/Redis duplikat di repository aplikasi.
- [x] Buat Dockerfile API dan web sesuai target deployment.
- [x] Pisahkan Compose development dan production; development mendukung API watch mode serta Vite HMR.
- [x] Gunakan alias network API unik untuk Compose development dan production yang berbagi external network.
- [x] Pisahkan database PostgreSQL development dari database production lokal; migrasi/seed development dan login admin berhasil tanpa menyentuh database production.
- [x] Tambahkan reverse proxy bila deployment membutuhkannya.
- [x] Tambahkan CI untuk install, lint, typecheck, test, dan build.
- [x] Dokumentasikan setup lokal, migrasi snapshot, seed, dan health check.
- [x] Dokumentasikan deployment produksi setelah runtime API beralih ke Prisma.
- [x] Verifikasi setup dari environment bersih mengikuti dokumentasi.

**Catatan / blocker:**

- Pemeriksaan 2026-09-27: Prisma migration dan seed pada database `bukit-delight` port 5432 sukses; API menyala memakai Prisma dan readiness lulus. Compose aplikasi memakai external network `local-infra_local-infra` (nama aktual dari project Compose `local-infra`) untuk PostgreSQL, tanpa service/volume PostgreSQL atau Redis duplikat di repository ini. Config Compose tervalidasi. Setelah pemulihan Docker Desktop, Compose production lokal berhasil build dan start; migrator selesai, API readyz 200, dan API/web healthy. `.env.docker.production` lokal diarahkan ke user dan database yang tersedia pada local-infra.
- [x] Hapus definisi Compose infrastruktur duplikat dan arahkan mode development/production ke network project eksternal `local-infra`; pertahankan volume yang dikelola project infrastruktur.
- Verifikasi environment bersih lulus: workspace sementara tanpa `.env`/`node_modules` menjalankan install frozen, typecheck API/web, dan build API/web; kedua service Compose sehat; build Docker API sebelumnya dan build Docker web terbaru sukses. Build web Docker menghasilkan bundle 698.96 kB (gzip 216.46 kB; 907 modul), sama seperti build workspace bersih. Build workspace lokal masih menghasilkan 1,105.06 kB (gzip 296.23 kB; 913 modul) walau source dan dependency langsung cocok; virtual store lokal 2.258 folder dibanding 730 pada instalasi bersih, jadi drift node_modules masih hipotesis.
- README dan `docs/deployment.md` kini mendokumentasikan konfigurasi Prisma/PostgreSQL aktif. Validasi produksi masih mencakup backup/restore PostgreSQL, rahasia deployment, ingress, dan persistensi upload.

## Phase 7 — Cutover dan penutupan migrasi

- [x] Jalankan pemeriksaan lokal akhir: install lockfile, API/web build dan typecheck, lint API, serta focused HTTP contract checks.
- [x] Tambahkan PostgreSQL ephemeral, migrate, dan seed pada workflow CI agar suite integrasi memakai database disposable.
- [x] Jalankan focused acceptance untuk health, 404, validasi request/ID, dan penerbitan token Prisma.
- [x] Catat sinyal pemantauan API/PostgreSQL dan ambang deployment di panduan deployment.
- [x] Dokumentasikan backup PostgreSQL dan rehearsal restore ke database recovery terpisah.
- [x] Rehearse backup dan restore lokal pada PostgreSQL disposable; jalankan acceptance API pada hasil restore.
- [x] Hapus kode, dependensi, dan konfigurasi Mongoose yang tidak dipakai; importer offline tetap membaca snapshot Extended JSON.
- [x] Perbarui README dan dokumentasi arsitektur sesuai implementasi final.
- [x] Pastikan checklist phase dan keputusan penting terdokumentasi.
- [x] Jalankan ulang acceptance penuh auth, menu, pesanan, dan transaksi pada PostgreSQL test terisolasi setelah penghapusan scaffolding lama.
- [x] Tinjau run CI pada remote setelah workflow terbaru berjalan.
- [x] Rehearse mode production Compose lokal: image API/web ter-build, migrasi/seed sukses tanpa migrasi tertunda, API `/readyz` 200, API/web healthcheck healthy.
- [x] Rehearse backup database yang dipakai production Compose lokal: custom dump dapat dibaca dan restore ke database terpisah berhasil; tabel serta jumlah role, akun, dan migrasi cocok dengan database sumber.
- [x] Rehearse observability dasar pada production Compose lokal: API/web healthcheck healthy, `/readyz` 200, dan statistik koneksi/transaksi PostgreSQL terbaca.
- [x] Rehearse backup/restore dan observability pada production Compose lokal: migrasi/seed, backup serta restore terpisah, health/readiness, dan statistik PostgreSQL terverifikasi.

**Catatan kronologis dan hasil verifikasi:** Entri berikut mencatat hambatan awal dan tindak lanjutnya; hambatan yang ditandai dalam entri lama diselesaikan oleh checkpoint sesudahnya. Lihat `Status akhir` di atas untuk kondisi terkini.

- Build root, typecheck, lint API, seluruh API tests (12 lulus tanpa skip di PostgreSQL disposable), web tests (178 lulus), Prettier pada seluruh file yang disentuh selain generated `pnpm-lock.yaml`, dan `git diff --check` lulus pada 2026-09-27. `/healthz=ok` dan `/readyz=ready`. Build web mempertahankan peringatan bundle JS 1,105.07 kB dan banner-2 874.51 kB.
- Web tidak lagi memiliki skrip ESLint yang dapat dijalankan: skrip lama mencari JavaScript yang sudah dipindah ke TypeScript, dan parser CRA lama gagal dimuat dengan TypeScript 7. TypeScript web diverifikasi oleh `tsc --noEmit`; lint aktif tetap memeriksa JS/test API.
- Full integration suite berjalan pada container PostgreSQL disposable port 5434; migrasi, seed, seluruh 12 tes API, lalu cleanup container berhasil. Rehearsal backup memakai format custom, `pg_restore --list`, restore ke database baru, verifikasi role `admin`/`cashier`/`customer` dan dua akun seed, lalu seluruh 12 tes API lulus terhadap hasil restore. Database aktif di port 5432 dan Compose di port 5433 tidak dipakai.
- CI GitHub Actions pada draft PR #2 (`phase-7-ci-validation`, commit `39766f9`) sukses: install frozen, Prisma generate/migrate/seed, build, typecheck, lint, dan test. Workflow memberi annotation deprecation Node.js 20 dari action v4 dan pemberitahuan migrasi runner `ubuntu-latest`; tidak ada job yang gagal. PR belum di-merge.
- Production cutover/restore belum dapat diverifikasi dari workspace lokal; dokumentasi kini berisi prosedur dan sinyal observability yang harus direhearse pada target deployment.
- Pemeriksaan jaringan menemukan nama aktual external network `local-infra_local-infra`; kedua file Compose dan dokumentasi telah memakai nama tersebut dengan override `LOCAL_INFRA_NETWORK` bila deployment memakai nama lain. PostgreSQL dalam network ini menerima koneksi dan memiliki database `bukit-delight` dengan migrasi aplikasi selesai.
- Percobaan lanjutan: Docker daemon kembali tidak merespons `docker info` setelah 20 detik; pemeriksaan TCP host ke port PostgreSQL 5432 berhasil. Rehearsal production tetap menunggu Docker API pulih agar deployment dan health check container bisa dijalankan.
- Docker Desktop sempat gagal bootstrap WSL dan menampilkan opsi factory reset. Reset tidak dilakukan. Shutdown WSL, penutupan UI secara normal, dan peluncuran ulang Docker Desktop memulihkan Engine; diagnosis lokal kemudian meluluskan Engine/API. Local-infra PostgreSQL/Redis kembali berjalan.
- Build production Compose berikutnya lulus (704 package terpasang, Prisma client/API build, Vite web build). Percobaan pertama mengungkap path Prisma CLI dan URL kredensial lama pada file production lokal; keduanya diperbaiki. Re-run migration/seed keluar 0 dengan `No pending migrations to apply`; API readyz mengembalikan 200, API dan web healthcheck healthy, web port 8080 tersedia. Target production sebenarnya tetap belum ada untuk rehearsal pemulihan/observability saat cutover.
- Rehearsal backup/restore lokal 2026-09-28 pada database yang dipakai production Compose: custom dump lolos `pg_restore --list`, restore ke database terpisah sukses dengan `pg_restore --exit-on-error`, dan seluruh 11 tabel public serta jumlah barisnya cocok (`_prisma_migrations=2`, `accounts=3`, `categories=0`, `customers=0`, `itemorders=0`, `menus=0`, `orders=0`, `refreshtokens=10`, `roles=3`, `tables=0`, `transactions=0`). Nama role `admin`, `cashier`, dan `customer` cocok. Database recovery dan dump sementara dihapus setelah pemeriksaan; database sumber tidak diubah.
- Observability lokal 2026-09-28: konfigurasi Compose development/production lolos `docker compose config`; API dan web healthy, API readiness healthcheck lulus, migrator keluar dengan kode 0, dan statistik `pg_stat_database` terbaca (`numbackends=1`, `xact_commit=117`, `xact_rollback=1`, `deadlocks=0`; satu koneksi idle). Ini snapshot lokal dan tidak membuktikan pemantauan selama periode pemulihan pada server production eksternal.
- Phase 7 selesai dalam scope deployment Docker yang diminta: production Compose berjalan lokal dan rehearsal deployment, pemulihan DB, serta observability lokal selesai. Belum ada rilis traffic publik/server production eksternal karena target tersebut tidak ditentukan; lakukan checklist deployment eksternal bila target itu ditambahkan.
- Infrastruktur Docker API/web, konfigurasi Nginx untuk SPA/API/Socket.IO, serta `.dockerignore` tersedia. Build Docker API dan web berhasil; setup bersih juga lulus sebagaimana dicatat di atas.
- Deployment production lokal diperbarui 2026-09-28 dari source terbaru: build API/web Docker berhasil; project Compose `bukit-delight-production` menjalankan migrasi tanpa pending migration lalu seed sukses. API dan web berstatus healthy, web port 8080 menampilkan landing page, dan browser tidak melaporkan error/warning console. Gunakan `docker compose -p bukit-delight-production -f docker-compose.production.yml --env-file .env.docker.production up -d --no-build` untuk menjalankan image hasil build tersebut. File root `.env` yang dimodifikasi lokal memiliki baris dotenv tidak valid, jadi deploy memakai env file production eksplisit. Dua container orphan postgres/redis dari Compose lama dihapus setelah dipastikan berhenti; volume keduanya dipertahankan.
- Mode development dijalankan 2026-09-28 di port web 5174 dan API 3001 dengan database terpisah `bukit-delight-development`; `.env.example`, README, dan fallback Compose menunjuk ke database development, sedangkan production tetap ke `bukit-delight`. Migrasi/seed development berhasil, API readyz healthy, login `admin` development sukses, halaman Dashboard termuat, dan browser memuat Vite client. Probe CSS sementara membuktikan HMR menerapkan perubahan tanpa navigasi/reload dokumen; probe dihapus sesudah verifikasi. Production API/web tetap healthy di port 8080.
- Smoke check production lokal 2026-09-28: login akun seed `admin` berhasil melalui `http://localhost:8080/login`, dialihkan ke `/admin/dashboard`, dan halaman dashboard menampilkan akun admin serta navigasi admin.
- Pemisahan alias API Docker 2026-09-28: kedua Compose sebelumnya memakai alias DNS `api` pada external network yang sama, sehingga Nginx production sesekali tersambung ke API development. Nginx kini memakai `bukit-delight-production-api` dan Vite development memakai `bukit-delight-development-api`. Kedua stack direkreasi; alias DNS dan readiness masing-masing API terverifikasi. Request categories/menus melalui Nginx merespons 200 dari network internal; setelah sesi browser dimuat ulang, GET categories juga merespons 200. Satu `ERR_CONNECTION_RESET` tercatat pada request lama saat container sedang diganti, dan tidak muncul pada request berikutnya.
- Audit styling frontend 2026-09-28: tidak ditemukan CSS-in-JS, stylesheet framework tambahan, atau API Material UI. Inline style yang tersisa hanya ukuran spinner dari prop `size` serta URL gambar menu, keduanya nilai runtime yang tepat dipertahankan.
- Revalidasi 2026-09-28: typecheck workspace lulus; seluruh 178 web tests lulus. Enam test API tanpa kebutuhan database lulus, enam test integrasi diskip karena tidak ada `PRISMA_TEST_DATABASE_URL` disposable. Ditambahkan `ResizeObserver` mock untuk jsdom/headless UI, diselaraskan assertion test dengan HTML/ARIA aktual, role timer countdown, dan role `alert` untuk notifikasi error. Prettier serta `git diff --check` lulus pada file terkait. Build web berhasil; warning chunk JavaScript tetap muncul (926.62 kB pada build host). Production Compose dibangun ulang; migrator/seed selesai, API dan web healthy, `/readyz`, web `/healthz`, serta halaman production mengembalikan HTTP 200.

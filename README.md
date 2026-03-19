# Sistem Transparansi Program Makan Bergizi Gratis (MBG)

Sistem Transparansi MBG adalah platform digital untuk mendukung keterbukaan data, standarisasi gizi, dan pengawasan independen terhadap program Makan Bergizi Gratis (MBG) yang dikelola oleh Badan Gizi Nasional (BGN).

## 🚀 Fitur Utama

- **Manajemen Standar Gizi**: BGN menetapkan ambang batas gizi minimum (kalori, protein, lemak, dll) per kelompok usia.
- **Validasi Resep Otomatis**: Operator SPPG membuat resep yang divalidasi secara otomatis oleh sistem terhadap standar BGN.
- **Transparansi Operasional**: Pelaporan pembelian bahan baku, penggajian, dan distribusi makanan.
- **Portal Publik**: Akses data terbuka bagi masyarakat umum tanpa perlu login.
- **Pengawasan & Audit**: Akses khusus bagi Auditor Independen (Ombudsman/KPK) untuk melakukan flagging dan pengunduhan audit trail.
- **Sistem Pengaduan**: Portal bagi masyarakat untuk melaporkan kendala di lapangan yang dapat dieskalasi ke auditor.

## 🛠️ Tech Stack

- **Backend**: [Laravel 11](https://laravel.com)
- **Frontend**: [React](https://reactjs.org) + [Inertia.js](https://inertiajs.com)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + [ShadCN UI](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)

## 📦 Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/username/mikin-birgizi-gritis.git
   cd mikin-birgizi-gritis
   ```

2. **Instal dependensi Backend (PHP)**
   ```bash
   composer install
   ```

3. **Instal dependensi Frontend (Node.js)**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Jangan lupa sesuaikan konfigurasi database di file `.env`.*

5. **Migrasi Database & Seeding**
   ```bash
   php artisan migrate --seed
   ```

6. **Jalankan Aplikasi**
   - Terminal 1 (Backend): `php artisan serve`
   - Terminal 2 (Frontend): `npm run dev`

## 👥 Kontribusi

Proyek ini dibangun untuk meningkatkan kepercayaan publik. Kontribusi dalam bentuk laporan bug, saran fitur, atau pull request sangat dihargai.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

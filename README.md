# 💍 Digital Wedding Invitation - Luxury Romantic Baroque

Selamat datang di project Undangan Pernikahan Digital. Project ini dibangun menggunakan **Next.js** dengan estetika desain **Luxury Romantic Baroque**, menampilkan animasi yang halus, desain premium, dan kemudahan kustomisasi.

---

## 🚀 Cara Menjalankan Project (Sangat Mudah)

Project ini sudah dilengkapi dengan "Trigger File" otomatis. Kamu tidak perlu mengetik perintah di terminal jika tidak terbiasa.

### A. Pengguna macOS
1. Buka folder project ini di Finder.
2. Cari file bernama **`start.command`**.
3. **Klik 2x** file tersebut.
4. Terminal akan terbuka otomatis, menginstall semua kebutuhan, dan menjalankan project.

### B. Pengguna Windows
1. Buka folder project ini di File Explorer.
2. Cari file bernama **`start.bat`**.
3. **Klik 2x** file tersebut.
4. Jendela Command Prompt akan terbuka otomatis dan menjalankan project.

### C. Cara Manual (Terminal)
Jika kamu ingin menjalankan secara manual lewat terminal:
```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development
npm run dev
```
Setelah jalan, buka [http://localhost:3000](http://localhost:3000) di browser kamu.

---

## 🛠 Teknologi yang Digunakan
- **Framework**: Next.js (App Router)
- **Animasi**: Framer Motion & GSAP (GreenSock)
- **Styling**: Vanilla CSS dengan Modern Design Tokens (Glassmorphism & Parallax)
- **Database**: Firebase (untuk RSVP & Buku Tamu)
- **Efek Khusus**: Canvas Confetti

---

## ✍️ Cara Mengubah Data Undangan (Kustomisasi)

Semua data teks, nama mempelai, tanggal, lokasi, hingga foto diatur dalam satu file pusat agar mudah diubah tanpa menyentuh kode program.

### Lokasi File Konfigurasi:
📂 `src/data/weddingConfig.json`

### Yang bisa kamu ubah di dalam file tersebut:
- **`couple`**: Nama lengkap, nama panggilan, foto, dan nama orang tua mempelai.
- **`events`**: Detail Akad Nikah dan Resepsi (Tanggal, Jam, Alamat, Link Google Maps).
- **`gallery`**: Daftar foto yang akan ditampilkan di section galeri.
- **`quotes`**: Ayat suci atau kutipan romantis yang muncul di bagian atas.
- **`gift`**: Informasi rekening atau alamat pengiriman kado.

**Tips:** Setelah kamu mengubah isi file `weddingConfig.json`, tampilan web akan langsung berubah otomatis (*Hot Reload*).

---

## 📂 Struktur Folder
- `src/app/` : Berisi halaman utama dan layout (Next.js App Router).
- `src/components/` : Komponen UI seperti Navbar, Countdown, RSVP Form, dll.
- `src/data/` : **Tempat kustomisasi data (weddingConfig.json).**
- `src/app/globals.css` : Pengaturan desain, warna, dan tema (Baroque Aesthetic).
- `public/` : Tempat menyimpan aset gambar, ikon, dan musik.

---

## 🌐 Cara Deploy (Online-kan Website)

Setelah selesai mengedit, kamu bisa mem-publish undangan ini secara gratis menggunakan **Vercel** atau **Netlify**:

1. Upload folder ini ke project baru di **GitHub**.
2. Hubungkan akun GitHub kamu ke [Vercel](https://vercel.com).
3. Pilih repository ini dan klik **Deploy**.
4. Website kamu akan online dalam 1-2 menit!

---

## 📞 Bantuan & Dukungan
Jika ada kendala dalam instalasi atau ingin mengubah desain lebih dalam, silakan tanyakan kepada pengembang atau gunakan asisten AI untuk memandu modifikasi CSS di `globals.css`.

---
*Dibuat dengan ❤️ untuk hari istimewa Anda.*

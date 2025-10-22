# 🎯 MindClash - Quiz Game (Server + Client)

Multiplayer real-time quiz game yang menggunakan OpenAI untuk generate soal. Proyek ini terdiri dari server (Socket.IO + Express + OpenAI) dan client React (Vite + Socket.IO client).

## 🔧 Tech Stack

- Backend: Node.js, Express, Socket.IO, OpenAI
- Frontend: React, Vite, Socket.IO Client

## 📁 Struktur proyek (relevan)

```
Final GP/
├── MindClash-Server/         # server (index.js)
├── MindClash-Client/
│   └── client/              # frontend (Vite + React)
└── README.md
```

## ⚙️ Prerequisites

- Node.js v18+ dan npm
- (Opsional) OpenAI API Key jika ingin soal di-generate otomatis

## 🚀 Menjalankan aplikasi

1. Server

```bash
cd MindClash-Server
npm install
# set environment variable di file .env (opsional, tapi disarankan)
# contoh: OPENAI_API_KEY=sk-xxx
node index.js
# atau development mode dengan auto-reload:
npx nodemon index.js
```

Server default running di `http://localhost:3000`.

2. Client

```bash
cd MindClash-Client/client
npm install
npm run dev
```

Client biasanya akan berjalan di `http://localhost:5173` (Vite) — cek output terminal.

## 🧩 Konfigurasi

- MindClash-Server menggunakan `OPENAI_API_KEY` di file `.env` untuk memanggil OpenAI. Jika tidak tersedia, server akan memakai fallback questions statis.
- Port server default: 3000 (bisa di-set lewat `PORT` environment variable).

## 📖 Cara Main (singkat)

1. Buka client di browser.
2. Masukkan nickname dan (opsional) room code.
3. Jika kamu pembuat room, pilih tema (Olahraga, Matematika, Sejarah Umum, IPA).
4. Tunggu server men-generate quiz, lalu klik `SIAP`.
5. Jawab setiap soal sebelum timer habis. Poin berdasarkan kecepatan.

## 📝 Catatan penting

- Max 10 pemain per room.
- Game berjalan lewat Socket.IO; client harus connect ke `http://localhost:3000`.
- Server menyediakan health-check `GET /` yang merespon HTML sederhana.

## 🐛 Troubleshooting singkat

- Jika client tidak connect: pastikan server jalan dan URL Socket.IO client sama.
- Jika OpenAI error: periksa `OPENAI_API_KEY` dan internet connection.
- Jika port 3000 sibuk: ubah `PORT` environment variable sebelum start.

---

Jika kamu mau, aku bisa:

- Tambahkan README yang lebih terperinci untuk server dan client masing-masing
- Buat Postman collection / dokumentasi OpenAPI (untuk health-check dan testing)
- Menambahkan contoh client React yang minimal (bypass UI yang ada) untuk otomatisasi testing

Pilih yang mau dikerjakan selanjutnya.

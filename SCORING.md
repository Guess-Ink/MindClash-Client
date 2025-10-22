# 🎯 Sistem Scoring Berdasarkan Kecepatan

Sistem scoring sekarang menggunakan **time-based rewards** — semakin cepat menjawab, semakin banyak poin!

## 📊 Tabel Poin

| Waktu Jawaban        | Poin   |
| -------------------- | ------ |
| < 5 detik            | **10** |
| 5-10 detik           | **8**  |
| 10-15 detik          | **6**  |
| 15-20 detik          | **4**  |
| 20-30 detik          | **2**  |
| > 30 detik / Timeout | **0**  |

## 🎮 Cara Kerja

1. **Timer dimulai** saat ronde baru ditampilkan
2. Saat user **submit jawaban yang benar**, server menghitung berapa detik yang telah berlalu
3. **Poin dihitung** berdasarkan tabel di atas
4. **Feedback** akan menampilkan: "Benar! +6 poin (12s) 🎉" (contoh untuk jawaban di detik ke-12)

## 💡 Tips untuk Pemain

- **Jawab cepat** untuk maksimalkan poin (10 poin di bawah 5 detik!)
- **Tapi tetap akurat** — jawaban salah = 0 poin
- Server menyimpan satu jawaban benar per pemain per soal — tidak bisa mendapatkan poin berulang pada soal yang sama

## 🔧 Implementasi Teknis

### Server (`MindClash-Server/index.js`)

```javascript
function calculatePoints(elapsedSeconds) {
  if (elapsedSeconds < 5) return 10;
  if (elapsedSeconds < 10) return 8;
  if (elapsedSeconds < 15) return 6;
  if (elapsedSeconds < 20) return 4;
  if (elapsedSeconds < 30) return 2;
  return 0;
}
```

- Server menyimpan `roundStartTime` saat ronde dimulai.
- Ketika player menjawab benar, server menghitung `elapsedSeconds = Math.floor((Date.now() - roundStartTime) / 1000)` dan menghitung poin berdasarkan fungsi di atas.
- Server menggunakan property `lastCorrectRound` untuk memastikan pemain hanya mendapat poin sekali per ronde.

## Contoh pemakaian di client

```js
const onGuessResult = ({ correct, already, points, elapsedSeconds }) => {
  if (correct && !already) {
    setFeedback(`Benar! +${points} poin (${elapsedSeconds}s) 🎉`);
  } else if (correct && already) {
    setFeedback(`Kamu sudah mendapatkan poin untuk soal ini sebelumnya`);
  } else {
    setFeedback(`Salah. Jawaban yang benar: ${correctAnswer}`);
  }
};
```

---

Selamat bermain dan berlomba dengan waktu! ⏱️🎉

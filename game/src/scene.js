// Definisi adegan taman dan daftar perbedaannya.
// Semua posisi memakai koordinat ternormalisasi di dalam satu panel:
// x dan y berada di rentang 0..1, sehingga panel bisa digambar pada
// ukuran piksel berapa pun tanpa mengubah tata letaknya.
//
// Panel kanan selalu merupakan salinan panel kiri, kecuali tujuh
// perbedaan yang tercatat di sini. Setiap perbedaan punya titik pusat
// dan radius klik, dan titik yang sama berlaku di kedua panel.

import { buatAcak } from './rng.js';

export const JUMLAH_PERBEDAAN = 7;

export function buatAdegan(seed) {
  const acak = buatAcak(seed * 7919 + 13);

  // Bunga dan rumpun rumput dekoratif: posisinya diturunkan dari seed,
  // tetapi tidak pernah menjadi perbedaan, jadi kedua panel selalu
  // menggambarnya dengan cara yang persis sama.
  const bunga = [];
  const warnaBunga = ['#e75480', '#f2c230', '#ffffff', '#9b59d0'];
  for (let i = 0; i < 16; i++) {
    bunga.push({
      x: acak.rentang(0.04, 0.96),
      y: acak.rentang(0.80, 0.96),
      warna: warnaBunga[i % warnaBunga.length],
      ukuran: acak.rentang(0.008, 0.014),
    });
  }
  const rumpun = [];
  for (let i = 0; i < 22; i++) {
    rumpun.push({ x: acak.rentang(0.02, 0.98), y: acak.rentang(0.66, 0.97), tinggi: acak.rentang(0.015, 0.03) });
  }
  const bintangAwan = acak.rentang(0, 0.02);

  const perbedaan = [
    { id: 'matahari', label: 'Warna matahari berubah', x: 0.15, y: 0.16, r: 0.10 },
    { id: 'awan', label: 'Satu awan hilang', x: 0.74, y: 0.12, r: 0.11 },
    { id: 'burung', label: 'Seekor burung hilang', x: 0.46, y: 0.22, r: 0.06 },
    { id: 'apel', label: 'Sebuah apel hilang dari pohon', x: 0.265, y: 0.47, r: 0.055 },
    { id: 'jendela', label: 'Warna jendela rumah berubah', x: 0.527, y: 0.415, r: 0.055 },
    { id: 'bangku', label: 'Warna bangku berubah', x: 0.42, y: 0.79, r: 0.11 },
    { id: 'bebek', label: 'Bebek di kolam bergeser', x: 0.76, y: 0.84, r: 0.11 },
  ];

  return {
    bunga,
    rumpun,
    geserAwan: bintangAwan,
    perbedaan,
    // Posisi bebek versi kiri dan versi kanan memang berbeda; itulah
    // perbedaan nomor tujuh. Area kliknya menutupi kedua posisi.
    bebekKiri: { x: 0.70, y: 0.84 },
    bebekKanan: { x: 0.82, y: 0.86 },
  };
}

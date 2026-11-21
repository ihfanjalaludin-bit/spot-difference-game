// Generator acak ber-seed yang kecil dan deterministik.
// Memakai mulberry32: cukup cepat untuk tata letak adegan, dan hasil
// urutannya selalu sama untuk seed yang sama di mesin mana pun.

export function buatAcak(seedAwal) {
  let keadaan = (seedAwal >>> 0) || 1;
  function berikutnya() {
    keadaan = (keadaan + 0x6d2b79f5) >>> 0;
    let t = keadaan;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return {
    // Angka pecahan di [0, 1).
    pecahan: berikutnya,
    // Angka pecahan di [min, maks).
    rentang(min, maks) {
      return min + berikutnya() * (maks - min);
    },
    // Bilangan bulat di [min, maks], kedua ujung termasuk.
    bulat(min, maks) {
      return min + Math.floor(berikutnya() * (maks - min + 1));
    },
    // Satu anggota acak dari sebuah array.
    pilih(daftar) {
      return daftar[Math.floor(berikutnya() * daftar.length)];
    },
  };
}

// Program penyerahan untuk entri spot-the-difference ini.
// Tugasnya sederhana: ambil folder game/ dan screenshots/ yang ada di
// samping berkas ini, letakkan salinannya di folder keluaran, lalu tulis
// dossier.json di sana memakai pustaka resmi make.fun dari vendor/.
//
// Folder keluaran berasal dari MAKEFUN_OUTPUT_DIR bila variabel itu ada,
// selain itu /output. Folder itu sendiri tidak pernah dihapus di sini:
// di lingkungan penilai folder tersebut adalah titik mount, jadi kita
// cukup membuatnya bila belum ada lalu mengisi isinya saja.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const folderEntri = fileURLToPath(new URL('.', import.meta.url));
const folderKeluar = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(folderKeluar, { recursive: true });

cpSync(join(folderEntri, 'game'), join(folderKeluar, 'game'), { recursive: true });

const tujuanFoto = join(folderKeluar, 'screenshots');
mkdirSync(tujuanFoto, { recursive: true });
const asalFoto = join(folderEntri, 'screenshots');
if (existsSync(asalFoto)) {
  cpSync(asalFoto, tujuanFoto, { recursive: true });
}

// Batas-batas di bawah ini adalah batas yang dipakai penilai platform:
// teks dossier paling banyak 163840 byte, foto paling banyak 4 buah dan
// 262144 byte per buah, isi game/ paling banyak 993 berkas dan
// 50331648 byte seluruhnya, dan panjang path di dalam game/ paling
// banyak 1000 byte.
const ringkasan = buildDossier(folderKeluar, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

writeFileSync(join(folderKeluar, 'dossier.json'), ringkasan);

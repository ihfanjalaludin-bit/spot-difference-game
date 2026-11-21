// Titik masuk game Park Pair — Spot the Difference.
// Dua gambar taman berdampingan; gambar kanan punya tujuh perbedaan.
// Klik perbedaan di panel mana pun untuk menandainya. Temukan semuanya
// sebelum waktu habis, dan hati-hati: klik yang meleset memotong waktu.
//
// Mode jepretan untuk screenshot, dari query string:
//   ?shot=start  layar judul
//   ?shot=play   permainan berjalan, tiga perbedaan sudah ditemukan
//   ?shot=end    layar akhir kemenangan
// Seed tata letak dibaca dari ?seed=..., bawaan 1.

import { buatAdegan, JUMLAH_PERBEDAAN } from './scene.js';
import { gambarPanel } from './draw.js';

const kanvas = document.getElementById('board');
const ctx = kanvas.getContext('2d');
const statusEl = document.getElementById('status');

const params = new URLSearchParams(location.search);
const seed = Number.parseInt(params.get('seed') ?? '1', 10) || 1;
const modeFoto = params.get('shot');

const adegan = buatAdegan(Number.isFinite(seed) ? seed : 1);
const WAKTU_AWAL = 90;
const PENALTI_SALAH = 5;

let fase = 'judul'; // 'judul' | 'main' | 'menang' | 'kalah'
let ditemukan = new Set();
let skor = 0;
let sisaWaktu = WAKTU_AWAL;
let detikTerakhir = null;
let kilatSalah = 0; // penanda waktu untuk kilatan merah saat klik meleset
let tombolMain = null; // kotak tombol aktif di layar judul / akhir

function aturStatus(teks) {
  if (statusEl) statusEl.textContent = teks;
}

function mulaiLagi() {
  ditemukan = new Set();
  skor = 0;
  sisaWaktu = WAKTU_AWAL;
  detikTerakhir = null;
  fase = 'main';
  aturStatus(`Game started. Find ${JUMLAH_PERBEDAAN} differences.`);
}

function terapkanModeFoto() {
  if (modeFoto === 'play') {
    fase = 'main';
    ditemukan = new Set(['matahari', 'awan', 'apel']);
    skor = 300;
    sisaWaktu = 62;
  } else if (modeFoto === 'end') {
    fase = 'menang';
    ditemukan = new Set(adegan.perbedaan.map((d) => d.id));
    skor = 700 + Math.round(38) * 5;
    sisaWaktu = 38;
  } else if (modeFoto === 'start') {
    fase = 'judul';
  }
}

function tataLetak() {
  const lebar = kanvas.width;
  const tinggi = kanvas.height;
  const tinggiHud = 64;
  const celah = 18;
  const lebarPanel = (lebar - celah * 3) / 2;
  const tinggiPanel = tinggi - tinggiHud - celah;
  return {
    tinggiHud,
    kiri: { x: celah, y: tinggiHud, w: lebarPanel, h: tinggiPanel },
    kanan: { x: celah * 2 + lebarPanel, y: tinggiHud, w: lebarPanel, h: tinggiPanel },
  };
}

function teksTengah(teks, y, ukuran, warna, tebal = 700) {
  ctx.fillStyle = warna;
  ctx.font = `${tebal} ${ukuran}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(teks, kanvas.width / 2, y);
}

function gambarHud() {
  ctx.fillStyle = '#20301f';
  ctx.fillRect(0, 0, kanvas.width, 64);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Park Pair — Spot the Difference', 18, 33);
  ctx.textAlign = 'right';
  const menit = Math.floor(Math.max(0, sisaWaktu) / 60);
  const detik = Math.floor(Math.max(0, sisaWaktu) % 60);
  const jam = `${menit}:${String(detik).padStart(2, '0')}`;
  ctx.fillStyle = sisaWaktu <= 15 && fase === 'main' ? '#ff8787' : '#ffffff';
  ctx.fillText(`Time ${jam}   Found ${ditemukan.size}/${JUMLAH_PERBEDAAN}   Score ${skor}`, kanvas.width - 18, 33);
}

function gambarTombol(x, y, w, h, label) {
  tombolMain = { x, y, w, h };
  ctx.fillStyle = '#2b8a3e';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 26px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}

function gambarLapisan(judul, baris, labelTombol) {
  ctx.fillStyle = 'rgba(20, 32, 20, 0.72)';
  ctx.fillRect(0, 0, kanvas.width, kanvas.height);
  const lebarKotak = 620;
  const tinggiKotak = 320;
  const x = (kanvas.width - lebarKotak) / 2;
  const y = (kanvas.height - tinggiKotak) / 2;
  ctx.fillStyle = '#fdfdf5';
  ctx.beginPath();
  ctx.roundRect(x, y, lebarKotak, tinggiKotak, 18);
  ctx.fill();
  teksTengah(judul, y + 62, 40, '#20301f');
  ctx.font = '400 21px system-ui, sans-serif';
  ctx.fillStyle = '#445544';
  ctx.textAlign = 'center';
  baris.forEach((b, i) => ctx.fillText(b, kanvas.width / 2, y + 122 + i * 30));
  gambarTombol(kanvas.width / 2 - 120, y + tinggiKotak - 92, 240, 56, labelTombol);
}

function gambar() {
  const t = tataLetak();
  ctx.fillStyle = '#31473a';
  ctx.fillRect(0, 0, kanvas.width, kanvas.height);
  gambarHud();
  gambarPanel(ctx, t.kiri.x, t.kiri.y, t.kiri.w, t.kiri.h, adegan, false, ditemukan);
  gambarPanel(ctx, t.kanan.x, t.kanan.y, t.kanan.w, t.kanan.h, adegan, true, ditemukan);

  if (kilatSalah > 0 && performance.now() < kilatSalah) {
    ctx.fillStyle = 'rgba(224, 49, 49, 0.16)';
    ctx.fillRect(0, 64, kanvas.width, kanvas.height - 64);
  }

  if (fase === 'judul') {
    tombolMain = null;
    gambarLapisan('Park Pair', [
      'Two park pictures, side by side.',
      'The right one hides 7 differences.',
      'Click a difference in either picture to mark it.',
      'Wrong clicks cost 5 seconds. Good luck!',
    ], 'Start');
  } else if (fase === 'menang') {
    tombolMain = null;
    gambarLapisan('You found them all!', [
      `Final score: ${skor}`,
      `Time left: ${Math.ceil(sisaWaktu)} seconds.`,
      'Every difference is circled in both pictures.',
    ], 'Play again');
  } else if (fase === 'kalah') {
    tombolMain = null;
    gambarLapisan('Time is up!', [
      `You found ${ditemukan.size} of ${JUMLAH_PERBEDAAN} differences.`,
      `Score: ${skor}`,
      'Try again and watch the small details.',
    ], 'Try again');
  } else {
    tombolMain = null;
  }
}

function perbarui(dt) {
  if (fase !== 'main' || modeFoto) return;
  sisaWaktu -= dt;
  if (sisaWaktu <= 0) {
    sisaWaktu = 0;
    fase = 'kalah';
    aturStatus(`Time is up. You found ${ditemukan.size} of ${JUMLAH_PERBEDAAN} differences.`);
  }
}

function bingkai(capWaktu) {
  if (detikTerakhir === null) detikTerakhir = capWaktu;
  const dt = Math.min(0.1, (capWaktu - detikTerakhir) / 1000);
  detikTerakhir = capWaktu;
  perbarui(dt);
  gambar();
  requestAnimationFrame(bingkai);
}

function diDalamTombol(x, y) {
  return tombolMain && x >= tombolMain.x && x <= tombolMain.x + tombolMain.w &&
    y >= tombolMain.y && y <= tombolMain.y + tombolMain.h;
}

kanvas.addEventListener('click', (ev) => {
  const kotak = kanvas.getBoundingClientRect();
  const x = (ev.clientX - kotak.left) * (kanvas.width / kotak.width);
  const y = (ev.clientY - kotak.top) * (kanvas.height / kotak.height);

  if (fase !== 'main') {
    if (diDalamTombol(x, y)) mulaiLagi();
    return;
  }

  const t = tataLetak();
  for (const panel of [t.kiri, t.kanan]) {
    if (x < panel.x || x > panel.x + panel.w || y < panel.y || y > panel.y + panel.h) continue;
    const nx = (x - panel.x) / panel.w;
    const ny = (y - panel.y) / panel.h;
    let kena = null;
    for (const d of adegan.perbedaan) {
      if (ditemukan.has(d.id)) continue;
      const dx = (nx - d.x) * panel.w;
      const dy = (ny - d.y) * panel.h;
      const jarak = Math.sqrt(dx * dx + dy * dy);
      const radiusPiksel = d.r * Math.min(panel.w, panel.h) * 1.35;
      if (jarak <= Math.max(26, radiusPiksel)) { kena = d; break; }
    }
    if (kena) {
      ditemukan.add(kena.id);
      skor += 100;
      aturStatus(`${kena.label}. Found ${ditemukan.size} of ${JUMLAH_PERBEDAAN}.`);
      if (ditemukan.size === JUMLAH_PERBEDAAN) {
        skor += Math.ceil(sisaWaktu) * 5;
        fase = 'menang';
        aturStatus(`You win! Final score ${skor}.`);
      }
    } else {
      sisaWaktu = Math.max(0, sisaWaktu - PENALTI_SALAH);
      kilatSalah = performance.now() + 220;
      aturStatus(`Not a difference. Minus ${PENALTI_SALAH} seconds.`);
      if (sisaWaktu <= 0) fase = 'kalah';
    }
    return;
  }
});

function sesuaikanUkuran() {
  const rasio = Math.min(1, window.innerWidth / 1280);
  kanvas.width = 1280;
  kanvas.height = 800;
  kanvas.style.width = `${Math.floor(1280 * Math.max(rasio, 0.4))}px`;
  kanvas.style.height = 'auto';
}

window.addEventListener('resize', sesuaikanUkuran);
sesuaikanUkuran();
terapkanModeFoto();
aturStatus(fase === 'judul'
  ? 'Park Pair. Press Start, then find 7 differences between the two park pictures.'
  : statusEl?.textContent ?? '');
requestAnimationFrame(bingkai);

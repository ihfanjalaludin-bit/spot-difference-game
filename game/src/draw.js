// Semua kode menggambar adegan taman ke canvas.
// Satu panel digambar oleh gambarPanel; panel kanan menerima bendera
// `kanan` sehingga tujuh perbedaan dari scene.js bisa diterapkan,
// sementara semua elemen lain digambar dengan kode yang sama persis.

function lingkaran(ctx, x, y, r, warna) {
  ctx.fillStyle = warna;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function elips(ctx, x, y, rx, ry, warna) {
  ctx.fillStyle = warna;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gambarAwan(ctx, cx, cy, skala) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx, cy, skala * 1.6, skala * 0.62, 0, 0, Math.PI * 2);
  ctx.ellipse(cx - skala * 0.9, cy + skala * 0.18, skala * 0.95, skala * 0.45, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + skala * 0.95, cy + skala * 0.16, skala * 1.0, skala * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gambarBurung(ctx, x, y, s) {
  ctx.strokeStyle = '#23406b';
  ctx.lineWidth = Math.max(2, s * 0.16);
  ctx.beginPath();
  ctx.arc(x - s * 0.55, y, s * 0.55, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + s * 0.55, y, s * 0.55, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function gambarPohon(ctx, px, py, u, denganApel, apelTengah) {
  // Batang.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(px - u * 0.018, py, u * 0.036, u * 0.16);
  // Tajuk dari tiga lingkaran hijau yang tumpang tindih.
  lingkaran(ctx, px, py - u * 0.06, u * 0.085, '#2f9e44');
  lingkaran(ctx, px - u * 0.06, py - u * 0.015, u * 0.06, '#37b24d');
  lingkaran(ctx, px + u * 0.06, py - u * 0.015, u * 0.06, '#37b24d');
  if (denganApel) {
    lingkaran(ctx, px - u * 0.045, py - u * 0.075, u * 0.013, '#e03131');
    lingkaran(ctx, px + u * 0.02, py - u * 0.01, u * 0.013, '#e03131');
    if (apelTengah) lingkaran(ctx, px + u * 0.065, py - u * 0.08, u * 0.013, '#e03131');
  }
}

function gambarRumah(ctx, x0, y0, u, warnaJendela) {
  // Dinding, atap segitiga, pintu, dan satu jendela yang bisa berubah.
  ctx.fillStyle = '#f6e3c5';
  ctx.fillRect(x0, y0, u * 0.17, u * 0.15);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(x0 - u * 0.02, y0);
  ctx.lineTo(x0 + u * 0.085, y0 - u * 0.075);
  ctx.lineTo(x0 + u * 0.19, y0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x0 + u * 0.115, y0 + u * 0.06, u * 0.032, u * 0.09);
  ctx.fillStyle = warnaJendela;
  ctx.fillRect(x0 + u * 0.028, y0 + u * 0.045, u * 0.038, u * 0.038);
  ctx.strokeStyle = '#5b3a1a';
  ctx.lineWidth = Math.max(1.5, u * 0.003);
  ctx.strokeRect(x0 + u * 0.028, y0 + u * 0.045, u * 0.038, u * 0.038);
}

function gambarBangku(ctx, cx, cy, u, warna) {
  ctx.fillStyle = warna;
  ctx.fillRect(cx - u * 0.075, cy - u * 0.028, u * 0.15, u * 0.016);
  ctx.fillRect(cx - u * 0.075, cy + u * 0.002, u * 0.15, u * 0.016);
  ctx.fillRect(cx - u * 0.075, cy - u * 0.062, u * 0.15, u * 0.014);
  ctx.fillStyle = '#3d3d3d';
  ctx.fillRect(cx - u * 0.062, cy + u * 0.02, u * 0.012, u * 0.035);
  ctx.fillRect(cx + u * 0.05, cy + u * 0.02, u * 0.012, u * 0.035);
  ctx.fillRect(cx - u * 0.062, cy - u * 0.062, u * 0.012, u * 0.034);
  ctx.fillRect(cx + u * 0.05, cy - u * 0.062, u * 0.012, u * 0.034);
}

function gambarBebek(ctx, x, y, u) {
  elips(ctx, x, y, u * 0.032, u * 0.02, '#ffffff');
  lingkaran(ctx, x + u * 0.026, y - u * 0.022, u * 0.014, '#ffffff');
  ctx.fillStyle = '#f59f00';
  ctx.beginPath();
  ctx.moveTo(x + u * 0.038, y - u * 0.022);
  ctx.lineTo(x + u * 0.056, y - u * 0.016);
  ctx.lineTo(x + u * 0.038, y - u * 0.01);
  ctx.closePath();
  ctx.fill();
  lingkaran(ctx, x + u * 0.03, y - u * 0.026, u * 0.0035, '#222222');
}

// Menggambar satu panel lengkap. `ditemukan` adalah Set berisi id
// perbedaan yang sudah ketemu, untuk menggambar lingkaran penandanya.
export function gambarPanel(ctx, x0, y0, lebar, tinggi, adegan, kanan, ditemukan) {
  const X = (nx) => x0 + nx * lebar;
  const Y = (ny) => y0 + ny * tinggi;
  const u = lebar;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, lebar, tinggi);
  ctx.clip();

  // Langit dan tanah.
  const langit = ctx.createLinearGradient(0, y0, 0, Y(0.62));
  langit.addColorStop(0, '#8ecdf0');
  langit.addColorStop(1, '#d8f2fd');
  ctx.fillStyle = langit;
  ctx.fillRect(x0, y0, lebar, tinggi * 0.64);
  ctx.fillStyle = '#69b455';
  ctx.fillRect(x0, Y(0.62), lebar, tinggi * 0.38);
  ctx.fillStyle = '#7cc464';
  ctx.fillRect(x0, Y(0.62), lebar, tinggi * 0.03);

  // Jalan setapak melengkung sederhana.
  ctx.fillStyle = '#e6d3a3';
  ctx.beginPath();
  ctx.moveTo(X(0.44), Y(1));
  ctx.lineTo(X(0.52), Y(0.62));
  ctx.lineTo(X(0.60), Y(0.62));
  ctx.lineTo(X(0.62), Y(1));
  ctx.closePath();
  ctx.fill();

  // Matahari: perbedaan pertama adalah warnanya di panel kanan.
  const warnaMatahari = kanan ? '#ff8c42' : '#ffd94d';
  lingkaran(ctx, X(0.15), Y(0.16), u * 0.052, warnaMatahari);
  ctx.strokeStyle = warnaMatahari;
  ctx.lineWidth = Math.max(2, u * 0.006);
  for (let i = 0; i < 8; i++) {
    const sudut = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(X(0.15) + Math.cos(sudut) * u * 0.065, Y(0.16) + Math.sin(sudut) * u * 0.065);
    ctx.lineTo(X(0.15) + Math.cos(sudut) * u * 0.085, Y(0.16) + Math.sin(sudut) * u * 0.085);
    ctx.stroke();
  }

  // Awan: awan kedua hanya ada di panel kiri.
  gambarAwan(ctx, X(0.38 + adegan.geserAwan), Y(0.13), u * 0.045);
  if (!kanan) gambarAwan(ctx, X(0.74), Y(0.12), u * 0.05);

  // Burung: burung pertama hanya ada di panel kiri.
  if (!kanan) gambarBurung(ctx, X(0.46), Y(0.22), u * 0.03);
  gambarBurung(ctx, X(0.60), Y(0.17), u * 0.024);

  // Rumah dengan jendela yang warnanya berbeda di panel kanan.
  gambarRumah(ctx, X(0.48), Y(0.355), u, kanan ? '#7fd4ff' : '#ffe680');

  // Pohon besar berapel dan pohon kecil polos.
  gambarPohon(ctx, X(0.20), Y(0.55), u, true, !kanan);
  gambarPohon(ctx, X(0.88), Y(0.56), u * 0.8, false, false);

  // Kolam dan bebeknya, yang bergeser tempat di panel kanan.
  elips(ctx, X(0.76), Y(0.86), u * 0.185, tinggi * 0.075, '#4dabf7');
  elips(ctx, X(0.76), Y(0.85), u * 0.165, tinggi * 0.06, '#74c0fc');
  const bebek = kanan ? adegan.bebekKanan : adegan.bebekKiri;
  gambarBebek(ctx, X(bebek.x), Y(bebek.y), u);

  // Bangku: warnanya cokelat di kiri, biru di kanan.
  gambarBangku(ctx, X(0.42), Y(0.79), u, kanan ? '#3366cc' : '#8b5a2b');

  // Dekorasi yang sama di kedua panel.
  for (const r of adegan.rumpun) {
    ctx.strokeStyle = '#2b8a3e';
    ctx.lineWidth = Math.max(1.5, u * 0.003);
    ctx.beginPath();
    ctx.moveTo(X(r.x), Y(r.y));
    ctx.lineTo(X(r.x) - u * 0.006, Y(r.y) - r.tinggi * tinggi / tinggi * 0.03 * (tinggi / lebar));
    ctx.moveTo(X(r.x), Y(r.y));
    ctx.lineTo(X(r.x) + u * 0.006, Y(r.y) - r.tinggi * 1.4);
    ctx.stroke();
  }
  for (const b of adegan.bunga) {
    lingkaran(ctx, X(b.x), Y(b.y), b.ukuran * u, b.warna);
    lingkaran(ctx, X(b.x), Y(b.y), b.ukuran * u * 0.4, '#fff3bf');
  }

  // Lingkaran penanda untuk perbedaan yang sudah ditemukan.
  for (const d of adegan.perbedaan) {
    if (!ditemukan.has(d.id)) continue;
    ctx.strokeStyle = '#e03131';
    ctx.lineWidth = Math.max(3, u * 0.007);
    ctx.beginPath();
    ctx.ellipse(X(d.x), Y(d.y), d.r * lebar, d.r * tinggi, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = Math.max(1.5, u * 0.003);
    ctx.beginPath();
    ctx.ellipse(X(d.x), Y(d.y), d.r * lebar + 4, d.r * tinggi + 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // Bingkai panel.
  ctx.strokeStyle = '#20301f';
  ctx.lineWidth = 3;
  ctx.strokeRect(x0 + 1.5, y0 + 1.5, lebar - 3, tinggi - 3);
}

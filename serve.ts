// Server statis kecil untuk memainkan game ini saat pengembangan.
// Jalankan `node serve.ts`, lalu buka http://localhost:8080 di browser.
// Hanya memakai pustaka standar Node, dan menolak setiap permintaan
// yang mencoba keluar dari folder game/.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const akarGame = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const argumen = process.argv.slice(2);
const posisiPort = argumen.indexOf('--port');
const portDiminta = posisiPort === -1 ? 8080 : Number(argumen[posisiPort + 1]);
const PORT = Number.isInteger(portDiminta) && portDiminta > 0 && portDiminta < 65536 ? portDiminta : 8080;

const TIPE: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer((req, res) => {
  let jalur: string;
  try {
    jalur = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('permintaan tidak valid');
    return;
  }
  if (jalur.endsWith('/')) jalur += 'index.html';

  const berkas = resolve(join(akarGame, normalize(jalur)));
  if (berkas !== akarGame && !berkas.startsWith(akarGame + sep)) {
    res.writeHead(403).end('terlarang');
    return;
  }

  let ukuran = 0;
  try {
    const info = statSync(berkas);
    if (!info.isFile()) throw new Error('bukan berkas');
    ukuran = info.size;
  } catch {
    res.writeHead(404).end('tidak ditemukan');
    return;
  }

  res.writeHead(200, {
    'content-type': TIPE[extname(berkas).toLowerCase()] ?? 'application/octet-stream',
    'content-length': ukuran,
    'cache-control': 'no-store',
  });
  createReadStream(berkas).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Game tersaji di http://localhost:${PORT}`);
});

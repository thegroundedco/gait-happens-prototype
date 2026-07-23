// Real-images pass: batch-convert print-res client photography (~32MP JPGs
// from Dropbox) into web-ready derivatives under public/images/.
//
// Usage: node scripts/optimize-images.mjs [mapping.json]
//   mapping.json defaults to scripts/image-map.json — an array of entries:
//     {
//       "src":     "C:\\...\\AF123456.jpg",  // absolute path to the original
//       "out":     "plp/toe-spacers.jpg",     // path under public/images/
//       "width":   1600,                       // max long-edge px (default 1600)
//       "quality": 80,                         // jpeg/webp quality (default 80)
//       "square":  true                        // optional: center-crop to 1:1
//     }
//
// Originals are never modified. Existing outputs are overwritten (the
// mapping file is the source of truth; re-running is idempotent).

import sharp from 'sharp';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mappingPath = process.argv[2] ?? join(root, 'scripts', 'image-map.json');
const outRoot = join(root, 'public', 'images');

const entries = JSON.parse(await readFile(mappingPath, 'utf8'));
let ok = 0;
const failures = [];

for (const e of entries) {
  const { src, out, width = 1600, quality = 80, square = false } = e;
  try {
    const outPath = join(outRoot, out);
    await mkdir(dirname(outPath), { recursive: true });

    let img = sharp(src, { limitInputPixels: false }).rotate(); // honor EXIF orientation

    if (square) {
      // 'attention' keeps the salient region (faces) inside the 1:1 crop
      img = img.resize(width, width, { fit: 'cover', position: sharp.strategy.attention });
    } else {
      img = img.resize({ width, height: width, fit: 'inside', withoutEnlargement: true });
    }

    if (out.endsWith('.png')) {
      await img.png({ compressionLevel: 9 }).toFile(outPath);
    } else if (out.endsWith('.webp')) {
      await img.webp({ quality }).toFile(outPath);
    } else {
      await img.jpeg({ quality, mozjpeg: true }).toFile(outPath);
    }

    const { size } = await stat(outPath);
    console.log(`ok  ${out}  ${(size / 1024).toFixed(0)} KB`);
    ok++;
  } catch (err) {
    failures.push({ out, message: err.message });
    console.error(`FAIL ${out}: ${err.message}`);
  }
}

console.log(`\n${ok}/${entries.length} converted${failures.length ? `, ${failures.length} FAILED` : ''}`);
if (failures.length) process.exit(1);

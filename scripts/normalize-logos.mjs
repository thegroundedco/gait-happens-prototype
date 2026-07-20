import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_DIR = path.join(__dirname, '..', 'public', 'images', 'logos');

// Mirror LogoWall.astro's displayHeight so the printout previews the result.
const TARGET_AREA = 7000, MIN_H = 28, MAX_H = 56;
const displayHeight = (w, h) =>
  Math.round(Math.min(MAX_H, Math.max(MIN_H, Math.sqrt(TARGET_AREA / (w / h)))));

const files = readdirSync(LOGO_DIR).filter((f) => f.endsWith('.png')).sort();
const rows = [];
for (const file of files) {
  const p = path.join(LOGO_DIR, file);
  // Read + trim fully into a buffer BEFORE writing back to the same path
  // (no concurrent read/write). trim() crops the uniform (transparent) border
  // to the content bounding box; threshold tolerates anti-aliased edges.
  // Idempotent: a trimmed image has content edge-to-edge, so a 2nd run finds
  // no border to remove and the dimensions are unchanged.
  const out = await sharp(p).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  await sharp(out.data).toFile(p);
  rows.push({ file, w: out.info.width, h: out.info.height });
}

console.log('Trimmed logo dimensions (paste width/height into pressLogos):\n');
for (const r of rows) {
  console.log(
    `  ${r.file.padEnd(26)} width: ${String(r.w).padEnd(4)} height: ${String(r.h).padEnd(4)} -> displayHeight ${displayHeight(r.w, r.h)}px`,
  );
}

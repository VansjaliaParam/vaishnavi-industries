// Re-encode full-resolution product photos into web-optimized versions.
//
// Reads originals from /_original-photos (gitignored, full print resolution)
// and writes optimized JPEGs under /public.
//
// Files at the root of _original-photos land in /public/catalog. Files in a
// subfolder land in /public/<subfolder> — so _original-photos/founders/*
// becomes /public/founders/*, and _original-photos/series/* becomes
// /public/series/*. Output names are always lowercased, because Vercel's
// filesystem is case-sensitive and Windows' is not: an "opula.JPG" that
// resolves fine locally 404s in production.
//
// Max 1600px on the long edge (≈2× the largest on-screen size, retina-crisp),
// mozjpeg quality 82, EXIF orientation baked in, metadata stripped.
//
// Usage: node scripts/optimize-images.mjs [subfolder]
//
// With no argument every original is re-encoded. Pass a subfolder name to
// process only that one (e.g. `npm run optimize-images -- series`), which
// keeps a one-folder change from rewriting all the other JPEGs.

import { readdir, mkdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const SRC = "_original-photos";
const ROOT_OUT = "public/catalog";
const MAX_EDGE = 1600;
const QUALITY = 82;

const fmt = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const isImage = (f) => /\.(jpe?g|png)$/i.test(f);

/** Every image under SRC, paired with the public folder it belongs in. */
async function collect(only) {
  const jobs = [];
  for (const entry of await readdir(SRC, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (only && entry.name !== only) continue;
      const dir = join(SRC, entry.name);
      for (const file of (await readdir(dir)).filter(isImage)) {
        jobs.push({ src: join(dir, file), outDir: `public/${entry.name}`, file });
      }
    } else if (isImage(entry.name) && !only) {
      jobs.push({ src: join(SRC, entry.name), outDir: ROOT_OUT, file: entry.name });
    }
  }
  return jobs;
}

async function run() {
  const only = process.argv[2];
  const jobs = await collect(only);

  if (only && jobs.length === 0) {
    console.error(`No images found in ${join(SRC, only)}`);
    process.exit(1);
  }

  let inTotal = 0;
  let outTotal = 0;

  for (const { src, outDir, file } of jobs) {
    await mkdir(outDir, { recursive: true });
    const out = join(outDir, `${basename(file, extname(file)).toLowerCase()}.jpg`);

    const inSize = (await stat(src)).size;
    inTotal += inSize;

    await sharp(src)
      .rotate() // apply EXIF orientation before stripping metadata
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);

    const outSize = (await stat(out)).size;
    outTotal += outSize;

    console.log(`${out.padEnd(34)} ${fmt(inSize).padStart(10)} -> ${fmt(outSize).padStart(9)}`);
  }

  console.log(
    `\n${jobs.length} images: ${fmt(inTotal)} -> ${fmt(outTotal)} ` +
      `(${((1 - outTotal / inTotal) * 100).toFixed(1)}% smaller)`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

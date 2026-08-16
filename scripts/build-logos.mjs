// Derive every web logo asset from the two brand originals.
//
// Reads the print-resolution masters from /_original-photos/logos (gitignored)
// and writes the web-sized versions the app actually imports:
//
//   public/logo-mark.png        the "half" mark, trimmed, for the navbar
//   public/logo-full-light.png  the "full" lockup recoloured for the dark footer
//   src/app/icon.png            favicon (Next's `icon` file convention)
//   src/app/apple-icon.png      iOS home-screen icon, on a solid dark plate
//   src/app/favicon.ico         16/32/48 for /favicon.ico requests
//
// The full lockup is drawn for white paper: black "VISHU / EXCLUSIVE HARDWARE
// FITTINGS" type and a soft grey drop shadow under the mark. The footer is dark
// in both themes, so `forDarkBackground` repaints the neutral (unsaturated) ink
// to the footer's text colour and erases the grey shadow, while leaving the
// teal, red and white of the mark itself untouched.
//
// Usage: node scripts/build-logos.mjs   (or: npm run build-logos)

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const SRC_MARK = "_original-photos/logos/vishu-logo-half.png";
const SRC_FULL = "_original-photos/logos/vishu-logo-full.png";

const MARK_HEIGHT = 256; // navbar renders it at 32-36px, so this is ~7x
const FULL_WIDTH = 520; // footer renders it at ~170px wide
const ICON_SIZE = 512;
const APPLE_SIZE = 180;
const ICO_SIZES = [16, 32, 48];

const INK_ON_DARK = [244, 241, 234]; // --text in the dark theme (#F4F1EA)
const APPLE_PLATE = { r: 12, g: 12, b: 13, alpha: 1 }; // --bg in the dark theme (#0C0C0D)

// The artwork is a handful of flat colours, so a quantised palette is visually
// identical at these sizes and a fraction of the bytes.
const png = (img) => img.png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 });

/** Tightest box holding real pixels, ignoring stray near-transparent noise. */
async function alphaBounds(file, { alpha = 64, minPerLine = 3 } = {}) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const rows = new Array(height).fill(0);
  const cols = new Array(width).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] >= alpha) {
        rows[y]++;
        cols[x]++;
      }
    }
  }

  const first = (line) => line.findIndex((n) => n >= minPerLine);
  const last = (line) => line.length - 1 - [...line].reverse().findIndex((n) => n >= minPerLine);
  const top = first(rows);
  const left = first(cols);

  return { left, top, width: last(cols) - left + 1, height: last(rows) - top + 1 };
}

/** The mark on its own, cropped to the artwork. */
async function trimmedMark() {
  const box = await alphaBounds(SRC_MARK);
  return sharp(SRC_MARK).extract(box);
}

/**
 * Repaint the lockup for a dark background: neutral dark ink (type, rules, the
 * ® circle) becomes the footer's off-white, mid greys (the drop shadow) are
 * erased, and anything saturated or already white is left alone.
 */
async function forDarkBackground(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    if (data[i + 3] < 8) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    if (max - Math.min(r, g, b) >= 30) continue; // teal + red stay as drawn

    if (max <= 150) {
      [data[i], data[i + 1], data[i + 2]] = INK_ON_DARK; // black type -> off-white
    } else if (max <= 250) {
      data[i + 3] = 0; // grey drop shadow -> gone
    }
  }

  return sharp(data, { raw: { width, height, channels } });
}

async function write(file, buffer) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buffer);
  console.log(`${file.padEnd(28)} ${(buffer.length / 1024).toFixed(1)} KB`);
}

/**
 * The mark centred on a transparent square, with a little breathing room.
 * The mark is resized before it is composited: sharp resizes the canvas first
 * otherwise, and a full-size overlay on a shrunken canvas throws.
 */
async function squareIcon(size, scale = 0.92) {
  const mark = await (await trimmedMark())
    .resize({
      width: Math.round(size * scale),
      height: Math.round(size * scale),
      fit: "inside",
    })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: mark, gravity: "center" }]);
}

async function run() {
  await write(
    "public/logo-mark.png",
    await png((await trimmedMark()).resize({ height: MARK_HEIGHT })).toBuffer()
  );

  await write(
    "public/logo-full-light.png",
    await png((await forDarkBackground(SRC_FULL)).resize({ width: FULL_WIDTH })).toBuffer()
  );

  await write("src/app/icon.png", await png(await squareIcon(ICON_SIZE)).toBuffer());

  await write(
    "src/app/apple-icon.png",
    await png(
      sharp({
        create: {
          width: APPLE_SIZE,
          height: APPLE_SIZE,
          channels: 4,
          background: APPLE_PLATE,
        },
      }).composite([
        { input: await png(await squareIcon(APPLE_SIZE, 0.76)).toBuffer(), gravity: "center" },
      ])
    ).toBuffer()
  );

  await write("src/app/favicon.ico", await ico(ICO_SIZES));
}

/**
 * A .ico wrapping one PNG per size - the container every browser since IE11
 * understands, and the only encoder we need since sharp writes the PNGs.
 */
async function ico(sizes) {
  const images = [];
  for (const size of sizes) {
    images.push(await png(await squareIcon(size)).toBuffer());
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;
  const entries = images.map((image, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0); // width  (0 means 256)
    entry.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images]);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

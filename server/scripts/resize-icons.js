/**
 * One-shot migration: resize base64 data-URL icons in the `agents` table
 * down to 96x96 WebP. Safe to re-run — tiny/already-small icons are skipped.
 *
 * Run against the live DB (DATABASE_URL must be set):
 *   node scripts/resize-icons.js
 */
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');

const prisma = new PrismaClient();

const TARGET_SIZE = 96;
const SKIP_UNDER_BYTES = 8 * 1024; // don't bother if already <= 8KB

function parseDataUrl(url) {
  const m = /^data:([^;]+);base64,(.+)$/.exec(url);
  if (!m) return null;
  return { mime: m[1], base64: m[2] };
}

async function main() {
  const agents = await prisma.agent.findMany({
    select: { id: true, name: true, icon_url: true },
  });

  let totalBefore = 0;
  let totalAfter = 0;
  let resized = 0;
  let skipped = 0;

  for (const agent of agents) {
    const url = agent.icon_url;
    if (!url) {
      skipped++;
      continue;
    }

    totalBefore += url.length;

    const parsed = parseDataUrl(url);
    if (!parsed) {
      console.log(`  skip (not a data URL): ${agent.name}`);
      totalAfter += url.length;
      skipped++;
      continue;
    }

    if (parsed.mime === 'image/svg+xml') {
      console.log(`  skip (svg): ${agent.name}`);
      totalAfter += url.length;
      skipped++;
      continue;
    }

    const inputBuf = Buffer.from(parsed.base64, 'base64');
    if (inputBuf.length <= SKIP_UNDER_BYTES) {
      console.log(`  skip (already small, ${inputBuf.length}B): ${agent.name}`);
      totalAfter += url.length;
      skipped++;
      continue;
    }

    try {
      const outBuf = await sharp(inputBuf)
        .resize(TARGET_SIZE, TARGET_SIZE, { fit: 'cover' })
        .webp({ quality: 82 })
        .toBuffer();

      const newUrl = `data:image/webp;base64,${outBuf.toString('base64')}`;

      await prisma.agent.update({
        where: { id: agent.id },
        data: { icon_url: newUrl },
      });

      totalAfter += newUrl.length;
      resized++;
      console.log(
        `  resized: ${agent.name}  ${url.length} -> ${newUrl.length} bytes  (${(
          (1 - newUrl.length / url.length) *
          100
        ).toFixed(1)}% smaller)`
      );
    } catch (err) {
      console.error(`  FAILED: ${agent.name}:`, err.message);
      totalAfter += url.length;
      skipped++;
    }
  }

  console.log('\n--- summary ---');
  console.log(`agents:   ${agents.length}`);
  console.log(`resized:  ${resized}`);
  console.log(`skipped:  ${skipped}`);
  console.log(`before:   ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`after:    ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

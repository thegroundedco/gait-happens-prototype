import { spawn } from 'node:child_process';
import { LinkChecker } from 'linkinator';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

const preview = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
  stdio: 'ignore', shell: true,
});

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { await fetch(url); return; } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('preview server did not start');
}

try {
  await waitForServer(BASE);
  const checker = new LinkChecker();
  const result = await checker.check({ path: BASE, recurse: true });
  const broken = result.links.filter(l => l.state === 'BROKEN');
  if (broken.length) {
    console.error(`\n${broken.length} BROKEN links:`);
    for (const b of broken) console.error(`  ${b.status}  ${b.url}  (on ${b.parent})`);
    process.exitCode = 1;
  } else {
    console.log(`OK — ${result.links.length} links checked, 0 broken.`);
  }
} finally {
  try {
    if (process.platform === 'win32' && preview.pid) {
      const { spawnSync } = await import('node:child_process');
      spawnSync('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      preview.kill();
    }
  } catch { /* best-effort teardown */ }
}

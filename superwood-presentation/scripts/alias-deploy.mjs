#!/usr/bin/env node
// Deploy with the Vercel CLI and alias the result. The CLI now prints a JSON
// document to a non-TTY stdout (and a bare URL to a TTY), so the old
// `$(cat /tmp/url)` shell trick fed garbage to `vercel alias`. This parses both.
// Usage: node scripts/alias-deploy.mjs <alias-host> [extra `vercel deploy` args]
import { execFileSync } from 'node:child_process';

const [alias, ...extra] = process.argv.slice(2);
if (!alias) {
  console.error('usage: node scripts/alias-deploy.mjs <alias-host> [vercel deploy args]');
  process.exit(2);
}

const out = execFileSync('vercel', ['deploy', '--yes', '--scope', 'inventwood', ...extra], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
}).trim();

let url = null;
try {
  url = JSON.parse(out).deployment.url;
} catch {
  const lines = out.split('\n').map(l => l.trim()).filter(l => /^https:\/\/\S+$/.test(l));
  url = lines.pop() || null;
}
if (!url) {
  console.error('alias-deploy: could not find a deployment URL in vercel output');
  process.exit(1);
}
execFileSync('vercel', ['alias', 'set', url, alias, '--scope', 'inventwood'], { stdio: 'inherit' });
console.log(`▲ Aliased https://${alias} → ${url}`);

import * as esbuild from 'esbuild';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function getFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e =>
    e.isDirectory() ? getFiles(join(dir, e.name)) : [join(dir, e.name)]
  );
}

const entryPoints = getFiles('src').filter(f => f.endsWith('.ts'));

await esbuild.build({
  entryPoints,
  bundle: false,
  outdir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  packages: 'external',
});

console.log('Build complete');

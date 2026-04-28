import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/tracker.iife.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
});

console.log('Tracking script built successfully');

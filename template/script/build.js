#!/usr/bin/env node

/* eslint-disable */
const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');
const path = require('path');

esbuild.build({
  logLevel: 'info',
  platform: 'node',
  target: 'node10.4',
  entryPoints: [path.resolve(__dirname, '..', 'src/index.ts')],
  outdir: 'dist',
  bundle: true,
  tsconfig: path.resolve(__dirname, '..', 'tsconfig.json'),
  plugins: [
    alias({
      '@': path.resolve(__dirname, '..', 'src')
    }),
  ],
  sourcemap: !(process.env.NODE_ENV === 'production')
}).catch((err) => {
  console.log(err);
  process.exit(1)
})

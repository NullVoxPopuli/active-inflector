#!/bin/bash


pnpm esbuild src/index.ts --outfile=dist/index.js \
  --bundle \
  --sourcemap \
  --external:capital-case \
  --format=esm $@


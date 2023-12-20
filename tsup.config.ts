import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/'],
  outDir: 'dist/lib',
	splitting: false,
	sourcemap: true,
	dts: true,
	name: 'fonzi2',
	clean: true,
	treeshake: true,
	format: ['esm', 'cjs'],
});

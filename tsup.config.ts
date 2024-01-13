import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/'],
	outDir: 'dist/',
	splitting: false,
	sourcemap: true,
	dts: true,
	name: 'fonzi2',
	clean: true,
	treeshake: true,
	format: ['esm', 'cjs'],
	loader: {
		'.json': 'copy',
	},
});

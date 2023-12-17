import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/'],
	splitting: false,
	sourcemap: true,
	dts: true,
	name: 'fonzi2',
	clean: true,
	treeshake: true,
	format: ['esm', 'cjs'],
});

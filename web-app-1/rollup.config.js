import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: 'esm',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: { dev: !production },
    }),
    css({ output: 'bundle.css' }),
    resolve({ browser: true, dedupe: ['svelte'] }),
    typescript({ sourceMap: !production, inlineSources: !production }),
    production && terser(),
  ],
  watch: { clearScreen: false },
}

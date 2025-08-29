import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: './index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'BottleMonitor',
      sourcemap: false,
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: false,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: '../../tsconfig.sdk.json',
      useTsconfigDeclarationDir: true,
    }),
    copy({
      targets: [
        { src: '../../README.md', dest: 'dist' },
        { src: '../../README-zh.md', dest: 'dist' },
        { src: './package.json', dest: 'dist' },
      ],
    }),
  ],
  external: [],
}

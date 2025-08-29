import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: './index.ts',
  output: [
    {
      file: 'sdk/dist/index.js',
      format: 'umd',
      name: 'BottleMonitor',
      sourcemap: false,
    },
    {
      file: 'sdk/dist/index.cjs.js',
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: 'sdk/dist/index.esm.js',
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
        { src: '../../README.md', dest: 'sdk' },
        { src: '../../README-zh.md', dest: 'sdk' },
        { src: './package.json', dest: 'sdk' },
      ],
    }),
  ],
  external: [],
}

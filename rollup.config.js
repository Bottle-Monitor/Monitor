import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const inputFile = 'packages/core/index.ts'

export default {
  input: inputFile,
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'BottleMonitor', // 全局变量名
      sourcemap: true
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // 支持 node_modules 引入
    commonjs(), // 支持 CommonJS
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true
    })
  ],
  external: [], // 依赖的外部库，可以放在这里避免打包
}
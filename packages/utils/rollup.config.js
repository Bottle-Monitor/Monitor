import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig([
  // 主构建
  {
    input: 'index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['ua-parser-js', '@bottle-monitor/types'],
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true,
      }),
      isProduction && terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      }),
    ].filter(Boolean),
  },
  // 类型定义构建
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    external: ['ua-parser-js', '@bottle-monitor/types'],
    plugins: [dts()],
  },
])

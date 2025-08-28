import fs from 'node:fs'
import path, { dirname } from 'node:path'

import { fileURLToPath } from 'node:url'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

// 获取当前文件路径和目录路径（ES模块兼容方式）
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 判断是否为打包子包模式
const isPackageMode = process.env.BUILD_MODE === 'package'

// 基础配置
const baseConfig = {
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
  ],
}

let exportConfig

if (!isPackageMode) {
  exportConfig = {
    ...baseConfig,
    input: 'packages/core/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'BottleMonitor',
        sourcemap: true,
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
    external: ['ua-parser-js'],
  }
}
else {
  const packagesDir = path.resolve(__dirname, 'packages')
  const packageConfigs = []

  fs.readdirSync(packagesDir)
    .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory())
    .forEach((pkgName) => {
      const pkgPath = path.join(packagesDir, pkgName)

      let external = []

      if (pkgName === 'core' || pkgName === 'plugins') {
        external = ['ua-parser-js']
        if (pkgName === 'plugins') {
          external.push('error-stack-parser', 'nanoid')
        }
      }

      packageConfigs.push({
        ...baseConfig,
        input: path.join(pkgPath, 'index.ts'),
        output: [
          {
            file: path.join(pkgPath, 'dist', 'index.js'),
            format: 'umd',
            name: `BottleMonitor${pkgName.charAt(0).toUpperCase() + pkgName.slice(1)}`,
            sourcemap: true,
          },
          {
            file: path.join(pkgPath, 'dist', 'index.cjs.js'),
            format: 'cjs',
            sourcemap: true,
          },
          {
            file: path.join(pkgPath, 'dist', 'index.esm.js'),
            format: 'esm',
            sourcemap: true,
          },
        ],
        external,
      })
    })

  exportConfig = packageConfigs
}

export default exportConfig

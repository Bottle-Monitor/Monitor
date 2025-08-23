#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let targetDirName = 'public'
process.argv.forEach((arg) => {
    if (arg.startsWith('--dir=')) {
        targetDirName = arg.replace('--dir=', '')
    }
})

const src = path.resolve(__dirname, './sw.js')

const targetDir = path.resolve(process.cwd(), targetDirName)
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

const target = path.join(targetDir, 'sw.js')

if (!fs.existsSync(target)) {
    fs.copyFileSync(src, target)
    console.log(`sw.js 已写入用户项目 ${targetDirName} 文件夹`)
} else {
    console.log(`用户项目 ${targetDirName}/sw.js 已存在，跳过`)
}

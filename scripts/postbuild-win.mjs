/**
 * Windows 构建后脚本
 * 将 unpacked 输出压缩为 zip 便携包
 * 使用 archiver（纯 JS，无外部依赖）
 */

import { createWriteStream, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ZipArchive } from 'archiver'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const version = process.env.npm_package_version || '0.0.3'
const name = 'wuzi2do'

function getUnpackedDirs() {
  const dist = resolve(root, 'dist')
  if (!existsSync(dist)) return []

  return readdirSync(dist).filter((entry) => {
    return entry.startsWith('win-') && !entry.includes('.')
  })
}

function archName(dirEntry) {
  const arch = dirEntry.includes('ia32') ? 'ia32' : 'x64'
  return `${name}-${version}-win-${arch}-portable-beta.zip`
}

async function packDir(inputDir, outputFile) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputFile)
    const archive = new ZipArchive({
      zlib: { level: 9 } // Sets the compression level.
    })

    output.on('close', () => {
      console.log(
        `[postbuild] 完成: ${outputFile} (${(archive.pointer() / 1024 / 1024).toFixed(1)} MB)`
      )
      resolve()
    })

    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.directory(inputDir, false)
    archive.finalize()
  })
}

async function main() {
  const dirs = getUnpackedDirs()
  if (dirs.length === 0) {
    console.log('[postbuild] 未找到 unpacked 目录，跳过打包')
    return
  }

  for (const dirEntry of dirs) {
    const inputDir = resolve(root, 'dist', dirEntry)
    const outputName = archName(dirEntry)
    const outputFile = resolve(root, 'dist', outputName)

    console.log(`[postbuild] 打包 zip: ${dirEntry} → ${outputName}`)
    await packDir(inputDir, outputFile)
  }
}

main().catch((err) => {
  console.error('[postbuild] 错误:', err.message)
  process.exit(1)
})

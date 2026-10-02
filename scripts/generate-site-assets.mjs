import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'docs/public')
const shareDir = path.join(publicDir, 'social')
const designDir = path.join(root, 'design')
const heroCharacterSource = path.join(designDir, 'vibe-guide-character.png')
const shareSceneSource = path.join(designDir, 'vibe-guide-share-scene.png')
const mascotOutput = path.join(publicDir, 'images', 'vibe-guide.webp')

await mkdir(shareDir, { recursive: true })
await mkdir(path.dirname(mascotOutput), { recursive: true })

const width = 1200
const height = 630
const textLayer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><linearGradient id="wash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f5f9ff" stop-opacity=".98"/><stop offset=".52" stop-color="#f5f9ff" stop-opacity=".94"/><stop offset=".68" stop-color="#f5f9ff" stop-opacity=".36"/><stop offset=".8" stop-color="#f5f9ff" stop-opacity="0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#wash)"/>
  <text x="82" y="96" font-family="Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, sans-serif" font-size="27" font-weight="700" fill="#2451d8">布吉岛 Vibe 教程</text>
  <rect x="82" y="122" width="78" height="6" rx="3" fill="#4d80cf"/>
  <text x="80" y="249" font-family="Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, sans-serif" font-size="54" font-weight="750" letter-spacing="-2" fill="#12233e"><tspan x="80" dy="0">看见效果，</tspan><tspan x="80" dy="66">再学会怎么说。</tspan></text>
  <text x="83" y="414" font-family="Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, sans-serif" font-size="24" font-weight="400" fill="#53647d">从下拉框、抽屉开始，把界面需求说清楚。</text>
</svg>`)

await sharp(heroCharacterSource)
  .resize({ width: 640, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(mascotOutput)

await sharp(shareSceneSource)
  .resize(width, height, { fit: 'cover', position: 'attention' })
  .composite([{ input: textLayer }])
  .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toFile(path.join(shareDir, 'default-share.jpg'))

await sharp(path.join(publicDir, 'favicon.svg'))
  .resize(128, 128)
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, 'favicon.png'))

console.log('Generated optimized mascot, 1200×630 Open Graph JPEG, and 128×128 PNG favicon.')

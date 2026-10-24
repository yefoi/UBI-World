import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Resvg } from '@resvg/resvg-js'

const source = join(process.cwd(), 'public', 'og.svg')
const target = join(process.cwd(), 'public', 'og.png')

const svg = readFileSync(source, 'utf8')
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#0b1220',
})

const png = resvg.render().asPng()
writeFileSync(target, png)
console.log(`Open Graph image generated: ${target} (${png.length} bytes)`)

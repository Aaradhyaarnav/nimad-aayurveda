// Build for GitHub Pages under /<repo>/ : vite base + rewrite the absolute asset paths used in code.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const repo = process.argv[2] || 'nimad-aayurveda'
const base = `/${repo}/`
execSync(`npx vite build --base=${base}`, { stdio: 'inherit' })
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
for (const f of walk('dist').filter((f) => /\.(js|css|html)$/.test(f))) {
  const s = fs.readFileSync(f, 'utf8')
  const out = s.replace(/(["'`(])\/(img|seq|models|favicon\.svg)/g, `$1${base}$2`)
  if (out !== s) fs.writeFileSync(f, out)
}
fs.writeFileSync('dist/.nojekyll', '')
fs.copyFileSync('dist/index.html', 'dist/404.html')
console.log('pages build ready for', base)

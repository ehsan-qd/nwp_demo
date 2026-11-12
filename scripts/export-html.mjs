import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = path.join(ROOT, 'exports', 'nwp-forward-deployment.html')
const sourceDirectory = 'src/components/operations/'
const modules = new Map()

const read = relative => readFile(path.join(ROOT, relative), 'utf8')
const dataUrl = async (relative, type) => `data:${type};base64,${(await readFile(path.join(ROOT, relative))).toString('base64')}`

// Keep the existing component tree and production React runtime inside the file.
// The browser does not need npm, Next.js, a server, or a network connection.
const runtimeFiles = {
  react: 'node_modules/react/cjs/react.production.js',
  'react/jsx-runtime': 'node_modules/react/cjs/react-jsx-runtime.production.js',
  'react-dom': 'node_modules/react-dom/cjs/react-dom.production.js',
  'react-dom/client': 'node_modules/react-dom/cjs/react-dom-client.production.js',
  scheduler: 'node_modules/scheduler/cjs/scheduler.production.js',
}
for (const [name, filename] of Object.entries(runtimeFiles)) modules.set(name, await read(filename))

const stylesheet = await read(`${sourceDirectory}operations.module.css`)
const classNames = [...new Set([...stylesheet.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(match => match[1]))]
modules.set('styles', `module.exports = ${JSON.stringify(Object.fromEntries(classNames.map(name => [name, name])))};`)
modules.set('wards', `module.exports = ${await read(`${sourceDirectory}wards.json`)};`)

const logos = {
  quantum: await dataUrl('public/images/quantum-dice-mark.png', 'image/png'),
  police: await dataUrl('public/images/north-wales-police-crest.png', 'image/png'),
}
modules.set('brand', `
const React = require('react');
exports.QuantumDiceWordmark = function({className = '', markClassName = ''}) {
  return React.createElement('div', {className: 'brandQuantum ' + className},
    React.createElement('img', {src: ${JSON.stringify(logos.quantum)}, alt: 'Quantum Dice', width: 4050, height: 1386, className: markClassName}));
};
exports.NWPWordmark = function({className = '', crestClassName = ''}) {
  return React.createElement('div', {className: 'brandPolice ' + className},
    React.createElement('img', {src: ${JSON.stringify(logos.police)}, alt: 'North Wales Police', width: 1418, height: 710, className: crestClassName}));
};
`)

const sourceFiles = {
  workspace: `${sourceDirectory}DeploymentWorkspace.tsx`,
  map: `${sourceDirectory}DeploymentMap.tsx`,
  model: `${sourceDirectory}model.ts`,
  icon: `${sourceDirectory}Icon.tsx`,
  schedule: 'src/components/ui/ScheduleHeatmap.tsx',
}
const imports = {
  '@/components/BrandMark': 'brand',
  '@/components/ui/ScheduleHeatmap': 'schedule',
  './DeploymentMap': 'map',
  './Icon': 'icon',
  './model': 'model',
  './wards.json': 'wards',
  './operations.module.css': 'styles',
}

for (const [name, filename] of Object.entries(sourceFiles)) {
  const source = await read(filename)
  const result = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    reportDiagnostics: true,
  })
  const errors = result.diagnostics?.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error) ?? []
  if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
    getCurrentDirectory: () => ROOT, getCanonicalFileName: file => file, getNewLine: () => '\n',
  }))
  modules.set(name, result.outputText.replace(/require\((['"])([^'"]+)\1\)/g, (_match, _quote, dependency) => `require(${JSON.stringify(imports[dependency] ?? dependency)})`))
}

for (const [name, code] of modules) {
  for (const match of code.matchAll(/require\((['"])([^'"]+)\1\)/g)) {
    if (!modules.has(match[2])) throw new Error(`Unbundled dependency in ${name}: ${match[2]}`)
  }
}

// Reuse the font faces from the existing build, including Welsh characters.
// Build artifacts are needed only when regenerating the export.
const cssDirectory = path.join(ROOT, '.next/static/chunks')
let cssFiles
try { cssFiles = (await readdir(cssDirectory)).filter(file => file.endsWith('.css')).sort() }
catch { throw new Error('Run npm run build once to prepare the embedded fonts, then retry npm run export:html.') }
const fontFaces = new Set()
for (const file of cssFiles) {
  const css = await readFile(path.join(cssDirectory, file), 'utf8')
  for (const match of css.matchAll(/@font-face\{[^}]+\}/g)) {
    if (!/font-family:(?:"?Instrument Sans"?|"?Lora"?);/.test(match[0]) || !match[0].includes('src:url(')) continue
    let face = match[0]
    for (const asset of face.matchAll(/url\(([^)]+)\)/g)) {
      const relative = asset[1].replace(/^['"]|['"]$/g, '')
      const bytes = await readFile(path.resolve(cssDirectory, relative))
      face = face.replace(asset[0], `url(data:font/woff2;base64,${bytes.toString('base64')})`)
    }
    fontFaces.add(face)
  }
}
if (!fontFaces.size || ![...fontFaces].some(face => face.includes('font-family:Lora;')) || ![...fontFaces].some(face => face.includes('font-family:Instrument Sans;'))) {
  throw new Error('Both Instrument Sans and Lora font faces are required. Run npm run build to refresh the font assets.')
}

const resetCss = `
*,::before,::after {box-sizing:border-box;margin:0;padding:0;border:0 solid}
html {line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;-webkit-tap-highlight-color:transparent}
body {margin:0;overflow:hidden;background:#080b0e;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
:root {--font-instrument-sans:'Instrument Sans',Arial,sans-serif;--font-lora:'Lora',Georgia,serif;--state-available:#58B9DF;--state-busy:#E5716F;--state-resting:#8C8C8C}
h1,h2,h3,h4,h5,h6 {font-size:inherit;font-weight:inherit}
h1,h2,h3,h4,h5,h6,b,strong {font-family:var(--font-instrument-sans)}
b,strong {font-weight:bolder}
button,input,select,textarea {font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;background:transparent;border-radius:0;opacity:1}
button,input:where([type=button],[type=reset],[type=submit]) {appearance:button}
button,select {text-transform:none}
a {color:inherit;text-decoration:inherit}
table {text-indent:0;border-color:inherit;border-collapse:collapse}
img,svg,video,canvas {display:block;vertical-align:middle}
img,video {max-width:100%;height:auto}
.brandQuantum,.brandPolice {display:flex;align-items:center}
.brandPolice {background:rgba(255,255,255,.95);padding:4px 10px}
.brandLockup img {height:36px;width:auto;object-fit:contain}
.standaloneNoscript {padding:32px;color:#f8fafc;font:600 18px Arial,sans-serif}
`

const factories = [...modules].map(([name, code]) => `${JSON.stringify(name)}: function(module, exports, require) {\n${code}\n}`).join(',\n')
const javascript = `/* React, React DOM and Scheduler are bundled under their MIT licenses below. */
(function () {
'use strict';
const factories = {${factories}};
const cache = Object.create(null);
function require(name) {
  if (cache[name]) return cache[name].exports;
  if (!factories[name]) throw new Error('Missing embedded module: ' + name);
  const module = {exports: {}};
  cache[name] = module;
  factories[name](module, module.exports, require);
  return module.exports;
}
const React = require('react');
const {createRoot} = require('react-dom/client');
createRoot(document.getElementById('app')).render(React.createElement(require('workspace').default));
})();`
new Script(javascript, { filename: 'nwp-forward-deployment.embedded.js' })

const licenses = await Promise.all(['react', 'react-dom', 'scheduler'].map(async name => `${name}\n${await read(`node_modules/${name}/LICENSE`)}`))
const html = `<!doctype html>
<html lang="en" data-standalone="true">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="description" content="Offline forward deployment management prototype for North Wales Police and Quantum Dice. Illustrative scenario data.">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'">
<title>Forward Deployment | North Wales Police × Quantum Dice</title>
<style>${[...fontFaces].join('\n')}\n${resetCss}\n${stylesheet}</style>
</head>
<body>
<div id="app"></div>
<noscript><p class="standaloneNoscript">Enable JavaScript to use the interactive deployment prototype. No internet connection is required.</p></noscript>
<script>${javascript.replace(/<\/script/gi, '<\\/script')}</script>
<!-- Embedded runtime licenses\n${licenses.join('\n\n').replace(/-->/g, '--&gt;')}\n-->
</body>
</html>
`
if (/<(?:script|link|img)\b[^>]*\b(?:src|href)=["'](?!data:)/i.test(html) || /url\(\s*(?!data:)["']?(?:https?:|\.\.\/)/i.test(html)) {
  throw new Error('The HTML export contains a non-embedded asset reference.')
}
await mkdir(path.dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, html)
console.log(`Created ${OUTPUT}\n${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB · ${modules.size} embedded modules · ${fontFaces.size} embedded font faces · no external assets`)

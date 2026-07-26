import { packageExtension, bundleJs, replace } from '@lvce-editor/package-extension'
import { build } from 'esbuild'
import fs, { readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const restClientWorker = path.join(root, 'packages', 'rest-client-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })
fs.rmSync(join(extension, 'dist'), { recursive: true, force: true })
fs.rmSync(join(restClientWorker, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))
fs.mkdirSync(path.join(extension, 'dist'))
fs.mkdirSync(path.join(restClientWorker, 'dist'))

const packageJson = JSON.parse(readFileSync(join(extension, 'package.json')).toString())
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(join(root, 'dist', 'package.json'), JSON.stringify(packageJson, null, 2) + '\n')
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(root, 'LICENSE'), join(root, 'dist', 'LICENSE'))
fs.copyFileSync(join(extension, 'extension.json'), join(root, 'dist', 'extension.json'))
fs.cpSync(join(extension, 'media'), join(root, 'dist', 'media'), {
  recursive: true,
})

await bundleJs(
  join(restClientWorker, 'src', 'restClientWorkerMain.ts'),
  join(restClientWorker, 'dist', 'restClientWorkerMain.js'),
  false,
)
fs.cpSync(join(restClientWorker, 'dist'), join(root, 'dist', 'rest-client-worker', 'dist'), {
  recursive: true,
})

await build({
  bundle: true,
  entryPoints: [join(extension, 'src', 'restClientMain.ts')],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile: join(extension, 'dist', 'restClientMain.js'),
  platform: 'browser',
  target: 'esnext',
})
fs.cpSync(join(extension, 'dist'), join(root, 'dist', 'dist'), {
  recursive: true,
})

await replace({
  path: join(root, 'dist', 'extension.json'),
  occurrence: '../rest-client-worker/dist/restClientWorkerMain.js',
  replacement: './rest-client-worker/dist/restClientWorkerMain.js',
})

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})

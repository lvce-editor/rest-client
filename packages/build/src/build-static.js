import { cp, writeFile } from 'node:fs/promises'
import path, { join } from 'node:path'
import { root } from './root.js'
import { pathToFileURL } from 'node:url'

await import('./build.js')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

const sharedProcessPath = join(root, 'node_modules', '@lvce-editor', 'shared-process', 'index.js')
const sharedProcessUri = pathToFileURL(sharedProcessPath).toString()
const { exportStatic } = await import(sharedProcessUri)

const { commitHash } = await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

await cp(path.join(root, 'dist2'), path.join(root, 'dist', commitHash, 'extensions', 'builtin.rest-client'), {
  recursive: true,
  force: true,
})

const fileMapPath = join(root, 'dist', commitHash, 'config', 'fileMap.json')
await writeFile(fileMapPath, JSON.stringify(['/playground/index.rest']))
await writeFile(join(root, 'dist', commitHash, 'playground', 'index.rest'), `GET https://example.com`)

import { replace } from '@lvce-editor/package-extension'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
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

await replace({
  path: path.join(root, 'dist', commitHash, 'config', 'webExtensions.json'),
  occurrence: 'src/restClientMain.ts',
  replacement: 'dist/restClientMain.js',
})
await replace({
  path: path.join(root, 'dist', commitHash, 'config', 'webExtensions.json'),
  occurrence: '../rest-client-worker/src/restClientWorkerMain.ts',
  replacement: './rest-client-worker/dist/restClientWorkerMain.js',
})

await replace({
  path: path.join(root, 'dist', commitHash, 'config', 'extensions.json'),
  occurrence: 'src/restClientMain.ts',
  replacement: 'dist/restClientMain.js',
})
await replace({
  path: path.join(root, 'dist', commitHash, 'config', 'extensions.json'),
  occurrence: '../rest-client-worker/dist/restClientWorkerMain.js',
  replacement: './rest-client-worker/dist/restClientWorkerMain.js',
})
const pathPrefix = '/rest-client'
const webViewsPath = join(root, 'dist', commitHash, 'config', 'webViews.json')
const extensionJsonPath = join(root, 'dist', commitHash, 'extensions', 'builtin.rest-client', 'extension.json')
const extensionJsonContent = await readFile(extensionJsonPath, 'utf8')
const extensionJson = JSON.parse(extensionJsonContent)
extensionJson.webViews[0].path = `${commitHash}/extensions/${extensionJson.id}/${extensionJson.webViews[0].path}`
extensionJson.webViews[0].remotePath = `${pathPrefix}/${commitHash}/extensions/${extensionJson.id}`
await writeFile(webViewsPath, JSON.stringify(extensionJson.webViews, null, 2) + '\n')

const fileMapPath = join(root, 'dist', commitHash, 'config', 'fileMap.json')
await writeFile(fileMapPath, JSON.stringify(['/playground/index.rest']))
await writeFile(join(root, 'dist', commitHash, 'playground', 'index.rest'), `GET https://example.com`)

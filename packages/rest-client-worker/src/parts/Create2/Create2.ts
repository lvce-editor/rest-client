import * as Create from '../Create/Create.ts'
import { id } from '../Id/Id.ts'

export const create2 = async ({ port, savedState, webViewId, uri }) => {
  // TODO avoid global variable
  // @ts-ignore
  const rpc = globalThis.rpc
  const content = await rpc.invoke('WebView.readFile', uri)
  const [method, url] = content.split(' ')
  Create.create(id, port, method, uri)
  await port.invoke('initialize', method, url)
  return {}
}

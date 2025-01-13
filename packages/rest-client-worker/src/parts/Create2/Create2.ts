import * as Create from '../Create/Create.ts'
import { id } from '../Id/Id.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const create2 = async ({ port, savedState, webViewId, uri }) => {
  const content = await Rpc.invoke('WebView.readFile', uri)
  const [method, url] = content.split(' ')
  Create.create(id, port, method, uri)
  await port.invoke('initialize', method, url)
  return {}
}

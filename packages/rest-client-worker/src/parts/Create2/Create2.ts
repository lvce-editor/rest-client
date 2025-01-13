import * as Rpc from '../Rpc/Rpc.ts'

export const create2 = async ({ port, savedState, webViewId, uri }) => {
  const content = await Rpc.invoke('WebView.readFile', uri)
  const [method, url] = content.split(' ')
  await port.invoke('initialize', method, url)
  return {}
}

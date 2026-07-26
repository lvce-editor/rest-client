import * as Create from '../Create/Create.ts'
import { id } from '../Id/Id.ts'

const getInitialCode = (content: string) => {
  const [method, url] = content.split(' ')
  if (method && url) {
    return {
      method,
      url,
    }
  }
  return {
    method: 'GET',
    url: 'https://example.com',
  }
}

export const create2 = async ({ port, savedState, uri, webViewId }) => {
  // TODO avoid global variable
  // @ts-ignore
  const { rpc } = globalThis
  const content = await rpc.invoke('WebView.readFile', uri)
  const { method, url } = getInitialCode(content)
  Create.create(id, port, method, uri)
  await port.invoke('initialize', method, url)
  return {}
}

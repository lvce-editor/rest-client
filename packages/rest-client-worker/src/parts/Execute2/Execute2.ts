import * as Execute from '../Execute/Execute.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const execute2 = async (id: number) => {
  const { method, url, port } = WebViewStates.get(id)
  console.log({ method, url, port })
  const result = await Execute.execute(method, url)
  await port.invoke('setOutput', result)
}

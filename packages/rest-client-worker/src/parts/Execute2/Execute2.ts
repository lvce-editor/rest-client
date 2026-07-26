import * as Execute from '../Execute/Execute.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const execute2 = async (id: number) => {
  const { method, port, url } = WebViewStates.get(id)
  const result = await Execute.execute(method, url)
  await port.invoke('setOutput', result)
}

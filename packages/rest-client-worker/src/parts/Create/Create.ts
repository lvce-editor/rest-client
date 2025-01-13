import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number, port: MessagePort): void => {
  const webview: WebView = {
    port,
  }
  WebViewStates.set(id, webview)
}

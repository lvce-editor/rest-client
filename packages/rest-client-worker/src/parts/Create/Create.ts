import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number, port: MessagePort, method: string, url: string): void => {
  const webview: WebView = {
    port,
    method,
    url,
  }
  WebViewStates.set(id, webview)
}

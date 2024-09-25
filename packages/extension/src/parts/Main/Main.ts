import * as RestClientWorker from '../RestClientWorker/RestClientWorker.ts'

const webViewProvider = {
  id: 'builtin.rest-client',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)
    await webView.invoke('initialize', content)
    // @ts-ignore
    this.webView = webView
  },
  async open(uri, webView) {},
  commands: {
    async handleSubmit(method, url) {
      const result = await RestClientWorker.invoke('RestClient.execute', method, url)
      // @ts-ignore
      const webView = webViewProvider.webView
      await webView.invoke('setOutput', result)
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}

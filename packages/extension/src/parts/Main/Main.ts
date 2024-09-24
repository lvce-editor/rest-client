import * as RestClientWorker from '../RestClientWorker/RestClientWorker.ts'

const webViewProvider = {
  id: 'builtin.rest-client',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)
    await webView.invoke('initialize', content)
  },
  async open(uri, webView) {},
  commands: {
    async handleSubmit(text) {
      const result = await RestClientWorker.invoke('RestClient.execute', text)
      console.log({ result })
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}

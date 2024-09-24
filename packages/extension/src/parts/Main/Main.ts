const webViewProvider = {
  id: 'builtin.rest-client',
  async create(webView, uri) {
    await webView.invoke('initialize')
  },
  async open(uri, webView) {},
  commands: {
    async handleSubmit(text) {
      console.log({ text })
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}

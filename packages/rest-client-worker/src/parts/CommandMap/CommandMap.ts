import * as Execute from '../Execute/Execute.ts'
import * as Create2 from '../Create2/Create2.ts'

export const commandMap = {
  'RestClient.execute': Execute.execute,
  'Webview.create': Create2.create2,
}

import * as Create2 from '../Create2/Create2.ts'
import * as Execute2 from '../Execute2/Execute2.ts'
import * as Execute from '../Execute/Execute.ts'
import * as WrapCommand from '../WrapCommand/WrapCommand.ts'

const saveState = () => {
  return {}
}

export const commandMap = {
  // new
  handleSubmit: WrapCommand.wrapCommand(Execute2.execute2),
  // old
  'RestClient.execute': Execute.execute,
  'WebView.create': Create2.create2,

  'WebView.saveState': saveState,
}

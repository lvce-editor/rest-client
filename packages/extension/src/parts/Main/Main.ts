import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'
import { view } from '../RestClientView/RestClientView.ts'
import { dispose as disposeWorker } from '../RestClientWorker/RestClientWorker.ts'

const state: {
  viewDisposable: { dispose: () => void } | undefined
} = {
  viewDisposable: undefined,
}

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  state.viewDisposable = registerView(view)
}

export const deactivate = async (): Promise<void> => {
  state.viewDisposable?.dispose()
  state.viewDisposable = undefined
  await disposeWorker()
}

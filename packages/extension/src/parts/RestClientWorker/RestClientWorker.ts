import { createRpc } from '@lvce-editor/api'

export interface RestClientResponse {
  readonly serializedHeaders: readonly {
    readonly key: string
    readonly value: string
  }[]
  readonly status: number
  readonly statusText: string
  readonly text: string
}

const state: {
  rpcPromise: ReturnType<typeof createRpc> | undefined
} = {
  rpcPromise: undefined,
}

const getRpc = (): ReturnType<typeof createRpc> => {
  state.rpcPromise ||= createRpc({
    name: 'REST Client Worker',
    url: new URL('restClientWorkerMain.js', import.meta.url).href,
  })
  return state.rpcPromise
}

export const executeRequest = async (method: string, url: string): Promise<RestClientResponse> => {
  const rpc = await getRpc()
  return rpc.invoke('RestClient.execute', method, url)
}

export const dispose = async (): Promise<void> => {
  const { rpcPromise } = state
  state.rpcPromise = undefined
  if (!rpcPromise) {
    return
  }
  const rpc = await rpcPromise
  await rpc.dispose()
}

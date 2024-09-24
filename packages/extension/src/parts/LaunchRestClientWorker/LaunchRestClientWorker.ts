import * as RestClientWorkerUrl from '../RestClientWorkerUrl/RestClientWorkerUrl.ts'

const execute = (method, ...params) => {
  return {}
}

export const launchRestClientWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: RestClientWorkerUrl.restClientWorkerUrl,
    name: 'Rest Client Worker',
    execute,
  })
  return rpc
}

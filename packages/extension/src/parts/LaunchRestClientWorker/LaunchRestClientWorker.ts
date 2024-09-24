import * as HeapSnapshotWorkerUrl from '../RestClientWorkerUrl/RestClientWorkerUrl.ts'

const execute = (method, ...params) => {
  return {}
}

export const launchResrClientWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: HeapSnapshotWorkerUrl.heapSnapshotWorkerUrl,
    name: 'Rest Client Worker',
    execute,
  })
  return rpc
}

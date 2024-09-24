import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.ts'
import * as LaunchHeapSnapshotWorker from '../LaunchRestClientWorker/LaunchRestClientWorker.ts'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchHeapSnapshotWorker.launchHeapSnapshotWorker)

export { invoke }

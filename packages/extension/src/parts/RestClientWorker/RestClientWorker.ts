import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.ts'
import * as LaunchRestClientWorker from '../LaunchRestClientWorker/LaunchRestClientWorker.ts'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchRestClientWorker.launchRestClientWorker)

export { invoke }

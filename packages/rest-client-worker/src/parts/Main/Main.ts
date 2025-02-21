import { listen, commandMap } from '@lvce-editor/extension-host-sub-worker/api'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const main = async () => {
  await listen({ ...commandMap, ...CommandMap.commandMap })
}

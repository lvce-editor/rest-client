import type { View } from '@lvce-editor/api'
import { createInstance, type RestClientViewInstance } from './CreateInstance.ts'

export const viewId = 'builtin.rest-client'

export const view: View<RestClientViewInstance> = {
  create: createInstance,
  displayName: 'REST Client',
  id: viewId,
  kind: 'virtualDom',
  title: 'REST Client',
}

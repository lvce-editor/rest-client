import { readFile, type ViewContext, type ViewEvent, type VirtualDomViewInstance } from '@lvce-editor/api'
import { VirtualDomElements, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { executeRequest, type RestClientResponse } from '../RestClientWorker/RestClientWorker.ts'
import * as Dom from '../VirtualDom/VirtualDom.ts'

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

interface RestClientViewContext extends ViewContext {
  readonly uri?: string
}

interface SavedState {
  readonly method?: unknown
  readonly uri?: unknown
  readonly url?: unknown
}

interface RestClientState {
  error: string
  loading: boolean
  method: string
  response: RestClientResponse | undefined
  url: string
}

export interface RestClientViewInstance extends VirtualDomViewInstance {
  readonly handleEvent: (event: Readonly<ViewEvent>) => Promise<void>
  readonly render: () => readonly VirtualDomNode[]
  readonly renderTitle: () => string
  readonly saveState: () => SavedState
}

interface Dependencies {
  readonly executeRequest: typeof executeRequest
  readonly readFile: typeof readFile
}

const defaultDependencies: Dependencies = {
  executeRequest,
  readFile,
}

const getSavedState = (context: RestClientViewContext | undefined): SavedState => {
  if (!context?.state || typeof context.state !== 'object') {
    return {}
  }
  return context.state
}

const getUri = (context: RestClientViewContext | undefined, savedState: SavedState): string => {
  if (typeof context?.uri === 'string') {
    return context.uri
  }
  return typeof savedState.uri === 'string' ? savedState.uri : ''
}

const getInitialRequest = (content: string): { method: string; url: string } => {
  const [method, url] = content.trim().split(/\s+/, 2)
  return {
    method: method || 'GET',
    url: url || 'https://example.com',
  }
}

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error)
}

const getStringOrFallback = (value: unknown, fallback: string): string => {
  if (typeof value === 'string') {
    return value
  }
  return fallback
}

const getMethods = (method: string): readonly string[] => {
  return methods.includes(method) ? methods : [method, ...methods]
}

const renderHeader = ({ key, value }: { readonly key: string; readonly value: string }): Dom.TreeNode => {
  return Dom.div('RestClientResponseHeader', [Dom.textNode(`${key}: ${value}`)])
}

const renderResponse = (response: RestClientResponse | undefined): Dom.TreeNode => {
  if (!response) {
    return Dom.div('RestClientResponseEmpty', [Dom.textNode('Run the request to see the response.')])
  }
  const status = `${response.status} ${response.statusText}`.trim()
  const statusNode = Dom.div('RestClientResponseStatus', [Dom.textNode(status)])
  return Dom.div('RestClientResponse', [
    statusNode,
    Dom.div('RestClientResponseHeaders', response.serializedHeaders.map(renderHeader)),
    Dom.node(VirtualDomElements.Pre, { className: 'RestClientResponseBody' }, [Dom.textNode(response.text)]),
  ])
}

const render = (state: RestClientState): readonly VirtualDomNode[] => {
  const methodOptions = getMethods(state.method)
  const methodSelect = Dom.select('method', state.method, methodOptions)
  const root = Dom.div('RestClient', [
    Dom.div('RestClientForm', [
      methodSelect,
      Dom.input('url', state.url),
      Dom.button('run', 'Run', 'RestClientRunButton', !state.url),
    ]),
    ...(state.error ? [Dom.div('RestClientError', [Dom.textNode(state.error)])] : []),
    ...(state.loading ? [Dom.div('RestClientLoading', [Dom.textNode('Running request…')])] : []),
    renderResponse(state.response),
  ])
  return Dom.flatten(root)
}

export const createInstanceWithDependencies = async (
  context: RestClientViewContext | undefined,
  dependencies: Dependencies,
): Promise<RestClientViewInstance> => {
  const savedState = getSavedState(context)
  const uri = getUri(context, savedState)
  let initialRequest = { method: 'GET', url: 'https://example.com' }
  let error = ''
  if (uri && typeof savedState.method !== 'string') {
    try {
      initialRequest = getInitialRequest(await dependencies.readFile(uri))
    } catch (readError) {
      error = getErrorMessage(readError)
    }
  }
  const state: RestClientState = {
    error,
    loading: false,
    method: getStringOrFallback(savedState.method, initialRequest.method),
    response: undefined,
    url: getStringOrFallback(savedState.url, initialRequest.url),
  }
  let disposed = false
  let requestId = 0
  const requestRerender = (): void => {
    if (!context?.requestRerender || disposed) {
      return
    }
    void context.requestRerender()
  }

  return {
    dispose(): void {
      disposed = true
    },
    async handleEvent(event: Readonly<ViewEvent>): Promise<void> {
      if (disposed) {
        return
      }
      if (event.type === 'input' && event.name === 'url' && typeof event.value === 'string') {
        state.url = event.value
        return
      }
      if ((event.type === 'input' || event.type === 'change') && event.name === 'method' && typeof event.value === 'string') {
        state.method = event.value
        return
      }
      if (event.type !== 'click' || event.name !== 'run' || !state.url) {
        return
      }
      const currentRequestId = ++requestId
      state.error = ''
      state.loading = true
      state.response = undefined
      requestRerender()
      void (async () => {
        try {
          const response = await dependencies.executeRequest(state.method, state.url)
          if (currentRequestId === requestId && !disposed) {
            state.response = response
          }
        } catch (requestError) {
          if (currentRequestId === requestId && !disposed) {
            state.error = getErrorMessage(requestError)
          }
        }
        if (currentRequestId === requestId && !disposed) {
          state.loading = false
          requestRerender()
        }
      })()
    },
    render(): readonly VirtualDomNode[] {
      return render(state)
    },
    renderTitle(): string {
      return 'REST Client'
    },
    saveState(): SavedState {
      return { method: state.method, uri, url: state.url }
    },
  }
}

export const createInstance = (context?: ViewContext): Promise<RestClientViewInstance> => {
  return createInstanceWithDependencies(context, defaultDependencies)
}

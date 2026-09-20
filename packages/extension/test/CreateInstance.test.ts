import { expect, test } from '@jest/globals'
import { createInstanceWithDependencies } from '../src/parts/RestClientView/CreateInstance.ts'

const createContext = (uri: string) => ({
  requestRerender: async (): Promise<void> => {},
  showContextMenu: async (): Promise<void> => {},
  uid: 1,
  uri,
  viewId: 'builtin.rest-client',
})

const getNodeByClass = (nodes: readonly Record<string, unknown>[], className: string) => {
  return nodes.find((node) => node.className === className)
}

test('create instance reads and renders the request for its own uri', async () => {
  const instance = await createInstanceWithDependencies(createContext('one.rest'), {
    async executeRequest() {
      return {
        serializedHeaders: [],
        status: 200,
        statusText: 'OK',
        text: 'response',
      }
    },
    async readFile(uri) {
      return uri === 'one.rest' ? 'POST data:text/plain,one' : 'GET data:text/plain,two'
    },
  })

  const input = getNodeByClass(instance.render(), 'RestClientUrlInput')
  expect(input).toMatchObject({ value: 'data:text/plain,one' })
  expect(instance.saveState()).toEqual({
    method: 'POST',
    uri: 'one.rest',
    url: 'data:text/plain,one',
  })
})

test('create instance executes edited requests and renders failures', async () => {
  const requests: string[] = []
  let rerenders = 0
  const instance = await createInstanceWithDependencies(
    {
      ...createContext('test.rest'),
      requestRerender: async (): Promise<void> => {
        rerenders++
      },
    },
    {
      async executeRequest(method, url) {
        requests.push(`${method} ${url}`)
        if (url === 'invalid://url') {
          throw new Error('request failed')
        }
        return {
          serializedHeaders: [{ key: 'content-type', value: 'text/plain' }],
          status: 200,
          statusText: 'OK',
          text: 'hello',
        }
      },
      async readFile() {
        return 'GET data:text/plain,initial'
      },
    },
  )

  await instance.handleEvent({ name: 'url', type: 'input', value: 'data:text/plain,edited' })
  await instance.handleEvent({ name: 'method', type: 'change', value: 'PUT' })
  await instance.handleEvent({ name: 'run', type: 'click' })

  expect(requests).toEqual(['PUT data:text/plain,edited'])
  expect(getNodeByClass(instance.render(), 'RestClientResponseBody')).toMatchObject({
    childCount: 1,
  })
  expect(rerenders).toBe(2)

  await instance.handleEvent({ name: 'url', type: 'input', value: 'invalid://url' })
  await instance.handleEvent({ name: 'run', type: 'click' })
  expect(getNodeByClass(instance.render(), 'RestClientError')).toBeDefined()
})

const response = (text: string) => ({ serializedHeaders: [], status: 200, statusText: 'OK', text })

test('a slower previous request cannot replace the latest response', async () => {
  const first = Promise.withResolvers<ReturnType<typeof response>>()
  const second = Promise.withResolvers<ReturnType<typeof response>>()
  const instance = await createInstanceWithDependencies(createContext('test.rest'), {
    executeRequest: (_method, url) => (url === 'first' ? first : second).promise,
    readFile: async () => 'GET first',
  })
  await instance.handleEvent({ name: 'run', type: 'click' })
  await instance.handleEvent({ name: 'url', type: 'input', value: 'second' })
  await instance.handleEvent({ name: 'run', type: 'click' })
  second.resolve(response('second response'))
  await second.promise
  first.resolve(response('stale response'))
  await first.promise
  expect(instance.render()).toContainEqual(expect.objectContaining({ text: 'second response' }))
  expect(instance.render()).not.toContainEqual(expect.objectContaining({ text: 'stale response' }))
  expect(getNodeByClass(instance.render(), 'RestClientLoading')).toBeUndefined()
})

test('disposal prevents pending requests from changing or rerendering the view', async () => {
  const pending = Promise.withResolvers<ReturnType<typeof response>>()
  let rerenders = 0
  const instance = await createInstanceWithDependencies(
    {
      ...createContext('test.rest'),
      requestRerender: async () => {
        rerenders++
      },
    },
    {
      executeRequest: () => pending.promise,
      readFile: async () => 'GET first',
    },
  )
  await instance.handleEvent({ name: 'run', type: 'click' })
  instance.dispose?.()
  const before = instance.render()
  const beforeRerenders = rerenders
  pending.resolve(response('disposed response'))
  await pending.promise
  expect(instance.render()).toEqual(before)
  expect(rerenders).toBe(beforeRerenders)
})

test('restores saved request state without rereading the original file', async () => {
  const instance = await createInstanceWithDependencies(
    {
      ...createContext('test.rest'),
      state: { method: 'PATCH', uri: 'test.rest', url: 'https://example.com/edited' },
    },
    {
      executeRequest: async () => response('unused'),
      readFile: async () => {
        throw new Error('must not read saved file')
      },
    },
  )
  expect(instance.saveState()).toEqual({ method: 'PATCH', uri: 'test.rest', url: 'https://example.com/edited' })
  expect(getNodeByClass(instance.render(), 'RestClientError')).toBeUndefined()
})

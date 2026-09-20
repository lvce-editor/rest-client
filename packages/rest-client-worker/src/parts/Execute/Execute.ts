import * as SerializeHeaders from '../SerializeHeaders/SerializeHeaders.ts'

export const execute = async (method: string, url: string) => {
  const response = await fetch(url, {
    method,
  })
  const text = await response.text()
  const { headers } = response
  const serializedHeaders = SerializeHeaders.serializeHeaders(headers)
  return {
    serializedHeaders,
    status: response.status,
    statusText: response.statusText,
    text,
  }
}

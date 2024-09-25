export const serializeHeaders = (headers: Headers) => {
  const serialized: any[] = []
  // @ts-ignore
  for (const [key, value] of headers.entries()) {
    serialized.push({ key, value })
  }
  return serialized
}

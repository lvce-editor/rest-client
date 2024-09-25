export const serializeHeaders = (headers: Headers) => {
  const serialized: any[] = []
  for (const [key, value] of Object.entries(headers)) {
    serialized.push({ key, value })
  }
  return serialized
}

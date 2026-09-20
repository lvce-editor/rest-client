export const name = 'rest-client-two-files'

export const test = async ({ FileSystem, Main, Locator, expect }) => {
  const requestUrl = new URL('../fixtures/response.json', import.meta.url).href
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/first.rest`, `GET ${requestUrl}`)
  await FileSystem.writeFile(`${tmpDir}/second.rest`, `HEAD ${requestUrl}`)
  await Main.openUri(`${tmpDir}/first.rest`)
  const root = Locator('.RestClient')
  await expect(root.locator('.RestClientMethodSelect')).toHaveValue('GET')
  await Main.openUri(`${tmpDir}/second.rest`)
  await expect(root.locator('.RestClientMethodSelect')).toHaveValue('HEAD')
  await root.locator('.RestClientRunButton').click()
  await expect(root.locator('.RestClientResponseStatus')).toHaveText('200 OK')
  await expect(root.locator('.RestClientResponseBody')).toHaveText('')
  await Main.openUri(`${tmpDir}/first.rest`)
  await expect(root.locator('.RestClientMethodSelect')).toHaveValue('GET')
  await root.locator('.RestClientRunButton').click()
  await expect(root.locator('.RestClientResponseBody')).toHaveText('{"message":"hello-rest-client"}')
}

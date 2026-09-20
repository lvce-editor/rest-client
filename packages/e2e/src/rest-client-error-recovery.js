export const name = 'rest-client-error-recovery'

export const test = async ({ FileSystem, Main, Locator, expect }) => {
  const requestUrl = new URL('../fixtures/response.json', import.meta.url).href
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/error.rest`, 'GET invalid://request')
  await Main.openUri(`${tmpDir}/error.rest`)
  const root = Locator('.RestClient')
  await expect(root).toBeVisible()
  await root.locator('.RestClientRunButton').click()
  await expect(root.locator('.RestClientError')).toBeVisible()
  await root.locator('.RestClientUrlInput').type(requestUrl)
  await root.locator('.RestClientRunButton').click()
  await expect(root.locator('.RestClientResponseStatus')).toHaveText('200 OK')
  await expect(root.locator('.RestClientResponseBody')).toHaveText('{"message":"hello-rest-client"}')
  await expect(root.locator('.RestClientError')).toBeHidden()
}

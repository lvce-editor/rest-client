export const name = 'rest-client'

// TODO maybe use localhost url for test
// but make the localhost url dynamic so that it also works on gitpod
// or codespaces
export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.rest`, `GET https://example.com`)

  // act
  await Main.openUri(`${tmpDir}/test.rest`)

  // assert
  const webView = Locator('.WebViewIframe')
  await expect(webView).toBeVisible()
}

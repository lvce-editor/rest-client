// TODO use virtual dom in  worker

const handleSubmit = async (event) => {
  event.preventDefault()
  const { target } = event
  const formData = new FormData(target)
  const method = formData.get('method')
  const url = formData.get('url')
  // @ts-ignore
  await rpc.invoke('handleSubmit', method, url)
}

const initialize = (selectValue, inputValue) => {
  const app = document.createElement('div')
  app.className = 'App'

  const heading = document.createElement('h1')
  heading.textContent = 'Rest Client'

  const select = document.createElement('select')
  select.name = 'method'
  const options = ['GET', 'PUT', 'POST']
  for (const option of options) {
    const $Option = document.createElement('option')
    $Option.value = option
    $Option.textContent = option
    select.append($Option)
  }

  const input = document.createElement('input')
  input.value = inputValue
  input.name = 'url'
  input.id = 'Input'

  const button = document.createElement('button')
  button.textContent = 'run'

  const form = document.createElement('form')
  form.append(select, input, button)
  form.addEventListener('submit', handleSubmit)

  const output = document.createElement('output')
  output.id = 'Output'

  app.append(heading, form, output)

  document.body.append(app)
}

const setOutput = (value) => {
  const output = document.getElementById('Output')
  if (!output) {
    throw new Error('output not found')
  }
  output.textContent = value.text
}

const rpc = globalThis.lvceRpc({
  initialize,
  setOutput,
})

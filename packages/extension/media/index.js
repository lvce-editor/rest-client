// TODO use virtual dom in  worker

const initialize = (parsedNodes, timings) => {
  const app = document.createElement('div')
  app.className = 'App'
  app.textContent = 'Hello Rest Client'

  document.body.append(app)
}

const rpc = globalThis.lvceRpc({
  initialize,
})

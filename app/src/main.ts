import App from './App.svelte'

document.body.children.item(0).remove()
const app = new App({ target: document.body })

export default app

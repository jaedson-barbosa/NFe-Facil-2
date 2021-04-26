import * as db from './db'
const carregando = document.querySelector('dialog')

db.sync().then(() => {
  carregando.close()
})

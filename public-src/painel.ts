import { getLastAlteracoes } from './sincronizacao'
const carregando = document.querySelector('dialog')

getLastAlteracoes().then(() => {
  carregando.close()
})

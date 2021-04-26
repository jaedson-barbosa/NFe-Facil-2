import { getForm } from './form-base'
import { importar } from './functions'

let xmls: string[]

// Como temos multiplos arquivos, não dá pra usar o metodo tradicional
document.getElementById('xmls').onchange = async (event) => {
  if (!event) return
  xmls = await Promise.all(
    Array.from((event.target as any).files as FileList).map((v) => v.text())
  )
}

getForm(0).onsubmit = async (e) => {
  e.preventDefault()
  const resp = await importar(xmls)
  console.log(resp)
}

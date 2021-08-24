import type { TCadastro } from "../app/store"

function abrirXML(xml: string) {
  const blob = new Blob([xml], { type: 'application/xml' })
  const url = window.URL.createObjectURL(blob)
  window.open(url)
}

export function XML(root: TCadastro) {
  const xml = root.get('xml')
  abrirXML(xml)
}

export function XMLC(root: TCadastro) {
  const xmlCancelamento = root.get('xmlCancelamento')
  abrirXML(xmlCancelamento)
}

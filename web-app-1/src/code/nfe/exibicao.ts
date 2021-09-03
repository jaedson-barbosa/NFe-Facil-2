export function abrirXML(xml: string) {
  const blob = new Blob([xml], { type: 'application/xml' })
  window.open(window.URL.createObjectURL(blob))
}
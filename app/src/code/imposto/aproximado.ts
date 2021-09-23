export function calcularAproximacao(prod: any, imposto: any, consumidorFinal: boolean, ibpt: any) {
  if (consumidorFinal && ibpt) {
    const taxa = ibpt.federal + ibpt.estadual + ibpt.municipal
    const vProd = +prod.vProd || 0
    imposto.vTotTrib = vProd * taxa / 100
  } else delete imposto.vTotTrib
}
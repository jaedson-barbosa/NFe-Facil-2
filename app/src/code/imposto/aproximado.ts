export function calcularAproximacao(prod: any, imposto: any, consumidorFinal: boolean, ibpt: any) {
  if (consumidorFinal && ibpt) {
    const imposto = ibpt.federal + ibpt.estadual + ibpt.municipal
    const vProd = +prod.vProd || 0
    imposto.vTotTrib = vProd * imposto
  } else delete imposto.vTotTrib
}
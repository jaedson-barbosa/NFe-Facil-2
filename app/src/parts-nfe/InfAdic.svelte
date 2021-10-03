<script lang="ts">
  import { getMoeda } from '../code/numero'

  import type { IIBPT } from '../code/tipos'

  export let raiz: any
  export let consumidorFinal: boolean

  if (!raiz.infAdic) raiz.infAdic = {}

  function removerAproximacao(infCpl: string) {
    return infCpl?.includes('Valor aproximado dos tributos: ')
      ? infCpl.substr(infCpl.indexOf('\n'))
      : ''
  }

  let infCpl = removerAproximacao(raiz.infAdic.infCpl)

  interface IDet {
    prod: any
    ibpt: IIBPT
  }

  interface IAproximacao {
    federal: number
    estadual: number
    municipal: number
  }

  function getAproximacao(consumidorFinal: boolean, dets: IDet[]) {
    function agregarImposto(p: IAproximacao, det: IDet) {
      const vProd = +det.prod.vProd || 0
      p.federal += (vProd * det.ibpt.federal) / 100
      p.estadual += (vProd * det.ibpt.estadual) / 100
      p.municipal += (vProd * det.ibpt.municipal) / 100
      return p
    }

    function getTextoAproximacao(aproximacao: IAproximacao) {
      const f = getMoeda(aproximacao.federal) + ' federal'
      const e = getMoeda(aproximacao.estadual) + ' estadual'
      const m = `${getMoeda(aproximacao.municipal)} municipal`
      return `Valor aproximado dos tributos: ${f}, ${e} e ${m}, fonte: IBPT.\n`
    }

    if (!consumidorFinal || dets.some((v) => !v.ibpt)) return ''
    const inicial = { federal: 0, estadual: 0, municipal: 0 }
    const aproximacao = dets.reduce((p, c) => agregarImposto(p, c), inicial)
    return getTextoAproximacao(aproximacao)
  }

  $: raiz.infAdic.infCpl = getAproximacao(consumidorFinal, raiz.det) + infCpl
</script>

<h2>Informações adicionais</h2>
<div class="row">
  <div class="column">
    <label>
      <i>Informações de interesse do contribuinte</i>
      <input maxlength="5000" bind:value={infCpl} />
    </label>
  </div>
  <div class="column">
    <label>
      <i>Informações de interesse do fisco</i>
      <input maxlength="2000" bind:value={raiz.infAdic['infAdFisco']} />
    </label>
  </div>
</div>
<br />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { calcularAproximacao } from '../code/imposto/aproximado'
  import { calcularCIDE } from '../code/imposto/CIDE'
  import { atualizarICMS } from '../code/imposto/ICMS'
  import { atualizarIPI } from '../code/imposto/IPI'
  import { atualizarPISCOFINS } from '../code/imposto/PISCOFINS'
  import type { IIBPT } from '../code/tipos'

  export let raiz: any
  export let ibpt: IIBPT
  export let consumidorFinal: boolean

  let prod = raiz.prod
  $: raiz.prod = prod

  const dispatch = createEventDispatcher()

  $: {
    const qCom = +prod.qCom || 1
    const vUnCom = +prod.vUnCom
    const vProd = qCom * vUnCom
    prod.vProd = vProd
    const vUnTrib = +prod.vUnTrib
    prod.qTrib = vProd / vUnTrib
  }

  function atualizarImpostos(prod: any) {
    const imposto = raiz.imposto
    atualizarICMS(prod, imposto, consumidorFinal)
    atualizarIPI(prod, imposto)
    atualizarPISCOFINS(prod, imposto)
    calcularAproximacao(prod, imposto, consumidorFinal, ibpt)
    calcularCIDE(prod)
    return imposto
  }
  $: raiz.imposto = atualizarImpostos(prod)
</script>

<tr class="clicavel" on:click>
  <td>{prod.cProd}</td>
  <td>
    <input
      type="number"
      step="0.0001"
      min="0"
      on:click|stopPropagation={() => {}}
      on:blur={() => prod.qCom == 0 && dispatch('invalido')}
      bind:value={prod.qCom}
      required
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={prod.vFrete}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={prod.vSeg}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={prod.vDesc}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={prod.vOutro}
    />
  </td>
</tr>

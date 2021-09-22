<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { IIBPT } from '../code/tipos'

  export let raiz: any
  export let ibpt: IIBPT
  export let consumidorFinal: boolean

  const dispatch = createEventDispatcher()

  $: {
    const qCom = +raiz.prod.qCom || 1
    const vUnCom = +raiz.prod.vUnCom
    const vProd = qCom * vUnCom
    raiz.prod.vProd = vProd
    const vUnTrib = +raiz.prod.vUnTrib
    raiz.prod.qTrib = vProd / vUnTrib
    if (consumidorFinal) {
      const imposto = ibpt.federal + ibpt.estadual + ibpt.municipal
      raiz.imposto.vTotTrib = vProd * imposto
    } else delete raiz.imposto.vTotTrib
  }
</script>

<tr class="clicavel" on:click>
  <td>{raiz.prod.cProd}</td>
  <td>
    <input
      type="number"
      step="0.0001"
      min="0"
      on:click|stopPropagation={() => {}}
      on:blur={() => raiz.prod.qCom == 0 && dispatch('invalido')}
      bind:value={raiz.prod.qCom}
      required
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={raiz.prod.vFrete}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={raiz.prod.vSeg}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={raiz.prod.vDesc}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation={() => {}}
      bind:value={raiz.prod.vOutro}
    />
  </td>
</tr>

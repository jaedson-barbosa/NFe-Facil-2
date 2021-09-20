<script lang="ts">
  import { goto } from '@roxi/routify'

  export let raiz: any
  export let index: number

  $: prod = raiz.det[index].prod
  $: prod['vProd'] = (+prod['qCom'] * +prod['vUnCom']).toFixed(2)

  function calcularQuantidadeEValorTributavel(qCom: string) {
    
  }

  $: {
    const qCom = +(prod['qCom'] ?? 1)
    const vUnCom = +prod['vUnCom']
    const vUnTrib = +prod['vUnTrib']
    prod.qTrib = (qCom * vUnCom) / vUnTrib
  }

  function remover() {
    raiz.det.splice(index, 1)
    raiz.det = raiz.det
  }
</script>

<tr
  class="clicavel"
  on:click={() => $goto('/:produto', { produto: index.toString() })}
>
  <td>{prod.cProd}</td>
  <td>
    <input
      type="number"
      step="0.0001"
      min="0"
      on:click|stopPropagation
      on:blur={() => prod.qCom == 0 && remover()}
      bind:value={prod.qCom}
      required
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation
      bind:value={prod.vFrete}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation
      bind:value={prod.vSeg}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation
      bind:value={prod.vDesc}
    />
  </td>
  <td>
    <input
      type="number"
      step="0.01"
      min="0"
      on:click|stopPropagation
      bind:value={prod.vOutro}
    />
  </td>
</tr>

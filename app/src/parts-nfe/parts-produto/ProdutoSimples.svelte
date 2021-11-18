<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { atualizarImpostos } from '../../code/imposto/geral'

  export let raiz: any
  export let consumidorFinal: boolean
  export let ufOrigem: string, ufDestino: string

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
    raiz.imposto = atualizarImpostos(
      prod,
      raiz.imposto,
      consumidorFinal,
      raiz.ibpt,
      ufOrigem,
      ufDestino
    )
  }
</script>

<tr class="clicavel" on:click title={prod.xProd}>
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

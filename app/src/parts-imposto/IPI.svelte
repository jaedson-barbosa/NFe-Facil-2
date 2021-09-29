<script lang="ts">
  import { CST } from '../code/imposto/IPI'
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { getMoeda } from '../code/numero'
  import { validaCNPJ } from '../code/validacaoDoc'

  export let raiz: any

  if (!raiz['IPITrib'] && !raiz['IPINT']) raiz['IPITrib'] = { CST: '00' }
  let IPI = raiz['IPITrib'] ?? raiz['IPINT']
  let tipoIPI = IPI['CST']
  $: IPITributado = ['00', '49', '50', '99'].includes(tipoIPI)
  $: {
    if (IPITributado) {
      IPI = raiz['IPITrib'] = { CST: tipoIPI }
      raiz['IPINT'] = undefined
    } else {
      raiz['IPITrib'] = undefined
      IPI = raiz['IPINT'] = { CST: tipoIPI }
    }
  }
</script>

<h3>Imposto sobre produtos industrializados</h3>
<label>
  <i>CNPJ do produtor da mercadoria</i>
  <small>
    {aplicarMascara(raiz.CNPJProd, 'cnpj')} - Informar se diferente do emitente e
    somente em exportação
  </small>
  <input
    pattern="[0-9]{14}"
    bind:value={raiz.CNPJProd}
    on:blur={() => validaCNPJ(raiz.CNPJProd) || (raiz.CNPJProd = '')}
  />
</label>
<label>
  <i>Quantidade de selos de controle</i>
  <input type="number" step="1" bind:value={raiz.qSelo} />
</label>
<label>
  <i>Códigos dos selos de controle</i>
  <input maxlength="60" bind:value={raiz.cSelo} />
</label>
<label>
  Código de Enquadramento Legal
  <input
    type="number"
    step="1"
    min="1"
    max="999"
    bind:value={raiz.cEnq}
    required
  />
</label>
<label>
  CST
  <select bind:value={tipoIPI} required>
    {#each CST as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
{#if IPITributado}
  {#if !raiz['vUnid']}
    <label>
      Alíquota em percentual
      <input type="number" step="0.0001" bind:value={raiz['pIPI']} required />
    </label>
  {/if}
  {#if !raiz['pIPI']}
    <label>
      Alíquota em reais
      <input type="number" step="0.0001" bind:value={raiz['vUnid']} required />
    </label>
  {/if}
  {#if IPI['vIPI']}
    <p>
      <strong>IPI calculado:</strong>
      {getMoeda(IPI['vIPI'])}
    </p>
  {/if}
{/if}

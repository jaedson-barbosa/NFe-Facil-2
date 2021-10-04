<script lang="ts">
  import { pattern } from '../code/patterns'

  import Doc from '../components/Doc.svelte'
  import EnderDest from './EnderDest.svelte'

  export let dest: any

  if (!dest.enderDest) dest.enderDest = { cPais: '1058' }

  $: {
    if (dest['CPF'] || dest['idEstrangeiro']) dest['indIEDest'] = '9'
  }
</script>

<Doc bind:raiz={dest} />
<label>
  Razão social ou nome
  <input
    minlength="2"
    maxlength="60"
    bind:value={dest['xNome']}
    required
    {pattern}
  />
</label>
{#if dest['CNPJ']}
  <label>
    <label>
      <i>Inscrição na SUFRAMA</i>
      <input pattern={'[0-9]{8,9}'} bind:value={dest['ISUF']} />
    </label>
    <label>
      <i>Inscrição Municipal</i>
      <input maxlength="15" bind:value={dest['IM']} {pattern} />
    </label>
    Indicador da IE do destinatário
    <select bind:value={dest.indIEDest} required>
      <option value="1">Contribuinte ICMS</option>
      <option value="2">Contribuinte isento</option>
      <option value="9">Não contribuinte</option>
    </select>
  </label>
{/if}
{#if dest['indIEDest'] == '1'}
  <label>
    Inscrição Estadual
    <small>Usar literal 'ISENTO' se necessário</small>
    <input
      maxlength="14"
      pattern={'[0-9]{(2, 14)}|ISENTO'}
      bind:value={dest['IE']}
      required
    />
  </label>
{/if}
<label>
  <i>E-mail</i>
  <input type="email" maxlength="60" bind:value={dest['email']} />
</label>
<EnderDest bind:ender={dest.enderDest} estrangeiro={dest['idEstrangeiro']} />

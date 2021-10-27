<script lang="ts">
  import Municipio from '../components/Municipio.svelte'
  import Doc from '../components/Doc.svelte'
  import CEP from '../components/CEP.svelte'
  import { pattern } from '../code/patterns'

  export let raiz: any
  export let name: 'retirada' | 'entrega'

  let informar = raiz[name]
  $: {
    if (informar && !raiz[name]) raiz[name] = {}
    if (!informar && raiz[name]) raiz[name] = undefined
  }
  $: texto =
    name == 'entrega'
      ? 'Endereço de entrega diferente do endereço do destinatário'
      : 'Endereço de retirada diferente do endereço do remetente'
  $: pessoa = name == 'entrega' ? 'destinatário' : 'expedidor'
</script>

<label>
  {texto}
  <select bind:value={informar}>
    <option value={false}>Não</option>
    <option value={true}>Sim</option>
  </select>
</label>
{#if raiz[name]}
  <h2>Local de {name}</h2>
  <Doc bind:raiz={raiz[name]} apenasBR />
  <label>
    <i>Razão social ou nome do {pessoa}</i>
    <input
      minlength="2"
      maxlength="60"
      bind:value={raiz[name]['xNome']}
      {pattern}
    />
  </label>
  {#if raiz[name]['CNPJ']}
    <label>
      <i>Inscrição estadual</i>
      <input
        maxlength="14"
        pattern={'[0-9]{(2, 14)}|ISENTO'}
        bind:value={raiz[name]['IE']}
        title="Se necessário, usar 'ISENTO'"
      />
    </label>
  {/if}
  <label>
    <i>E-mail</i>
    <input type="email" maxlength="60" bind:value={raiz[name]['email']} />
  </label>
  <label>
    Logradouro
    <input
      minlength="2"
      maxlength="60"
      bind:value={raiz[name]['xLgr']}
      required
      {pattern}
    />
  </label>
  <label>
    Número
    <input maxlength="60" bind:value={raiz[name]['nro']} required {pattern} />
  </label>
  <label>
    <i>Complemento</i>
    <input maxlength="60" bind:value={raiz[name]['xCpl']} {pattern} />
  </label>
  <label>
    Bairro
    <input
      minlength="2"
      maxlength="60"
      bind:value={raiz[name]['xBairro']}
      required
      {pattern}
    />
  </label>
  <Municipio
    bind:cMun={raiz[name]['cMun']}
    bind:xMun={raiz[name]['xMun']}
    bind:UF={raiz[name]['UF']}
  />
  <CEP
    bind:CEP={raiz[name].CEP}
    UF={raiz[name].UF}
    Municipio={raiz[name].xMun}
    Logradouro={raiz[name].xLgr}
  />
  <label>
    <i>Telefone</i>
    <input pattern={'[0-9]{6,14}'} bind:value={raiz[name]['fone']} />
  </label>
{/if}
<br />

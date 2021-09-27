<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import Municipio from '../components/Municipio.svelte'
  import Doc from '../components/Doc.svelte'

  export let raiz: any
  export let name: 'retirada' | 'entrega'

  let informar = raiz[name]
  $: raiz[name] = informar ? {} : undefined
  $: texto =
    name == 'entrega'
      ? 'Endereço de entrega diferente do endereço do destinatário'
      : 'Endereço de retirada diferente do endereço do remetente'
  $: pessoa = name == 'entrega' ? 'destinatário' : 'expedidor'
</script>

<label>
  <input type="checkbox" bind:checked={informar} />
  {texto}
</label>
{#if raiz[name]}
  <h2>Local de {name}</h2>
  <Doc bind:raiz={raiz[name]} apenasBR />
  <label>
    <i>Razão social ou nome do {pessoa}</i>
    <input minlength="2" maxlength="60" bind:value={raiz[name]['xNome']} />
  </label>
  {#if raiz[name]['CNPJ']}
    <label>
      <i>Inscrição estadual</i>
      <small>Usar literal 'ISENTO' se necessário</small>
      <input
        maxlength="14"
        pattern={'[0-9]{(2, 14)}|ISENTO'}
        bind:value={raiz[name]['IE']}
      />
    </label>
  {/if}
  <label>
    <i>E-mail</i>
    <input maxlength="60" bind:value={raiz[name]['email']} />
  </label>
  <label>
    Logradouro
    <input
      minlength="2"
      maxlength="60"
      bind:value={raiz[name]['xLgr']}
      required
    />
  </label>
  <label>
    Número
    <input maxlength="60" bind:value={raiz[name]['nro']} required />
  </label>
  <label>
    <i>Complemento</i>
    <input maxlength="60" bind:value={raiz[name]['xCpl']} />
  </label>
  <label>
    Bairro
    <input
      minlength="2"
      maxlength="60"
      bind:value={raiz[name]['xBairro']}
      required
    />
  </label>
  <Municipio
    bind:cMun={raiz[name]['cMun']}
    bind:xMun={raiz[name]['xMun']}
    bind:UF={raiz[name]['UF']}
  />
  <label>
    <i>CEP {aplicarMascara(raiz[name]['CEP'], 'zipcode')}</i>
    <input pattern={'[0-9]{8}'} bind:value={raiz[name]['CEP']} />
  </label>
  <label>
    <i>Telefone</i>
    <input pattern={'[0-9]{6,14}'} bind:value={raiz[name]['fone']} />
  </label>
{/if}
<br />

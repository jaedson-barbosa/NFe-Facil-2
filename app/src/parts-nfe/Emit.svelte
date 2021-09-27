<script lang="ts">
  import Municipio from '../components/Municipio.svelte'
  import CNPJ from '../components/CNPJ.svelte'
  import { aplicarMascara } from '../code/mascaracaoDoc'

  export let raiz: any

  if (!raiz['emit']) raiz['emit'] = {}
  let emit = raiz['emit']

  if (!emit['enderEmit']) emit['enderEmit'] = {}
  let ender = emit['enderEmit']

  ender.cPais = '1058'
  ender.xPais = 'BRASIL'

  $: !emit.RM && delete emit.CNAE
</script>

<CNPJ bind:CNPJ={emit['CNPJ']} required />
<label>
  Razão social ou nome
  <input minlength="2" maxlength="60" bind:value={emit['xNome']} required />
</label>
<label>
  Nome fantasia
  <input maxlength="60" bind:value={emit['xFant']} required />
</label>
<label>
  Inscrição Estadual
  <small>Usar literal 'ISENTO' se necessário</small>
  <input
    maxlength="14"
    pattern={'[0-9]{(2, 14)}|ISENTO'}
    bind:value={emit['IE']}
    required
  />
</label>
<label>
  <i>Inscrição estadual ST</i>
  <input maxlength="14" pattern={'[0-9]{(2, 14)}'} bind:value={emit['IEST']} />
</label>
<label>
  <i>Inscrição Municipal</i>
  <input maxlength="15" bind:value={emit['IM']} />
</label>
{#if emit['IM']}
  <label>
    CNAE Fiscal
    <input pattern={'[0-9]{7}'} bind:value={emit['CNAE']} />
  </label>
{/if}
<label>
  Regime Tributário
  <select bind:value={emit.CRT} required>
    <option value="1">Simples Nacional</option>
    <option value="2">
      Simples Nacional, excesso de sublimite de receita bruta
    </option>
    <option value="3">Regime Normal</option>
  </select>
</label>

<h4>Endereço</h4>
<label>
  Logradouro
  <input minlength="2" maxlength="60" bind:value={ender['xLgr']} required />
</label>
<label>
  Número
  <input maxlength="60" bind:value={ender['nro']} required />
</label>
<label>
  <i>Complemento</i>
  <input maxlength="60" bind:value={ender['xCpl']} />
</label>
<label>
  Bairro
  <input
    minlength="2"
    maxlength="60"
    bind:value={ender['xBairro']}
    required
  />
</label>
<Municipio
  bind:cMun={ender['cMun']}
  bind:xMun={ender['xMun']}
  bind:UF={ender['UF']}
/>
<label>
  CEP {aplicarMascara(ender['CEP'], 'zipcode')}
  <input pattern={'[0-9]{8}'} bind:value={ender['CEP']} required />
</label>
<label>
  <i>Telefone</i>
  <input pattern={'[0-9]{6,14}'} bind:value={ender['fone']} />
</label>

<script lang="ts">
  import Municipio from '../components/Municipio.svelte'
  import CEP from '../components/CEP.svelte'
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { validaCNPJ } from '../code/validacaoDoc'
  import { pattern } from '../code/patterns'

  export let raiz: any

  if (!raiz['emit']) raiz['emit'] = {}
  let emit = raiz['emit']

  if (!emit['enderEmit']) emit['enderEmit'] = {}
  let ender = emit['enderEmit']

  ender.cPais = '1058'
  ender.xPais = 'BRASIL'
</script>

<label>
  CNPJ
  <input
    required
    pattern={'[0-9]{14}'}
    bind:value={emit['CNPJ']}
    on:blur={() => validaCNPJ(emit['CNPJ']) || (emit['CNPJ'] = '')}
    title={aplicarMascara(emit['CNPJ'], 'cnpj')}
  />
</label>
<label>
  Razão social ou nome
  <input
    minlength="2"
    maxlength="60"
    bind:value={emit['xNome']}
    required
    {pattern}
  />
</label>
<label>
  Nome fantasia
  <input maxlength="60" bind:value={emit['xFant']} required {pattern} />
</label>
<label>
  Inscrição Estadual
  <input
    maxlength="14"
    pattern={'[0-9]{(2, 14)}|ISENTO'}
    bind:value={emit['IE']}
    required
    title="Se necessário, usar 'ISENTO'"
  />
</label>
<label>
  <i>Inscrição estadual ST</i>
  <input maxlength="14" pattern={'[0-9]{(2, 14)}'} bind:value={emit['IEST']} />
</label>
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
  <input
    minlength="2"
    maxlength="60"
    bind:value={ender['xLgr']}
    required
    {pattern}
  />
</label>
<label>
  Número
  <input maxlength="60" bind:value={ender['nro']} required {pattern} />
</label>
<label>
  <i>Complemento</i>
  <input maxlength="60" bind:value={ender['xCpl']} {pattern} />
</label>
<label>
  Bairro
  <input
    minlength="2"
    maxlength="60"
    bind:value={ender['xBairro']}
    required
    {pattern}
  />
</label>
<Municipio
  bind:cMun={ender['cMun']}
  bind:xMun={ender['xMun']}
  bind:UF={ender['UF']}
/>
<CEP
  bind:CEP={ender.CEP}
  required
  UF={ender.UF}
  Municipio={ender.xMun}
  Logradouro={ender.xLgr}
/>
<label>
  <i>Telefone</i>
  <input pattern={'[0-9]{6,14}'} bind:value={ender['fone']} />
</label>

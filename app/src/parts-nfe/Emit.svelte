<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Municipio from '../components/Municipio.svelte'

  export let raiz: any

  if (!raiz['emit']) raiz['emit'] = {}
  let emit = raiz['emit']

  if (!emit['enderEmit']) emit['enderEmit'] = {}
  let enderEmit = emit['enderEmit']

  enderEmit.cPais = '1058'
  enderEmit.xPais = 'BRASIL'
</script>

<InputT lab="CNPJ" mask="cnpj" bind:val={emit['CNPJ']} pat={'[0-9]{14}'} />
<InputT
  lab="Razão social ou nome do emitente"
  min={2}
  max={60}
  bind:val={emit['xNome']}
/>
<InputT lab="Nome fantasia" opt min={1} max={60} bind:val={emit['xFant']} />
<InputT
  lab="Inscrição Estadual"
  max={14}
  pat={'[0-9]{(2, 14)}|ISENTO'}
  bind:val={emit['IE']}
/>
<InputT
  lab="IE do Substituto Tributário"
  opt
  max={14}
  pat={'[0-9]{(2, 14)}'}
  bind:val={emit['IEST']}
/>
<InputT
  lab="Inscrição Municipal"
  opt={!emit['CNAE']}
  min={1}
  max={15}
  bind:val={emit['IM']}
/>
{#if emit['IM'] || emit['CNAE']}
  <InputT lab="CNAE Fiscal" pat={'[0-9]{7}'} bind:val={emit['CNAE']} />
{/if}
<label>
  Regime Tributário
  <select bind:value={emit.CRT} required>
    <option value="1">Simples Nacional</option>
    <option value="2">Simples Nacional, excesso de sublimite de receita bruta</option>
    <option value="3">Regime Normal</option>
  </select>
</label>

<h4>Endereço</h4>
<InputT lab="Logradouro" bind:val={enderEmit['xLgr']} min={2} max={60} />
<InputT lab="Número" bind:val={enderEmit['nro']} min={1} max={60} />
<InputT lab="Complemento" bind:val={enderEmit['xCpl']} opt min={1} max={60} />
<InputT lab="Bairro" bind:val={enderEmit['xBairro']} min={2} max={60} />
<Municipio
  bind:cMun={enderEmit['cMun']}
  bind:xMun={enderEmit['xMun']}
  bind:UF={enderEmit['UF']}
/>
<InputT lab="CEP" mask="zipcode" bind:val={enderEmit['CEP']} pat={'[0-9]{8}'} />
<InputT
  lab="Telefone"
  bind:val={enderEmit['fone']}
  opt
  aux={'DDD + número do telefone'}
  pat={'[0-9]{6,14}'}
/>

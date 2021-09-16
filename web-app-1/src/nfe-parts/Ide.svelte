<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import InputD from '../components/InputD.svelte'
  import Select from '../components/Select.svelte'
  import Municipio from '../components/Municipio.svelte'
  import { empresa } from '../code/store'
  import { get } from 'svelte/store'
  import IBGE from '../code/IBGE'
  import { VERSAO } from '../code/app'
  import Lista from '../components/Lista.svelte'

  export let raiz: any

  function getCodigoEstado(sigla: string) {
    return IBGE.find((v) => v.Sigla == sigla)?.Codigo
  }

  function getRandomNumber(digits: number = 8) {
    var minm = 10 ** (digits - 1)
    var maxm = 10 ** digits - 1
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm
  }

  if (!raiz['ide']) raiz['ide'] = {}
  const ide = raiz['ide']
  const emp = get(empresa)
  const emit = emp.emit
  ide['cUF'] = getCodigoEstado(emit.enderEmit.UF)
  ide['cNF'] = getRandomNumber().toString()
  ide['serie'] = emp.serieNFe
  $: ide['serie'] = ide['mod'] == '65' ? emp.serieNFCe : emp.serieNFe
  ide['nNF'] = '0'
  ide['cMunFG'] = emit.enderEmit.cMun
  ide['tpEmis'] = '1'
  ide['tpImp'] = '1'
  ide['procEmi'] = '0'
  let isHomolog = ide['tpAmb'] == '2'
  $: ide['tpAmb'] = isHomolog ? '2' : '1'
  ide['verProc'] = VERSAO

  if (!ide['NFref']) ide['NFref'] = []
</script>

<h3>Identificação</h3>
<label>
  <input type="checkbox" bind:checked={isHomolog} />
  Ambiente de homologação
  <small>Testar emissão com nota sem valor fiscal</small>
</label>
<Select
  bind:val={ide['mod']}
  lab="Modelo"
  els={[
    ['55', 'NF-e'],
    ['65', 'NFC-e'],
  ]}
/>
<InputT bind:val={ide['natOp']} lab="Natureza da Operação" min={1} max={60} />
<InputT
  bind:val={ide['serie']}
  lab="Série do Documento Fiscal"
  pat={'0|[1-9]{1}[0-9]{0,2}'}
/>
<InputT
  bind:val={ide['nNF']}
  lab="Número do Documento Fiscal"
  aux="Deixar com 0 para cálculo automático pelo servidor."
  pat={'[1-9]{1}[0-9]{0,8}'}
/>
<InputD raiz={ide} name="dhEmi" lab="Data e Hora de emissão" />
<InputD raiz={ide} name="dhSaiEnt" lab="Data e Hora de saída/entrada" opt />
<Select
  bind:val={ide['tpNF']}
  lab="Tipo do Documento Fiscal"
  els={[
    ['1', 'Saída'],
    ['0', 'Entrada'],
  ]}
/>
<Select
  bind:val={ide['idDest']}
  lab="Identificador de Local de destino da operação"
  els={[
    ['1', 'Interna'],
    ['2', 'Interestadual'],
    ['3', 'Exterior'],
  ]}
/>
<Municipio bind:cMun={ide['cMunFG']} lab="Município de ocorrência" />
<Select
  bind:val={ide['finNFe']}
  lab="Finalidade da emissão"
  els={[
    ['1', 'Normal'],
    ['2', 'Complementar'],
    ['3', 'Ajuste'],
    ['4', 'Devolução/Retorno'],
  ]}
/>
<Select
  bind:val={ide['indFinal']}
  lab="Consumidor final"
  els={[
    ['1', 'Sim'],
    ['0', 'Não'],
  ]}
/>
<Select
  bind:val={ide['indPres']}
  lab="Presença do comprador"
  els={[
    ['1', 'Operação presencial'],
    ['0', 'Não se aplica (complementar ou ajuste)'],
    ['2', 'Não presencial, internet'],
    ['3', 'Não presencial, teleatendimento'],
    ['4', 'NFC-e entrega em domicílio'],
    ['5', 'Operação presencial, fora do estabelecimento'],
    ['9', 'Não presencial, outros'],
  ]}
/>
{#if ide['indPres'] != '1'}
  <Select
    bind:val={ide['indIntermed']}
    opt
    lab="Indicador de intermediador ou marketplace"
    els={[
      ['0', 'Operação em site ou plataforma própria'],
      ['1', 'Operação em site ou plataforma de terceiros'],
    ]}
  />
{/if}

<h4>NF-es referenciadas</h4>
<Lista raiz={ide} name="NFref">
  <svelte:fragment slot="h" let:item>
    {item['refNFe']}
  </svelte:fragment>
  <InputT
    slot="b"
    let:item
    raiz={item}
    name="refNFe"
    lab="Chave de acesso da NF-e"
    pat={'[0-9]{44}'}
    max={44}
  />
</Lista>

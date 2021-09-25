<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Municipio from '../components/Municipio.svelte'
  import { empresa } from '../code/store'
  import { get } from 'svelte/store'
  import IBGE from '../code/IBGE'
  import { VERSAO } from '../code/app'
  import { toNFeString } from '../code/getDataString'

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
  let ide = raiz['ide']
  $: raiz['ide'] = ide
  const emp = get(empresa)
  const emit = emp.emit
  ide['cUF'] = getCodigoEstado(emit.enderEmit.UF)
  ide['cNF'] = getRandomNumber().toString()
  ide['serie'] = emp.serieNFe
  $: ide['serie'] = ide['mod'] == '65' ? emp.serieNFCe : emp.serieNFe
  ide['nNF'] = '0'
  ide['dhEmi'] = toNFeString(new Date())
  ide['idDest'] = '1'
  ide['cMunFG'] = emit.enderEmit.cMun
  ide['tpEmis'] = '1'
  ide['tpImp'] = '1'
  ide['procEmi'] = '0'
  let isHomolog = ide['tpAmb'] == '2'
  $: ide['tpAmb'] = isHomolog ? '2' : '1'
  ide['verProc'] = VERSAO

  if (!ide['NFref']) ide['NFref'] = []

  $: ide['mod'] == '65' &&
    (ide['tpNF'] = ide['idDest'] = ide['finNFe'] = ide['indFinal'] = '1')

  let informarSaidaEntrada = !!ide.dhSaiEnt
  $: ide.dhSaiEnt = informarSaidaEntrada ? toNFeString(new Date()) : ''
  let saidaEntrada = ide.dhSaiEnt?.slice(0, 16) || ''
  $: ide.dhSaiEnt = saidaEntrada ? toNFeString(new Date(saidaEntrada)) : ''

  function analisar(index: number) {
    return () => {
      if (ide.NFref[index].refNFe.length == 44) return
      ide.NFref.splice(index, 1)
      ide = ide
    }
  }

  let indFinal = ide.indFinal == '1'
  $: ide.indFinal = indFinal ? '1' : '0'

  let indIntermed = ide.indIntermed == '1'
  $: ide.indIntermed = indIntermed ? '1' : '0'
</script>

<h2>Identificação</h2>
<div class="row">
  <div class="column">
    <label>
      <input type="checkbox" bind:checked={isHomolog} />
      Ambiente de homologação
      <small>Testar emissão com nota sem valor fiscal</small>
    </label>
    <label>
      Modelo
      <select bind:value={ide['mod']} required>
        <option value="55">NF-e</option>
        <option value="65">NFC-e</option>
      </select>
    </label>
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
    {#if ide['mod'] == 55}
      <label>
        Finalidade da emissão
        <select bind:value={ide['finNFe']} required>
          <option value="1">Normal</option>
          <option value="2">Complementar</option>
          <option value="3">Ajuste</option>
          <option value="4">Devolução/Retorno</option>
        </select>
      </label>
      <label>
        <input type="checkbox" bind:checked={indFinal} />
        Consumidor final
      </label>
    {/if}
    {#if ['2', '3', '4', '9'].includes(ide['indPres'])}
      <label>
        <input type="checkbox" bind:checked={indIntermed} />
        Operação executada em site ou plataforma de terceiros
        <small>intermediador ou marketplace</small>
      </label>
    {/if}
  </div>
  <div class="column">
    <label>
      <input type="checkbox" bind:checked={informarSaidaEntrada} />
      Informar data e hora de saída/entrada
    </label>
    {#if informarSaidaEntrada}
      <label>
        Data e Hora de saída/entrada
        <input type="datetime-local" bind:value={saidaEntrada} required />
      </label>
    {/if}
    <InputT
      bind:val={ide['natOp']}
      lab="Natureza da Operação"
      min={1}
      max={60}
    />
    <Municipio bind:cMun={ide['cMunFG']} lab="Município de ocorrência" />
    <label>
      Presença do comprador
      <select bind:value={ide['indPres']} required>
        <option value="0">Não se aplica (complementar ou ajuste)</option>
        <option value="1">Operação presencial</option>
        <option value="2">Não presencial, internet</option>
        <option value="3">Não presencial, teleatendimento</option>
        <option value="4">NFC-e entrega em domicílio</option>
        <option value="5">Operação presencial, fora do estabelecimento</option>
        <option value="9">Não presencial, outros</option>
      </select>
    </label>
    {#if ide['mod'] == 55}
      <label>
        Tipo do documento fiscal
        <select bind:value={ide['tpNF']} required>
          <option value="0">Entrada</option>
          <option value="1">Saída</option>
        </select>
      </label>
      <label>
        Identificador de local de destino da operação
        <select bind:value={ide['idDest']} required>
          <option value="1">Interna</option>
          <option value="2">Interestadual</option>
          <option value="3">Exterior</option>
        </select>
      </label>
    {/if}
  </div>
</div>

<h3>NF-es referenciadas</h3>
<button type="button" on:click={() => (ide.NFref = [{}, ...ide.NFref])}>
  Adicionar
</button>
<br />
{#if ide.NFref.length}
  <table>
    <thead>
      <tr>
        <td>Chave de acesso da NF-e</td>
      </tr>
    </thead>
    <tbody>
      {#each ide.NFref as _, i}
        <tr>
          <td>
            <input
              bind:value={ide.NFref[i].refNFe}
              pattern="[0-9]{44}"
              on:blur={analisar(i)}
              required
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<br />

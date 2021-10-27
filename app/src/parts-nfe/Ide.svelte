<script lang="ts">
  import Municipio from '../components/Municipio.svelte'
  import { empresa } from '../code/store'
  import { get } from 'svelte/store'
  import IBGE from '../code/IBGE'
  import { VERSAO } from '../code/app'
  import { toNFeString } from '../code/getDataString'
  import Adicionar from '../components/Adicionar.svelte'
  import { pattern } from '../code/patterns'
  import { validaCNPJ } from '../code/validacaoDoc'
  import { aplicarMascara } from '../code/mascaracaoDoc'

  export let raiz: any
  let ide = raiz.ide
  $: raiz.ide = ide

  function getCodigoEstado(sigla: string) {
    return IBGE.find((v) => v.Sigla == sigla)?.Codigo
  }

  function getRandomNumber(digits: number = 8) {
    var minm = 10 ** (digits - 1)
    var maxm = 10 ** digits - 1
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm
  }

  const emp = get(empresa)
  const emit = emp.emit

  if (!ide) {
    ide = {
      mod: '55',
      serie: emp.serieNFe,
      idDest: '1',
      tpEmis: '1',
      tpImp: '1',
      procEmi: '0',
    }
  }
  if (!ide['NFref']) {
    ide['NFref'] = []
  }

  ide.nNF = '0'
  ide['cUF'] = getCodigoEstado(emit.enderEmit.UF)
  ide['cNF'] = getRandomNumber().toString()
  ide['dhEmi'] = toNFeString(new Date())
  ide['cMunFG'] = emit.enderEmit.cMun
  ide['verProc'] = VERSAO

  $: {
    if (['2', '3', '4', '9'].includes(ide['indPres'])) {
      const indIntermed = +ide.indIntermed
      if (indIntermed === 1 && !raiz.infIntermed) raiz.infIntermed = {}
      if (indIntermed === 0 && raiz.infIntermed) raiz.infIntermed = undefined
    } else {
      ide.indIntermed = '0'
      raiz.infIntermed = undefined
    }
  }

  let oldMod = ide.mod
  $: {
    if (ide.mod != oldMod) {
      if (ide['mod'] == '65') {
        ide['serie'] = emp.serieNFCe
        ide['tpNF'] = ide['idDest'] = ide['finNFe'] = ide['indFinal'] = '1'
        ide['tpImp'] = '4'
      } else {
        ide['tpImp'] = '1'
        ide['serie'] = emp.serieNFe
      }
      oldMod = ide.mod
    }
  }

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

  let informarExporta = !!raiz.exporta
  $: {
    if (informarExporta && !raiz.exporta) raiz.exporta = {}
    if (!informarExporta && raiz.exporta) raiz.exporta = undefined
  }

  let informarCompra = !!raiz.compra
  $: {
    if (informarCompra && !raiz.compra) raiz.compra = {}
    if (!informarCompra && raiz.compra) raiz.compra = undefined
  }

  let informarCobr = !!raiz.cobr
  $: {
    if (informarCobr && !raiz.cobr) raiz.cobr = {}
    if (!informarCobr && raiz.cobr) raiz.cobr = undefined
  }

  let informarCana = !!raiz.cana
  $: {
    if (informarCana && !raiz.cana) raiz.cana = {}
    if (!informarCana && raiz.cana) raiz.cana = undefined
  }
</script>

<h2>Identificação</h2>
<div class="row">
  <div class="column">
    <label>
      Ambiente
      <select bind:value={ide['tpAmb']}>
        <option value="1">Produção</option>
        <option value="2">Homologação</option>
      </select>
    </label>
  </div>
  <div class="column">
    <label>
      Modelo
      <select bind:value={ide['mod']} required>
        <option value="55">NF-e</option>
        <option value="65">NFC-e</option>
      </select>
    </label>
  </div>
</div>
<div class="row">
  {#if ide['mod'] == 55}
    <div class="column">
      <label>
        Tipo de operação
        <select bind:value={ide['tpNF']} required>
          <option value="1">Saída</option>
          <option value="0">Entrada</option>
        </select>
      </label>
    </div>
  {/if}
  <div class="column">
    <label>
      Natureza da Operação
      <input maxlength="60" bind:value={ide['natOp']} required {pattern} />
    </label>
  </div>
</div>
<div class="row">
  <div class="column">
    <Municipio bind:cMun={ide['cMunFG']} lab="Município de ocorrência" />
  </div>
  <div class="column">
    <label>
      Presença do comprador
      <select bind:value={ide['indPres']} required>
        <option value="1">Presencial</option>
        {#if ide['mod'] == 55}
          <option value="5">Presencial, fora do estabelecimento</option>
          <option value="2">Não presencial, internet</option>
          <option value="3">Não presencial, teleatendimento</option>
          <option value="9">Não presencial, outros</option>
          <option value="0">Não se aplica (complementar ou ajuste)</option>
        {:else}
          <option value="4">NFC-e entrega em domicílio</option>
        {/if}
      </select>
    </label>
  </div>
</div>
{#if ide['mod'] == 55}
  <div class="row">
    <div class="column">
      <label>
        Finalidade da emissão
        <select bind:value={ide['finNFe']} required>
          <option value="1">Normal</option>
          <option value="2">Complementar</option>
          <option value="3">Ajuste</option>
          <option value="4">Devolução/Retorno</option>
        </select>
      </label>
    </div>
    <div class="column">
      <label>
        Consumidor final?
        <select bind:value={ide.indFinal}>
          <option value="0">Não</option>
          <option value="1">Sim</option>
        </select>
      </label>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <label>
        Exportação?
        <select bind:value={informarExporta} required>
          <option value={false}>Não</option>
          <option value={true}>Sim</option>
        </select>
      </label>
    </div>
    <div class="column">
      <label>
        Venda/Compra pública?
        <select bind:value={informarCompra} required>
          <option value={false}>Não</option>
          <option value={true}>Sim</option>
        </select>
      </label>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <label>
        Detalhar cobrança?
        <select bind:value={informarCobr} required>
          <option value={false}>Não</option>
          <option value={true}>Sim</option>
        </select>
      </label>
    </div>
    <div class="column">
      <label>
        Aquisição de cana?
        <select bind:value={informarCana} required>
          <option value={false}>Não</option>
          <option value={true}>Sim</option>
        </select>
      </label>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <label>
        Informar data de {#if ide['tpNF'] === '1'}saída{:else}entrada{/if}?
        <select bind:value={informarSaidaEntrada}>
          <option value={false}>Não</option>
          <option value={true}>Sim</option>
        </select>
      </label>
    </div>
    {#if informarSaidaEntrada}
      <div class="column">
        <label>
          Data e hora
          <input type="datetime-local" bind:value={saidaEntrada} required />
        </label>
      </div>
    {/if}
    <div class="column">
      <label>
        Tipo de destino
        <select bind:value={ide['idDest']} required>
          <option value="1">Outro município - interna</option>
          <option value="2">Outro estado - interestadual</option>
          <option value="3">Outro país - exterior</option>
        </select>
      </label>
    </div>
  </div>
{/if}
{#if ['2', '3', '4', '9'].includes(ide['indPres'])}
  <div class="row">
    <div class="column">
      <label>
        Operação em plataforma de terceiros
        <select bind:value={ide.indIntermed}>
          <option value="0">Não</option>
          <option value="1">Sim</option>
        </select>
      </label>
    </div>
    {#if raiz.infIntermed}
      <div class="column">
        <label>
          CNPJ do intermediador
          <input
            pattern={'[0-9]{14}'}
            bind:value={raiz.infIntermed.CNPJ}
            on:blur={() =>
              validaCNPJ(raiz.infIntermed.CNPJ) || (raiz.infIntermed.CNPJ = '')}
            title={aplicarMascara(raiz.infIntermed.CNPJ, 'cnpj')}
          />
        </label>
      </div>
      <div class="column">
        <label>
          Id no intermediador
          <input
            bind:value={raiz.infIntermed.idCadIntTran}
            maxlength="60"
            {pattern}
            required
          />
        </label>
      </div>
    {/if}
  </div>
{/if}

{#if ide['mod'] == 55}
  <h3>
    NF-es referenciadas
    <Adicionar on:click={() => (ide.NFref = [{}, ...ide.NFref])} />
  </h3>
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
                pattern={'[0-9]{44}'}
                on:blur={analisar(i)}
                required
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/if}
<br />

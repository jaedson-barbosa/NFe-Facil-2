<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Lista from '../components/Lista.svelte'
  import Opcional from '../components/Opcional.svelte'
  import Estado from '../components/Estado.svelte'
  import { refEmpresa } from '../code/store'
  import ExibDoc from './ExibDoc.svelte'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { goto, url } from '@roxi/routify'

  export let raiz: any

  if (!raiz['transp']) raiz['transp'] = {}
  if (!raiz['transp']['vol']) raiz['transp']['vol'] = []

  $: transp = raiz['transp']
  $: volumes = transp['vol'] as any[]
  $: transporta = transp['transporta']
  $: reboque = transp['reboque']

  let transportadores = [] as DocumentSnapshot[]
  const buscador = new Buscador(
    $refEmpresa,
    Dados.Transportes,
    'transporta.xNome',
    'asc',
    (v) => (transportadores = v)
  )
</script>

<h2>Transporte</h2>
<Select
  bind:val={transp['modFrete']}
  lab="Modalidade do frete"
  els={[
    ['0', 'Contratação do Frete por conta do Remetente (CIF)'],
    ['1', 'Contratação do Frete por conta do destinatário/remetente (FOB)'],
    ['2', 'Contratação do Frete por conta de terceiros'],
    ['3', 'Transporte próprio por conta do remetente'],
    ['4', 'Transporte próprio por conta do destinatário'],
    ['9', 'Sem Ocorrência de transporte'],
  ]}
/>

<h3>Transportador</h3>
<label>
  Buscar transportador pelo nome
  <input on:input={buscador.buscar} />
</label>
{#if transportadores.length}
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Documento</th>
      </tr>
    </thead>
    <tbody>
      {#each transportadores as t}
        <tr
          class="clicavel"
          class:marcado={transporta?.xNome == t.get('transporta.xNome')}
          on:click={() => (transporta = t.data())}
        >
          <td>{t.get('transporta.xNome')}</td>
          <td>
            <ExibDoc
              CPF={t.get('transporta.CPF')}
              CNPJ={t.get('transporta.CNPJ')}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<h3>Meio</h3>
{#if !transp.veicTransp && !reboque?.length}
  {#if !transp['balsa']}
    <InputT bind:val={transp['vagao']} lab="Vagão" min={1} max={20} />
  {/if}
  {#if !transp['vagao']}
    <InputT bind:val={transp['balsa']} lab="Balsa" min={1} max={20} />
  {/if}
{/if}
{#if !transp['balsa'] && !transp['vagao']}
  <Opcional bind:raiz={raiz['transp']} name="veicTransp" titulo="veículo">
    <h4>Veículo</h4>
    <InputT
      bind:val={transp.veicTransp['placa']}
      lab="Placa do veículo"
      pat={'[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}'}
    />
    <Estado bind:UF={transp.veicTransp['UF']} incluirEX />
    <InputT
      bind:val={transp.veicTransp['RNTC']}
      opt
      lab="Registro Nacional de Transportador de Carga (ANTT)"
      min={1}
      max={20}
    />
  </Opcional>
  <h4>Reboque</h4>
  <Lista raiz={transp} name="reboque">
    <svelte:fragment slot="h" let:item>
      {item.placa} ({item.UF})
    </svelte:fragment>
    <svelte:fragment slot="b" let:item>
      <InputT
        raiz={item}
        name="placa"
        lab="Placa do veículo"
        pat={'[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}'}
      />
      <Estado raiz={item} UFName="UF" incluirEX />
      <InputT
        raiz={item}
        name="RNTC"
        opt
        lab="Registro Nacional de Transportador de Carga (ANTT)"
        min={1}
        max={20}
      />
    </svelte:fragment>
  </Lista>
{/if}

<h3>Volumes</h3>
<a class="button" href={$url('./volume/:volume', { volume: '-1' })}>
  Adicionar
</a>
{#if transp.vol.length}
  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Espécie</th>
        <th>Marca</th>
        <th>Numeração</th>
      </tr>
    </thead>
    <tbody>
      {#each volumes as v, i}
        <tr
          on:click={() => $goto('./volume/:volume', { volume: i.toString() })}
        >
          <td>{v.qVol}</td>
          <td>{v.esp}</td>
          <td>{v.marca}</td>
          <td>{v.nVol}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<Opcional raiz={transp} name="retTransp" titulo="retenção ICMS">
  <h3>Retenção ICMS</h3>
  <InputT
    bind:val={transp.retTransp['vServ']}
    lab="Valor do Serviço"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={transp.retTransp['vBCRet']}
    lab="BC da Retenção do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={transp.retTransp['pICMSRet']}
    lab="Alíquota da Retenção"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={transp.retTransp['vICMSRet']}
    lab="Valor do ICMS Retido"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={transp.retTransp['CFOP']}
    lab="Código Fiscal de Operações e Prestações"
    pat={'[1,2,3,5,6,7]{1}[0-9]{3}'}
  />
  <InputT
    bind:val={transp.retTransp['cMunFG']}
    lab="Código do Município de Ocorrência do Fato Gerador"
    pat={'[0-9]{7}'}
  />
</Opcional>

<br />

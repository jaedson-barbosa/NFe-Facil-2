<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Lista from '../components/Lista.svelte'
  import Opcional from '../components/Opcional.svelte'
  import Estado from '../components/Estado.svelte'
  import Municipio from '../components/Municipio.svelte'

  export let raiz: any

  if (!raiz['transp']) raiz['transp'] = {}
  const transp = raiz['transp']

  $: transporta = transp['transporta']
  $: retTransp = transp['retTransp']
  $: veicTransp = transp['veicTransp']
  $: reboque = transp['reboque']
  $: vol = transp['vol']
</script>

<h3>Transporte</h3>
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

<h4>Transportador</h4>
<Opcional raiz={transp} name="transporta">
  {#if !transporta['CPF']}
    <InputT
      lab="CNPJ"
      mask="cnpj"
      bind:val={transporta['CNPJ']}
      pat={'[0-9]{14}'}
    />
  {/if}
  {#if !transporta['CNPJ']}
    <InputT
      lab="CPF"
      mask="cpf"
      bind:val={transporta['CPF']}
      max={11}
      pat={'[0-9]{11}'}
    />
  {/if}
  <InputT
    lab="Razão Social ou nome do transportador"
    min={2}
    max={60}
    bind:val={transporta['xNome']}
  />
  <InputT
    opt
    lab="Inscrição Estadual"
    pat={'ISENTO|[0-9]{2,14}'}
    max={14}
    bind:val={transporta['IE']}
  />
  <InputT
    opt
    lab="Endereço completo"
    min={1}
    max={60}
    bind:val={transporta['xEnder']}
  />
  <Municipio bind:xMun={transporta['xMun']} bind:UF={transporta['UF']} />
</Opcional>

<h4>Retenção ICMS</h4>
<Opcional raiz={transp} name="retTransp">
  <InputT
    bind:val={retTransp['vServ']}
    lab="Valor do Serviço"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTransp['vBCRet']}
    lab="BC da Retenção do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTransp['pICMSRet']}
    lab="Alíquota da Retenção"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={retTransp['vICMSRet']}
    lab="Valor do ICMS Retido"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTransp['CFOP']}
    lab="Código Fiscal de Operações e Prestações"
    pat={'[1,2,3,5,6,7]{1}[0-9]{3}'}
  />
  <InputT
    bind:val={retTransp['cMunFG']}
    lab="Código do Município de Ocorrência do Fato Gerador"
    pat={'[0-9]{7}'}
  />
</Opcional>

<h4>Meio de transporte</h4>
{#if !transp['veicTransp'] && !transp['reboque']}
  {#if !transp['balsa']}
    <h5>Vagão</h5>
    <InputT
      bind:val={transp['vagao']}
      lab="Identificação do vagão"
      min={1}
      max={20}
    />
  {/if}
  {#if !transp['vagao']}
    <h5>Balsa</h5>
    <InputT
      bind:val={transp['balsa']}
      lab="Identificação da balsa"
      min={1}
      max={20}
    />
  {/if}
{/if}
{#if !transp['balsa'] && !transp['vagao']}
  <h5>Veículo</h5>
  <Opcional raiz={transp} name="veicTransp">
    <InputT
      bind:val={veicTransp['placa']}
      lab="Placa do veículo"
      pat={'[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}'}
    />
    <Estado bind:UF={veicTransp['UF']} incluirEX />
    <InputT
      bind:val={veicTransp['RNTC']}
      opt
      lab="Registro Nacional de Transportador de Carga (ANTT)"
      min={1}
      max={20}
    />
  </Opcional>
  <h5>Reboque</h5>
  <Lista raiz={transp} name="reboque">
    <svelte:fragment slot="h" let:item>
      {item.placa} ({item.UF})
    </svelte:fragment>
    <svelte:fragment slot="b" let:item>
      <InputT
        raiz={item}
        name='placa'
        lab="Placa do veículo"
        pat={'[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}'}
      />
      <Estado raiz={item} UFName='UF' incluirEX />
      <InputT
        raiz={item}
        name='RNTC'
        opt
        lab="Registro Nacional de Transportador de Carga (ANTT)"
        min={1}
        max={20}
      />
    </svelte:fragment>
  </Lista>
{/if}

<h4>Volumes</h4>
<Lista raiz={transp} name="vol">
  <svelte:fragment slot="h" let:item>
    {item.qVol}|{item.esp}|{item.marca}|{item.nVol}
  </svelte:fragment>
  <svelte:fragment slot="b" let:item>
    <InputT
      raiz={item}
      name='qVol'
      opt
      lab="Quantidade de volumes transportados"
      pat={'[0-9]{1,15}'}
    />
    <InputT
      raiz={item}
      name='esp'
      opt
      lab="Espécie dos volumes transportados"
      min={1}
      max={60}
    />
    <InputT
      raiz={item}
      name='marca'
      opt
      lab="Marca dos volumes transportados"
      min={1}
      max={60}
    />
    <InputT
      raiz={item}
      name='nVol'
      opt
      lab="Numeração dos volumes transportados"
      min={1}
      max={60}
    />
    <InputT
      raiz={item}
      name='pesoL'
      opt
      lab="Peso líquido (em kg)"
      pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
    />
    <InputT
      raiz={item}
      name='pesoB'
      opt
      lab="Peso bruto (em kg)"
      pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
    />
    <h5>Lacres</h5>
    <Lista raiz={item} name="lacres">
      <svelte:fragment slot="h" let:item={subitem}>
        {subitem.nLacre}
      </svelte:fragment>
      <InputT
        slot="b"
        let:item={subitem}
        raiz={subitem}
        name='nLacre'
        lab="Número"
        min={1}
        max={60}
      />
    </Lista>
  </svelte:fragment>
</Lista>

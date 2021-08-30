<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Lista from '../components/Lista.svelte'
  import Opcional from '../components/Opcional.svelte'
  import Estado from '../components/Estado.svelte'

  export let raiz: any
  // Melhor criar uma versão personalizável da simplificação (mais tarde)
  export let simplificado: boolean
  $: completo = !simplificado

  if (!raiz['prod']) raiz['prod'] = {}
  let prod = raiz['prod']

  $: {
    prod['vProd'] = (+prod['qCom'] * +prod['vUnCom']).toFixed(2)
  }

  $: detExport = prod['detExport']
  $: veicProd = prod['veicProd']
  $: med = prod['med']
  $: arma = prod['arma']
  $: comb = prod['comb']
  $: CIDE = comb?.['CIDE']
  $: encerrante = comb?.['encerrante']
</script>

<h4>Dados do produto</h4>
{#if completo}
  <InputT
    bind:val={prod['cProd']}
    lab="Código do produto"
    aux="Preencher com CFOP caso se trate de itens não relacionados com mercadorias/produto e que o contribuinte não possua codificação própria (Formato: CFOP9999)"
    min={1}
    max={60}
  />
  <InputT
    bind:val={prod['cEAN']}
    lab="GTIN do produto, antigo código EAN ou código de barras"
    pat={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
  />
  <InputT
    bind:val={prod['xProd']}
    lab="Descrição do produto"
    min={1}
    max={120}
  />
  <InputT
    bind:val={prod['NCM']}
    lab="Código NCM"
    aux="É permitida a informação do gênero (posição do capítulo do NCM) quando a operação não for de comércio exterior (importação/exportação) ou o produto não seja tributado pelo IPI."
    pat={'[0-9]{2}|[0-9]{8}'}
  />
  <InputT
    bind:val={prod['NVE']}
    opt
    lab="Nomenclatura de Valor aduaneio e Estatístico"
    pat={'[A-Z]{2}[0-9]{4}'}
  />
  <InputT
    bind:val={prod['CEST']}
    opt={!prod['indEscala'] && !prod['CNPJFab']}
    lab="CEST (Codigo especificador da Substuicao Tributaria)"
    aux="Identifica a mercadoria sujeita aos regimes de substituicao tributária e de antecipação do recolhimento do imposto"
    pat={'[0-9]{7}'}
  />
  {#if prod['CEST']}
    <Select
      bind:val={prod['indEscala']}
      opt
      lab="Prozido em escala relevante"
      els={[
        ['S', 'Sim'],
        ['N', 'Não'],
      ]}
    />
    <InputT
      bind:val={prod['CNPJFab']}
      opt
      lab="CNPJ do Fabricante da Mercadoria, obrigatório para produto em escala NÃO relevante."
      pat={'[0-9]{14}'}
      max={14}
      mask="cnpj"
    />
  {/if}
  <InputT
    bind:val={prod['cBenef']}
    opt
    lab="Código de Benefício Fiscal na UF aplicado ao item"
    pat={'([!-ÿ]{8}|[!-ÿ]{10}|SEM CBENEF)?'}
  />
  <InputT
    bind:val={prod['EXTIPI']}
    opt
    lab="Código EX TIPI"
    pat={'[0-9]{2,3}'}
  />
{/if}
<InputT
  bind:val={prod['CFOP']}
  lab="CFOP (Código Fiscal de Operações e Prestações)"
  pat={'[1,2,3,5,6,7]{1}[0-9]{3}'}
/>
{#if completo}
  <InputT bind:val={prod['uCom']} lab="Unidade comercial" min={1} max={6} />
{/if}
<InputT
  bind:val={prod['qCom']}
  lab="Quantidade Comercial  do produto"
  pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
/>
<InputT
  bind:val={prod['vUnCom']}
  lab="Valor unitário de comercialização"
  pat={'0|0.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,10})?'}
/>
{#if completo}
  <InputT
    bind:val={prod['cEANTrib']}
    lab="GTIN da unidade tributável, antigo código EAN ou código de barras"
    pat={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
  />
  <InputT bind:val={prod['uTrib']} lab="Unidade Tributável" min={1} max={6} />
{/if}
<InputT
  bind:val={prod['qTrib']}
  lab="Quantidade Tributável"
  pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
/>
<InputT
  bind:val={prod['vUnTrib']}
  lab="Valor unitário de tributação"
  pat={'0|0.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,10})?'}
/>
<InputT
  bind:val={prod['vFrete']}
  opt
  lab="Valor Total do Frete"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={prod['vSeg']}
  opt
  lab="Valor Total do Seguro"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={prod['vDesc']}
  opt
  lab="Valor do Desconto"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={prod['vOutro']}
  opt
  lab="Outras despesas acessórias"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<Select
  bind:val={prod['indTot']}
  lab="O valor do item compõe o valor total da NF-e"
  els={[
    ['1', 'Sim'],
    ['0', 'Não'],
  ]}
/>
{#if false}
  <h5>Declaração de Importação</h5>
  <Lista raiz={prod} name="DI">
    <svelte:fragment slot="h" let:item>
      {item['nDI']}
    </svelte:fragment>
    <svelte:fragment slot="b" let:item>
      <InputT
        raiz={item}
        name="nDI"
        lab="Numero do Documento de Importação (DI/DSI/DA/DRI-E)"
        min={1}
        max={12}
      />
      <InputT
        raiz={item}
        name="dDI"
        lab="Data de registro da DI/DSI/DA"
        pat={'(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))'}
      />
      <InputT
        raiz={item}
        name="xLocDesemb"
        lab="Local do desembaraço aduaneiro"
        min={1}
        max={60}
      />
      <Estado
        raiz={item}
        UFName="UFDesemb"
        lab="UF onde ocorreu o desembaraço aduaneiro"
      />
      <InputT
        raiz={item}
        name="dDesemb"
        lab="Data do desembaraço aduaneiro"
        pat={'(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))'}
      />
      <Select
        raiz={item}
        name="tpViaTransp"
        lab="Via de transporte internacional informada na DI"
        els={[
          ['1', 'Maritima'],
          ['2', 'Fluvial'],
          ['3', 'Lacustre'],
          ['4', 'Aerea'],
          ['5', 'Postal'],
          ['6', 'Ferroviaria'],
          ['7', 'Rodoviaria'],
          ['8', 'Conduto'],
          ['9', 'Meios Proprios'],
          ['10', 'Entrada/Saida Ficta'],
        ]}
      />
      <InputT
        raiz={item}
        name="vAFRMM"
        opt
        lab="Valor Adicional ao frete para renovação de marinha mercante"
        pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
      />
      <Select
        raiz={item}
        name="tpIntermedio"
        lab="Forma de Importação quanto a intermediação"
        els={[
          ['1', 'Por conta propria'],
          ['2', 'Por conta e ordem'],
          ['3', 'Encomenda'],
        ]}
      />
      <InputT
        raiz={item}
        name="CNPJ"
        opt
        lab="CNPJ do adquirente ou do encomendante"
        pat={'[0-9]{14}'}
        max={14}
        mask="cnpj"
      />
      <Estado
        raiz={item}
        UFName="UFTerceiro"
        opt
        lab="UF do adquirente ou do encomendante"
      />
      <InputT
        raiz={item}
        name="cExportador"
        lab="Código do exportador"
        aux="Usado nos sistemas internos de informação do emitente"
        min={1}
        max={60}
      />
      <h6>Adições</h6>
      <Lista raiz={item} name="adi">
        <svelte:fragment slot="h" let:item={subitem}>
          {subitem['nAdicao']} - {subitem['nSeqAdic']}
        </svelte:fragment>
        <svelte:fragment slot="b" let:item={subitem}>
          <InputT
            raiz={subitem}
            name="nAdicao"
            lab="Número da adição"
            pat={'[1-9]{1}[0-9]{0,2}'}
          />
          <InputT
            raiz={subitem}
            name="nSeqAdic"
            lab="Número sequencial do item dentro da adição"
            pat={'[1-9]{1}[0-9]{0,2}'}
          />
          <InputT
            raiz={subitem}
            name="cFabricante"
            lab="Código do fabricante estrangeiro"
            aux="Usado nos sistemas internos de informação do emitente"
            min={1}
            max={60}
          />
          <InputT
            raiz={subitem}
            name="vDescDI"
            opt
            lab="Valor do desconto do item da DI – adição"
            pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
          />
          <InputT
            raiz={subitem}
            name="nDraw"
            opt
            lab="Número do ato concessório de Drawback"
            pat={'[0-9]{0,11}'}
          />
        </svelte:fragment>
      </Lista>
    </svelte:fragment>
  </Lista>
  <h5>Detalhe da exportação</h5>
  <Lista {raiz} name="detExport">
    <svelte:fragment slot="summary" let:item>
      {item['nDraw']}
    </svelte:fragment>
    <svelte:fragment slot="body" let:i>
      <InputT
        bind:val={detExport[i]['nDraw']}
        opt
        lab="Número do ato concessório de Drawback"
        pat={'[0-9]{0,11}'}
      />
      <h6>Exportação indireta</h6>
      <Opcional {raiz} name="exportInd">
        <InputT
          bind:val={detExport[i]['exportInd']['nRE']}
          lab="Registro de exportação"
          pat={'[0-9]{0,12}'}
        />
        <InputT
          bind:val={detExport[i]['exportInd']['chNFe']}
          lab="Chave de acesso da NF-e recebida para exportação"
          pat={'[0-9]{44}'}
          max={44}
        />
        <InputT
          bind:val={detExport[i]['exportInd']['qExport']}
          lab="Quantidade do item efetivamente exportado"
          pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
        />
      </Opcional>
    </svelte:fragment>
  </Lista>
  <InputT
    bind:val={prod['xPed']}
    opt
    lab="Pedido de compra"
    aux="Informação de interesse do emissor para controle do B2B"
    min={1}
    max={15}
  />
  <InputT
    bind:val={prod['nItemPed']}
    opt
    lab="Número do item do pedido de compra"
    pat={'[0-9]{1,6}'}
  />
  <InputT
    bind:val={prod['nFCI']}
    opt
    lab="Número de controle da FCI (Ficha de Conteúdo de Importação)"
    pat={'[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}'}
  />
{/if}
<Lista raiz={prod} name="rastro">
  <svelte:fragment slot="h" let:item>
    {item['nLote']}
  </svelte:fragment>
  <svelte:fragment slot="b" let:item>
    <InputT
      raiz={item}
      name="nLote"
      lab="Número do lote do produto."
      min={1}
      max={20}
    />
    <InputT
      raiz={item}
      name="qLote"
      lab="Quantidade de produto no lote."
      pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,7}(.[0-9]{1,3})?'}
    />
    <InputT
      raiz={item}
      name="dFab"
      lab="Data de fabricação/produção"
      pat={'(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))'}
    />
    <InputT
      raiz={item}
      name="dVal"
      lab="Data de validade"
      aux="Informar o último dia do mês caso a validade não especifique o dia"
      pat={'(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))'}
    />
    <InputT
      raiz={item}
      name="cAgreg"
      opt
      lab="Código de agregação"
      pat={'[0-9]{1,20}'}
    />
  </svelte:fragment>
</Lista>
{#if !prod['med'] && !prod['arma'] && !prod['comb'] && !prod['nRECOPI']}
  <h5>Veículo novo</h5>
  <Opcional raiz={prod} name="veicProd">
    <Select
      bind:val={veicProd['tpOp']}
      lab="Tipo da Operação"
      els={[
        ['0', 'Venda concessionária'],
        ['1', 'Faturamento direto'],
        ['2', 'Venda direta'],
        ['3', 'Outros'],
      ]}
    />
    <InputT
      bind:val={veicProd['chassi']}
      lab="Chassi do veículo (VIN)"
      pat={'[A-Z0-9]+'}
    />
    <InputT bind:val={veicProd['cCor']} lab="Cor do veículo" min={1} max={4} />
    <InputT
      bind:val={veicProd['xCor']}
      lab="Descrição da cor"
      min={1}
      max={40}
    />
    <InputT
      bind:val={veicProd['pot']}
      lab="Potência máxima do motor do veículo em CV (cavalo vapor)"
      min={1}
      max={4}
    />
    <InputT
      bind:val={veicProd['cilin']}
      lab="Capacidade voluntária do motor expressa em CC (cilindradas)"
      min={1}
      max={4}
    />
    <InputT bind:val={veicProd['pesoL']} lab="Peso líquido" min={1} max={9} />
    <InputT bind:val={veicProd['pesoB']} lab="Peso bruto" min={1} max={9} />
    <InputT
      bind:val={veicProd['nSerie']}
      lab="Serial (série)"
      min={1}
      max={9}
    />
    <Select
      bind:val={veicProd['tpComb']}
      lab="Tipo de combustível"
      els={[
        ['01', 'Álcool'],
        ['02', 'Gasolina'],
        ['03', 'Diesel'],
        ['04', 'Gasogênio'],
        ['05', 'Gás Metano'],
        ['06', 'Elétrico/Fonte Interna'],
        ['07', 'Elétrico/Fonte Externa'],
        ['08', 'Gasolina/Gás Natural Combustível'],
        ['09', 'Álcool/Gás Natural Combustível'],
        ['10', 'Diesel/Gás Natural Combustível'],
        ['11', 'Vide/Campo/Observação'],
        ['12', 'Álcool/GNV'],
        ['13', 'Gasolina/GNV'],
        ['14', 'Diesel/GNV'],
        ['15', 'GNV'],
        ['16', 'Álcool/Gasolina'],
        ['17', 'Gasolina/Álcool/GNV'],
        ['18', 'Gasolina/Elétrico'],
      ]}
    />
    <InputT
      bind:val={veicProd['nMotor']}
      lab="Número do motor"
      min={1}
      max={21}
    />
    <InputT
      bind:val={veicProd['CMT']}
      lab="CMT (Capacidade Máxima de Tração) em toneladas"
      min={1}
      max={9}
    />
    <InputT
      bind:val={veicProd['dist']}
      lab="Distância entre eixos"
      min={1}
      max={4}
    />
    <InputT
      bind:val={veicProd['anoMod']}
      lab="Ano do modelo_Formato: AAAA"
      pat={'[0-9]{4}'}
    />
    <InputT
      bind:val={veicProd['anoFab']}
      lab="Ano de fabricação_Formato: AAAA"
      pat={'[0-9]{4}'}
    />
    <InputT bind:val={veicProd['tpPint']} lab="Tipo de pintura" />
    <Select
      bind:val={veicProd['tpVeic']}
      lab="Tipo de veículo"
      els={[
        ['02', 'Ciclomotor'],
        ['03', 'Motoneta'],
        ['04', 'Motocicleta'],
        ['05', 'Triciclo'],
        ['06', 'Automóvel'],
        ['07', 'Micro-ônibus'],
        ['08', 'Ônibus'],
        ['10', 'Reboque'],
        ['11', 'Semirreboque'],
        ['13', 'Camioneta'],
        ['14', 'Caminhão'],
        ['17', 'Caminhão trator'],
        ['18', 'Trator de rodas'],
        ['19', 'Trador esteira'],
        ['20', 'Trator misto'],
        ['21', 'Quadriciclo'],
        ['22', 'Chassi plataforma'],
        ['23', 'Caminhonete'],
        ['25', 'Utilitário'],
        ['26', 'Motor-casa'],
      ]}
    />
    <Select
      bind:val={veicProd['espVeic']}
      lab="Espécie de veículo"
      els={[
        ['1', 'Passageiro'],
        ['2', 'Carga'],
        ['3', 'Misto'],
        ['4', 'Corrida'],
        ['5', 'Tração'],
        ['6', 'Especial'],
      ]}
    />
    <Select
      bind:val={veicProd['VIN']}
      lab="Chassi remarcado"
      els={[
        ['R', 'Sim'],
        ['N', 'Não'],
      ]}
    />
    <Select
      bind:val={veicProd['condVeic']}
      lab="Condição do veículo"
      els={[
        ['1', 'Acabado'],
        ['2', 'Inacabado'],
        ['3', 'Semi-acabado'],
      ]}
    />
    <InputT
      bind:val={veicProd['cMod']}
      lab="Código Marca Modelo (utilizar tabela RENAVAM)"
      pat={'[0-9]{1,6}'}
    />
    <Select
      bind:val={veicProd['cCorDENATRAN']}
      lab="Cor"
      els={[
        ['01', 'Amarelo'],
        ['02', 'Azul'],
        ['03', 'Bege'],
        ['04', 'Branca'],
        ['05', 'Cinza'],
        ['06', 'Dourada'],
        ['07', 'Grená'],
        ['08', 'Laranja'],
        ['09', 'Marrom'],
        ['10', 'Prata'],
        ['11', 'Preta'],
        ['12', 'Rosa'],
        ['13', 'Roxa'],
        ['14', 'Verde'],
        ['15', 'Vermelha'],
        ['16', 'Fantasia'],
      ]}
    />
    <InputT
      bind:val={veicProd['lota']}
      lab="Lotação máxima (passageiros sentados, inclusive motorista)"
      pat={'[0-9]{1,3}'}
      min={1}
      max={3}
    />
    <Select
      bind:val={veicProd['tpRest']}
      lab="Restrição"
      els={[
        ['0', 'Não há'],
        ['1', 'Alienação Fiduciária'],
        ['2', 'Arrendamento Mercantil'],
        ['3', 'Reserva de Domínio'],
        ['4', 'Penhor de Veículos'],
        ['9', 'Outras'],
      ]}
    />
  </Opcional>
{/if}
{#if !prod['veicProd'] && !prod['arma'] && !prod['comb'] && !prod['nRECOPI']}
  <h5>Medicamento</h5>
  <Opcional raiz={prod} name="med">
    <InputT
      bind:val={med['cProdANVISA']}
      lab="Registro ANVISA (usar literal ISENTO no caso de medicamento isento de registro na ANVISA"
      pat={'[0-9]{13}|ISENTO'}
    />
    {#if med['cProdANVISA'] == 'ISENTO'}
      <InputT
        bind:val={med['xMotivoIsencao']}
        opt
        lab="Motivo da isenção"
        aux="Para medicamento isento de registro na ANVISA, informar o número da decisão que o isenta, como por exemplo o número da Resolução da Diretoria Colegiada da ANVISA (RDC)"
        min={1}
        max={255}
      />
    {/if}
    <InputT
      bind:val={med['vPMC']}
      lab="Preço máximo ao consumidor."
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
  </Opcional>
{/if}
{#if !prod['veicProd'] && !prod['med'] && !prod['comb'] && !prod['nRECOPI']}
  <h5>Armamento</h5>
  <Opcional raiz={prod} name="arma">
    <Select
      bind:val={arma['tpArma']}
      lab="Tipo de arma de fogo"
      els={[
        ['0', 'Uso permitido'],
        ['1', 'Uso restrito'],
      ]}
    />
    <InputT
      bind:val={arma['nSerie']}
      lab="Número de série da arma"
      min={1}
      max={15}
    />
    <InputT
      bind:val={arma['nCano']}
      lab="Número de série do cano"
      min={1}
      max={15}
    />
    <InputT
      bind:val={arma['descr']}
      lab="Descrição completa da arma"
      aux="Compreendendo: calibre, marca, capacidade, tipo de funcionamento, comprimento e demais elementos que permitam a sua perfeita identificação"
      min={1}
      max={256}
    />
  </Opcional>
{/if}
{#if !prod['veicProd'] && !prod['med'] && !prod['arma'] && !prod['nRECOPI']}
  <h5>Combustível</h5>
  <Opcional raiz={prod} name="comb">
    <InputT
      bind:val={comb['cProdANP']}
      lab="Código de produto da ANP"
      pat={'[0-9]{9}'}
    />
    <InputT
      bind:val={comb['descANP']}
      lab="Descrição do Produto conforme ANP"
      aux="Utilizar a descrição de produtos do SIMP (Sistema de Informações de Movimentação de Produtos)"
      min={2}
      max={95}
    />
    {#if comb['cProdANP'] == 210203001}
      <InputT
        bind:val={comb['pGLP']}
        opt
        lab="Percentual do GLP derivado do petróleo no produto GLP"
        aux="Valores de 0 a 100"
        pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
      />
      <InputT
        bind:val={comb['pGNn']}
        opt
        lab="Percentual de gás natural nacional GLGNn para o produto GLP"
        aux="Valores de 0 a 100"
        pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
      />
      <InputT
        bind:val={comb['pGNi']}
        opt
        lab="Percentual de gás natural importado GLGNi para o produto GLP"
        aux="Valores de 0 a 100"
        pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
      />
      <InputT
        bind:val={comb['vPart']}
        opt
        lab="Valor de partida (por quilograma sem ICMS)"
        pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
      />
    {/if}
    <InputT
      bind:val={comb['CODIF']}
      opt
      lab="Código de autorização / registro do CODIF"
      aux="Informar apenas quando a UF utilizar o CODIF (Sistema de Controle do Diferimento do Imposto nas Operações com Álcool Etílico Anidro Combustível)"
      pat={'[0-9]{1,21}'}
    />
    <InputT
      bind:val={comb['qTemp']}
      opt
      lab="Quantidade de combustível faturada à temperatura ambiente"
      aux="Informar quando a quantidade faturada informada no campo de quantidade comercial tiver sido ajustada para uma temperatura diferente da ambiente"
      pat={'0.[1-9]{1}[0-9]{3}|0.[0-9]{3}[1-9]{1}|0.[0-9]{2}[1-9]{1}[0-9]{1}|0.[0-9]{1}[1-9]{1}[0-9]{2}|[1-9]{1}[0-9]{0,11}(.[0-9]{4})?'}
    />
    <Estado bind:UF={comb['UFCons']} incluirEX lab="UF de consumo" />

    <h6>CIDE (Contribuição de Intervenção no Domínio Econômico)</h6>
    <Opcional raiz={comb} name="CIDE">
      <InputT
        bind:val={CIDE['qBCProd']}
        lab="BC do CIDE ( Quantidade comercializada)"
        pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(.[0-9]{1,4})?'}
      />
      <InputT
        bind:val={CIDE['vAliqProd']}
        lab="Alíquota do CIDE  (em reais)"
        pat={'0|0.[0-9]{4}|[1-9]{1}[0-9]{0,10}(.[0-9]{4})?'}
      />
      <InputT
        bind:val={CIDE['vCIDE']}
        lab="Valor do CIDE"
        pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
      />
    </Opcional>

    <h6>Encerrante</h6>
    <Opcional raiz={comb} name="encerrante">
      <InputT
        bind:val={encerrante['nBico']}
        lab="Numero do bico utilizado no abastecimento"
        pat={'[0-9]{1,3}'}
      />
      <InputT
        bind:val={encerrante['nBomba']}
        opt
        lab="Numero da bomba, caso exista"
        pat={'[0-9]{1,3}'}
      />
      <InputT
        bind:val={encerrante['nTanque']}
        lab="Numero de identificação do tanque"
        pat={'[0-9]{1,3}'}
      />
      <InputT
        bind:val={encerrante['vEncIni']}
        lab="Valor do Encerrante no ínicio do abastecimento"
        pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
      />
      <InputT
        bind:val={encerrante['vEncFin']}
        lab="Valor do Encerrante no final do abastecimento"
        pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
      />
    </Opcional>
  </Opcional>
{/if}
{#if !prod['veicProd'] && !prod['med'] && !prod['arma'] && !prod['comb']}
  <InputT
    bind:val={prod['nRECOPI']}
    lab="Número do RECOPI"
    pat={'[0-9]{20}'}
    max={20}
  />
{/if}

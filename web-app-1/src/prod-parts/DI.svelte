<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Lista from '../components/Lista.svelte'
  import Estado from '../components/Estado.svelte'

  export let raiz: any
</script>

<h4>Declaração de Importação</h4>
<Lista {raiz} name="DI">
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
    <h5>Adições</h5>
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

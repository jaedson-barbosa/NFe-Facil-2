<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Select from "../components/Select.svelte";
  import Estado from "../components/Estado.svelte";
  import Lista from "../components/Lista.svelte";

  export let raiz: any;

  const el = "DI";
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];

  if (!r['adi']) r['adi'] = []
  const adi = r['adi']
</script>

<InputT
  bind:val={r["nDI"]}
  lab="Numero do Documento de Importação (DI/DSI/DA/DRI-E)"
  min={1}
  max={12}
/>
<InputT
  bind:val={r["dDI"]}
  lab="Data de registro da DI/DSI/DA"
  pat={"(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))"}
/>
<InputT
  bind:val={r["xLocDesemb"]}
  lab="Local do desembaraço aduaneiro"
  min={1}
  max={60}
/>
<Estado bind:UF={r["UFDesemb"]} lab="UF onde ocorreu o desembaraço aduaneiro" />
<InputT
  bind:val={r["dDesemb"]}
  lab="Data do desembaraço aduaneiro"
  pat={"(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))"}
/>
<Select
  bind:val={r["tpViaTransp"]}
  lab="Via de transporte internacional informada na DI"
  els={[
    ["1", "Maritima"],
    ["2", "Fluvial"],
    ["3", "Lacustre"],
    ["4", "Aerea"],
    ["5", "Postal"],
    ["6", "Ferroviaria"],
    ["7", "Rodoviaria"],
    ["8", "Conduto"],
    ["9", "Meios Proprios"],
    ["10", "Entrada/Saida Ficta"],
  ]}
/>
<InputT
  bind:val={r["vAFRMM"]}
  opt
  lab="Valor Adicional ao frete para renovação de marinha mercante"
  pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
/>
<Select
  bind:val={r["tpIntermedio"]}
  lab="Forma de Importação quanto a intermediação"
  els={[
    ["1", "Por conta propria"],
    ["2", "Por conta e ordem"],
    ["3", "Encomenda"],
  ]}
/>
<InputT
  bind:val={r["CNPJ"]}
  opt
  lab="CNPJ do adquirente ou do encomendante"
  pat={"[0-9]{14}"}
  max={14}
  mask="cnpj"
/>
<Estado
  bind:UF={r["UFTerceiro"]}
  opt
  lab="UF do adquirente ou do encomendante"
/>
<InputT
  bind:val={r["cExportador"]}
  lab="Código do exportador"
  aux="Usado nos sistemas internos de informação do emitente"
  min={1}
  max={60}
/>
<h6>Adições</h6>
<Lista {raiz} name="adi">
  <svelte:fragment slot="summary" let:item>
    {item["nAdicao"]} - {item["nSeqAdic"]}
  </svelte:fragment>
  <svelte:fragment slot="body" let:i>
    <InputT
      bind:val={adi[i]["nAdicao"]}
      lab="Número da adição"
      pat={"[1-9]{1}[0-9]{0,2}"}
    />
    <InputT
      bind:val={adi[i]["nSeqAdic"]}
      lab="Número sequencial do item dentro da adição"
      pat={"[1-9]{1}[0-9]{0,2}"}
    />
    <InputT
      bind:val={adi[i]["cFabricante"]}
      lab="Código do fabricante estrangeiro"
      aux="Usado nos sistemas internos de informação do emitente"
      min={1}
      max={60}
    />
    <InputT
      bind:val={adi[i]["vDescDI"]}
      opt
      lab="Valor do desconto do item da DI – adição"
      pat={"0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
    />
    <InputT
      bind:val={adi[i]["nDraw"]}
      opt
      lab="Número do ato concessório de Drawback"
      pat={"[0-9]{0,11}"}
    />
  </svelte:fragment>
</Lista>

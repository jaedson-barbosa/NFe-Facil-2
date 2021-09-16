<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Lista from '../components/Lista.svelte'

  export let raiz: any
</script>

<h4>Detalhamento de rastreabilidade</h4>
<Lista {raiz} name="rastro">
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

<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Lista from '../components/Lista.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any
</script>

<h4>Detalhe da exportação</h4>
<Lista {raiz} name="detExport">
  <svelte:fragment slot="h" let:item>
    {item['nDraw']}
  </svelte:fragment>
  <svelte:fragment slot="b" let:item>
    <InputT
      raiz={item}
      name="nDraw"
      opt
      lab="Número do ato concessório de Drawback"
      pat={'[0-9]{0,11}'}
    />
    <Opcional raiz={item} name="exportInd" titulo="exportação indireta" let:r>
      <h5>Exportação indireta</h5>
      <InputT
        raiz={r}
        name="nRE"
        lab="Registro de exportação"
        pat={'[0-9]{0,12}'}
      />
      <InputT
        name="chNFe"
        raiz={r}
        lab="Chave de acesso da NF-e recebida para exportação"
        pat={'[0-9]{44}'}
        max={44}
      />
      <InputT
        name="qExport"
        raiz={r}
        lab="Quantidade do item efetivamente exportado"
        pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
      />
    </Opcional>
  </svelte:fragment>
</Lista>

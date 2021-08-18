<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Lista from '../components/Lista.svelte'

  export let raiz: any

  if (!raiz['autXML']) raiz['autXML'] = []
</script>

<h3>Autorizações de acesso ao XML</h3>
<Lista {raiz} name="autXML">
  <svelt:fragment slot="h" let:item>{item.CPF ?? item.CNPJ}</svelt:fragment>
  <svelte:fragment slot="b" let:item>
    {#if !item['CPF']}
      <InputT
        lab="CNPJ"
        mask="cnpj"
        raiz={item}
        name="CNPJ"
        pat={'[0-9]{14}'}
      />
    {/if}
    {#if !item['CNPJ']}
      <InputT
        lab="CPF"
        mask="cpf"
        raiz={item}
        name="CPF"
        max={11}
        pat={'[0-9]{11}'}
      />
    {/if}
  </svelte:fragment>
</Lista>

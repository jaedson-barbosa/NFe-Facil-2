<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any
</script>

<Opcional {raiz} name="II" titulo="II" let:r>
  <h4>Imposto de Importação</h4>
  <InputT
    raiz={r}
    name="vBC"
    lab="Base da BC do Imposto de Importação"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    raiz={r}
    name="vDespAdu"
    lab="Valor das despesas aduaneiras"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    raiz={r}
    name="vII"
    lab="Valor do Imposto de Importação"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    raiz={r}
    name="vIOF"
    lab="Valor do Imposto sobre Operações Financeiras"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>

<script lang="ts">
  import InputT from '../components/InputT.svelte'

  export let raiz: any
</script>

<h4>Medicamento</h4>
<InputT
  name="cProdANVISA"
  {raiz}
  lab="Registro ANVISA"
  aux="Usar literal ISENTO no caso de medicamento isento de registro na ANVISA"
  pat={'[0-9]{13}|ISENTO'}
/>
{#if raiz['cProdANVISA'] == 'ISENTO'}
  <InputT
    name="xMotivoIsencao"
    {raiz}
    opt
    lab="Motivo da isenção"
    aux="Para medicamento isento de registro na ANVISA, informar o número da decisão que o isenta, como por exemplo o número da Resolução da Diretoria Colegiada da ANVISA (RDC)"
    min={1}
    max={255}
  />
{/if}
<InputT
  name="vPMC"
  {raiz}
  lab="Preço máximo ao consumidor."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<br />

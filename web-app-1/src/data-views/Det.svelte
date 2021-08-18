<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'
  import Prod from './Prod.svelte'
  import Imposto from './Imposto.svelte'

  export let raiz: any
  export let regimeNormal: boolean

  if (!raiz) raiz = {}
  $: impostoDevol = raiz['impostoDevol']
  $: {
    if (impostoDevol && !impostoDevol.IPI) impostoDevol.IPI = {}
  }
</script>

<Prod {raiz} />
<Imposto {raiz} {regimeNormal} />

<h4>Imposto devolvido</h4>
<Opcional {raiz} name="impostoDevol">
  <InputT
    raiz={impostoDevol}
    name="pDevol"
    lab="Percentual de mercadoria devolvida"
    pat={'0(.[0-9]{2})?|100(.00)?|[1-9]{1}[0-9]{0,1}(.[0-9]{2})?'}
  />
  <InputT
    raiz={impostoDevol.IPI}
    name="vIPIDevol"
    lab="Valor do IPI devolvido"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>

<h4>Informações adicionais</h4>
<InputT
  {raiz}
  name="infAdProd"
  opt
  lab="Informações adicionais do produto"
  aux="Norma referenciada, informações complementares, etc"
  min={1}
  max={500}
/>

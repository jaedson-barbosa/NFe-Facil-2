<script lang="ts">
  import { applyMask } from '../app/documentUtils'

  export let CPF: string
  export let CNPJ: string
  export let idEstrangeiro = ''

  $: value = CPF
    ? applyMask(CPF, 'cpf')
    : CNPJ
    ? applyMask(CNPJ, 'cnpj')
    : idEstrangeiro
</script>

{value}

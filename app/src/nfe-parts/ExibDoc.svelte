<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'

  export let CPF: string
  export let CNPJ: string
  export let idEstrangeiro = ''

  $: value = CPF
    ? aplicarMascara(CPF, 'cpf')
    : CNPJ
    ? aplicarMascara(CNPJ, 'cnpj')
    : idEstrangeiro
</script>

{value}

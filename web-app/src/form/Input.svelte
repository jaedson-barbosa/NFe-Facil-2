<script lang="ts">
  import InputD from './InputD.svelte'
  import InputT from './InputT.svelte'

  export let el: any
  export let root: any

  $: {
    if (!root[el.name]) root[el.name] = ''
  }

  $: ({ aux, label } = el.annotation)
</script>

{#if el.restriction.decimal}
  <InputD
    optional={el.optional}
    decimal={+el.restriction.decimal}
    {label}
    {aux}
    bind:value={root[el.name]}
  />
{:else}
  <InputT
    optional={el.optional}
    {label}
    {aux}
    mask={el.type == 'TCpf'
      ? 'cpf'
      : el.type == 'TCnpj'
      ? 'cnpj'
      : el.name == 'CEP'
      ? 'zipcode'
      : undefined}
    minlength={+el.restriction.minLength}
    maxlength={+el.restriction.maxLength}
    pattern={el.restriction.pattern}
    bind:value={root[el.name]}
  />
{/if}

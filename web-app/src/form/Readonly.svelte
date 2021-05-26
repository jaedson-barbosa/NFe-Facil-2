<script lang="ts">
  import ReadonlyV from './ReadonlyV.svelte'
  
  export let el: any
  export let root: any

  $: {
    const enumeration = el.restriction?.enumeration
    if (typeof enumeration == 'string') {
      if (enumeration.startsWith('return ')) {
        const func = new Function('r', enumeration)
        root[el.name] = func(root)
      }
      else root[el.name] = enumeration
    }
    else if (!root[el.name]) root[el.name] = ''
  }

  const { aux, label } = el.annotation
  $: required = !el.optional
</script>

<ReadonlyV {required} {label} {aux} value={root[el.name]} />

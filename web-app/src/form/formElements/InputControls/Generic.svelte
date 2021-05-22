<script lang="ts">
  import { applyMask } from '@app/documentUtils'

  export let el: any
  export let id: string
  export let root: any
  let value = root[el.name]

  $: {
    root[el.name] = value ?? (value = '')
    root = root
  }

  const restriction = el.restriction as {
    pattern?: string
    minLength?: number
    maxLength?: number
  }

  function getType() {
    if (el.name == 'fone') return 'tel'
    if (el.name == 'email') return 'email'
    // if (el.name == 'senha') return 'password'
    if (el.type == 'TData') return 'date'
    // if (!/[a-zA-Z]|ÿ/.test(el.restriction?.pattern)) return 'number'
    return 'text'
  }
  const isCPF = el.type == 'TCpf'
  const isCNPJ = el.type == 'TCnpj'
  const isCEP = el.name == 'CEP'
  const hasMask = isCPF || isCNPJ || isCEP
  const type = getType()

  function getMask(text: string) {
    if (isCPF) return applyMask(text, 'cpf')
    if (isCNPJ) return applyMask(text, 'cnpj')
    if (isCEP) return applyMask(text, 'zipcode')
    return text
  }

  function handleChange(e: { currentTarget: HTMLInputElement }) {
    const text = e.currentTarget
    if (!text.value) {
      value = ''
      return
    }
    if (type == 'text' && hasMask) {
      text.value = getMask(text.value)
      value = text.value.match(/\d+/g).join('')
    } else value = text.value
  }
</script>

<input
  {id}
  class="input"
  required={!el.optional}
  pattern={restriction.pattern}
  minlength={restriction.minLength}
  maxlength={restriction.maxLength}
  {type}
  {value}
  on:blur={e => value = e.currentTarget.value}
/>

<!-- on:focus={e => e.currentTarget.value = value}
  on:blur={handleChange} -->
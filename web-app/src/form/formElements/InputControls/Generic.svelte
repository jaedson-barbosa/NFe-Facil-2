<script context="module">
  import Mask from './mask'

  const config = {
    cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    datetime: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/],
    phone: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    time: [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/],
    zipcode: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };
  const mask = new Mask(config);
  const numberPattern = /\d+/g;
</script>

<script lang="ts">
  export let el: any
  export let id: string
  export let value: string

  const restriction = el.restriction as {
    pattern?: string
    minLength?: number
    maxLength?: number
  }

  function getType() {
    if (el.name == 'fone') return 'tel'
    if (el.name == 'email') return 'email'
    if (el.type == 'TData') return 'date'
    // if (!/[a-zA-Z]|ÿ/.test(el.restriction?.pattern)) return 'number'
    return 'text'
  }
  const isCPF = el.type == 'TCpf'
  const isCNPJ = el.type == 'TCnpj'
  const isCEP = el.name == 'CEP'
  const hasMask = isCPF || isCNPJ || isCEP
  const type = getType()

  function handleChange(e: { currentTarget: HTMLInputElement }) {
    const text = e.currentTarget
    if (!text.value) {
      value = ''
      return
    }
    if (type == 'text' && hasMask) {
      if (isCPF) text.value = mask.exec(text.value, 'cpf', '_')
      if (isCNPJ) text.value = mask.exec(text.value, 'cnpj', '_');
      if (isCEP) text.value = mask.exec(text.value, 'zipcode', '_')
      value = text.value.match(numberPattern).join('')
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
  on:focus={e => e.currentTarget.value = value}
  on:blur={handleChange}
/>
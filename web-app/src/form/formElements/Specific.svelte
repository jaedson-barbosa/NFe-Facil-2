<script lang="ts">
  import { createId } from './helpers'
  import { IBGE } from '../data/IBGE.json'
  import { paises } from '../data/paises.json'

  export let el: any
  export let root: any
  export let specificReadonly: string[]

  const ufTypeObj = IBGE[0]
  type ufType = typeof ufTypeObj
  const munTypeObj = IBGE[0].Municipios[0]
  type munType = typeof munTypeObj
  const paisTypeObj = paises[0]
  type paisType = typeof paisTypeObj
  type optionType = {
    uf?: ufType
    mun?: munType
    pais?: paisType
    text: string
  }

  const name = el.name as string

  function getOptions(): optionType[] {
    const isC = name.startsWith('c')
    if (['xMun', 'cMun', 'cMunFG'].includes(name)) {
      return IBGE.flatMap((v) =>
        v.Municipios.map((k) => {
          const text = isC
            ? `${k.Codigo} (${k.Nome} - ${v.Sigla})`
            : `${k.Nome} (${v.Sigla})`
          return { uf: v, mun: k, text }
        })
      )
    } else if (name == 'cUF' || name == 'UF') {
      return IBGE.map((v) => {
        const text = isC ? `${v.Codigo} (${v.Nome})` : v.Nome
        return { uf: v, text }
      })
    } else {
      return paises.map((v) => {
        const text = isC ? `${v.codigo} (${v.nome})` : v.nome
        return { pais: v, text }
      })
    }
  }
  const options = getOptions()

  function getInitialValue() {
    if (!root[name]) return ''
    const find = (get: (v: optionType) => string) =>
      options.find((v) => get(v) == root[name])?.text ?? ''
    switch (name) {
      case 'xMun':
        return find((v) => v.mun.Nome)
      case 'cMun':
        return find((v) => v.mun.Codigo)
      case 'cMunFG':
        return find((v) => v.mun.Codigo)
      case 'cUF':
        return find((v) => v.uf.Codigo)
      case 'UF':
        return find((v) => v.uf.Sigla)
      case 'cPais':
        return find((v) => v.pais.codigo)
      case 'xPais':
        return find((v) => v.pais.nome)
      default:
        return ''
    }
  }

  function updateValues(value: any) {
    if ('mun' in value) {
      const mun = value.mun
      if (specificReadonly.includes('xMun')) root.xMun = mun.Nome
      if (specificReadonly.includes('cMun')) root.cMun = mun.Codigo
      if (specificReadonly.includes('cMunFG')) root.cMunFG = mun.Codigo
    }
    if ('uf' in value) {
      const uf = value.uf
      if (specificReadonly.includes('cUF')) root.cUF = uf.Codigo
      if (specificReadonly.includes('UF')) root.UF = uf.Sigla
    }
    if ('pais' in value) {
      const pais = value.pais
      if (specificReadonly.includes('cPais')) root.cPais = pais.codigo
      if (specificReadonly.includes('xPais')) root.xPais = pais.nome
    }
    root = root
  }

  let internalValue = getInitialValue()

  $: {
    const curOption: optionType = options.find((v) => v.text == internalValue)
    if (curOption) updateValues(curOption)
  }

  const { aux, label } = el.annotation
  const id = createId()
  const listId = createId()
  $: required = !el.optional
</script>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label" for={id}>
      {#if required}
        {label}
      {:else}
        <i>{label}</i>
      {/if}
    </label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control is-expanded">
        <input
          {id}
          class="input"
          type="text"
          list={listId}
          bind:value={internalValue}
        />
        <datalist id={listId}>
          {#each options as opt}
            <option>{opt.text}</option>
          {/each}
        </datalist>
      </div>
      {#if aux}
        <p class="help">{aux}</p>
      {/if}
    </div>
  </div>
</div>

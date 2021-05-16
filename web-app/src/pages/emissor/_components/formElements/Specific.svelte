<script lang="ts">
  import { createId } from './helpers'
  import { IBGE } from '../data/IBGE.json'
  import { paises } from '../data/paises.json'

  export let el: any
  export let specificReadonly: any
  export let value: string = ''

  const ufTypeObj = IBGE[0]
  type ufType = typeof ufTypeObj
  const munTypeObj = IBGE[0].Municipios[0]
  type munType = typeof munTypeObj
  const paisTypeObj = paises[0]
  type paisType = typeof paisTypeObj
  type optionType =
    | { uf: ufType; mun?: munType; text: string }
    | { pais?: paisType; text: string }

  const name = el.name
  const muns = ['xMun', 'cMun', 'cMunFG']
  const ufs = ['cUF', 'UF']

  function getOptions(): optionType[] {
    // Incluir opcoes para inicio em cMun para ser mais condizente
    if (muns.includes(name)) {
      return IBGE.flatMap((v) =>
        v.Municipios.map((k) => {
          return { uf: v, mun: k, text: `${k.Nome} (${v.Sigla})` }
        })
      )
    } else if (ufs.includes(name)) {
      return IBGE.map((v) => {
        return { uf: v, text: v.Nome }
      })
    } else {
      return paises.map((v) => {
        return { pais: v, text: v.nome }
      })
    }
  }
  const options = getOptions()

  function updateSpecificReadonly(value: any) {
    if ('mun' in value) {
      const mun = value.mun
      if ('xMun' in specificReadonly) specificReadonly.xMun = mun.Nome
      if ('cMun' in specificReadonly) specificReadonly.cMun = mun.Codigo
      if ('cMunFG' in specificReadonly) specificReadonly.cMunFG = mun.Codigo
    }
    if ('uf' in value) {
      const uf = value.uf
      if ('cUF' in specificReadonly) specificReadonly.cUF = uf.Codigo
      if ('UF' in specificReadonly) specificReadonly.UF = uf.Sigla
    }
    if ('pais' in value) {
      const pais = value.pais
      if ('cPais' in specificReadonly) specificReadonly.cPais = pais.codigo
      if ('xPais' in specificReadonly) specificReadonly.xPais = pais.nome
    }
  }

  function handleChange(e: { currentTarget: HTMLInputElement }) {
    const text = e.currentTarget
    const internalValue: optionType = options.find((v) => v.text == text.value)
    if (!internalValue) {
      text.value = ''
      return
    }
    updateSpecificReadonly(internalValue)
    text.value = value = specificReadonly[name]
    specificReadonly = specificReadonly
  }

  const { aux, label } = el.annotation
  const id = createId()
  const listId = createId()
</script>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label" for={id}>{label}</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control is-expanded">
        <input
          {id}
          class="input"
          type="text"
          list={listId}
          on:change={handleChange}
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

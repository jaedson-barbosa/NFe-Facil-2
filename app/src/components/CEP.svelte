<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { debounce } from 'lodash-es'

  export let UF: string
  export let Municipio: string
  export let Logradouro: string

  export let CEP: string

  let ceps: {cep: string, descricao: string}[] = []

  interface ICEP {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
  }

  interface IRequisicao {
    UF: string
    Municipio: string
    Logradouro: string
  }

  async function requisitarCEPs({ UF, Municipio, Logradouro }: IRequisicao) {
    if (!UF || !Municipio) return
    const logradouro = Logradouro?.length >= 3 ? '/' + Logradouro : ''
    const url = `https://viacep.com.br/ws/${UF}/${Municipio}${logradouro}/json`
    const res = await fetch(url)
    const json: ICEP[] = await res.json()
    console.log(JSON.stringify(json))
    ceps = json.map(v => {
      let descricao = aplicarMascara(v.cep, 'zipcode')
      if (v.bairro) {
        descricao += ' - ' + v.bairro
        if (v.logradouro) {
          descricao += ', ' + v.logradouro
          if (v.complemento) {
            descricao += ', ' + v.logradouro
          }
        }
      }
      return { cep: v.cep, descricao }
    })
  }

  const requisicaoIntervalada = debounce(
    (dados: IRequisicao) => requisitarCEPs(dados),
    1000
  )
  $: {
    if (Municipio != 'EXTERIOR') {
      const dados = { UF, Municipio, Logradouro }
      requisicaoIntervalada(dados)
    }
  }
</script>

{#if Municipio == 'EXTERIOR'}
  <label>
    CEP {aplicarMascara(CEP, 'zipcode')}
    <input pattern={'[0-9]{8}'} bind:value={CEP} required />
  </label>
{:else}
  <label>
    CEP
    <select bind:value={CEP}>
      {#each ceps as v}
        <option value={v.cep}>{v.descricao}</option>
      {/each}
    </select>
  </label>
{/if}

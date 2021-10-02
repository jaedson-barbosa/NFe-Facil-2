<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { debounce } from 'lodash-es'

  export let UF: string
  export let Municipio: string
  export let Logradouro: string

  export let CEP: string
  export let required: boolean = false

  let ceps: { cep: string; descricao: string }[] = []

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

  async function requisitarCEPs(dados: IRequisicao, primeiraTentativa = true) {
    const { UF, Municipio, Logradouro } = dados
    if (!UF || !Municipio) return
    try {
      const logradouro =
        Logradouro?.length >= 3
          ? '/' + Logradouro.replace(/[^a-zA-Z ]+/g, '')
          : ''
      const url = `https://viacep.com.br/ws/${UF}/${Municipio}${logradouro}/json`
      const res = await fetch(url)
      const json: ICEP[] = await res.json()
      console.log(JSON.stringify(json))
      ceps = json.map((v) => {
        let descricao = v.cep
        if (v.bairro) {
          descricao += ' - ' + v.bairro
          if (v.logradouro) {
            descricao += ', ' + v.logradouro
            if (v.complemento) {
              descricao += ', ' + v.logradouro
            }
          }
        }
        return { cep: v.cep.replace('-', ''), descricao }
      })
    } catch (error) {
      if (primeiraTentativa) {
        requisitarCEPs(dados, false)
      }
    }
  }

  const requisicaoIntervalada = debounce(requisitarCEPs, 1000)

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
    <input pattern={'[0-9]{8}'} bind:value={CEP} {required} />
  </label>
{:else}
  {#key ceps}
    <label>
      CEP
      <select bind:value={CEP} {required}>
        {#if !ceps.some((v) => v.cep == CEP)}
          <option value={CEP}>{aplicarMascara(CEP, 'zipcode')}</option>
        {/if}
        {#each ceps as v}
          <option value={v.cep}>{v.descricao}</option>
        {/each}
      </select>
    </label>
  {/key}
{/if}

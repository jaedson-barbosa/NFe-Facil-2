<script lang="ts">
  import { idEmpresa } from '../code/store'
  import { cadastrar as _cadastrar, defaultCatch } from '../code/functions'

  let cadastrando = false
  let certificado = undefined as FileList
  $: certificado.length && cadastrar()

  async function cadastrar() {
    cadastrando = true
    const certificadoArray = new Uint8Array(await certificado[0].arrayBuffer())
    const certificadoBase64 = btoa(String.fromCharCode(...certificadoArray))
    const senha = prompt('Senha do certificado.')
    if (!senha) {
      alert('Operação cancelada.')
      return
    }
    try {
      const req = { cert: certificadoBase64, senha }
      const res = await _cadastrar(req)
      const { cnpj } = res.data as { cnpj: string }
      $idEmpresa = cnpj
    } catch (error) {
      defaultCatch(error)
    }
    cadastrando = false
  }
</script>

{#if cadastrando}
  Aguarde, estamos analisando o certificado...
{:else}
  <label class="button">
    Cadastrar nova empresa
    <input
      type="file"
      bind:files={certificado}
      accept="application/x-pkcs12"
      required
    />
  </label>
{/if}

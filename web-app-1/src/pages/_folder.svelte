<script lang="ts">
  import { precadastro } from '../app/functions'
  import { user, idEmpresa } from '../app/store'
  import { get } from 'svelte/store'

  let cadastros: { cnpj: string; status: number; ident: string }[]

  const db = firebase.firestore()

  db.collectionGroup('usuarios')
    .where('id', '==', get(user).uid)
    .get()
    .then((registros) => {
      cadastros = registros.docs.map((v) => ({
        cnpj: v.ref.parent.parent.id,
        status: v.get('status'),
        ident: v.get('ident'),
      }))
      const logaveis = cadastros.filter((v) => v.status >= 2)
      if (!logaveis.some((v) => v.cnpj == $idEmpresa)) {
        $idEmpresa = '' // Usuario nao tem mais permissao
      } else if (logaveis.length === 1) {
        $idEmpresa = logaveis[0].cnpj // Usar o unico
      }
    })

  let cadastrando = false
  const requisicao = {
    cert: undefined as FileList,
    cnpj: '',
    ident: get(user).displayName,
    senha: '',
  }

  async function cadastrar() {
    cadastrando = true
    if (requisicao.cnpj) {
      try {
        await db
          .collection('empresas')
          .doc('cnpj')
          .collection('usuarios')
          .doc($user.uid)
          .set({
            id: $user.uid,
            status: 0,
            ident: requisicao.ident,
          })
        alert(
          'Pedido de registro efetuado, agora você pode fechar a aplicação ' +
            'e retornar após algum administrador liberar o seu acesso.'
        )
      } catch (error) {
        console.error(error)
        alert('Erro no registro do pedido: ' + error.message)
      }
    } else {
      const cert = new Uint8Array(await requisicao.cert[0].arrayBuffer())
      const envio = { ...requisicao, cert: btoa(String.fromCharCode(...cert)) }
      if (await precadastro(envio)) $idEmpresa = requisicao.cnpj
    }
    cadastrando = false
  }
</script>

<main class="container">
  {#if $user}
    {#if !cadastros}
      Aguardando análise de empresas cadastradas...
    {:else if $idEmpresa}
      <slot />
    {:else}
      {#if cadastros.length}
        <h3>Escolha de emitente</h3>
        {#each cadastros as v}
          <button>
            {v.cnpj}<br />
            <smal>{v.ident}</smal>
            {#if v.status == 0}
              Em análise
            {:else if v.status == 1}
              Rejeitado
            {:else if v.status == 2}
              Apenas leitura
            {:else if v.status == 3}
              Leitura e escrita
            {:else if v.status == 4}
              Administrador
            {/if}
          </button>
        {/each}
        <br />
      {/if}
      <h3>Cadastro</h3>
      <form on:submit|preventDefault={cadastrar}>
        <fieldset disabled={cadastrando}>
          {#if !requisicao.cert?.length}
            {#if !requisicao.cnpj}
              <label class="button">
                Escolher certificado
                <input
                  type="file"
                  bind:files={requisicao.cert}
                  accept="application/x-pkcs12"
                  required
                />
              </label>
            {/if}
            <label class="button">
              CNPJ <small>da empresa já cadastrada.</small>
              <input bind:value={requisicao.cnpj} required />
            </label>
          {/if}
          <label>
            Senha do certificado <small>para assinatura e comunicação.</small>
            <input bind:value={requisicao.senha} required />
          </label>
          <label>
            Identificação <small>no registro de usuários da empresa </small>
            <input bind:value={requisicao.ident} required />
          </label>
          <input type="submit" class="button" />
        </fieldset>
      </form>
    {/if}
  {:else if $user === undefined}
    <h1>Bem vindo ao NFe Fácil</h1>
    <button on:click={user.signIn}> Iniciar sessão </button>
  {:else}
    Aguardando serviço de autenticação...
  {/if}
</main>

<style>
  main {
    margin-top: 1.5rem;
  }

  button {
    text-align: center;
  }
</style>

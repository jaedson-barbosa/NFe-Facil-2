<script lang="ts">
  import { precadastro } from '../app/functions'
  import { user, idEmpresa } from '../app/store'
  import { get } from 'svelte/store'

  let cadastros: { cnpj: string; status: number; ident: string }[]

  const db = firebase.firestore()

  function carregarEmitentes(u: firebase.User) {
    if (!u) return
    db.collectionGroup('usuarios')
      .where('id', '==', u.uid)
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
  }

  let cadastrando = false
  const requisicao = {
    cert: undefined as FileList,
    cnpj: '',
    ident: '',
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
    carregarEmitentes($user)
    cadastrando = false
  }

  $: carregarEmitentes($user)
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
        <table>
          <thead>
            <tr>
              <th>CNPJ</th>
              <th>Identificação</th>
              <th>Acesso</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each cadastros as v}
              <tr>
                <td>{v.cnpj}</td>
                <td>{v.ident}</td>
                <td>
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
                </td>
                <td>
                  <button on:click={() => ($idEmpresa = v.cnpj)}>
                    Escolher
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <br />
      {/if}
      <h3>Cadastro</h3>
      <form on:submit|preventDefault={cadastrar}>
        <fieldset disabled={cadastrando}>
          {#if !requisicao.cnpj}
            {#if !requisicao.cert?.length}
              <label class="button">
                Escolher certificado
                <input
                  type="file"
                  bind:files={requisicao.cert}
                  accept="application/x-pkcs12"
                  required
                />
              </label>
            {:else}
              <label>
                Senha do certificado
                <input bind:value={requisicao.senha} required />
              </label>
            {/if}
          {/if}
          {#if !requisicao.cert?.length}
            <label>
              CNPJ <small>da empresa já cadastrada.</small>
              <input bind:value={requisicao.cnpj} required />
            </label>
          {/if}
          <label>
            Identificação <small>no registro de usuários da empresa</small>
            <input bind:value={requisicao.ident} required />
          </label>
          <input type="submit" class="button" />
          <details>
            <summary>Ajuda</summary>
            <p>Existem duas formas de obter acesso a um emitente:</p>
            <ol>
              <li>
                <strong>Com certificado: </strong> usando o certificado da empresa
                é possível acessar a aplicação como um administrador. Caso a empresa
                ainda não esteja cadastrada na aplicação, esta é a única forma de
                cadastro disponível.
              </li>
              <li>
                <strong>Sem certificado: </strong> sem o certificado é possível pedir
                para que um administrador liberesse o seu acesso, não sendo então
                necessário possuir o certificado para poder usar o app.
              </li>
            </ol>
            <p>
              Quanto ao campo de identificação, ele tanto é o único campo que te
              identifica na tabela de usuários da empresa quanto é o único
              identificador da empresa na sua tabela de emitentes cadastrados,
              por isso recomendo que o escolha com sabedoria.
            </p>
          </details>
        </fieldset>
      </form>
    {/if}
  {:else if $user === null}
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

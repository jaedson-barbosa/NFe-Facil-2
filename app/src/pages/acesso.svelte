<script lang="ts">
  import {
    addMembro as _addMembro,
    remMembro,
    defaultCatch,
  } from '../code/firebase'
  import { idEmpresa } from '../code/store'
  import Voltar from '../components/Voltar.svelte'

  function addMembro(escrita: boolean) {
    const idNovo = prompt('Id do novo membro:')
    _addMembro({ CNPJ: $idEmpresa, escrita, idNovo })
      .then(() => alert('Registrado com sucesso.'))
      .catch(defaultCatch)
  }

  function seBloquear() {
    const msg = 'Tens certeza de que desejas revogar teu acesso a esta empresa?'
    const certeza = confirm(msg)
    if (certeza) {
      remMembro({ CNPJ: $idEmpresa })
        .then(() => {
          alert('Acesso revogado com sucesso.')
          window.close()
        })
        .catch(defaultCatch)
    }
  }

  function bloquearOutro() {
    const idUsuario = prompt('Id do usuário que desejas bloquear:')
    if (!idUsuario) return
    remMembro({ CNPJ: $idEmpresa, idUsuario })
      .then(() => alert('Usuário bloqueado com sucesso'))
      .catch(defaultCatch)
  }
</script>

<h1><Voltar /> Controle de acesso</h1>
<h2>Adição</h2>
<button on:click={() => addMembro(false)}>Somente leitura</button>
<button on:click={() => addMembro(true)}>Leitura e escrita</button>
<p>
  Você pode liberar o acesso a outros usuários, para isso basta clicar em um dos
  dois botões acima com base no que você deseja que eles sejam capazes de fazer
  e preencher com o ID do novo usuário quando solicitado.
</p>
<h2>Remoção</h2>
<button on:click={bloquearOutro}>Outro usuário</button>
<button on:click={seBloquear}>Próprio acesso</button>
<p>
  Da mesma forma como é possível liberar o acesso a novos usuários, também é
  possível remover o acesso de usuários comuns (aqueles que não são
  administradores) e também o de você próprio (cuidado com essa função).
</p>

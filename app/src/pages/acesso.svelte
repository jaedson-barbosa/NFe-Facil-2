<script lang="ts">
  import {
    addMembro as _addMembro,
    remMembro,
    defaultCatch,
  } from '../code/firebase'
  import { idEmpresa } from '../code/store'
  import Voltar from '../components/Voltar.svelte'

  function addMembro() {
    const id = prompt('Id do novo membro:')
    _addMembro({ CNPJ: idEmpresa, id })
      .then(() => alert('Registrado com sucesso.'))
      .catch(defaultCatch)
  }

  function seBloquear() {
    const msg = 'Tens certeza de que desejas revogar teu acesso a esta empresa?'
    const certeza = confirm(msg)
    if (certeza) {
      remMembro({ CNPJ: idEmpresa })
        .then(() => {
          alert('Acesso revogado com sucesso.')
          window.close()
        })
        .catch(defaultCatch)
    }
  }

  function bloquearOutro() {
    const id = prompt('Id do usuário que desejas bloquear:')
    if (!id) return
    remMembro({ CNPJ: idEmpresa, id })
      .then(() => alert('Usuário bloqueado com sucesso'))
      .catch(defaultCatch)
  }
</script>

<h1><Voltar /> Controle de acesso</h1>
<button on:click={addMembro}>Adicionar funcionário</button>
<p>
  Você pode liberar o acesso a outros usuários para que eles possam fazer
  operações nesta empresa, como por seus funcionários.
</p>
<button on:click={bloquearOutro}>Remover funcionário</button>
<button on:click={seBloquear}>Se remover</button>
<p>
  Da mesma forma como é possível liberar o acesso a novos usuários, também é
  possível remover o acesso de usuários comuns (aqueles que não são
  administradores) e também o de você próprio (cuidado com essa função).
</p>

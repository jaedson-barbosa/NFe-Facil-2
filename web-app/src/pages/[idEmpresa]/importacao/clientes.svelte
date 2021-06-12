<script lang="ts">
  import { url } from '@roxi/routify'
  import { dbColumns } from '@app/store'
  import { status } from './status'
  import type { IScoped } from './IScoped'
  import { applyMask } from '@app/documentUtils'

  export let scoped: IScoped

  function getDocumento(dest: any, mask = false) {
    const cpf = dest.CPF
    if (cpf) return mask ? applyMask(cpf, 'cpf') : cpf
    const cnpj = dest.CNPJ
    if (cnpj) return mask ? applyMask(cnpj, 'cnpj') : cnpj
    const idEstrangeiro = dest.idEstrangeiro
    return idEstrangeiro
  }

  type TCliente = { dest: any; status: status }

  let filteredDests: TCliente[] = scoped.nfes
    .filter((v) => v.dest)
    .map((v) => v.dest)
    .filter((v) => getDocumento(v))
    .filter((v) => v.xNome)
    .filter((v, i, a) => {
      const doc = getDocumento(v)
      return a.findIndex((k) => getDocumento(k) == doc) == i
    })
    .map((v) => {
      return { dest: v, status: status.aguardando } as TCliente
    })

  const destsColumn = $dbColumns.clientes
  Promise.all(
    filteredDests.map(async (v, i) => {
      const update = (status: status) => {
        filteredDests[i].status = status
        filteredDests = filteredDests
      }
      try {
        const id = getDocumento(v.dest)
        const docRef = destsColumn.doc(id)
        const resp = await docRef.get()
        if (resp.exists) throw new Error('Já registrado.')
        await docRef.set({ dest: v.dest })
        update(status.aceito)
      } catch (error) {
        console.log(error)
        update(status.recusado)
      }
    })
  ).then(() => (showActions = true))

  let showActions = false
</script>

<div class="container is-fluid">
  <section class="section">
    <h1 class="title">Análise de clientes</h1>
    <h2 class="subtitle">
      Os clientes das notas fiscais são analisados e apenas aqueles que ainda
      não estão cadastrados serão registrados.
    </h2>
  </section>
  <div class="content">
    {#each filteredDests as dest}
      <div class="icon-text">
        {#if dest.status == status.recusado}
          <span class="icon has-text-danger">
            <i class="fas fa-ban" />
          </span>
          <span> Cliente não aceito </span>
        {:else if dest.status == status.aceito}
          <span class="icon has-text-success">
            <i class="fas fa-check" />
          </span>
          <span> Cliente aceito </span>
        {:else if dest.status == status.aguardando}
          <span class="icon has-text-info">
            <i class="fas fa-ellipsis-h" />
          </span>
          <span> Aguardando </span>
        {/if}
      </div>
      <p class="block">{dest.dest.xNome} ({getDocumento(dest.dest, true)})</p>
    {/each}
  </div>
  {#if showActions}
    <a class="button is-primary" href={$url(scoped.getNext('./clientes'))}>
      Continuar
    </a>
  {/if}
</div>

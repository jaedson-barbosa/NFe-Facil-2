<script lang="ts">
  import { url } from '@roxi/routify'
  import { dbColumns } from '@app/store'
  import { status } from './status'
  import { createId } from '@form/helpers'
  import type { IScoped } from './IScoped'
  
  export let scoped: IScoped

  function getIdImport(det: any) {
    return det.prod.cProd + ' - ' + det.prod.xProd
  }

  type TProduto = { det: any; status: status }

  let filteredDets: TProduto[] = scoped.nfes
    .flatMap((v) => v.det as any[])
    .filter((v, i, a) => {
      const doc = getIdImport(v)
      return a.findIndex((k) => getIdImport(k) == doc) == i
    })
    .map((v) => {
      return { det: v, status: status.aguardando } as TProduto
    })

  const detsColumn = $dbColumns.produtos
  Promise.all(
    filteredDets.map(async (v, i) => {
      const update = (status: status) => {
        filteredDets[i].status = status
        filteredDets = filteredDets
      }
      try {
        const det = v.det
        const cProd = det.prod.cProd as string
        const exists = async (id: string) => {
          const doc = await detsColumn.doc(id).get()
          return doc.exists
        }
        if (cProd.startsWith('CFOP')) {
          let novoCProd: string
          do {
            novoCProd = createId(5)
          } while (await exists(novoCProd))
          v.det.prod.cProd = novoCProd
        } else if (await exists(cProd)) {
          throw new Error('Já registrado.')
        }
        await detsColumn.doc(cProd).set({ det })
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
    <h1 class="title">Análise de produtos</h1>
    <h2 class="subtitle">
      Os produtos das notas fiscais são analisados usando tanto o código quanto
      a descrição e apenas aqueles que ainda não estão cadastrados serão
      registrados.
    </h2>
  </section>
  <div class="content">
    {#each filteredDets as det}
      <div class="icon-text">
        {#if det.status == status.recusado}
          <span class="icon has-text-danger">
            <i class="fas fa-ban" />
          </span>
          <span> Produto não aceito </span>
        {:else if det.status == status.aceito}
          <span class="icon has-text-success">
            <i class="fas fa-check" />
          </span>
          <span> Produto aceito </span>
        {:else if det.status == status.aguardando}
          <span class="icon has-text-info">
            <i class="fas fa-ellipsis-h" />
          </span>
          <span> Aguardando </span>
        {/if}
      </div>
      <p class="block">{getIdImport(det.det)}</p>
    {/each}
  </div>
  {#if showActions}
    <a
      class="button is-primary"
      href={$url(scoped.getNext('./produtos'))}
    >
      Continuar
    </a>
  {/if}
</div>

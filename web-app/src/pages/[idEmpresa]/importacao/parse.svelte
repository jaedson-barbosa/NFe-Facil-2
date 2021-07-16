<script lang="ts">
  import { url } from '@roxi/routify'
  import * as parser from 'xml2json-light-es6module'
  import { dbColumns } from '@app/store'
  import type { IScoped } from './IScoped'
  import { status } from './status'

  export let scoped: IScoped

  type TNFe = { name: string; json?: any; status: status }

  const files = [...Array(scoped.files.length)].map((v, i) => scoped.files[i])
  let nfes: TNFe[] = files.map((v) => {
    return { name: v.name, status: status.aguardando } as TNFe
  })

  const nfesColumn = $dbColumns.notasEmitidas
  const nfcesColumn = $dbColumns.notasCEmitidas
  Promise.all(
    files.map(async (v, i) => {
      let json = undefined
      const update = (status: status) => {
        nfes[i].json = json
        nfes[i].status = status
        nfes = nfes
      }
      try {
        const xml = await v.text()
        json = parser.xml2json(xml)
        const infNFe = json.nfeProc.NFe.infNFe
        if (!infNFe.Id) throw new Error('Sem identificação.')
        const isNFCe = infNFe.ide.mod == 65
        const nfeRef = (isNFCe ? nfcesColumn : nfesColumn).doc(infNFe.Id)
        const salva = await nfeRef.get()
        if (salva.exists) throw new Error('Já registrada.')
        const nfeData = {
          cancelada: false,
          infNFe,
          dhEmi: new Date(infNFe.ide.dhEmi),
          nProt: json.nfeProc.protNFe.infProt.nProt,
          xml,
        }
        await nfeRef.set(nfeData)
        update(status.aceito)
      } catch (error) {
        console.log(error)
        update(status.recusado)
      }
    })
  ).then(() => {
    scoped.nfes = nfes
      .filter((v) => v.status == status.aceito)
      .map((v) => v.json.nfeProc.NFe.infNFe)
      .sort((a, b) => (a.ide.dhEmi > b.ide.dhEmi ? -1 : 1))
    showActions = true
  })

  let showActions = false
</script>

<div class="container">
  <section>
    <h1>Análise de NFes</h1>
    <h2>
      Apenas notas válidas e que ainda não foram importadas podem prosseguir.
    </h2>
  </section>
  {#each nfes as nfe}
    <span>
      {#if nfe.status == status.recusado}
        NFe não aceita
      {:else if nfe.status == status.aceito}
        NFe aceita
      {:else if nfe.status == status.aguardando}
        Aguardando
      {/if}
    </span>
    <span>{nfe.name}</span>
  {/each}
  {#if showActions}
    <a class="button" href={$url('../')}> Cancelar </a>
    <a class="button" href={$url(scoped.getNext())}> Continuar </a>
  {/if}
</div>

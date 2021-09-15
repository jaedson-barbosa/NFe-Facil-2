<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any
</script>

<Opcional {raiz} name="IPI" titulo="IPI" let:r>
  <h4>Imposto sobre produtos industrializados</h4>
  <InputT
    raiz={r}
    name="CNPJProd"
    opt
    lab="CNPJ do produtor da mercadoria"
    aux="Informar se diferente do emitente e somente em exportação"
    pat={'[0-9]{14}'}
    max={14}
    mask="cnpj"
  />
  <InputT
    raiz={r}
    name="cSelo"
    opt
    lab="Código do selo de controle"
    min={1}
    max={60}
  />
  <InputT
    raiz={r}
    name="qSelo"
    opt
    lab="Quantidade de selo de controle"
    pat={'[0-9]{1,12}'}
  />
  <InputT
    raiz={r}
    name="cEnq"
    lab="Código de Enquadramento Legal"
    min={1}
    max={3}
  />
  <Select
    raiz={r}
    name="CST"
    lab="Código da Situação Tributária"
    els={[
      ['00', 'Entrada com recuperação de crédito'],
      ['01', 'Entrada tributada com alíquota zero'],
      ['02', 'Entrada isenta'],
      ['03', 'Entrada não-tributada'],
      ['04', 'Entrada imune'],
      ['05', 'Entrada com suspensão'],
      ['49', 'Outras entradas'],
      ['50', 'Saída tributada'],
      ['51', 'Saída tributada com alíquota zero'],
      ['52', 'Saída isenta'],
      ['53', 'Saída não-tributada'],
      ['54', 'Saída imune'],
      ['55', 'Saída com suspensão'],
      ['99', 'Outras saídas'],
    ]}
  />
  {#if ['00', '49', '50', '99'].includes(r['CST'])}
    {#if !r['qUnid'] && !r['vUnid']}
      <InputT
        raiz={r}
        name="vBC"
        lab="Valor da BC do IPI"
        pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
      />
      <InputT
        raiz={r}
        name="pIPI"
        lab="Alíquota do IPI"
        pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
      />
    {/if}
    {#if !r['vBC'] && !r['pIPI']}
      <InputT
        raiz={r}
        name="qUnid"
        lab="Quantidade total na unidade padrão para tributação"
        pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(.[0-9]{1,4})?'}
      />
      <InputT
        raiz={r}
        name="vUnid"
        lab="Valor por Unidade Tributável"
        pat={'0|0.[0-9]{4}|[1-9]{1}[0-9]{0,10}(.[0-9]{4})?'}
      />
    {/if}
    <InputT
      raiz={r}
      name="vIPI"
      lab="Valor do IPI"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
  {/if}
</Opcional>

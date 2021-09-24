<script lang="ts">
  import { onDestroy } from 'svelte'
  import InputT from '../components/InputT.svelte'

  export let raiz: any
  if (!raiz.veicProd) raiz.veicProd = {}
  onDestroy(() => (raiz.veicProd = undefined))
</script>

<h3>Veículo novo</h3>
<label>
  Tipo de operação
  <select bind:value={raiz.veicProd.tpOp} required>
    <option value="0">Venda concessionária</option>
    <option value="1">Faturamento direto</option>
    <option value="2">Venda direta</option>
    <option value="3">Outros</option>
  </select>
</label>
<InputT
  bind:val={raiz.veicProd.chassi}
  lab="Chassi do veículo (VIN)"
  pat={'[A-Z0-9]+'}
/>
<InputT bind:val={raiz.veicProd.cCor} lab="Cor do veículo" min={1} max={4} />
<InputT bind:val={raiz.veicProd.xCor} lab="Descrição da cor" min={1} max={40} />
<InputT
  bind:val={raiz.veicProd.pot}
  lab="Potência máxima do motor do veículo em CV (cavalo vapor)"
  min={1}
  max={4}
/>
<InputT
  bind:val={raiz.veicProd.cilin}
  lab="Capacidade voluntária do motor expressa em CC (cilindradas)"
  min={1}
  max={4}
/>
<InputT bind:val={raiz.veicProd.pesoL} lab="Peso líquido" min={1} max={9} />
<InputT bind:val={raiz.veicProd.pesoB} lab="Peso bruto" min={1} max={9} />
<InputT bind:val={raiz.veicProd.nSerie} lab="Serial (série)" min={1} max={9} />
<label>
  Tipo de combustível
  <select bind:value={raiz.veicProd.tpComb} required>
    <option value="01">Álcool</option>
    <option value="02">Gasolina</option>
    <option value="03">Diesel</option>
    <option value="04">Gasogênio</option>
    <option value="05">Gás Metano</option>
    <option value="06">Elétrico/Fonte Interna</option>
    <option value="07">Elétrico/Fonte Externa</option>
    <option value="08">Gasolina/Gás Natural Combustível</option>
    <option value="09">Álcool/Gás Natural Combustível</option>
    <option value="10">Diesel/Gás Natural Combustível</option>
    <option value="11">Vide/Campo/Observação</option>
    <option value="12">Álcool/GNV</option>
    <option value="13">Gasolina/GNV</option>
    <option value="14">Diesel/GNV</option>
    <option value="15">GNV</option>
    <option value="16">Álcool/Gasolina</option>
    <option value="17">Gasolina/Álcool/GNV</option>
    <option value="18">Gasolina/Elétrico</option>
  </select>
</label>
<InputT
  bind:val={raiz.veicProd.nMotor}
  lab="Número do motor"
  min={1}
  max={21}
/>
<InputT
  bind:val={raiz.veicProd.CMT}
  lab="CMT (Capacidade Máxima de Tração) em toneladas"
  min={1}
  max={9}
/>
<InputT
  bind:val={raiz.veicProd.dist}
  lab="Distância entre eixos"
  min={1}
  max={4}
/>
<InputT
  bind:val={raiz.veicProd.anoMod}
  lab="Ano do modelo_Formato: AAAA"
  pat={'[0-9]{4}'}
/>
<InputT
  bind:val={raiz.veicProd.anoFab}
  lab="Ano de fabricação_Formato: AAAA"
  pat={'[0-9]{4}'}
/>
<InputT bind:val={raiz.veicProd.tpPint} lab="Tipo de pintura" />
<label>
  Tipo de veículo
  <select bind:value={raiz.veicProd.tpVeic} required>
    <option value="02">Ciclomotor</option>
    <option value="03">Motoneta</option>
    <option value="04">Motocicleta</option>
    <option value="05">Triciclo</option>
    <option value="06">Automóvel</option>
    <option value="07">Micro-ônibus</option>
    <option value="08">Ônibus</option>
    <option value="10">Reboque</option>
    <option value="11">Semirreboque</option>
    <option value="13">Camioneta</option>
    <option value="14">Caminhão</option>
    <option value="17">Caminhão trator</option>
    <option value="18">Trator de rodas</option>
    <option value="19">Trador esteira</option>
    <option value="20">Trator misto</option>
    <option value="21">Quadriciclo</option>
    <option value="22">Chassi plataforma</option>
    <option value="23">Caminhonete</option>
    <option value="25">Utilitário</option>
    <option value="26">Motor-casa</option>
  </select>
</label>
<label>
  Espécie de veículo
  <select bind:value={raiz.veicProd.espVeic} required>
    <option value="1">Passageiro</option>
    <option value="2">Carga</option>
    <option value="3">Misto</option>
    <option value="4">Corrida</option>
    <option value="5">Tração</option>
    <option value="6">Especial</option>
  </select>
</label>
<label>
  Chassi remarcado
  <select bind:value={raiz.veicProd.VIN} required>
    <option value="R">Sim</option>
    <option value="N">Não</option>
  </select>
</label>
<label>
  Condição do veículo
  <select bind:value={raiz.veicProd.condVeic} required>
    <option value="1">Acabado</option>
    <option value="2">Inacabado</option>
    <option value="3">Semi-acabado</option>
  </select>
</label>
<InputT
  bind:val={raiz.veicProd.cMod}
  lab="Código Marca Modelo (utilizar tabela RENAVAM)"
  pat={'[0-9]{1,6}'}
/>
<label>
  Cor
  <select bind:value={raiz.veicProd.cCorDENATRAN} required>
    <option value="01">Amarelo</option>
    <option value="02">Azul</option>
    <option value="03">Bege</option>
    <option value="04">Branca</option>
    <option value="05">Cinza</option>
    <option value="06">Dourada</option>
    <option value="07">Grená</option>
    <option value="08">Laranja</option>
    <option value="09">Marrom</option>
    <option value="10">Prata</option>
    <option value="11">Preta</option>
    <option value="12">Rosa</option>
    <option value="13">Roxa</option>
    <option value="14">Verde</option>
    <option value="15">Vermelha</option>
    <option value="16">Fantasia</option>
  </select>
</label>

<InputT
  bind:val={raiz.veicProd.lota}
  lab="Lotação máxima (passageiros sentados, inclusive motorista)"
  pat={'[0-9]{1,3}'}
  min={1}
  max={3}
/>
<label>
  Restrição
  <select bind:value={raiz.veicProd.tpRest} required>
    <option value="0">Não há</option>
    <option value="1">Alienação Fiduciária</option>
    <option value="2">Arrendamento Mercantil</option>
    <option value="3">Reserva de Domínio</option>
    <option value="4">Penhor de Veículos</option>
    <option value="9">Outras</option>
  </select>
</label>

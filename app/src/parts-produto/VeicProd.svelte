<script lang="ts">
  import { pattern } from '../code/patterns'

  export let veicProd: any
</script>

<h3>Veículo novo</h3>
<label>
  Tipo de operação
  <select bind:value={veicProd.tpOp} required>
    <option value="0">Venda concessionária</option>
    <option value="1">Faturamento direto</option>
    <option value="2">Venda direta</option>
    <option value="3">Outros</option>
  </select>
</label>
<label>
  Chassi do veículo (VIN)
  <input pattern={'[A-Z0-9]+'} bind:value={veicProd.chassi} required />
</label>
<label>
  Código da cor da montadora
  <input maxlength="4" bind:value={veicProd.cCor} required {pattern} />
</label>
<label>
  Descrição da cor da montadora
  <input maxlength="40" bind:value={veicProd.xCor} required {pattern} />
</label>
<label>
  Potência máxima do motor do veículo em CV
  <input maxlength="4" bind:value={veicProd.pot} required {pattern} />
</label>
<label>
  Capacidade voluntária do motor expressa em CC
  <input maxlength="4" bind:value={veicProd.cilin} required {pattern} />
</label>
<label>
  Peso líquido
  <input maxlength="9" bind:value={veicProd.pesoL} required {pattern} />
</label>
<label>
  Peso bruto
  <input maxlength="9" bind:value={veicProd.pesoB} required {pattern} />
</label>
<label>
  Série
  <input maxlength="9" bind:value={veicProd.nSerie} required {pattern} />
</label>
<label>
  Tipo de combustível
  <select bind:value={veicProd.tpComb} required>
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
<label>
  Número do motor
  <input maxlength="21" bind:value={veicProd.nMotor} required {pattern} />
</label>
<label>
  CMT (Capacidade Máxima de Tração) em toneladas
  <input maxlength="9" bind:value={veicProd.CMT} required {pattern} />
</label>
<label>
  Distância entre eixos
  <input maxlength="4" bind:value={veicProd.dist} required {pattern} />
</label>
<label>
  Ano do modelo
  <input
    minlength="4"
    maxlength="4"
    bind:value={veicProd.anoMod}
    required
    {pattern}
  />
</label>
<label>
  Ano de fabricação
  <input
    minlength="4"
    maxlength="4"
    bind:value={veicProd.anoFab}
    required
    {pattern}
  />
</label>
<label>
  Tipo de pintura
  <input
    minlength="1"
    maxlength="1"
    bind:value={veicProd.tpPint}
    {pattern}
  />
</label>
<label>
  Tipo de veículo
  <select bind:value={veicProd.tpVeic} required>
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
  <select bind:value={veicProd.espVeic} required>
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
  <select bind:value={veicProd.VIN} required>
    <option value="R">Sim</option>
    <option value="N">Não</option>
  </select>
</label>
<label>
  Condição do veículo
  <select bind:value={veicProd.condVeic} required>
    <option value="1">Acabado</option>
    <option value="2">Inacabado</option>
    <option value="3">Semi-acabado</option>
  </select>
</label>
<label>
  Código do modelo (RENAVAM)
  <input pattern={'[0-9]{1,6}'} bind:value={veicProd.cMod} required />
</label>
<label>
  Cor
  <select bind:value={veicProd.cCorDENATRAN} required>
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
<label>
  Lotação máxima
  <input
    type="number"
    step="1"
    max="999"
    bind:value={veicProd.lota}
    required
    title="Passageiros sentados, inclusive motorista"
  />
</label>
<label>
  Restrição
  <select bind:value={veicProd.tpRest} required>
    <option value="0">Não há</option>
    <option value="1">Alienação Fiduciária</option>
    <option value="2">Arrendamento Mercantil</option>
    <option value="3">Reserva de Domínio</option>
    <option value="4">Penhor de Veículos</option>
    <option value="9">Outras</option>
  </select>
</label>

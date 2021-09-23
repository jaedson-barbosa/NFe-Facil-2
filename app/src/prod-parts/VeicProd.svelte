<script lang="ts">
  import { onDestroy } from 'svelte'
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

  export let raiz: any
  if (!raiz.veicProd) raiz.veicProd = {}
  onDestroy(() => (raiz.veicProd = undefined))
</script>

<h3>Veículo novo</h3>
<Select
  bind:val={raiz.veicProd.tpOp}
  lab="Tipo da Operação"
  els={[
    ['0', 'Venda concessionária'],
    ['1', 'Faturamento direto'],
    ['2', 'Venda direta'],
    ['3', 'Outros'],
  ]}
/>
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
<Select
  bind:val={raiz.veicProd.tpComb}
  lab="Tipo de combustível"
  els={[
    ['01', 'Álcool'],
    ['02', 'Gasolina'],
    ['03', 'Diesel'],
    ['04', 'Gasogênio'],
    ['05', 'Gás Metano'],
    ['06', 'Elétrico/Fonte Interna'],
    ['07', 'Elétrico/Fonte Externa'],
    ['08', 'Gasolina/Gás Natural Combustível'],
    ['09', 'Álcool/Gás Natural Combustível'],
    ['10', 'Diesel/Gás Natural Combustível'],
    ['11', 'Vide/Campo/Observação'],
    ['12', 'Álcool/GNV'],
    ['13', 'Gasolina/GNV'],
    ['14', 'Diesel/GNV'],
    ['15', 'GNV'],
    ['16', 'Álcool/Gasolina'],
    ['17', 'Gasolina/Álcool/GNV'],
    ['18', 'Gasolina/Elétrico'],
  ]}
/>
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
<Select
  bind:val={raiz.veicProd.tpVeic}
  lab="Tipo de veículo"
  els={[
    ['02', 'Ciclomotor'],
    ['03', 'Motoneta'],
    ['04', 'Motocicleta'],
    ['05', 'Triciclo'],
    ['06', 'Automóvel'],
    ['07', 'Micro-ônibus'],
    ['08', 'Ônibus'],
    ['10', 'Reboque'],
    ['11', 'Semirreboque'],
    ['13', 'Camioneta'],
    ['14', 'Caminhão'],
    ['17', 'Caminhão trator'],
    ['18', 'Trator de rodas'],
    ['19', 'Trador esteira'],
    ['20', 'Trator misto'],
    ['21', 'Quadriciclo'],
    ['22', 'Chassi plataforma'],
    ['23', 'Caminhonete'],
    ['25', 'Utilitário'],
    ['26', 'Motor-casa'],
  ]}
/>
<Select
  bind:val={raiz.veicProd.espVeic}
  lab="Espécie de veículo"
  els={[
    ['1', 'Passageiro'],
    ['2', 'Carga'],
    ['3', 'Misto'],
    ['4', 'Corrida'],
    ['5', 'Tração'],
    ['6', 'Especial'],
  ]}
/>
<Select
  bind:val={raiz.veicProd.VIN}
  lab="Chassi remarcado"
  els={[
    ['R', 'Sim'],
    ['N', 'Não'],
  ]}
/>
<Select
  bind:val={raiz.veicProd.condVeic}
  lab="Condição do veículo"
  els={[
    ['1', 'Acabado'],
    ['2', 'Inacabado'],
    ['3', 'Semi-acabado'],
  ]}
/>
<InputT
  bind:val={raiz.veicProd.cMod}
  lab="Código Marca Modelo (utilizar tabela RENAVAM)"
  pat={'[0-9]{1,6}'}
/>
<Select
  bind:val={raiz.veicProd.cCorDENATRAN}
  lab="Cor"
  els={[
    ['01', 'Amarelo'],
    ['02', 'Azul'],
    ['03', 'Bege'],
    ['04', 'Branca'],
    ['05', 'Cinza'],
    ['06', 'Dourada'],
    ['07', 'Grená'],
    ['08', 'Laranja'],
    ['09', 'Marrom'],
    ['10', 'Prata'],
    ['11', 'Preta'],
    ['12', 'Rosa'],
    ['13', 'Roxa'],
    ['14', 'Verde'],
    ['15', 'Vermelha'],
    ['16', 'Fantasia'],
  ]}
/>
<InputT
  bind:val={raiz.veicProd.lota}
  lab="Lotação máxima (passageiros sentados, inclusive motorista)"
  pat={'[0-9]{1,3}'}
  min={1}
  max={3}
/>
<Select
  bind:val={raiz.veicProd.tpRest}
  lab="Restrição"
  els={[
    ['0', 'Não há'],
    ['1', 'Alienação Fiduciária'],
    ['2', 'Arrendamento Mercantil'],
    ['3', 'Reserva de Domínio'],
    ['4', 'Penhor de Veículos'],
    ['9', 'Outras'],
  ]}
/>

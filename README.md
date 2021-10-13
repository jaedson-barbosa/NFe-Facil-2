# NFe Fácil

O objetivo deste projeto é ser o emissor fiscal gratuito mais leve, fácil de entender e bem documentado já produzido.



BANCO DE DADOS - FIRESTORE
certificados: //completamente inacessivel, usar metodo para cadastra-los
publicCert
privateCert

empresas: // cadastro apenas via servidor
emit (...)
serieNFe
serieNFCe
IDCSC
CSC
tokenIBPT
-clientes:
  dest: ...
-transportes:
  transporta: ...
-produtos:
  det: ...
  ibpt:
    isNacional
    federal
    estadual
    municipal
    validade
-nfes:
  infNFe
  dhEmi
  xml
  //caso emitida
  cancelada
  nProt
  xmlCancelamento

SESSIONSTORAGE
idEmpresa

METAS:
Preparação de lançamento inicial:
  Ajustar app.ts para a versão desejada
  Trocar true para false em firebase.ts
  Compilar pasta public como build
  Fazer deploy para o Firebase com a identificação da versão

REFINAMENTOS 0.2:
OK  Pôr auto ajuste de number para string na finalização
OK  Testar ajuste de number para string na finalização
OK  Corrigir erro do campo de documento (e demais patterns)
OK  Testar CEP
OK  Pôr controle de CEP em demais paginas
OK  Testar trasmissão
OK  Testar cancelamento
OK  Implementar importação de veículos
OK  Implementar importação de cancelamento
OK  Pôr texto de imposto aproximado com diferenciação entre diferentes esferas
OK  Simplificar arquivo estrutura.ts com base em sua nova função
OK  Refatorar finalização para funcionar com a nota estrutura simplificada
OK  Corrigir infNFe gerado a partir de XML (foco nos vetores)
OK  Remover sistema de idAleatorio para produtos com codigo proprio, usar CFOP no lugar
OK  Testar finalização simplificada
OK  Testar correção de infNFe na importação
OK  Adicionar patterns e validações restantes à interface
OK  Testar todos os sistemas de importação
OK  Testar edição e clonagem de notas fiscais, com foco em analisar datas e números
OK  Fazer pull request pro main e liberar versão

REFINAMENTOS 0.2.1:
OK  Importação de clientes desconsiderar clientes com nome de homologação
OK  Corrigir erro na abertura de cadastro de cliente
OK  Para cancelar uma nota deve haver o famoso Carregando... e ao final deve voltar à tela inicial
OK  Mais itens exibidos nas páginas de gerenciamento e corrigir problemas no buscador
OK  Corrigir erro que acontece logo após cadastrar empresa
OK  Fazer pull request pro main e liberar versão
OK  Atualizar arquivos do projeto em relação ao server

REFINAMENTOS 0.3:
    Impressão de NFC-e:
      Criar selecao de fonte e impressao geral para testar todas as fontes, deve usar optgroup para organizar por size
      Adicionar demais validacoes e conexões em NFC-e printer
      Adicionar dhRecbto ao bd como item de NFCe emitida
      Adicionar xMsg ao armazenamento do banco de dados como opcional
    Imposto aproximado não deve aparecer nas situações não obrigatorias, desabilitar no codigo php da NF-e
    Pôr loading screen basica com animacao da logo no body antes do projeto carregar por completo

REFINAMENTOS 0.4:
    Adicionação sistema de revogação de acesso de usuários comuns
    Adicionar sistema de revogação do próprio acesso (com mensagem de confirmação)
    Refinar importação de produtos, para não armazenar informação não relacionada ao cadastro
    Adicionar suporte a logotipo
      NF-e
      NFC-e
    Liberar adição de dados durante criação de nota, basta não mudar a $edição pra undefined
    Analise geral da solução e limpeza completa
    Leitura completa dos arquivos de documentação da NFe

METAS PRÓXIMA GRANDE REFATORAÇÃO (algumas tecnologias interessantes que merecem atenção e análise):
    11TY (para geração de um site único para todas as partes)
    JEST (para alguns testes unitários em alguns componentes)
    LERNA (para o app e firebase functions)
    STORYBOOK (mais separação de componentes)
    SNOWPACK (bundling puro sem Rollup)
    RXJS (conexao entre telas e classes sem usar funcoes de atualizacao customizadas)

REFINAMENTOS futuros implementados com base na arrecadacao:
    Controle de estoque com histórico, onde cada mudança deve ter uma fonte (importação de nota de saída destinada à empresa ou emitida pela empresa ou alteração manual) que deve estar atrelada a um usuário (armazenando ID e nome)
    Listagem de usuários com acesso à empresa
    Personalização de campos da NFe em templates personalizáveis
    Atualização tributária em múltiplos produtos em simultâneo
    Criar sistema de compartilhamento de informações entre empresas, onde um usuário com permissão de acesso (mesmo que apenas leitura) deve poder transportar informações de um lugar pra outro
    Scanner de código de barras usando a câmera de celular
    Scanner de código de barras usando um scanner USB
    Relatórios (tanto tradicionais quanto de informação adicional, como por exemplo saber quantos modelos de tributação estão em uso)

Observações:  
ISSQN completamente removido. Se necessário, basta pedir a implementação ao desenvolvedor.
Retirada e entrega limitados para endereço nacional. Se necessário, basta pedir a implementação ao desenvolvedor.
Obedecida apenas regra geral de cálculo do total (pag. 122)
Ainda não há importação de eventos, então ainda notas já canceladas serão importadas como se ainda não estivessem canceladas
Continuar com analise de CNPJ: https://apiconsultacnpj.com.br/#
No iOS aparentemente não haverá solução nativa para impressão da NFC-e via serial, motivo: preguiça da Apple ou porque ela ainda não vende impressora térmica rs.
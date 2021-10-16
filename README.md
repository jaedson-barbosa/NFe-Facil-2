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
OK  Emissão de NFC-e
OK  Cancelamento de NFC-e
OK  Adicionar exibição de xMsg na resposta de transmissão de NF-e, pode ser simples mesmo, um alert já serve
OK  Salvar dhRecbto como o dhEmi a partir de agora, afinal ele é mais importante e isso evita criar um novo campo
OK  Imposto aproximado não deve aparecer nas situações não obrigatorias, desabilitar na pagina da NFe deletando o vTotTrib
OK  Criar projeto separado para o DANFE e atualizar endereço de conexão aqui
OK  Pôr loading screen basica com animacao da logo no body antes do projeto carregar por completo
OK  Testar impressão de NF-e no novo endereço
OK  Remover esquemas do projeto (eles estão no mesmo patamar dos manuais)
OK  Testar sistema de exibição do loading em diferentes telas

CORREÇÕES 0.3.1:
OK  Corrigir erro de transmissão (provavelmente relacionado ao numero)
OK  Corrigir reset da seção de identificação
    Corrigir imposto aproximado não calculado
    Testar correção de erro de transmissão

REFINAMENTOS 0.4:
    Implementar sistema de exibição do loading nas telas
    Impressão de NFC-e:
      Criar selecao de fonte e impressao geral para testar todas as fontes, deve usar optgroup para organizar por size
      Adicionar demais validacoes e conexões em NFC-e printer
    Adicionar campo de CSC e IDCSC de homologação, caso não haja será usado o de produção mesmo
    Testar emissão e impressão de NFC-e usando o ambiente de homologação
    Adicionar revogação de acesso a usuários comuns e a si mesmo (com mensagem de confirmação)
    Refinar importação de produtos, para não armazenar informação não relacionada ao cadastro
    Liberar adição de dados durante criação de nota, basta não mudar a $edição pra undefined

REFINAMENTOS 0.5:
    Adicionar suporte a logotipo na NF-e
      Importação simples
      Definição de alinhamento
      Definição de preto e branco
      Envio de informações e processamento no projeto do DANFE
    Adicionar suporte a logotipo na NFC-e
      Definição de tamanho
      Definição de forma de pixelização
    Leitura completa dos arquivos de documentação da NFe

METAS PRÓXIMA GRANDE REFATORAÇÃO (algumas tecnologias interessantes que merecem atenção e análise):
    11TY (para geração de um site único para todas as partes)
    JEST (para alguns testes unitários em alguns componentes)
    LERNA (para o app e firebase functions)
    STORYBOOK (mais separação de componentes)
    SNOWPACK (bundling puro sem Rollup)
    RXJS (conexao entre telas e classes sem usar funcoes de atualizacao customizadas)

REFINAMENTOS 0.5:
    Pôr tabela CFOP
    Pôr tabela NCM

REFINAMENTOS futuros implementados com base na arrecadacao:
    Controle de estoque
    Possibilidade de atrelar nota fiscal a um id de usuário e nome (opcional)
    Personalização de campos da NFe em templates personalizáveis
    Atualização tributária em múltiplos produtos em simultâneo
    Criar sistema de compartilhamento de informações entre empresas, onde um usuário com permissão de acesso (mesmo que apenas leitura) deve poder transportar informações de um lugar pra outro
    Scanner de código de barras usando a câmera de celular
    Scanner de código de barras usando um scanner USB
    Relatórios (tanto tradicionais quanto de informação adicional, como por exemplo saber quantos modelos de tributação estão em uso)
    Avaliar uso de domínio próprio para o app (em paralelo, para poder testar a monetização)

Observações:  
ISSQN completamente removido. Se necessário, basta pedir a implementação ao desenvolvedor.
Retirada e entrega limitados para endereço nacional. Se necessário, basta pedir a implementação ao desenvolvedor.
Obedecida apenas regra geral de cálculo do total (pag. 122)
Ainda não há importação de eventos, então ainda notas já canceladas serão importadas como se ainda não estivessem canceladas
Continuar com analise de CNPJ: https://apiconsultacnpj.com.br/#
No iOS aparentemente não haverá solução nativa para impressão da NFC-e via serial, motivo: preguiça da Apple ou porque ela ainda não vende impressora térmica rs.
Estamos tendo problemas nos webservices do ceará, é bom fazer criar testes autmáticos para validar os webservices, tanto analisando conexao quanto fazendo uma consulta de status
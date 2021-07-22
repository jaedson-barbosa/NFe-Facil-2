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
-usuarios:
  id
  status //0-Em análise/1-Rejeitado/2-Apenas leitura/3-Leitura e escrita/4-Administrador
  ident
-clientes:
  dest: ...
-transportes:
  transporta: ...
-produtos:
  det: ...
-notasSalvas:
  infNFe
  dhEmi
  xml
-notasEmitidas:
  cancelada
  infNFe
  dhEmi
  nProt
  xml
  xmlCancelamento
-notasCSalvas:
  infNFe
  dhEmi
  xml
-notasCEmitidas:
  cancelada
  infNFe
  dhEmi
  nProt
  xml
  xmlCancelamento

SESSIONSTORAGE
idEmpresa

METAS:
BASE para lançamento em pré-alpha:
OK  Cadastro de emitentes
OK  Cadastro e edição de dados base
OK  Tipos de ICMS de acordo com o regime do emitente
OK  Sistema de lista para ítens multiplos
OK  Remover tag choice
OK  Tela de NFe
OK  Exibição de notas
OK  Clonagem de NFe
OK  Servidor básico (sem todas análises)
OK    precadastro
OK    transmitirNFe
OK    gerarDANFENFe
OK    cancelarNFe
OK  Reorganizar todo o código do servidor (já que agora ele é bem mais simples)
OK  Implementar cálculo de totais
OK  Analise de certificado do precadastro
OK  Proteger certificado com a senha atual
OK  Indicar carregamento na geração de PDF e cancelamento no botão
OK  Usar documento como Id e aplicar validação de CPF e CNPJ
OK  Importação com análise de elementos já salvos
OK  Excluir antigo public-src
OK  Aplicar bloco de try-catch na entrada do servidor
OK  User store para a pasta [idEmpresa]
OK  Simplificar scoped da NFe
OK  Corrigir exibição das páginas na NFe
OK    Busca com edição de clientes, produtos e transportes
OK    Botões na parte superior da tela
OK  Remover botões limpar
OK  Adicionar análise de CPF/CNPJ direto nos inputs destes campos
OK  Adicionar análise de permissões
OK    Banco de dados
OK    Servidor
OK    Web-app
OK  Base da NFCe
OK    Adicionar grupo NFCe
OK    Adicionar colunas de NFCe
OK    Adicionar criação, edição e exibição de NFCe
OK    Importação de NFCe
OK  Adotar onCall no lugar de onRequest
OK  Ajustar funções pro server de São Paulo
OK  Liberar a transmissão em produção

Preparação de lançamento inicial:
  Ajustar info.ts para a versão desejada
  Remover ?useEmulator=true de index.html
  Comentar linha de useEmulator de functions.ts
  Compilar pasta public como build
  Fazer deploy para o Firebase com a identificação da versão

REFINAMENTOS durante pré-alpha:
    Adicionar análises de schema
    Opção de trocar a senha do certificado
    Estudar uso de https://nodejs.org/api/crypto.html no lugar de node-forge
    Inserir elementos de try-catch
    Exibição de resumo do item no botão
    Customização (em choice tem um estatico)
    User onCall no lugar de onRequest
    Remover tag name do nfe.json e fragmentá-lo em diferentes arquivos
    Dividir cadastro de produto em 2 telas (dados base e impostos) para diminuir 1 nível de hierarquia usando o mesmo sistema da tela de nfe (com root no _reset)
    Evento de cancelamento
      Importação
    Mais configurações na tela de emitente
      Função no servidor para atualização
      Emitente atualizado na sincronização
      Modo de sessão única (com sinc apenas no dados.ts)
      Controle de usuários liberados
        Liberar novos pedidos
        Revogar liberações
        Controlar permissões
    Calculo de impostos semi-automático
      ICMS
      PIS
      COFINS
      Importação
      Cadastro
      Exibição
    Otimizar nfe.json
    Interfaces para banco de dados
      Firestore
      IntexedDB
    Interfaces para requisições e respostas na pasta commom
    Mais configurações na tela de emitente
      Personalização de campos da NFe em templates personalizáveis
    Analise geral da solução e limpeza completa
    Leitura completa dos arquivos de documentação da NFe

REFINAMENTOS durante alplha:
    Criar sistema de compartilhamento de informações entre empresas, onde um usuário com permissão de acesso (mesmo que apenas leitura) deve poder transportar informações de um lugar pra outro
    Personalização com o https://jenil.github.io/bulmaswatch/
    Scanner de código de barras
      USB
      Câmera de celular
    Gerenciamento de estoque
    NFC-e
      Usar um parceiro para realizar testes de emissão
      DANFE
        Testar impressão de PDF, caso dê errado devem ser usados apps para isso, pro Android tem alguns

Observações:  
ISSQN limitado para endereço nacional. Se necessário, basta pedir a implementação ao desenvolvedor.
Retirada e entrega limitados para endereço nacional. Se necessário, basta pedir a implementação ao desenvolvedor.
Obedecida apenas regra geral de cálculo do total (pag. 122)
Adição do vServ no total do vNF não é feita automaticamente
Na requisição de acesso não é feita a análise se a empresa já existe
Ainda não há importação de eventos, então ainda notas já canceladas serão importadas como se ainda não estivessem canceladas

firebase emulators:start --import .save-data --export-on-exit
sudo kill $(sudo lsof -t -i:5000)
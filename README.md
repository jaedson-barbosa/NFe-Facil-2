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
  //caso emitida
  cancelada
  nProt
  xml
  xmlCancelamento

SESSIONSTORAGE
idEmpresa

METAS:
Preparação de lançamento inicial:
  Ajustar info.ts para a versão desejada
  Trocar true para false em firebase.ts
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
ISSQN completamente removido. Se necessário, basta pedir a implementação ao desenvolvedor.
Retirada e entrega limitados para endereço nacional. Se necessário, basta pedir a implementação ao desenvolvedor.
Obedecida apenas regra geral de cálculo do total (pag. 122)
Ainda não há importação de eventos, então ainda notas já canceladas serão importadas como se ainda não estivessem canceladas
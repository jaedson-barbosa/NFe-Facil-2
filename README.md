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
  Ajustar info.ts para a versão desejada
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
    Corrigir infNFe gerado a partir de XML (foco nos vetores)
    Testar finalização simplificada
    Testar correção de infNFe na importação
    Adicionar patterns e validações restantes à interface
    Remover sistema de idAleatorio para produtos com codigo proprio, usar CFOP no lugar
    Testar todos os sistemas de importação
    Testar edição e clonagem de notas fiscais, com foco em analisar datas e números
    Fazer pull request pro main, liberar versão e planejar próximas etapas direto no GitHub

REFINAMENTOS 0.3:
    Mudanças relevantes a definir...
    Analise geral da solução e limpeza completa
    Leitura completa dos arquivos de documentação da NFe

REFINAMENTOS futuros:
    Personalização de campos da NFe em templates personalizáveis
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
Continuar com analise de CNPJ: https://apiconsultacnpj.com.br/#
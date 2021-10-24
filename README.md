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
IDCSCh
CSCh
logotipo {
  imagem
  alinhamento
  monocromatico
  tamanho
  pixelizacao
}
tokenIBPT
-clientes:
  dest: ...
-transportes:
  transporta: ...
-produtos:
  det: ...
  ibpt:
    isNacional
    nacional
    importado
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

Preparação de lançamento inicial:
  Ajustar app.ts para a versão desejada
  Trocar true para false em firebase.ts
  Compilar pasta public como build
  Fazer deploy para o Firebase com a identificação da versão

Observações:  
ISSQN completamente removido. Se necessário, basta pedir a implementação ao desenvolvedor.
Retirada e entrega limitados para endereço nacional. Se necessário, basta pedir a implementação ao desenvolvedor.
Obedecida apenas regra geral de cálculo do total (pag. 122)
Ainda não há importação de eventos, então ainda notas já canceladas serão importadas como se ainda não estivessem canceladas
Continuar com analise de CNPJ: https://apiconsultacnpj.com.br/#
No iOS aparentemente não haverá solução nativa para impressão da NFC-e via serial, motivo: preguiça da Apple ou porque ela ainda não vende impressora térmica rs.
Estamos tendo problemas nos webservices do ceará, é bom fazer criar testes autmáticos para validar os webservices, tanto analisando conexao quanto fazendo uma consulta de status

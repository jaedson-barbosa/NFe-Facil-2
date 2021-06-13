import { onLoggedRequest } from './onLoggedRequest'
import { INotaDB } from './INotaDB'
import axios from 'axios'
import { https } from 'firebase-functions'

export const gerarDANFENFe = onLoggedRequest(async ({ body, empRef }) => {
  const idNota = body.idNota
  if (!idNota) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "idNota" (identificação da nota fiscal) ausente.'
    )
  }
  if (!('emitida' in body)) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "emitida" (identificação de emissão) ausente.'
    )
  }
  const emitida = body.emitida
  const nota = await empRef
    .collection(emitida ? 'notasEmitidas' : 'notasSalvas')
    .doc(idNota)
    .get()
  if (!nota.exists) {
    throw new https.HttpsError(
      'not-found',
      'Noda fiscal não encontrada'
    )
  }
  const data = nota.data() as INotaDB
  const urlCloud =
    'https://us-central1-nfe-facil-980bc.cloudfunctions.net/helloWorld'
  const parametros = {
    xml: data.xml.replace(/>\s+</g, '><'),
    orientacao: 'P',
    margSup: 5,
    margEsq: 5,
  }
  const danfe = await axios.post(urlCloud, parametros, {
    responseType: 'arraybuffer', // Repassa as informações sem corrompê-las
  })
  return danfe.data
}, false)

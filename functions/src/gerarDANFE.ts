import { onLoggedRequest } from './onLoggedRequest'
import { INotaDB } from './INotaDB'
import axios from 'axios'

export const gerarDANFENFe = onLoggedRequest(async ({ body, empRef }, res) => {
  const idNota = body.idNota
  if (!idNota) {
    res.status(400).send('Requisição sem id da nota.')
    return
  }
  if (!('emitida' in body)) {
    res.status(400).send('Não foi informado se a nota foi emitida ou não.')
    return
  }
  const emitida = body.emitida
  const nota = await empRef
    .collection(emitida ? 'notasEmitidas' : 'notasSalvas')
    .doc(idNota)
    .get()
  if (!nota.exists) {
    res.status(400).send('Nota não existe')
    return
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
  res.status(200).send(danfe.data)
})

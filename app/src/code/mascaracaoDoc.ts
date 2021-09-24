import { DocumentSnapshot } from '@firebase/firestore'

export type mascaras = 'cpf' | 'cnpj' | 'zipcode'

const config = {
  cpf: [
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ],
  cnpj: [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ],
  zipcode: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
}

export function mascararDocSnapshot(doc: DocumentSnapshot, raiz: string) {
  const CPF = doc.get(raiz + '.CPF')
  const CNPJ = doc.get(raiz + '.CNPJ')
  return CPF
    ? aplicarMascara(CPF, 'cpf')
    : CNPJ
    ? aplicarMascara(CNPJ, 'cnpj')
    : doc.get(raiz + '.idEstrangeiro') ?? ''
}

export function mascararDocData(data: any) {
  const CPF = data.CPF
  const CNPJ = data.CNPJ
  return CPF
    ? aplicarMascara(CPF, 'cpf')
    : CNPJ
    ? aplicarMascara(CNPJ, 'cnpj')
    : data.idEstrangeiro ?? ''
}

export function aplicarMascara(text: string, mask: mascaras) {
  if (!text) text = ''
  const regexp = config[mask]
  const chars = text.split('')
  const formated = []

  for (
    let index = 0, indexChars = 0;
    index < regexp.length;
    index += 1, indexChars += 1
  ) {
    const r = regexp[index]
    if (r instanceof RegExp) {
      const isValid = r.test(chars[indexChars])
      if (isValid && chars[indexChars]) {
        formated.push(chars[indexChars])
      } else if (chars[indexChars]) {
        index -= 1
      } else {
        formated.push('_')
      }
    } else if (chars[indexChars] || '_') {
      formated.push(regexp[index])
      indexChars -= 1
    }
  }
  return formated.join('')
}

export type mascaras = 'cpf' | 'cnpj' | 'zipcode'
  
const config = {
  cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  zipcode: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
};

export function aplicarMascara(text: string, mask: mascaras) {
  const regexp = config[mask];
  const chars = text.split('');
  const formated = [];

  for (let index = 0, indexChars = 0; index < regexp.length; index += 1, indexChars += 1) {
    const r = regexp[index]
    if (r instanceof RegExp) {
      const isValid = r.test(chars[indexChars]);
      if (isValid && chars[indexChars]) {
        formated.push(chars[indexChars]);
      } else if (chars[indexChars]) {
        index -= 1;
      } else {
        formated.push('_');
      }
    } else if (chars[indexChars] || '_') {
      formated.push(regexp[index]);
      indexChars -= 1;
    }
  }
  return formated.join('');
}
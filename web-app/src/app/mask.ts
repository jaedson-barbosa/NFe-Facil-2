export default class Mask {
  constructor(private config: any) {}

  exec(text: string, mask: string, placeholder = '') {
    const regexp = this.config[mask];
    const chars = text.split('');
    const formated = [];

    for (let index = 0, indexChars = 0; index < regexp.length; index += 1, indexChars += 1) {
      if (regexp[index] instanceof RegExp) {
        const isValid = regexp[index].test(chars[indexChars]);
        if (isValid && chars[indexChars]) {
          formated.push(chars[indexChars]);
        } else if (chars[indexChars]) {
          index -= 1;
        } else {
          formated.push(placeholder);
        }
      } else if (chars[indexChars] || placeholder) {
        formated.push(regexp[index]);
        indexChars -= 1;
      }
    }
    return formated.join('');
  }
}
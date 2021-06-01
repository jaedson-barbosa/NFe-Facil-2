import Mask from './mask'

const config = {
  cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  datetime: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/],
  time: [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/],
  zipcode: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
};
const mask = new Mask(config);

export type TMask = 'cpf' | 'cnpj' | 'zipcode'

export function applyMask(text: string, maskName: TMask) {
  return text ? mask.exec(text, maskName, '_') : ''
}

export function isCpfValid(cpf: string): boolean {
  const cpfLength = 11;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return isValid(cpf, cpfLength, weights);
}

export function isCnpjValid(cnpj: string): boolean {
  const cpfLength = 14;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6];
  return isValid(cnpj, cpfLength, weights);
}

function isValid(digits: string, correctDigitsLength: number, weights: number[]): boolean {
  const cleanDigits = getOnlyNumbers(digits);
  if (cleanDigits.length !== correctDigitsLength || isAllTheSameDigits(cleanDigits)) {
    return false;
  }
  const digitsWithoutChecker = cleanDigits.substring(0, correctDigitsLength - 2);
  const digitsChecker = cleanDigits.substring(correctDigitsLength - 2, correctDigitsLength);
  const calculetedChecker = calcChecker(digitsWithoutChecker, weights);
  return digitsChecker === calculetedChecker;
}

function getOnlyNumbers(digits: string): string {
  return digits.replace(/\D/g, '');
}

function isAllTheSameDigits(digits: string): boolean {
  return !digits.split('').some((digit) => digit !== digits[0]);
}

function calcChecker(digits: string, weights: number[]): string {
  const digitsLength = digits.length;
  const digitsLengthWithoutChecker = weights.length - 1;

  const sum = digits.split('').reduce((acc, digit, idx) => {
    return acc + +digit * weights[digitsLength - 1 - idx];
  }, 0);
  const sumDivisionRemainder = sum % 11;
  const checker = sumDivisionRemainder < 2 ? 0 : 11 - sumDivisionRemainder;

  if (digitsLength === digitsLengthWithoutChecker) {
    return calcChecker(`${digits}${checker}`, weights);
  }

  return `${digits[digitsLength - 1]}${checker}`;
}
import { IBaseFormElement } from './form-elements/IBaseFormElement';

export function generateForm(
  onSubmit: (data: any) => void,
  ...elements: IBaseFormElement[]
): HTMLFormElement;
export function generateForm(
  actions: IFormAction[],
  ...elements: IBaseFormElement[]
): HTMLFormElement
export function generateForm(
  params: ((data: any) => void) | IFormAction[],
  ...elements: IBaseFormElement[]
): HTMLFormElement {
  const form = document.createElement('form')
  elements.forEach((v) => v.generate(form))
  const createSub = (action: (data: any) => void, text: string = 'Enviar') => {
    const btn = document.createElement('button')
    if (text) btn.textContent = text
    // btn.type = 'button' Ainda queremos a validação do form
    btn.onclick = () => defaultFormSubmit(action, form)
    form.appendChild(btn)
  }
  if (params) {
    if (Array.isArray(params)) {
      params.forEach((v) => createSub(v.task, v.label))
    } else {
      createSub(params)
    }
  }
  form.onsubmit = (e) => {
    e.preventDefault()
    console.log('Submissão ignorada.')
    return false
  }
  return form
}

export interface IFormAction {
  label: string;
  task: (data: any) => void;
}

function defaultFormSubmit(
  onSubmit: (data: any) => void,
  form: HTMLFormElement
) {
  var object = {};
  const formData = new FormData(form);
  const objectArrays: any[][] = [];
  formData.forEach(function (value, key) {
    if (!value)
      return;
    const path = key.split('.');
    let temp = object;
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      const isLast = i === path.length - 1;
      if (isLast) {
        temp[p] = value;
      } else if (temp[p]) {
        temp = temp[p];
      } else {
        // se nao houver proximo ou se for alfabetico usa {}
        if (isNaN(+path[i + 1])) {
          temp = temp[p] = {};
        } else {
          const newArray = [];
          objectArrays.push(newArray);
          temp = temp[p] = newArray;
        }
      }
    }
  });
  objectArrays.forEach((v) => {
    let index = -1;
    while ((index = v.findIndex((v) => !v)) != -1) {
      v.splice(index, 1);
    }
  });
  onSubmit(object);
  return false;
}

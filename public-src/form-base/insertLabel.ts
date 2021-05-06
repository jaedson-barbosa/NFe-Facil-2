import { createId } from "./createId";

export function insertLabel(
  input: HTMLSelectElement | HTMLInputElement,
  isRequired: boolean,
  documentation?: ILabel,
  insertBefore: boolean = true,
): HTMLLabelElement {
  const label = document.createElement('label');
  if (!documentation) return label
  label.htmlFor = input.id = createId();
  if (isRequired) {
    label.textContent = documentation.label;
  } else {
    const i = document.createElement('i')
    i.textContent = documentation.label;
    label.appendChild(i)
  }
  label.title = documentation.aux ?? ''
  if (insertBefore) {
    input.before(label);
  } else {
    input.after(label);
  }
  return label;
}

export interface ILabel {
  label: string;
  aux?: string;
}

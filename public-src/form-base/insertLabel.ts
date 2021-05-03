import { processLabelText } from './processLabelText';
import { createId } from "./createId";



export function insertLabel(
  input: HTMLSelectElement | HTMLInputElement,
  documentation: string,
  insertBefore = true
): HTMLLabelElement {
  const label = document.createElement('label');
  label.htmlFor = input.id = createId();
  label.textContent = processLabelText(documentation);
  if (insertBefore) {
    input.before(label);
  } else {
    input.after(label);
  }
  return label;
}

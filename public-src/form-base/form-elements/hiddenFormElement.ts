import { IBaseFormElement } from './IBaseFormElement';
import { inputFormElement } from "./inputFormElement";


export class hiddenFormElement extends inputFormElement {
  constructor(name: string[], required: boolean, value?: string) {
    super(name, undefined, required, value);
  }

  public get clone(): IBaseFormElement {
    const el = new hiddenFormElement(
      this.nextItemName,
      this.required,
      this.value
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    this.updateBaseProps(hidden);
    parent.appendChild(hidden);
    return hidden;
  }

  public resetValue() { }
}

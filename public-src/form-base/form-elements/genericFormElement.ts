import { IBaseFormElement } from './IBaseFormElement';


export class genericFormElement implements IBaseFormElement {
  private element: string;
  public readOnly: boolean;

  constructor(el: string) {
    this.element = el;
  }

  public get clone(): IBaseFormElement {
    const el = new genericFormElement(this.element);
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const element = document.createElement('div')
    element.innerHTML = this.element
    parent.appendChild(element)
    return element
  }

  public updateValue(values: any) {
    return true;
  }
  public resetValue() { }
}

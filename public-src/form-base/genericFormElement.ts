import { IBaseFormElement } from './IBaseFormElement';


export class genericFormElement implements IBaseFormElement {
  private element: HTMLElement;
  public readOnly: boolean;

  constructor(el: HTMLElement) {
    this.element = el;
  }

  public get clone(): IBaseFormElement {
    const el = new genericFormElement(this.element);
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const element = this.element;
    parent.appendChild(element);
    return element;
  }

  public updateValue(values: any) {
    return true;
  }
  public resetValue() { }
}

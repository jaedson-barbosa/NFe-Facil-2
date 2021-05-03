import { IBaseFormElement } from './IBaseFormElement';


export class buttonFormElement implements IBaseFormElement {
  private content: string;
  private onClick: () => void;
  public readOnly: boolean;

  constructor(content: string, onClick: () => void) {
    this.content = content;
    this.onClick = onClick;
  }

  public get clone(): IBaseFormElement {
    const el = new buttonFormElement(this.content, this.onClick);
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    if (this.readOnly)
      return;
    const button = document.createElement('button');
    button.textContent = this.content;
    button.type = 'button';
    button.onclick = this.onClick;
    parent.appendChild(button);
    return button;
  }
  public updateValue() {
    return true;
  }
  public resetValue() { }
}

import { fieldsetFormElement } from './fieldsetFormElement';
import { IBaseFormElement } from './IBaseFormElement';
import { buttonFormElement } from "./buttonFormElement";


export class listFormElement implements IBaseFormElement {
  private readonly elArg: fieldsetFormElement;
  private content: IBaseFormElement[];
  private container: fieldsetFormElement;
  private parentNames: string[];
  private addAction: () => void;
  private startValues: any[];
  private startValuesArray: any[];
  public onAddItem: (content: IBaseFormElement[]) => void;
  public get readOnly() {
    return this.container.readOnly;
  }
  public set readOnly(v: boolean) {
    this.container.readOnly = v;
    this.content?.forEach((k) => (k.readOnly = v));
  }

  public set hidden(v: boolean) {
    this.container.options.hidden = v;
  }

  constructor(el: fieldsetFormElement, parentNames: string[]) {
    this.elArg = el.clone as fieldsetFormElement;
    this.content = el.children;
    const add = new buttonFormElement('Adicionar item', () => this.addAction());
    el.children = [add];
    this.container = el;
    this.parentNames = parentNames.filter((v) => !v.includes('|'));
    this.startValues = [];
    this.startValuesArray = [];
  }

  public get clone(): IBaseFormElement {
    const newList = new listFormElement(
      this.elArg.clone as fieldsetFormElement,
      this.parentNames
    );
    newList.onAddItem = this.onAddItem;
    newList.readOnly = this.readOnly;
    return newList;
  }

  public generate(parent: HTMLElement) {
    const container = this.container.generate(parent);
    const addItem = (content?: any) => {
      const details = document.createElement('details');
      details.open = true;
      const summary = document.createElement('summary');
      summary.textContent = 'Item';
      details.appendChild(summary);
      const newContent = [...this.content];
      if (content)
        newContent.forEach((v) => v.updateValue(content));
      this.onAddItem?.(newContent);
      const remover = new buttonFormElement('Remover item', () => details.remove()
      );
      newContent.push(remover);
      newContent.forEach((v) => v.generate(details));
      this.content = this.content.map((v) => v.clone);
      container.appendChild(details);
    };
    this.addAction = () => addItem();
    this.startValuesArray.forEach((v) => addItem(this.startValues));
    return container;
  }

  public updateValue(values: any) {
    let baseValueParent = undefined;
    const baseValue = this.parentNames.reduce((p, c) => {
      baseValueParent = p;
      return p?.[c];
    }, values);
    if (baseValue) {
      if (!Array.isArray(baseValue)) {
        if (!baseValueParent)
          return false;
        const lastName = this.parentNames[this.parentNames.length - 1];
        baseValueParent[lastName] = this.startValuesArray = [baseValue];
      } else
        this.startValuesArray = baseValue;
      this.startValues = values;
      return true;
    }
    //Corrigir aqui pra remover a alteração pra array no nfe.ts
    return false;
  }

  public resetValue() {
    this.startValues = [];
  }
}

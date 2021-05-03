import { IBaseFormElement } from './IBaseFormElement';
import { insertLabel } from "./insertLabel";

interface IFieldsetOptions {
  legend: string;
  required: boolean;
  hidden?: boolean;
}

export class fieldsetFormElement implements IBaseFormElement {
  public options: IFieldsetOptions;
  public children: IBaseFormElement[];
  private hasInitialValue: boolean;
  private _readOnly: boolean;
  public get readOnly() {
    return this._readOnly;
  }
  public set readOnly(v: boolean) {
    this._readOnly = v;
    this.children.forEach((k) => (k.readOnly = v));
  }

  constructor(options: IFieldsetOptions, ...children: IBaseFormElement[]) {
    this.options = options;
    this.children = children;
    this.hasInitialValue = false;
  }

  public get clone(): IBaseFormElement {
    const el = new fieldsetFormElement(
      this.options,
      ...this.children.map((v) => v.clone)
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const createFieldset: () => HTMLFieldSetElement = () => {
      const content = document.createElement('fieldset');
      if (this.options.hidden) {
        content.style.display = 'none';
      }
      if (this.options.legend && this.options.required) {
        const legend = document.createElement('legend');
        legend.textContent = this.options.legend;
        content.appendChild(legend);
      }
      this.children.forEach((v) => v.generate(content));
      return content;
    };
    if (this.options.required && (this.options.legend || this.options.hidden)) {
      const content = createFieldset();
      parent.appendChild(content);
      return content;
    } else if (this.options.required) {
      const content = document.createElement('div');
      this.children.forEach((v) => v.generate(content));
      parent.appendChild(content);
      return content;
    } else {
      if (!this.options.legend) {
        console.error('Campo opcional sem legenda!');
        this.options.legend = 'SEM LEGENDA';
      }
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.readOnly = this.readOnly;
      check.checked = this.hasInitialValue;
      parent.appendChild(check);
      const label = insertLabel(
        check,
        'Informar campo: ' + this.options.legend,
        false
      );
      let fieldset: HTMLFieldSetElement;
      const onCheckChange = () => {
        if (check.checked) {
          fieldset = createFieldset();
          label.after(fieldset);
        } else {
          fieldset?.remove();
        }
      };
      check.onchange = () => onCheckChange();
      onCheckChange();
      return fieldset;
    }
  }

  public updateValue(values: any) {
    const updates = this.children.map((v) => v.updateValue(values));
    const hasInitialValue = updates.every((v) => v);
    this.hasInitialValue = hasInitialValue;
    return hasInitialValue;
  }

  public resetValue() {
    this.children.forEach((v) => v.resetValue());
    this.hasInitialValue = false;
  }
}

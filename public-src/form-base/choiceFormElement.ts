import { fieldsetFormElement } from './fieldsetFormElement';
import { IBaseFormElement } from './IBaseFormElement';
import { IChoiceOption } from './IChoiceOption';
import { clearChildren } from "./clearChildren";
import { insertLabel } from "./insertLabel";


export class choiceFormElement implements IBaseFormElement {
  private documentation: string;
  private isRequired: boolean;
  private options: IChoiceOption[];
  private startIndex: number;
  public get readOnly() {
    return this.options[1].view.readOnly;
  }
  public set readOnly(v: boolean) {
    this.options.filter((k) => k.view).forEach((k) => (k.view.readOnly = v));
  }

  constructor(
    documentation: string,
    isRequired: boolean,
    options: IChoiceOption[]
  ) {
    this.documentation = documentation;
    this.isRequired = isRequired;
    if (!isRequired) {
      options.unshift({
        text: 'Nenhuma das opções',
        view: undefined,
        name: [],
      });
    }
    this.options = options;
    this.startIndex = 0;
  }

  public get clone(): IBaseFormElement {
    const el = new choiceFormElement(
      this.documentation,
      this.isRequired,
      this.options.map((v) => {
        return {
          text: v.text,
          view: v.view?.clone,
          name: v.name,
        };
      })
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const select = document.createElement('select');
    if (this.readOnly)
      select.disabled = true;
    const div = document.createElement('div');
    this.options.forEach((v) => {
      const option = document.createElement('option');
      option.text = v.text;
      select.appendChild(option);
    });
    const updateView = () => {
      let index = select.selectedIndex;
      clearChildren(div);
      const view = this.options[index].view;
      if (view instanceof fieldsetFormElement) {
        view.options.legend = '';
      } // remove legenda do fieldset
      view?.generate(div);
    };
    select.onchange = () => updateView();
    parent.appendChild(select);
    parent.appendChild(div);
    insertLabel(select, this.documentation);
    select.selectedIndex = this.startIndex;
    updateView();
    return select;
  }

  public updateValue(values: any) {
    const indexes: number[] = [];
    this.options.some((v, i) => {
      const active = v.view?.updateValue(values) ?? false;
      if (active)
        indexes.push(i);
    });
    this.startIndex = indexes[0];
    return true;
  }

  public resetValue() {
    this.startIndex = 0;
  }
}

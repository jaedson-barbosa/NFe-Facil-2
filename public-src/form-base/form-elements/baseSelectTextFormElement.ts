import { IBaseFormElement } from './IBaseFormElement';
import { createId } from "../createId";
import { insertLabel } from "../insertLabel";

export abstract class baseSelectTextFormElement implements IBaseFormElement {
  protected documentation: string;
  protected required: boolean;
  protected options: string[];
  protected onChange: (input: HTMLInputElement, isValid: boolean) => void;
  protected startValue: string;
  public readOnly: boolean;

  constructor(
    documentation: string,
    required: boolean,
    options: string[],
    onChange: (input: HTMLInputElement, isValid: boolean) => void
  ) {
    this.documentation = documentation;
    this.required = required;
    this.options = options;
    this.onChange = onChange;
  }

  public abstract get clone(): IBaseFormElement;

  public generate(parent: HTMLElement) {
    const select = document.createElement('input');
    select.readOnly = this.readOnly;
    select.title = this.documentation;
    select.required = this.required;
    const datalist = document.createElement('datalist');
    this.options.forEach((v) => {
      const option = document.createElement('option');
      option.text = v;
      datalist.appendChild(option);
    });
    select.setAttribute('list', (datalist.id = createId()));
    parent.appendChild(select);
    parent.appendChild(datalist);
    insertLabel(select, this.documentation);
    select.onchange = () => {
      const isValid = this.options.some((v) => v == select.value);
      this.onChange(select, isValid);
    };
    select.setCustomValidity(
      this.required && !this.startValue ? 'Selecione um valor.' : ''
    );
    if (this.startValue)
      select.value = this.startValue;
    return select;
  }

  public abstract updateValue(values: any): boolean;
  public resetValue() {
    this.startValue = undefined;
  }
}

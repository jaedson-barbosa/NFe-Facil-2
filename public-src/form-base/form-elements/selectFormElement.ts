import { IBaseFormElement } from './IBaseFormElement';
import { inputFormElement } from "./inputFormElement";
import { ILabel, insertLabel } from "../insertLabel";


export class selectFormElement extends inputFormElement {
  private options: { value: string; text: string; }[];

  constructor(
    name: string[],
    documentation: ILabel,
    required: boolean,
    options: { value: string; text: string; }[]
  ) {
    super(name, documentation, required);
    this.options = options;
  }

  public get clone(): IBaseFormElement {
    const el = new selectFormElement(
      this.nextItemName,
      this.documentation,
      this.required,
      this.options
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const select = document.createElement('select');
    this.options.forEach((v) => {
      const option = document.createElement('option');
      option.value = v.value;
      option.text = v.text;
      select.appendChild(option);
    });
    this.updateBaseProps(select);
    parent.appendChild(select);
    insertLabel(select, this.required, this.documentation);
    return select;
  }
}

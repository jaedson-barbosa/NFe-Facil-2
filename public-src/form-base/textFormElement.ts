import { IBaseFormElement } from './IBaseFormElement';
import { inputFormElement } from "./inputFormElement";
import { insertLabel } from "./insertLabel";


export class textFormElement extends inputFormElement {
  private options: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };

  constructor(
    name: string[],
    documentation: string,
    required: boolean,
    options: {
      pattern?: string;
      minLength?: number;
      maxLength?: number;
    }
  ) {
    super(name, documentation, required);
    this.options = options;
  }

  public get clone(): IBaseFormElement {
    const el = new textFormElement(
      this.nextItemName,
      this.documentation,
      this.required,
      this.options
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public generate(parent: HTMLElement) {
    const text = document.createElement('input');
    text.type = 'text';
    if (this.options.pattern)
      text.pattern = this.options.pattern;
    if (this.options.minLength)
      text.minLength = this.options.minLength;
    if (this.options.maxLength)
      text.maxLength = this.options.maxLength;
    this.updateBaseProps(text);
    parent.appendChild(text);
    insertLabel(text, this.documentation);
    return text;
  }
}

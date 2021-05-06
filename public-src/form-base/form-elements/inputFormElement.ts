import { ILabel } from '../insertLabel';
import { IBaseFormElement } from './IBaseFormElement';


export abstract class inputFormElement implements IBaseFormElement {
  public name: string[];
  protected documentation: ILabel;
  public required: boolean;
  public readOnly: boolean;

  private generatedElement: HTMLSelectElement | HTMLInputElement;

  private _value: string;
  public get value(): string {
    return this._value;
  }
  public set value(v: string) {
    this._value = v;
    const el = this.generatedElement;
    if (el)
      el.value = v ?? '';
  }

  private readonly fixedValue: boolean;

  constructor(name: string[], doc: ILabel, req: boolean, value?: string) {
    this.name = name.filter((v) => !v.includes('|'));
    this.documentation = doc;
    this.required = req;
    if (value)
      this.value = value;
    this.fixedValue = !!value;
  }

  protected get nextItemName(): string[] {
    const name = [...this.name];
    const index = name.map((v) => !isNaN(+v)).lastIndexOf(true);
    if (index != -1)
      name[index] = (+name[index] + 1).toString();
    return name;
  }

  public abstract get clone(): IBaseFormElement;
  public abstract generate(parent: HTMLElement): HTMLElement;

  public updateValue(values: any) {
    if (this.fixedValue)
      return true;
    let hasParent = true;
    const value = this.name.reduce((p, c) => {
      if (!p)
        hasParent = false;
      return p?.[c];
    }, values);
    if (value) {
      if (typeof value == 'object') {
        const name = this.name[this.name.length - 1];
        this.value = defaultValues.find((v) => v[0] == name)?.[1];
      } else
        this.value = value;
    }
    return hasParent && (!!value || !this.required);
  }

  public resetValue() {
    this.value = undefined;
  }

  protected updateBaseProps(input: HTMLSelectElement | HTMLInputElement) {
    this.generatedElement = input;
    if (input instanceof HTMLSelectElement) {
      input.disabled = this.readOnly;
    } else {
      input.readOnly = this.readOnly;
    }
    input.name = this.name.join('.');
    // input.title = this.documentation;
    input.required = this.required;
    if (this.value)
      input.value = this.value;
  }
}

const defaultValues: [string, string][] = [
  ['cEAN', 'SEM GTIN'],
  ['cEANTrib', 'SEM GTIN'],
]

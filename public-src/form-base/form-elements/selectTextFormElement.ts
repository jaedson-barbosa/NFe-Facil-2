import { baseSelectTextFormElement } from './baseSelectTextFormElement';
import { IBaseFormElement } from './IBaseFormElement';


export class selectTextFormElement extends baseSelectTextFormElement {
  private readonly onChangeArg: (value: string) => void;
  private getOption: (values: any) => string;

  constructor(
    documentation: string,
    required: boolean,
    options: string[],
    onChange: (value: string) => void,
    getOption: (values: any) => string
  ) {
    super(documentation, required, options, (select, isValid) => {
      if (!select.value && !this.required) {
        select.setCustomValidity('');
        onChange(undefined);
      }
      const validity = isValid ? '' : 'Por favor, selecione um valor válido.';
      select.setCustomValidity(validity);
      onChange(isValid ? select.value : undefined);
    });
    this.onChangeArg = onChange;
    this.getOption = getOption;
  }

  public get clone(): IBaseFormElement {
    const el = new selectTextFormElement(
      this.documentation,
      this.required,
      this.options,
      this.onChangeArg,
      this.getOption
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public updateValue(values: any) {
    const option = this.getOption(values);
    this.startValue = option;
    return !!option;
  }
}

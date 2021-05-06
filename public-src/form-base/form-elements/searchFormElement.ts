import { ILabel } from '../insertLabel';
import { baseSelectTextFormElement } from './baseSelectTextFormElement';
import { IBaseFormElement } from './IBaseFormElement';


export class searchFormElement extends baseSelectTextFormElement {
  private readonly onResult: (value: string) => void;

  constructor(
    label: ILabel,
    options: string[],
    onResult: (value: string) => void
  ) {
    super(label, false, options, (select, isValid) => {
      if (isValid) {
        onResult(select.value);
        select.value = '';
      }
    });
    this.onResult = onResult;
  }

  public get clone(): IBaseFormElement {
    const el = new searchFormElement(
      this.documentation,
      this.options,
      this.onResult
    );
    el.readOnly = this.readOnly;
    return el;
  }

  public updateValue(values: any) {
    return true;
  }
}

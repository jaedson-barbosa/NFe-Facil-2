export interface IBaseFormElement {
  generate(parent: HTMLElement): HTMLElement;
  updateValue(values: any): boolean;
  resetValue(): void;
  readOnly: boolean;
  clone: IBaseFormElement;
}

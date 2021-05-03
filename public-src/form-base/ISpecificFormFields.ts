import { IBaseFormElement } from './IBaseFormElement';


export interface ISpecificFormFields {
  names: string[];
  addIgnoreFields: string[];
  getNewFields: (
    parentTags: string[],
    getField: (name: string) => any
  ) => IBaseFormElement[];
}

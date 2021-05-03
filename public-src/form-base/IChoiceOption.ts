import { IBaseFormElement } from './form-elements/IBaseFormElement';


export interface IChoiceOption {
  text: string;
  view: IBaseFormElement;
  name: string[];
}

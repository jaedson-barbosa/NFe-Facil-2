import { IBaseFormElement } from './form-elements/IBaseFormElement';
import { ILabel } from './insertLabel';


export interface IChoiceOption {
  text: ILabel;
  view: IBaseFormElement;
  name: string[];
}

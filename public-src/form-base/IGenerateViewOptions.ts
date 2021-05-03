import { IChoiceOption } from "./IChoiceOption";

export interface IGenerateViewOptions {
  customRequireds?: string[];
  customOptions?: {
    firstOption: string;
    optionsChanger: (options: IChoiceOption[]) => void;
  }[];
  rootTag?: string;
  parentTags?: string[];
}

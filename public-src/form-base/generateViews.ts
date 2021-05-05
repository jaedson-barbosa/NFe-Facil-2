import { getName } from "./getName"
import { generateView } from './generateView';

export function generateViews(
  rootField: any,
  options: IGenerateViewsOptions,
  ...names: string[]
) {
  return names.flatMap((name) => {
    const field = findField(rootField, name);
    return generateView(field.field, {
      rootTag: field.tag,
      parentTags: options.parentNames
        ? [...options.parentNames, ...field.parentNames]
        : field.parentNames,
    });
  });
}

interface IGenerateViewsOptions {
  parentNames?: string[];
}

function findField(
  rootField: any,
  name: string,
  parentNames: string[] = [],
  parentTag: string = '',
  lvl = 0
): { tag: string; parentNames: string[]; field: any; } {
  const rootName = getName(rootField);
  if (rootName == name)
    return rootField;
  if (parentNames.length == 0)
    parentNames.push(rootName);
  for (const index in rootField) {
    const field = rootField[index];
    const fieldName = getName(field);
    if (fieldName == name) {
      return {
        tag: isNaN(+index) ? index : parentTag,
        parentNames,
        field,
      };
    } else if (lvl < 5) {
      const searchParentNames = fieldName
        ? [...parentNames, fieldName]
        : parentNames;
      const search = findField(field, name, searchParentNames, index, lvl + 1);
      if (search)
        return search;
    }
  }
}

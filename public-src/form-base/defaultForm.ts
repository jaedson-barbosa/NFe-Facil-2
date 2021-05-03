import * as basicSchema from '../base-data/basic.json'
import * as nfeSchema from '../base-data/nfe.json'
import { IBGE } from '../base-data/IBGE.json';
import { paises } from '../base-data/paises.json';
import { processLabelText } from "./processLabelText";
import { listFormElement } from "./listFormElement";
import { selectFormElement } from "./selectFormElement";
import { choiceFormElement } from "./choiceFormElement";
import { fieldsetFormElement } from "./fieldsetFormElement";
import { hiddenFormElement } from "./hiddenFormElement";
import { selectTextFormElement } from "./selectTextFormElement";
import { textFormElement } from "./textFormElement";
import { getDocumentation } from "./getDocumentation";
import { defaultFormSubmit } from "./defaultFormSubmit";
import { getDefaultListNameChanger } from "./getDefaultListNameChanger";
import { getName } from "./getName";
import { findField } from "./findField";
import { IChoiceOption } from "./IChoiceOption";
import { ISpecificFormFields } from "./ISpecificFormFields";
import { IFormAction } from "./IFormAction";
import { IGenerateViewsOptions } from "./IGenerateViewsOptions";
import { IGenerateViewOptions } from "./IGenerateViewOptions";
import { IBaseFormElement } from "./IBaseFormElement";


export class defaultForm {
  static rootNFe = nfeSchema['xs:schema']['xs:complexType'][0]['xs:sequence']['xs:element'][0];
  static elementosNFe = defaultForm.rootNFe['xs:complexType']['xs:sequence']['xs:element'];

  public elements: IBaseFormElement[];

  constructor(...elements: IBaseFormElement[]) {
    this.elements = elements;
  }

  static generateViews(
    rootField: any,
    options: IGenerateViewsOptions,
    ...names: string[]
  ) {
    return names.flatMap((name) => {
      const field = findField(rootField, name);
      return defaultForm.generateView(field.field, {
        customRequireds: options.customRequireds ?? [],
        rootTag: field.tag,
        parentTags: options.parentNames
          ? [...options.parentNames, ...field.parentNames]
          : field.parentNames,
      });
    });
  }

  static generateView(
    rootField: any,
    options?: IGenerateViewOptions
  ): IBaseFormElement[] {
    const customOptions = options?.customOptions ?? [];
    const customRequireds = options?.customRequireds ?? [];
    const rootTag = options?.rootTag;
    const parentTags = options?.parentTags ?? [];
    let additionalNameChanger: ((names: string[]) => string[])[] = [];
    const customNameChanger = (names: string[]) => additionalNameChanger.forEach((v) => v(names));

    function isRequired(v: any): boolean {
      if (customRequireds.includes(getName(v)))
        return true;
      const element = v['xs:element'];
      if (element && Array.isArray(element)) {
        const required = element.every(
          (k) => isRequired(k) || customRequireds.includes(getName(k))
        );
        if (!required)
          return false;
      }
      const seq = v['xs:sequence'];
      if (seq) {
        const sequence = Array.isArray(seq) ? seq : (seq['xs:element'] as any[]);
        const required = sequence.every(
          (k) => isRequired(k) || customRequireds.includes(getName(k))
        );
        if (!required)
          return false;
      }
      return (v.minOccurs ?? 1) > 0;
    }

    function createInput(field: any, parentTags: string[]): IBaseFormElement {
      const fieldRestriction = field['xs:simpleType']?.['xs:restriction'];
      const baseType = field.type ?? fieldRestriction?.base;
      const findType = (v: any) => getName(v) == baseType;
      const hasOtherRestrictions = baseType != 'xs:string' && baseType != 'xs:base64Binary';
      const otherRestrictions: any = (simpleTypes.find(findType) as any)?.['xs:restriction'];
      if (hasOtherRestrictions && !otherRestrictions) {
        const complexType = field['xs:complexType'] ?? complexTypes.find(findType);
        if (!complexType) {
          const element = field['xs:element'];
          if (!element) {
            console.log(field);
            throw new Error('Invalid field');
          }
          return createFieldset(field, parentTags);
        }
        const newField = {
          ...field,
          'xs:complexType': complexType,
        };
        return createFieldset(newField, parentTags);
      }
      if (hasOtherRestrictions && otherRestrictions?.base != 'xs:string') {
        console.log(otherRestrictions);
        throw new Error('The other restrictions have a invalid base.');
      }
      const enumeration = fieldRestriction?.['xs:enumeration'] ??
        otherRestrictions?.['xs:enumeration'];
      const name = [...parentTags, getName(field)];
      customNameChanger?.(name);
      const required = isRequired(field);
      const documentation = getDocumentation(field);
      if (!enumeration) {
        const getProp = (el: string) => {
          const fieldProp = fieldRestriction?.[el]?.value;
          const otherProp = otherRestrictions?.[el]?.value;
          return fieldProp ?? otherProp;
        };
        return new textFormElement(name, documentation, required, {
          pattern: getProp('pattern'),
          minLength: getProp('minLength'),
          maxLength: getProp('maxLength'),
        });
      }
      if (!('length' in enumeration)) {
        const val = enumeration.value;
        return new hiddenFormElement(name, required, val);
      }
      const val0 = enumeration[0].value;
      const val1 = enumeration[1].value.toUpperCase();
      if (enumeration.length == 2 && val0.toUpperCase() == val1)
        return new hiddenFormElement(name, required, val0);
      const values = (enumeration as any[]).map((v) => v.value);
      const getValueDescription = (v: string) => {
        if (isNaN(+v) && v.length > 1)
          return v;
        const getIndex = (search: string) => documentation.indexOf(search);
        const getIndexEnd = (mark: string, pos: number) => documentation.indexOf(mark, pos);
        const starts = v.includes('.00')
          ? [getIndex(v.replace('.00', '%'))]
          : ['-', ' -', '  –', ' –', '–', '=', ' =']
            .map((k) => getIndex(v + k))
            .filter((v) => v != -1);
        if (starts.length == 0)
          return v;
        const start = Math.min(...starts);
        const ends = [';', '.', ')', '\n']
          .map((k) => getIndexEnd(k, start))
          .filter((k) => k != -1);
        if (ends.length == 0) {
          return documentation.substring(start);
        }
        let end = Math.min(...ends);
        return documentation.substring(start, end);
      };
      const getOption = (v: any, processDescription: boolean = true) => {
        return {
          value: v,
          text: processDescription ? getValueDescription(v) : v,
        };
      };
      const firstOption = getOption(values[0]);
      const optionsHaveDescriptions = firstOption.text != firstOption.value;
      const otherValues = values.slice(1);
      let stopValuesMap = false;
      const otherOptions = optionsHaveDescriptions
        ? otherValues
          .map((v) => {
            if (stopValuesMap)
              return undefined;
            const opt = getOption(v, true);
            if (opt.value == opt.text) {
              stopValuesMap = true;
              return undefined;
            }
            return opt;
          })
          .filter((v) => v)
        : otherValues.map((v) => getOption(v, false));
      const completeOptions = [firstOption, ...otherOptions];
      return new selectFormElement(
        name,
        documentation,
        required,
        completeOptions
      );
    }

    function createChoice(field: any, parentTags: string[]): IBaseFormElement {
      const elements = field['xs:element'] as any[];
      const sequence = field['xs:sequence'];
      if (!elements && !sequence) {
        throw new Error('Choice invalido');
      }
      let options: IChoiceOption[] = [];
      if (elements) {
        options.push(
          ...elements.map((v) => {
            return {
              text: getDocumentation(v),
              view: createInput(v, parentTags),
              name: [...parentTags, getName(v)],
            };
          })
        );
      }
      if (sequence) {
        if (options.length > 0) {
          options.push({
            text: getDocumentation(sequence),
            view: createFieldset(sequence, parentTags),
            name: [...parentTags, getName(sequence)],
          });
        } else {
          const array = Array.isArray(sequence)
            ? sequence
            : (sequence['xs:element'] as any[]);
          options.push(
            ...array.map((v) => {
              return {
                text: getDocumentation(v),
                view: createInput(v, parentTags),
                name: [...parentTags, getName(v)],
              };
            })
          );
        }
      }
      const doc = getDocumentation(field);
      const req = isRequired(field);
      customOptions
        .find((v) => v.firstOption == options[0].text)
        ?.optionsChanger(options);
      return new choiceFormElement(doc, req, options);
    }

    function createFieldset(
      field: any,
      parentTags: string[]
    ): IBaseFormElement {
      const legend = processLabelText(getDocumentation(field));
      const name = getName(field);
      const isRootList = 'length' in field;
      const max = field?.maxOccurs ?? 1;
      const isList = max > 1;
      if (isList)
        additionalNameChanger.push(getDefaultListNameChanger(name));
      const tags = name ? [...parentTags, name] : parentTags;
      const required = max > 1 || isRequired(field);
      const fields: IBaseFormElement[] = [];
      if (isRootList || field['xs:element']) {
        const elements = (isRootList ? field : field['xs:element']) as any[];
        fields.push(...elements.map((v) => createInput(v, tags)));
      }
      if (field['xs:complexType'] || field['xs:sequence']) {
        const sequence = field['xs:complexType']?.['xs:sequence'] ?? field['xs:sequence'];
        if (sequence) {
          if (fields.length == 0) {
            const pureFields = Object.entries(sequence);
            fields.push(
              ...pureFields.flatMap((v) => analyseTag(v[0], v[1], tags))
            );
          } else
            fields.push(createFieldset(sequence, tags));
        }
        const choice = field['xs:complexType']?.['xs:choice'];
        if (choice) {
          fields.push(createChoice(choice, tags));
        }
      }
      if (!fields.length) {
        console.log(field);
        throw new Error('Invalid tag for a fieldset');
      }
      const fieldset = new fieldsetFormElement({ legend, required }, ...fields);
      if (isList)
        additionalNameChanger.pop();
      return isList ? new listFormElement(fieldset, tags) : fieldset;
    }

    function createCityField(
      parentTags: string[],
      getField: (name: string) => any
    ): IBaseFormElement[] {
      const genEl = (name: string) => {
        const field = getField(name);
        return field
          ? new hiddenFormElement([...parentTags, name], isRequired(field))
          : undefined;
      };
      const cMun = genEl('cMun'),
        cMunFG = genEl('cMunFG'),
        xMun = genEl('xMun'),
        UF = genEl('UF'),
        cUF = genEl('cUF');
      if (!cMun && !cMunFG && !xMun)
        throw new Error('City field without cMun and xMun.');

      const mun2str = (mun: string, uf: string) => `${mun} (${uf})`;
      const municipio = new selectTextFormElement(
        'Município',
        cMun?.required || cMunFG?.required || xMun?.required,
        IBGE.flatMap((v) => v.Municipios.map((k) => mun2str(k.Nome, v.Sigla))),
        (value) => {
          if (value) {
            const startUF = value.indexOf('('),
              uf = value.substring(startUF + 1, value.length - 1),
              ufIBGE = IBGE.find((v) => v.Sigla == uf),
              mun = value.substring(0, startUF - 1),
              munIBGE = ufIBGE?.Municipios.find((v) => v.Nome == mun);
            if (munIBGE) {
              if (cMun)
                cMun.value = munIBGE.Codigo;
              if (cMunFG)
                cMunFG.value = munIBGE.Codigo;
              if (xMun)
                xMun.value = munIBGE.Nome;
              if (UF)
                UF.value = ufIBGE.Sigla;
              if (cUF)
                cUF.value = ufIBGE.Codigo;
              console.log(cMun, cMunFG, xMun, UF, cUF);
              return;
            }
          }
          if (cMun)
            cMun.value = undefined;
          if (cMunFG)
            cMunFG.value = undefined;
          if (xMun)
            xMun.value = undefined;
          if (UF)
            UF.value = undefined;
          if (cUF)
            cUF.value = undefined;
        },
        (values) => {
          const filteredNames = parentTags.filter((v) => !v.includes('|'));
          const baseValue = filteredNames.reduce((p, c) => p?.[c], values);
          if (!baseValue)
            return undefined;
          const cUFValue = baseValue['cUF'];
          const ufValue = baseValue['UF'];
          const cMunValue = baseValue['cMun'] ?? baseValue['cMunFG'];
          const xMunValue = baseValue['xMun'];
          if (cMunValue || xMunValue) {
            const uf = cUFValue
              ? IBGE.find((v) => v.Codigo == cUFValue)
              : ufValue
                ? IBGE.find((v) => v.Sigla.toUpperCase() == ufValue.toUpperCase())
                : cMunValue
                  ? IBGE.find((v) => v.Municipios.some((k) => k.Codigo == cMunValue)
                  )
                  : IBGE.find((v) => v.Municipios.some(
                    (k) => k.Nome.toUpperCase() == xMunValue.toUpperCase()
                  )
                  );
            if (!uf)
              return undefined;
            const munValue = cMunValue
              ? uf.Municipios.find((v) => v.Codigo === cMunValue)
              : uf.Municipios.find(
                (k) => k.Nome.toUpperCase() == xMunValue.toUpperCase()
              );
            return mun2str(munValue.Nome, uf.Sigla);
          }
          console.log(baseValue);
          return undefined;
        }
      );
      return [cMun, cMunFG, xMun, cUF, UF, municipio].filter((v) => v);
    }

    function createStateField(
      parentTags: string[],
      getField: (name: string) => any
    ): IBaseFormElement[] {
      const genEl = (name: string) => {
        const field = getField(name);
        return field
          ? new hiddenFormElement([...parentTags, name], isRequired(field))
          : undefined;
      };
      const cUF = genEl('cUF'),
        UF = genEl('UF');
      if (!cUF && !UF)
        throw new Error('State field without cUF and UF.');

      const uf = new selectTextFormElement(
        'Estado',
        cUF?.required || UF?.required,
        IBGE.map((v) => v.Nome),
        (value) => {
          const uf = IBGE.find((v) => v.Nome == value);
          if (cUF)
            cUF.value = uf?.Codigo;
          if (UF)
            UF.value = uf?.Sigla;
        },
        (values) => {
          const filteredNames = parentTags.filter((v) => !v.includes('|'));
          const baseValue = filteredNames.reduce((p, c) => p?.[c], values);
          if (!baseValue)
            return undefined;
          const cUFValue = baseValue['cUF'];
          const ufValue = baseValue['UF'];
          if (cUFValue || ufValue) {
            const uf = cUFValue
              ? IBGE.find((v) => v.Codigo == cUFValue)
              : IBGE.find((v) => v.Sigla.toUpperCase() == ufValue.toUpperCase());
            return uf?.Nome;
          }
          return undefined;
        }
      );
      return [cUF, UF, uf].filter((v) => v);
    }

    function createCountryField(
      parentTags: string[],
      getField: (name: string) => any
    ): IBaseFormElement[] {
      const genEl = (name: string) => {
        const field = getField(name);
        return field
          ? new hiddenFormElement([...parentTags, name], isRequired(field))
          : undefined;
      };
      const cPais = genEl('cPais'),
        xPais = genEl('xPais');
      if (!cPais && !xPais)
        throw new Error('Country field without cPais and xPais.');

      const pais = new selectTextFormElement(
        'País',
        cPais?.required || xPais?.required,
        paises.map((k) => k.nome),
        (value) => {
          const pais = paises.find((v) => v.nome == value);
          if (xPais)
            xPais.value = pais?.nome;
          if (cPais)
            cPais.value = pais?.codigo;
        },
        (values) => {
          const filteredNames = parentTags.filter((v) => !v.includes('|'));
          const baseValue = filteredNames.reduce((p, c) => p?.[c], values);
          if (!baseValue)
            return undefined;
          const cPais = baseValue['cPais'];
          const xPais = baseValue['xPais'];
          if (cPais || xPais) {
            const uf = cPais
              ? paises.find((v) => v.codigo == cPais)
              : paises.find((v) => v.nome.toUpperCase() == xPais.toUpperCase());
            return uf?.nome;
          }
          return undefined;
        }
      );
      return [cPais, xPais, pais].filter((v) => v);
    }

    function createElements(field: any, parentTags: string[]) {
      const elements = 'length' in field ? (field as any[]) : [field];
      const specificFields: ISpecificFormFields[] = [
        {
          names: ['cMun', 'xMun', 'cMunFG'],
          addIgnoreFields: ['cUF', 'UF'],
          getNewFields: createCityField,
        },
        {
          names: ['cUF', 'UF'],
          addIgnoreFields: [],
          getNewFields: createStateField,
        },
        {
          names: ['cPais', 'xPais'],
          addIgnoreFields: [],
          getNewFields: createCountryField,
        },
      ];
      const ignoreFields: string[] = [];
      return elements
        .flatMap((v) => {
          const name = getName(v);
          if (ignoreFields.includes(name))
            return undefined;
          const input = createInput(v, parentTags);
          const specific = specificFields.find((k) => k.names.includes(name));
          if (specific && !(input instanceof hiddenFormElement)) {
            ignoreFields.push(...specific.names, ...specific.addIgnoreFields);
            return specific.getNewFields(parentTags, (name) => elements.find((v) => getName(v) == name)
            );
          } // Se o valor for um hidden então ele não deve ser substituido
          return input;
        })
        .filter((v) => v);
    }

    function analyseTag(
      tag: string,
      field: any,
      parentTags: string[]
    ): IBaseFormElement[] {
      switch (tag) {
        case 'xs:choice':
          return [createChoice(field, parentTags)];
        case 'xs:element':
          return createElements(field, parentTags);
        default:
          if (!tag || tag == 'xs:sequence')
            return [createFieldset(field, parentTags)];
          console.trace('Invalid tag', tag, field);
          return [];
      }
    }

    return analyseTag(rootTag, rootField, parentTags);
  }
  public generateForm(onSubmit: (data: any) => void): HTMLFormElement;
  public generateForm(actions: IFormAction[]): HTMLFormElement;
  public generateForm(
    params: ((data: any) => void) | IFormAction[]
  ): HTMLFormElement {
    const form = document.createElement('form');
    this.elements.forEach((v) => v.generate(form));
    const createSub = (
      action: (data: any) => void,
      text: string = 'Enviar'
    ) => {
      const btn = document.createElement('button');
      if (text)
        btn.textContent = text;
      // btn.type = 'button' Ainda queremos a validação do form
      btn.onclick = () => defaultFormSubmit(action, form);
      form.appendChild(btn);
    };
    if (params) {
      if (Array.isArray(params)) {
        params.forEach((v) => createSub(v.task, v.label));
      } else {
        createSub(params);
      }
    }
    form.onsubmit = (e) => {
      e.preventDefault();
      console.log('Submissão ignorada.');
      return false;
    };
    return form;
  }

  public updateValue(values: any) {
    this.elements.forEach((v) => v.updateValue(values));
  }

  public resetValue() {
    this.elements.forEach((v) => v.resetValue());
  }
}

const complexTypes = nfeSchema['xs:schema']['xs:complexType']
const simpleTypes = [
  ...basicSchema['xs:schema']['xs:simpleType'],
  ...nfeSchema['xs:schema']['xs:simpleType'],
]

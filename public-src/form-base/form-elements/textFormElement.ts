import { IBaseFormElement } from './IBaseFormElement'
import { inputFormElement } from './inputFormElement'
import { ILabel, insertLabel } from '../insertLabel'

export class textFormElement extends inputFormElement {
  private options: {
    pattern?: string
    minLength?: number
    maxLength?: number
    type: string
    decimal?: number
  }

  constructor(
    name: string[],
    documentation: ILabel,
    required: boolean,
    options: {
      pattern?: string
      minLength?: number
      maxLength?: number
      type: string
      decimal?: number
    }
  ) {
    super(name, documentation, required)
    this.options = options
  }

  public get clone(): IBaseFormElement {
    const el = new textFormElement(
      this.nextItemName,
      this.documentation,
      this.required,
      this.options
    )
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    const text = document.createElement('input')
    text.type = this.options.type
    if (this.options.decimal) {
      text.step = (1 / 10 ** this.options.decimal).toString()
      text.onchange = () => {
        if (text.value) {
          const o = parseFloat(text.value).toFixed(this.options.decimal)
          // Fixado o número mínimo de casas decimais em 2
          text.value = o.slice(0, o.indexOf('0', o.indexOf('.') + 3))
        } else text.value = ''
      }
    }
    if (this.options.pattern) text.pattern = this.options.pattern
    if (this.options.minLength) text.minLength = this.options.minLength
    if (this.options.maxLength) text.maxLength = this.options.maxLength
    this.updateBaseProps(text)
    parent.appendChild(text)
    insertLabel(text, this.required, this.documentation)
    return text
  }
}

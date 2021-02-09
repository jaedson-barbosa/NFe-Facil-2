import * as basicSchema from './basic.json'
import * as nfeSchema from './nfe.json'

interface IType {
    _attributes: { name: string }
    annotation?: { documentation: { _text: string } }
}

interface IComplexType extends IType {
    sequence: { element: any[] }
}

const complexTypes: IComplexType[] = nfeSchema.schema.complexType
const simpleTypes: IType[] = basicSchema.schema.simpleType

interface ITextInputOptions {
    pattern: string
    name: string
    documentation: string
    minLength: number
    maxLength: number
}

function createId() { return Math.random().toString(36).substr(2, 9) }

function createView(parentView: HTMLElement, field: any, tag: string = ''): void {
    //Pra amanhã colocar o sequence final do emitente (usar um checkbox pra decidir se tem ou não)
    //Refinar um pouco mais a interface
    //Inserir alguns headers melhores pra alguns campos (não mechendo no schema, fazer aqui no código)
    //Inserir controles pros municípios (apenas um controle - Nome do nunicipio (sigla da UF))
    //Código e nome do país são fixos em Brasil, não precisa mostrar
    const getElementOptions = (v: any) => {
        const specificType = v.simpleType?.restriction
        const baseType = v._attributes?.type ?? specificType?._attributes.base
        const isDefaultType = baseType == 'string'
        const type: any = isDefaultType ? undefined : simpleTypes.find(k => k._attributes.name == baseType)
        if (!type && !isDefaultType) {
            const complex = complexTypes.find(k => k._attributes.name == baseType)
            if (complex) {
                createView(parentView, {...v, complexType: {sequence: complex.sequence} })
            } else {
                console.log(baseType)
                console.log(v)
            }
            return
        }
        return {
            pattern: type?.restriction?.pattern?._attributes.value,
            name: v._attributes.name,
            documentation: v.annotation.documentation._text,
            minLength: Number(specificType?.minLength?._attributes.value ?? type?.restriction?.minLength?._attributes.value ?? -1),
            maxLength: Number(specificType?.maxLength?._attributes.value ?? type?.restriction?.maxLength?._attributes.value ?? -1)
        } as ITextInputOptions
    }
    const updateInput = (input: HTMLInputElement, options: ITextInputOptions) => {
        input.value = ''
        input.pattern = options.pattern
        input.name = options.name
        input.title = options.documentation
        if (options.minLength > 0) input.minLength = options.minLength
        if (options.maxLength > 0) input.maxLength = options.maxLength
    }
    if (!tag) {
        if (!('complexType' in field)) throw new DOMException('It\'s not a complex type')
        const content = document.createElement('fieldset')
        const legend = document.createElement('legend')
        legend.innerText = field.annotation.documentation._text
        content.appendChild(legend)

        const fields = field.complexType.sequence
        Object.entries(fields).forEach(v => createView(content, v[1], v[0]))
        parentView.appendChild(content)
    }
    if (tag == 'choice') {
        const elements = field['element'] as any[]
        const input = document.createElement('input')
        input.type = 'text'
        const select = document.createElement('select')
        const options = elements.map(getElementOptions)
        select.innerHTML = options.map((v, i) => `<option>${v.documentation}</option>`).join('')
        select.onchange = () => updateInput(input, options[select.selectedIndex])
        updateInput(input, options[0])
        parentView.appendChild(select)
        parentView.appendChild(input)
    }
    if (tag == 'element') {
        field.forEach(v => {
            const input = document.createElement('input')
            input.type = 'text'
            const options = getElementOptions(v)
            if (!options) return
            const inputId = createId()
            input.id = inputId
            updateInput(input, options)
            const label = document.createElement('label')
            label.htmlFor = inputId
            label.innerText = options.documentation
            parentView.appendChild(label)
            parentView.appendChild(input)
        })
    }
    return undefined
}

const complex = nfeSchema.schema.complexType[0].sequence.element[0]['complexType']
const emit = createView(document.getElementsByTagName('form')[0], complex['sequence']['element'][1])

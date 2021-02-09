import * as fs from 'fs'
import * as basicSchema from './basic.json'
import * as nfeSchema from './nfe.json'

interface IType {
    _attributes: { name: string }
    annotation: { documentation: { _text: string } }
}

interface IComplexType extends IType {
    sequence: {element: any[]}
}

declare global {
    interface Object {
        OK: () => void
    }
}
Object.prototype.OK = () => console.log("OK")

let globalIndex: number = 0
function getIndex() {return globalIndex++}

const complexTypes: IComplexType[] = nfeSchema.schema.complexType
const simpleTypes: IType[] = nfeSchema.schema.simpleType

function getFieldset(field: any): string {
    // const tag = field._attributes.name
    const legend = field.annotation.documentation._text
    let content = ''
    if ('complexType' in field) {
        const fields = field.complexType.sequence
        content = Object.entries(fields).map(v => {
            switch (v[0]) {
                case 'choice': {
                    const elements = v[1]['element'] as any[]
                    const options = elements.map(v => v.annotation.documentation._text)
                    const selectContent = options.map((v,i) => `<option value="${i}">${v}</option>`).join('')
                    const id = getIndex()
                    return /*html*/`
                    <select id="select${id}" onchange="updateInput${id}(event.target.value)">
                        ${selectContent}
                    </select><br>
                    <input id="input${id}" type="text" name="${elements[0]._attributes.name}" value=""><br>
                    <script>
                        const types${id} = ${elements.map(v => v._attributes.type)}
                        function updateInput${id}(value) {alert(value)}
                    </script>`
                    // Terminar e testar no Parcel, por enquanto focar apenas no emitente e depois ir expandindo
                }
                default:
                    
                    return undefined
                    break;
            }
        }).filter(v => !!v).flat().join('')
    }

    return /*html*/`
    <fieldset>
        <legend>${legend}:</legend>
        ${content}
    </fieldset>`
}

const complex = nfeSchema.schema.complexType[0].sequence.element[0]['complexType']
const emit = getFieldset(complex['sequence']['element'][1])

fs.writeFileSync(
    './emitente.html',
    fs.readFileSync('./base-form.html', 'utf8').replace('FORM_CONTENT', emit))

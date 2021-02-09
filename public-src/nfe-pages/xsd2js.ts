import * as fs from 'fs'
import {xml2json} from 'xml-js'

function parse(originPath: string, targetPath: string) {
    fs.writeFileSync(targetPath, xml2json(fs.readFileSync(originPath, 'utf8'), {
        compact: true,
        spaces: 4,
        elementNameFn: v => v.replace('xs:', ''),
        attributeValueFn: v => v.replace('xs:', '')
    }))
}
parse('../../PL_009/tiposBasico_v4.00.xsd', './basic.json')
parse('../../PL_009/leiauteNFe_v4.00.xsd', './nfe.json')

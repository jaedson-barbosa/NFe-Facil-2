import * as fs from 'fs'
import {xml2json} from 'xml-js'
import {toJson,toXml} from 'xml2json'

function parse(originPath: string, targetPath: string) {
    fs.writeFileSync(targetPath, toJson(fs.readFileSync(originPath, 'utf8'), {reversible: true}))
}
function reverse(originPath: string, targetPath: string) {
    fs.writeFileSync(targetPath, toXml(fs.readFileSync(originPath, 'utf8')))
}

// parse('../../PL_009/tiposBasico_v4.00.xsd', './basic.json')
// parse('../../PL_009/leiauteNFe_v4.00.xsd', './nfe.json')
parse('../../NFe25210412931158000164550010000005501821207189.xml', './teste.json')
reverse('./teste.json', 'teste.xml')
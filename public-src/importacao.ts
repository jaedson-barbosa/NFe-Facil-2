import { getForm } from "./form-base";

let xmls: string[];

// Como temos multiplos arquivos, não dá pra usar o metodo tradicional
document.getElementById('xmls').onchange = async event => {
    if (!event) return
    xmls = (await Promise.all(
        Array.from(
            (event.target as any).files as FileList
        ).map(v => v.text()
    )))
}

getForm(0).onsubmit = e => {
    e.preventDefault()
    console.log(xmls)
}
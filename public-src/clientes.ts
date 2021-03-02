import { getForm, initializeForm } from './form-base'

//Cadastro de novos clientes deve ser feito nesta página por meio de uma caixa de diálogo
const mainDialog = document.querySelector('dialog')
initializeForm(
    'destinatario-cadastro', mainDialog,
    async data => {
        console.log(data)
    })
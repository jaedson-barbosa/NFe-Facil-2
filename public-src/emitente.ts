import initialize from './form-base'

initialize(
    'emitente',
    document.getElementsByTagName('form')[0],
    [{ name: 'fone', header: 'Telefone' }],
    (v) => console.log(v))

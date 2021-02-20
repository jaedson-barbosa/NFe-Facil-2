import db from './db'

db.create().then(v => {
    const addOperation = v.emitentes.add({ 'nome': 'Jaedson' }, db.autoId)
    addOperation.onsuccess = () => console.log(addOperation.result)
    addOperation.onerror = (e) => console.error(e)
}).catch(v => alert(v))
import * as idb from 'idb-keyval';

const id = sessionStorage.idEmpresa
if (!id) {
    alert('Por favor, inicie a sessão a partir da tela de escolha de emitentes.')
    location.href = './emitentes.html'
}
const sessionStore = idb.createStore(id, 'geral')

export function del(key: IDBValidKey) { return idb.del(key, sessionStore) }
export function entries() { return idb.entries(sessionStore) }
export function get(key: IDBValidKey) { return idb.get(key, sessionStore) }
export function getMany(keys: IDBValidKey[]) { return idb.getMany(keys, sessionStore) }
export function set(key: IDBValidKey, value: any) { return idb.set(key, value, sessionStore) }
export function setMany(entries: [IDBValidKey, any][]) { return idb.setMany(entries, sessionStore) }
export function update(key: IDBValidKey, updater: (oldValue: any) => any) { return idb.update(key, updater, sessionStore) }
export function sync() { return Promise.resolve() }
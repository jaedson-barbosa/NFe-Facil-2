export default class database {
    private source: IDBDatabase
    private _clientes?: IDBObjectStore

    public get clientes(): IDBObjectStore {
        if (this._clientes) return this._clientes
        const transaction = this.source.transaction('clientes', 'readwrite')
        return transaction.objectStore('clientes')
    }

    private constructor(source: IDBDatabase, options?: {
        clientes?: IDBObjectStore
    }) {
        this.source = source
        if (options?.clientes) this._clientes = options.clientes
    }

    public static get autoId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        return [...Array(20)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
    }

    public static async create(): Promise<database> {
        return new Promise((res, rej) => {
            const empresa = sessionStorage.getItem('idEmpresa')
            const request = window.indexedDB.open(empresa, 1)
            request.onerror = function (event) {
                console.error(event);
                rej('Error while trying to open connection with db.')
            }
            request.onupgradeneeded = function (event) {
                console.log("Atualizando...");
                const db = request.result;
                const clientes = db.createObjectStore("clientes");
                res(new database(db, { clientes: clientes }))
            };
            request.onsuccess = function (event) {
                console.log("Banco de dados aberto com sucesso.");
                const db = request.result;
                res(new database(db))
            }
        })
    }

    public close() { this.source.close() }
}
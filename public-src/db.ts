export default class database {
    private source: IDBDatabase
    private _emitentes?: IDBObjectStore

    public get emitentes(): IDBObjectStore {
        if (this._emitentes) return this._emitentes
        const transaction = this.source.transaction('emitentes', 'readwrite')
        return transaction.objectStore('emitentes')
    }

    private constructor(source: IDBDatabase, options?: {
        emitentes?: IDBObjectStore
    }) {
        this.source = source
        if (options?.emitentes) this._emitentes = options.emitentes
    }

    public static get autoId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        return [...Array(20)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
    }

    public static async create(): Promise<database> {
        return new Promise((res, rej) => {
            const request = window.indexedDB.open("NFeFacil", 1)
            request.onerror = function (event) {
                console.error(event);
                rej('Error while trying to open connection with db.')
            }
            request.onupgradeneeded = function (event) {
                console.log("Atualizando...");
                const db = request.result;
                const emitentes = db.createObjectStore("emitentes");
                res(new database(db, { emitentes: emitentes }))
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
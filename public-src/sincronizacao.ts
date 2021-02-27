import database from './db'

export async function Sincronizar(db?: database) {
    if (!db) db = await database.create()
    db.clientes.getAll().
}
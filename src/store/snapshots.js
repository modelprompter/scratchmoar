import Dexie from 'dexie'

// First export just the reference so that all imports use same instance
let db = new Dexie('snapshots')
export default db

// Then setup the database, exporting the method to use after deleting the database
resetSnapshots()
export function resetSnapshots (shouldRecreate = false) {
  db.version(1).stores({
    settings: '&key, value',
    snapshots: '++id, parentId, date, title, description, *tags'
  })

  return db
}
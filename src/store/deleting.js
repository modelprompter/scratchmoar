import {resetSnapshots} from './snapshots'

export default {
  /**
   * Reset the database
   */
  resetDB () {
    this.db.delete().then(() => {
      this.db = resetSnapshots(true)
      this.db.open()
      this.hasDeletedAutosave = true
      document.dispatchEvent(new CustomEvent('databaseResetFinished', {detail: this.db}))
    }).catch(this.log)
  },

  /**
   * Delete a snapshot
   */
  deleteSnapshot (ev) {
    this.db.snapshots.delete(ev.detail).then(() => {
      this.lastSnapshotTitle = ''
      this.lastSnapshotID = null
    }).catch(this.log)
  }
}
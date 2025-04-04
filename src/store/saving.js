import {exportDB} from 'dexie-export-import'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
  /**
   * Autosaves every few moments
   */
  autosave () {
    if (this.disableSaving || this.isLoading || this.isSaving) return
    if (!this.finishedLoading) {
      this.finishedLoading = true
      return
    }

    const files = this.vm.saveProjectSb3DontZip()
    this.isSaving = true
    this.db.settings.put({key: 'autosave', value: {
      title: this.getTitle(),
      date: new Date(),
      files
    }})
    .catch(this.log)
    .finally(() => {
      this.isSaving = false
    })
  },
  
  /**
   * Save a snapshot
   * - Take last autosave and recursively add each file/asset to zip
   *  (we'll do this manually so we can use same loading mechanism)
   * - Save zip to indexedDB
   * - Saves autosave if we're saving right after a delete (when the workspace still has blocks)
   */
  saveSnapshot () {
    if (this.disableSaving) return
    
    const zip = new JSZip()
    const files = this.vm.saveProjectSb3DontZip()
    this.isSaving = true

    Object.keys(files).forEach(key => zip.file(key, files[key]))
    zip.generateAsync({type: 'arraybuffer'}).then(data => {
      this.db.snapshots.add({
        title: this.getTitle(),
        date: new Date(),
        data
      }).then(id => {
        this.db.settings
          .put({key: 'lastSnapshotID', value: id})
          .then(() => {
            this.lastSnapshotID = id
            this.lastSnapshotTitle = this.getTitle()
          })
          .catch(this.log)

        // Save autosave
        if (this.hasDeletedAutosave) {
          this.hasDeletedAutosave = false
          this.autosave()
        }
      })
      .catch(this.log)
      .finally(() => this.isSaving = false)
    })
  },
 
  /**
   * Update a snapshot
   */
  updateSnapshot (ev) {
    if (this.disableSaving) return

    const zip = new JSZip()
    const files = this.vm.saveProjectSb3DontZip()
    Object.keys(files).forEach(key => zip.file(key, files[key]))
    this.db.settings
      .put({key: 'lastSnapshotID', value: ev.detail})
      .then(() => {
        this.lastSnapshotID = ev.detail
        this.lastSnapshotTitle = this.getTitle()
      })
      .catch(this.log)

    zip.generateAsync({type: 'arraybuffer'}).then(data => {
      this.isSaving = true
      this.db.snapshots.update(ev.detail, {
        title: this.getTitle(),
        updated: new Date(),
        data
      })
        .then(() => this.autosave())
        .catch(this.log)
        .finally(() => this.isSaving = false)
    }).catch(this.log)
  },

  /**
   * Download snapshots
   */
  async downloadSnapshots () {
    const zip = new JSZip()
    const files = this.vm.saveProjectSb3DontZip()
    this.isSaving = true

    // Add files to zip
    Object.keys(files).forEach(key => zip.file(key, files[key]))
    const blob = await exportDB(this.db)
    zip.file('snapshots.json', blob)

    // Generate and download
    zip.generateAsync({type: 'blob'}).then(data => {
      const title = this.getTitle()
      const date = new Date().toISOString().split('T')
      FileSaver.saveAs(data, `${date[0]} - ${title}.snaps.sb3`)
    })
    .catch(this.log)
    .finally(() => this.isSaving = false)
  }
}
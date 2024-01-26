import JSZip from 'jszip'

export default {
  /**
   * Load autosave
   */
  loadAutosave () {
    if (this.isLoading || this.isSaving) return
    
    // Load autosave
    this.isLoading = true
    this.finishedLoading = false // This gets reset in ./saving.js autosaving
    this.db.settings.get({key: 'autosave'}).then(autosave => {
      if (autosave?.value) {
        const zip = new JSZip()
        Object.keys(autosave.value.files).forEach(key => zip.file(key, autosave.value.files[key]))

        this.lastSnapshotTitle = autosave?.value?.title || 'Untitled Snapshot'
        this.setTitle(autosave?.value?.title || 'Untitled Snapshot')

        zip.generateAsync({type: 'arraybuffer'}).then(data => {
          this.vm.loadProject(data).then(() => {
            document.dispatchEvent(new CustomEvent('snapshotsLoadedProject'))
          }).catch(this.log)
        })
      }
    })
    .catch(this.log)
    .finally(() => this.isLoading = false)

    // Load last snapshot ID
    this.db.settings.get({key: 'lastSnapshotID'})
      .then(snapshot => {this.lastSnapshotID = snapshot?.value})
      .catch(this.log)
  },

  /**
   * Load a snapshot
   * @ev.detail Snapshot ID (INT) or Snapshot title (STRING)
   */
  loadSnapshot (ev) {
    const loadCb = snapshot => {
      this.isLoading = true
      this.db.settings.put({key: 'lastSnapshotID', value: snapshot.id})
        .then(() => this.lastSnapshotID = snapshot.id)
        .catch(this.log)
      this.vm.loadProject(snapshot.data).then(() => {
        document.dispatchEvent(new CustomEvent('snapshotsLoadedProject'))
        this.lastSnapshotTitle = snapshot.title
        this.setTitle(snapshot.title)
      })
      .finally(() => {
        ev?.cb?.()
      })
    }
    
    if (typeof ev.detail === 'number') {
      this.db.snapshots.get(ev.detail).then(loadCb).catch(this.log)
    } else if (typeof ev.detail === 'string') {
      this.db.snapshots.where('title').equalsIgnoreCase(ev.detail).first().then(loadCb).catch(this.log)
    }
  },

  /**
   * Load snapshots
   * @todo Needs better error catching
   */
  loadSnapshots () {
    const $btn = document.createElement('input')
    $btn.type = 'file'
    $btn.accept = '.sb3'
    $btn.style.display = 'none'

    $btn.addEventListener('change', async () => {
      const file = $btn.files[0]
      JSZip.loadAsync(file).then(async zip => {
        await zip.file('snapshots.json').async('string').then(async json => {
          const blob = new Blob([json], {type: 'application/json'})

          await this.db.import(blob, {
            chunkSizeBytes: 1024 * 1024 * 10,
            clearTablesBeforeImport: true
          }).catch(async () => {
            return await this.db.import(blob, {
              chunkSizeBytes: 1024 * 1024 * 100,
              clearTablesBeforeImport: true
            }).catch(async () => {
              return await this.db.import(blob, {
                chunkSizeBytes: 1024 * 1024 * 1000,
                clearTablesBeforeImport: true
              })  
            })
          })

          // Load last snapshot
          this.db.settings.get({key: 'lastSnapshotID'})
            .then(snapshot => {
              this.loadSnapshot({detail: snapshot.value})
            })
            .catch(this.log)
        })
      })
      .catch(err => {
        this.log(err)
      })
      .finally(() => {
        document.body.removeChild($btn)
      })
    })
    document.body.appendChild($btn)
    $btn.click()
  }
}
import App from './App.vue'
import Snapshots from './store/snapshots.js'
import $STYLES from './styles/main.css.js'
import {createApp} from 'vue'

export default {
  /**
   * Setup the extension
   */
  setup () {
    // resetDB if ?reset is present in URL and redirect to same URL without reset
    if (window.location.search.includes('reset')) {
      this.resetDB()
      window.location = window.location.href.replace('?reset', '')
    }

    // Reference virtual machine
    this.vm = globalThis.Scratch.vm || globalThis.vm
    this.runtime = this.vm.runtime
    this.db = Snapshots
    this.lastSnapshotID = null
    this.lastSnapshotTitle = ''
    globalThis.scratchmoar = this

    // @FIXME oz - 23-03-20
    // This will disable compiler warnings
    // ...but I'm not sure what other consequences there are
    // this.vm.setCompilerOptions({ enabled: false })

    // Mount Vue
    this.app = createApp(App)
    this.app.mount(this.$selectors.menubarPortal)
    
    // Manually add styles
    const $styles = document.createElement('style')
    $styles.innerHTML = $STYLES
    document.querySelector('body').appendChild($styles)

    // Determine the current project ID
    let path = window.location.pathname
    let parts = path.split('/')

    // Determine platform
    switch (window.location.host) {
      case 'scratch.mit.edu':
        this.platform = 'scratch'
      break
      case 'turbowarp.org':
      default:
        this.platform = 'turbowarp'
    }

    // @todo This should be added to db so that we can have multiple projects too!
    // Scratch: /projects/ID
    if (parts[1] === 'projects') {
      this.projectID = parts[2]
    // Turbowarp: /ID
    } else if (Number.isInteger(+parts[1])) {
      this.projectID = parts[2]
    // Create new
    } else {
      this.projectID = 'autosave'
    }

    // Determine if we should disable saving
    if (window.location.search.includes('nosave')) {
      this.disableSaving = true
    }
    
    // When saving immediately after deleting there is no autosave.
    // If you refresh page it will load the snapshot but not the autosave (since there wouldn't be one)
    // This is confusing, so this.hasDeletedAutosave helps make sure we always have an autosave
    this.hasDeletedAutosave = false
    this.loadAutosave()
    
    // Custom event listeners
    document.addEventListener('snapshotsResetDB', this.resetDB.bind(this))
    document.addEventListener('snapshotsSaveSnapshot', this.saveSnapshot.bind(this))
    document.addEventListener('snapshotsLoadSnapshot', this.loadSnapshot.bind(this))
    document.addEventListener('snapshotsDeleteSnapshot', this.deleteSnapshot.bind(this))
    document.addEventListener('snapshotsUpdateSnapshot', this.updateSnapshot.bind(this))
    document.addEventListener('snapshotsDownloadSnapshots', this.downloadSnapshots.bind(this))
    document.addEventListener('snapshotsLoadSnapshots', this.loadSnapshots.bind(this))

    document.addEventListener('snapshotsLoadedProject', () => this.isLoading = false)
    this.vm.on('PROJECT_CHANGED', () => this.autosave())
  },
}
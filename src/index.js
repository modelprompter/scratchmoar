import _SETUP from './setup.js'
import _SAVING from './store/saving.js'
import _LOADING from './store/loading.js'
import _DELETING from './store/deleting.js'
import _BLOCKS_SNAPSHOTS from './blocks/snapshots.js'
import _BLOCKS_API from './blocks/apis.js'
import _BLOCKS_DICTIONARY from './blocks/dictionary.js'
import _BLOCKS_LOOKS from './blocks/looks.js'

import {debounce} from 'lodash'
const DEBOUNCE_TIME = 250

/**
 * Scratchmoar extension
 * @todo Replace console.warning() and catch messages with Vue notifications
 */
class Scratchmoar {
  constructor () {
    // Constants
    this.DEBOUNCE_TIME = DEBOUNCE_TIME
    
    // Prop
    this.app = null // Vue app
    this.vm = null // scratch-gui Virtual Machine
    this.runtime = null // The Scratch Blocks extention runtime
    this.db = null // IndexedDB Database
    this.platform = null // Platform type ("scratch" for scratch.mit.edu, "turbowarp" assumes ?extension= support)
    this.projectID = null // Project ID from URL
    this.isLoading = false // Flag used to prevent autosave loops
    this.finishedLoading = false // Flag used to prevent autosave loops
    this.isSaving = false // Flag used to prevent autosave loops
    this.snapshot = {}
    this.$lastAPIResponse = null // The value of the last API response
    this.disableSaving = false // Flag used to disable autosave

    // Selectors
    this.$selectors = {
      projectTitle: 'input[class*="project-title-input_title-field_"]',
      menubarPortal: '[class*="menu-bar_account-info-group_"]'
    }

    // Methods and properties
    Object.keys(_SETUP).forEach(key => this[key] = _SETUP[key].bind(this))
    Object.keys(_SAVING).forEach(key => this[key] = _SAVING[key].bind(this))
    Object.keys(_LOADING).forEach(key => this[key] = _LOADING[key].bind(this))
    Object.keys(_DELETING).forEach(key => this[key] = _DELETING[key].bind(this))
    
    Object.keys(_BLOCKS_SNAPSHOTS.methods).forEach(key => this[key] = _BLOCKS_SNAPSHOTS.methods[key].bind(this))
    Object.keys(_BLOCKS_API.methods).forEach(key => this[key] = _BLOCKS_API.methods[key].bind(this))
    Object.keys(_BLOCKS_DICTIONARY.methods).forEach(key => this[key] = _BLOCKS_DICTIONARY.methods[key].bind(this))
    Object.keys(_BLOCKS_LOOKS.methods).forEach(key => this[key] = _BLOCKS_LOOKS.methods[key].bind(this))

    Object.keys(_BLOCKS_DICTIONARY.root).forEach(key => this[key] = _BLOCKS_DICTIONARY.root[key].bind(this))
    Object.keys(_BLOCKS_LOOKS.root).forEach(key => this[key] = _BLOCKS_LOOKS.root[key].bind(this))

    // Saving
    this.autosave = debounce(function () {_SAVING.autosave.call(this)}, this.DEBOUNCE_TIME, {leading: false, trailing: true})
  }

  // Misc
  setTitle (title = 'Untitled') {document.querySelector(this.$selectors.projectTitle).value = title}
  getTitle (def = 'Untitled') {return document.querySelector(this.$selectors.projectTitle).value || def}
  log () {console.log(...arguments)}

  // Required getInfo() method
  getInfo () {
    if (!this.vm) {
      this.setup()
    }
    return {
      name: 'Moar',
      id: 'scratchmoar',

      menus: {..._BLOCKS_SNAPSHOTS.menus, ..._BLOCKS_API.menus, ..._BLOCKS_DICTIONARY.menus, ..._BLOCKS_LOOKS.menus},
      blocks: [..._BLOCKS_SNAPSHOTS.blocks, '---', ..._BLOCKS_API.blocks, '---', ..._BLOCKS_DICTIONARY.blocks, '---', ..._BLOCKS_LOOKS.blocks],
    }
  }
}

// Automatically add the extension if it's getting imported,
// otherwise you'll have to manually run this yourself
globalThis.Scratch && Scratch.extensions.register(new Scratchmoar())

export default Scratchmoar
export default {
  methods: {
    /**
     * Load snapshot by ID
     */
    $loadSnapshotID ({ID}) {
      this.loadSnapshot({
        detail: ID,
        cb: () => {
          this.runtime.greenFlag()
        }
      })
    },
  
    /**
     * Load snapshot by name
     */
    $loadSnapshotName ({NAME}) {
      this.loadSnapshot({
        detail: NAME,
        cb: () => {
          this.runtime.greenFlag()
        }
      })
    },
    
    /**
     * Getters
     */
    $getSnapshotID () {
      return this.lastSnapshotID
    },
  
    $getSnapshotName () {
      return this.lastSnapshotTitle
    },
  },

  blocks: [
    {
      opcode: '$loadSnapshotID',
      blockType: 'command',
      isTerminal: true,
      text: 'load snapshot with ID [ID]',
      arguments: {
        ID: {
          type: 'number',
          defaultValue: 1
        }
      }
    },
    {
      opcode: '$loadSnapshotName',
      blockType: 'command',
      isTerminal: true,
      text: 'load snapshot named [NAME]',
      arguments: {
        NAME: {
          type: 'string',
          defaultValue: ''
        }
      }
    },
    {
      opcode: '$getSnapshotID',
      blockType: 'reporter',
      text: 'snapshot ID'
    },
    {
      opcode: '$getSnapshotName',
      blockType: 'reporter',
      text: 'snapshot name'
    }
  ],

  menus: {}
}
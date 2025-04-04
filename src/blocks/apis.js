import axios from 'axios'
export default {
  methods: {
    /**
     * Message a server
     * - Messages are stringified JSON
     * - Object blocks always check if a passed string is an object
     */
    $apiSendMessage ({METHOD, URL, DATA}, utils) {
      // Because this is a callback, the state of utils can change
      const origUtils = Object.assign(Object.create(Object.getPrototypeOf(utils)), utils)
      
      return new Promise((resolve, reject) => {
        axios({method: METHOD, url: URL, data: DATA})
          // Run main branch
          .then((res) => {
            const target = origUtils.thread.blockGlowInFrame
            if (origUtils.thread.blockContainer._blocks[target]?.inputs?.SUBSTACK?.block) {
              origUtils.startBranch(1, false)
              origUtils.startBranch(1, false)
            }
            this.$lastAPIResponse = res.data
            console.log('Scratchmoar API - SUCCESS', this.$lastAPIResponse, METHOD, URL, DATA, origUtils)

            resolve()
            return res
          // Run error branch
          }).catch((err) => {
            this.log('Scratchmoar API - ERROR', err, METHOD, URL, DATA, origUtils)
            this.$lastAPIResponse = JSON.stringify(err)
            origUtils.startBranch(2, false)
            resolve()
          })
      })
    },

    /**
     * Getters
     */
    $apiResponseData () {
      return this.$lastAPIResponse
    },

  },
  
  blocks: [
    /**
     * API block
     */
    {
      opcode: '$apiSendMessage',
      blockType: 'conditional',
      text: [
        'Send [METHOD] message to [URL] with [DATA] then',
        'on error'
      ],
      branchCount: 2,
      arguments: {
        METHOD: {
          type: 'string',
          menu: 'REST_METHODS',
          defaultValue:'GET'
        },
        URL: {
          type: 'string',
          defaultValue: 'https://www.boredapi.com/api/activity'
        },
        DATA: {
          type: 'string',
          defaultValue: '',
        }
      },
    },

    /**
     * Data response block
     */
    {
      opcode: '$apiResponseData',
      blockType: 'reporter',
      text: 'last API response',
      disableMonitor: true
    },

  ],

  menus: {
    REST_METHODS: {
      acceptReporters: true,
      items: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  }
}
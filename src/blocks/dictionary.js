import {get, set} from 'lodash'

export default {
  methods: {
    /**
     * Plucks a field from an object, use dot notation for.nested.fields
     * @param {*} param0 
     * @returns 
     */
    $objGetField ({FIELD, OBJ = {}}) {
      if (typeof OBJ === 'object') {
        return get(OBJ, FIELD)
      } else if (typeof OBJ === 'string') {
        try {
          return get(JSON.parse(OBJ), FIELD)
        } catch (e) {
          return e
        }
      } else {
        return ''
      }
    },

    /**
     * Plucks a field from an object, use dot notation for.nested.fields
     * @param {*} param0 
     * @returns 
     */
    $objSetField ({FIELD, OBJ = {}, WITH}) {
      
      if (typeof OBJ === 'object') {
        const val = JSON.stringify(set(OBJ, FIELD, WITH))
        console.log(OBJ, '\n\n', val)
        return val
      } else if (typeof OBJ === 'string') {
        try {
          const val = JSON.stringify(set(JSON.parse(OBJ), FIELD, WITH))
          console.log(OBJ, '\n\n', val)
          return val
        } catch (e) {
          return e
        }
      } else {
        return ''
      }
    },

    /**
     * Clears a list and replaces it with another
     * @param {*} param0 
     */
    $replaceList ({LISTA, LISTB}, utils) {
      const list = this.runtime?.getEditingTarget()?.lookupVariableByNameAndType(LISTA, 'list')
      if (list.value) {
        // Loop through and turn everything that's not a number into a string
        if (Array.isArray(LISTB)) {
          LISTB = LISTB.map((item) => {
            if (typeof item === 'number') {
              return item
            } else if (typeof item === 'object') {
              try {
                return JSON.stringify(item)
              } catch (e) {
                return item.toString()
              }
            } else {
              return item.toString()
            }
          })
        }
        
        this.vm.setVariableValue(this.runtime.getEditingTarget().id, list.id, LISTB)
      }
    }
  },

  blocks: [
    /**
     * Get field from object
     */
    {
      opcode: '$objGetField',
      blockType: 'reporter',
      text: 'get field [FIELD] from [OBJ]',
      arguments: {
        FIELD: {
          type: 'string',
          defaultValue: '',
        },
        OBJ: {
          type: 'string',
          defaultValue: '',
        }
      }
    },

    /**
     * Set field from object
     */
    {
      opcode: '$objSetField',
      blockType: 'reporter',
      text: 'set field [FIELD] in [OBJ] with [WITH]',
      arguments: {
        FIELD: {
          type: 'string',
          defaultValue: '',
        },
        OBJ: {
          type: 'string',
          defaultValue: '',
        },
        WITH: {
          type: 'string',
          defaultValue: '',
        }
      }
    },

    /**
     * Replace contest of list with another
     */
    {
      opcode: '$replaceList',
      blockType: 'command',
      text: 'replace list [LISTA] with [LISTB]',
      arguments: {
        LISTA: {
          type: 'string',
          menu: 'listOfLists'
        },
        LISTB: {
          type: 'string',
          defaultValue: '',
        }
      }
    }
  ],

  menus: {
    listOfLists: '$regenerateListsOfLists'
  },

  root: {
    $regenerateListsOfLists () {
      const listNames = this.runtime.getAllVarNamesOfType('list')
      
      if (listNames?.length) {
        return listNames
      } else {
        return ['']
      }
    }
  }
}
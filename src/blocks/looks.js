export default {
  methods: {
    $replaceBackdropFromURL ({BACKDROP, URL}) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = URL
        
        img.onload = () => {
          const stage = this.runtime.getTargetForStage()
          const costume = stage?.sprite?.costumes?.find(costume => costume.name === BACKDROP)
          if (!costume) return
          
          // Make sure backdrop covers the stage
          const nativeSize = this.runtime.renderer.getNativeSize()
          const size = {
            width: nativeSize[0]*2,
            height: nativeSize[1]*2
          }

          // Create canvas, copy the image to it, and replace costume.asset.data with it
          let canvas = document.createElement('canvas')
          canvas.width = img.width*2
          canvas.height = img.height*2

          // Cover
          let ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size.width, size.height)

          // Create new asset
          const costumeIndex = stage.getCostumeIndexByName(BACKDROP)
          const storage = this.runtime.storage
          const asset = storage.createAsset(
            storage.AssetType.ImageBitmap,
            storage.DataFormat.PNG,
            this.runtime.v2BitmapAdapter.convertDataURIToBinary(canvas.toDataURL('image/png')),
            null,
            true
          )

          // Prepare costume
          asset.size = [size.width*2, size.height*2]
          costume.asset = asset
          costume.dataFormat = asset.dataFormat
          costume.rotationCenterX = size.width / 2
          costume.rotationCenterY = size.height / 2
          costume.size = [size.width, size.height]
          costume.md5 = `${asset.assetId}.${asset.dataFormat}`

          // Find asset with same id and update it
          const newCostume = Object.assign({}, costume)
          costume.name += '__marked_for_deletion__'
          stage.renameCostume(costumeIndex, costume.name)
          
          // Add the new costume
          this.vm.assets.find(asset => asset.assetId === costume.asset.assetId).asset = asset
          this.vm.addBackdrop(costume.md5, newCostume)
          let newIndex = stage.getCostumeIndexByName(BACKDROP)

          // Loop through and find costume with same name and delete it
          // Needs to be deleted in two places, otherwise it'll be cached
          stage.sprite.costumes_.forEach((stageCostume, index) => {
            if (stageCostume.name.includes('__marked_for_deletion__')) {
              setTimeout(() => {
                // stage.deleteCostume(index)
                stage.sprite.costumes_.splice(index, 1)
                newIndex = stage.getCostumeIndexByName(BACKDROP)
                stage.currentCostume = newIndex
              }, 1000/(30/10))
            }
          })

          newIndex = stage.getCostumeIndexByName(BACKDROP)
          this.runtime.requestTargetsUpdate(stage)
          resolve()
        }

        /**
         * Bail
         */
        img.onerror = () => {
          resolve()
        }
      })
    }
  },
  blocks: [
    {
      opcode: '$replaceBackdropFromURL',
      blockType: 'command',
      text: 'replace backdrop [BACKDROP] with [URL]',
      arguments: {
        BACKDROP: {
          type: 'string',
          menu: '$menuReplaceBackdropFromURL'
        },
        URL: {
          type: 'string',
          defaultValue: './scratchmoar.png'
        }
      }
    }
  ],
  menus: {
    $menuReplaceBackdropFromURL: '$menuReplaceBackdropFromURL'
  },
  root: {
    $menuReplaceBackdropFromURL () {
      // Get stage
      const stage = this.runtime?.targets?.find(target => target.isStage)
      if (!stage) return ['']

      // Get backdrop names
      const backdropNames = stage?.sprite?.costumes?.map(costume => costume.name)
      return backdropNames?.length ? backdropNames : ['']
    }
  }
}
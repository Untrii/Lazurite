<template>
  <div class="root">
    <div class="type-picker" :class="{ 'type-picker_underlined': isListScrolled }">
      <h4
        class="type-picker__item"
        v-for="type in availableBackgrounds.default.keys()"
        :key="type"
        :class="{ 'type-picker__item_selected': pickedType == type }"
        @click="pickedType = type"
      >
        {{ localize(type) }}
      </h4>
    </div>
    <div class="tiles bg-module-tiles">
      <div class="tiles-wrap">
        <div class="tiles__grid">
          <color-tile
            v-for="tile in defaultTiles"
            :key="tile"
            :value="tile"
            :type="pickedType"
            :isDeletable="false"
            :isSelected="tile == pickedTileVal"
            @select="selectBackground(tile)"
            @delete="deleteTile(tile)"
          ></color-tile>

          <color-tile
            v-for="tile in customTiles"
            :key="tile"
            :value="tile"
            :type="pickedType"
            :isDeletable="true"
            :isSelected="tile == pickedTileVal"
            @select="selectBackground(tile)"
            @delete="deleteTile(tile)"
          ></color-tile>
          <color-tile type="add" @add="addBackground"></color-tile>
        </div>
      </div>
    </div>

    <color-palette
      :isColorPaletteOpened="isColorPaletteOpened"
      :mode="pickedType"
      @picked="onColorPicked"
      @closed="onPaletteClosed"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BackgroundCollection, { getBlankCollection } from '@/entities/BackgroundCollection'
import DesignService from '@/services/DesignService'
import VisualisationService from '@/services/VisualisationService'
import ColorTile from './ColorTile.vue'
import ColorPalette from './ColorPalette.vue'
import { stringFromType } from '@/entities/Theme'
import { remote } from 'electron'
import { promises as fs } from 'fs'

const dialog = remote.dialog
const { ImageProcessing } = remote.require('./main')

let service = new DesignService()
let visService = new VisualisationService()
let addBackgroundResolve: Function
let addBackgroundReject: Function

@Component({
  components: {
    ColorTile,
    ColorPalette,
  },
})
export default class BackgroundModule extends Vue {
  availableBackgrounds: BackgroundCollection = getBlankCollection()
  pickedType = 'color'
  pickedTileVal = '#FFFFFF'
  pickedTileType = 'color'
  isColorPaletteOpened = false
  isListScrolled = false
  trackedFrames = 20

  localize(str) {
    return str
  }

  getState() {
    this.availableBackgrounds = service.getBackgroundCollection()
    this.pickedTileType = this.pickedType = stringFromType(visService.theme.backgroundType)
    this.pickedTileVal = visService.theme.backgroundValue
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  mounted() {
    let element = document.querySelector('.bg-module-tiles')
    if (!element) return
    element.addEventListener('scroll', this.startScrollTracking)
  }

  beforeDestroy() {
    let element = document.querySelector('.bg-module-tiles')
    if (!element) return
    element.removeEventListener('scroll', this.startScrollTracking)
  }

  startScrollTracking() {
    this.trackScroll(20)
  }

  trackScroll(iteration: number) {
    let element = document.querySelector('.bg-module-tiles')
    if (!element) return

    if (element.scrollTop > 0) this.isListScrolled = true
    else this.isListScrolled = false

    if (iteration != 0) requestAnimationFrame(() => this.trackScroll(iteration - 1))
  }

  async selectBackground(val) {
    this.pickedTileVal = val
    this.pickedTileType = this.pickedType
    await service.selectBackground(this.pickedType, val)
  }

  async addBackground() {
    let getFreeFileName = async function(folder: string): Promise<string> {
      let files = await fs.readdir(folder)
      let index = 0
      while (true) {
        if (!files.includes(`custom${index}.png`) && !files.includes(`custom${index}.jpg`)) {
          return 'custom' + index
        }
        index++
      }
      return ''
    }
    switch (this.pickedType) {
      case 'color':
      case 'gradient':
      case 'gradicolor':
        let promise: Promise<string> = new Promise(function(resolve, reject) {
          addBackgroundResolve = resolve
          addBackgroundReject = reject
        })
        this.isColorPaletteOpened = true
        try {
          let result: string = await promise
          await this.selectBackground(result)
          service.addBackground(this.pickedType, result)
          this.isColorPaletteOpened = false
        } catch {}
        break
      case 'image':
      case 'pattern':
        let result = await dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
        })
        if (!result.canceled) {
          for (const file of result.filePaths) {
            let dataPath =
              process
                .cwd()
                .split('\\')
                .join('/') + '/data'
            let path = dataPath + (this.pickedType == 'image' ? '/background' : '/patterns')
            let extension = '.' + file.split('.').pop()
            let fileName = (await getFreeFileName(path)) + extension
            let filePath = path + '/' + fileName
            await fs.copyFile(file, filePath)
            if (this.pickedType == 'image') {
              await ImageProcessing.createPreviews()
            }
            service.addBackground(this.pickedType, filePath.replace(dataPath, ''))
          }
        }
        break
    }

    //service.addBackground()
  }
  onColorPicked(value) {
    addBackgroundResolve(value)
  }

  onPaletteClosed() {
    this.isColorPaletteOpened = false
    addBackgroundReject()
  }

  deleteTile(val) {
    service.deleteBackground(this.pickedType, val)
  }

  get defaultTiles() {
    let tileVals: string[] = []
    let defaultVals = this.availableBackgrounds.default.get(this.pickedType)
    if (defaultVals)
      for (let val of defaultVals) {
        tileVals.push(val)
      }
    return tileVals
  }
  get customTiles() {
    let tileVals: string[] = []
    let customVals = this.availableBackgrounds.custom.get(this.pickedType)
    if (customVals)
      for (let val of customVals) {
        tileVals.push(val)
      }
    return tileVals
  }
}
</script>

<style lang="scss" scoped>
.type-picker {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid white !important;

  &__item {
    cursor: pointer;
    display: inline;
    margin: 20px;
    user-select: none;
    &_selected {
      text-decoration: underline;
    }
  }
  &_underlined {
    border-bottom: 1px solid gray !important;
    transition: 0.2s;
  }
}

.root {
  width: 100%;
  height: 100%;
}

.tiles-wrap {
  width: fit-content;
  margin: auto;

  &__fade {
    width: calc(100% - 250px);
    height: 20px;
    margin-bottom: -20px;
    position: fixed;
    background: linear-gradient(0deg, transparent, white);
  }
}

.tiles::-webkit-scrollbar-thumb {
  border-color: white;
}

.tiles {
  width: 100%;
  max-height: calc(100% - 120px);

  overflow-y: scroll;
}
.tiles__grid {
  display: inline-grid;
}

@media (min-width: 520px) {
  .tiles__grid {
    grid-template-columns: 240px;
  }
}
@media (min-width: 760px) {
  .tiles__grid {
    grid-template-columns: 240px 240px;
  }
}
@media (min-width: 1000px) {
  .tiles__grid {
    grid-template-columns: 240px 240px 240px;
  }
}
@media (min-width: 1240px) {
  .tiles__grid {
    grid-template-columns: 240px 240px 240px 240px;
  }
}
@media (min-width: 1480px) {
  .tiles__grid {
    grid-template-columns: 240px 240px 240px 240px 240px;
  }
}
@media (min-width: 1720px) {
  .tiles__grid {
    grid-template-columns: 240px 240px 240px 240px 240px 240px;
  }
}
@media (min-width: 1960px) {
  .tiles__grid {
    grid-template-columns: 240px 240px 240px 240px 240px 240px 240px;
  }
}
</style>

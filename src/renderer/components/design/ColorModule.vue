<template>
  <div class="root">
    <h2 class="header">
      Recomended palletes:
    </h2>
    <div class="palettes">
      <div v-for="(palette, index) in recomendedPalettes" :key="index" class="palette">
        <div
          class="palette__brick-wrap"
          @click="selectedPaletteIndex = index"
          :style="`grid-template-columns: repeat(${palette.length}, 1fr)`"
        >
          <div
            class="palette__brick"
            v-for="(color, cindex) in palette"
            :key="cindex"
            :style="{ background: color.toCssColor() }"
          ></div>
        </div>
        <div class="sel-mark" v-if="selectedPaletteIndex == index">
          <h5>selected</h5>
        </div>
      </div>
    </div>
    <h2 class="header">
      Custom palette:
    </h2>
    <div class="palette">
      <div
        class="palette__brick-wrap"
        @click="selectedPaletteIndex = 10"
        :style="`grid-template-columns: repeat(${customPalette.length}, 1fr)`"
      >
        <div
          class="palette__brick"
          v-for="(color, cindex) in customPalette"
          :key="cindex"
          :style="{ background: color.toCssColor() }"
        ></div>
      </div>
      <div class="sel-mark" v-if="selectedPaletteIndex == 10">
        <h5>selected</h5>
      </div>
    </div>
    <lz-button size="large" style="float:left;" :block-level="false">Edit</lz-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesignService from '@/services/DesignService'
import Color from '@/entities/Color'

let service = new DesignService()

@Component
export default class ColorModule extends Vue {
  backgroundColor = new Color().fromRgb(0, 0, 1)
  selectedPalette: Color[] = []
  customPalette = [new Color().fromRgb(0, 0, 1), new Color().fromRgb(0, 0, 1), new Color().fromRgb(0, 0, 1)]

  getState() {
    this.backgroundColor = service.theme.backgroundColor
    this.selectedPalette = service.theme.palette || []
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }

  get recomendedPalettes(): Color[][] {
    return service.getRecommendedPalettes(this.backgroundColor)
  }

  isPalettesEquals(palette0: Color[], palette1: Color[]) {
    if (palette0.length != palette1.length) return false
    let isPaletteEquals = true
    for (let i = 0; i < palette0.length; i++) {
      if (palette0[i].equals(palette1[i])) continue
      else {
        isPaletteEquals = false
        break
      }
    }
    return isPaletteEquals
  }

  get selectedPaletteIndex() {
    if (this.isPalettesEquals(this.selectedPalette, this.customPalette)) return 10
    let result = -1
    for (let paletteIndex = 0; paletteIndex < this.recomendedPalettes.length; paletteIndex++) {
      let palette = this.recomendedPalettes[paletteIndex]
      if (this.isPalettesEquals(palette, this.selectedPalette)) {
        result = paletteIndex
        break
      }
    }
    return result
  }
  set selectedPaletteIndex(index: number) {
    if (index < this.recomendedPalettes.length) service.selectPalette(this.recomendedPalettes[index])
    else if (index == 10) service.selectPalette(this.customPalette)
  }
}
</script>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar-thumb {
    border-color: white;
  }
}
.header {
  margin: 40px;
  font-size: 32px;
}

.color-brick-large {
  width: 160px;
  height: 160px;
  display: inline-block;
}

.palette {
  display: inline-block;
  padding: 0 20px 40px 40px;
  border-radius: 8px;
  position: relative;
  width: 100%;

  &__brick-wrap {
    width: 100%;
    height: 82px;
    border: 1px solid #596b7d;
    border-radius: 10px;
    cursor: pointer;
    display: inline-grid;
  }

  &__brick {
    height: 80px;
    width: 100%;
    display: inline-block;

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
}

.sel-mark {
  position: absolute;
  top: 0;
}
.sel-mark h5 {
  padding: 4px;
  background: white;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 8px;
  border-top: 1px solid #596b7d;
  border-left: 1px solid #596b7d;
}

@media (min-width: 1000px) {
  .palette {
    max-width: calc(50vw - 126px);
  }
}
</style>

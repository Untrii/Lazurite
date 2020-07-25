<template>
  <div class="root">
    <h2 class="header">
      Recomended palletes:
    </h2>
    <div class="palettes">
      <div
        v-for="(palette, index) in recomendedPalettes"
        :key="index"
        class="palette"
      >
        <div class="palette__brick-wrap" @click="selectedPaletteIndex = index">
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

  getState() {
    this.backgroundColor = service.theme.backgroundColor
    this.selectedPalette = service.theme.palette || []
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get recomendedPalettes(): Color[][] {
    return service.getRecommendedPalettes(this.backgroundColor)
  }

  get selectedPaletteIndex() {
    let result = -1
    for (
      let paletteIndex = 0;
      paletteIndex < this.recomendedPalettes.length;
      paletteIndex++
    ) {
      let palette = this.recomendedPalettes[paletteIndex]
      if (palette.length == this.selectedPalette.length) {
        let isPaletteEquals = true
        for (let i = 0; i < palette.length; i++) {
          if (palette[i].equals(this.selectedPalette[i])) continue
          else {
            isPaletteEquals = false
            break
          }
        }
        if (isPaletteEquals) {
          result = paletteIndex
          break
        }
      }
    }
    return result
  }
  set selectedPaletteIndex(index: number) {
    service.selectPalette(this.recomendedPalettes[index])
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
  max-width: 600px;
  position: relative;
  width: 100%;

  &__brick-wrap {
    width: 100%;
    height: 82px;
    border: 1px solid #596b7d;
    border-radius: 10px;
    cursor: pointer;
  }

  &__brick {
    width: 20%;
    height: 80px;
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
</style>

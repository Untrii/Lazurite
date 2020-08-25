<template>
  <div class="color-input" :style="rootStyle">
    <lz-prepend :size="prependSize">{{ prepend }}</lz-prepend>
    <div
      class="color-input__tile"
      v-for="(color, index) in colors"
      :key="index"
      :style="getTileStyle(index)"
      @click="$emit('input', color)"
    ></div>
    <div class="color-input__select-custom" @click="isColorPaletteOpened = true">
      <svg width="16" height="4">
        <circle cx="2" cy="2" r="2" fill="gray"></circle>
        <circle cx="8" cy="2" r="2" fill="gray"></circle>
        <circle cx="14" cy="2" r="2" fill="gray"></circle>
      </svg>
    </div>
    <color-palette
      :isColorPaletteOpened="isColorPaletteOpened"
      mode="color"
      @picked="onColorPicked"
      @closed="onPaletteClosed"
    />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import DesignService from '@/services/DesignService'
import Color from '@/entities/Color'
import ColorPalette from '@/components/dialogs/ColorPalette.vue'

let service = new DesignService()

@Component({
  components: {
    ColorPalette,
  },
})
export default class LzColorInput extends Vue {
  @Prop({ default: '' }) prepend!: string
  @Prop({ default: 'small' }) size!: string
  colors: Color[] = []
  getState() {
    this.colors = service.theme.palette
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }

  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }

  get prependSize() {
    return this.prepend.trim().length > 0 ? this.size : 'no-prepend'
  }

  get rootStyle() {
    let result: any = {}
    result.gridTemplateColumns = `max-content repeat(${this.colors.length + 1},1fr)`
    return result
  }

  getTileStyle(index: number) {
    let color = new Color()
    color.fromOther(this.colors[index])
    //if color isnt instance of Color
    console.log('here')
    return {
      backgroundColor: color.toCssColor(),
    }
  }

  isColorPaletteOpened = false
  onColorPicked(value: string) {
    let color = new Color()
    color.fromHex(value)
    this.isColorPaletteOpened = false
    this.$emit('input', color)
  }
  onPaletteClosed() {
    this.isColorPaletteOpened = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.color-input {
  display: inline-grid;
  width: 100%;

  &__tile {
    width: 100%;
    height: 100%;
  }
  &__select-custom {
    background: $gray-light;
    display: grid;
    grid-template-rows: 1fr max-content 1fr;

    svg {
      margin: auto;
      grid-row: 2;
    }
  }
}
</style>

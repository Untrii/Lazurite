<template>
  <lz-modal
    :isVisible="isColorPaletteOpened"
    id="color-picker-modal"
    title="Chose color"
    size="lg"
    centered
    @close="close"
    @hide="close"
    @ok="picked"
  >
    <div id="color-palette"></div>

    <div class="palette__preview-block">
      <div class="palette__preview" :style="previewStyle"></div>
      <div
        class="palette__preview-sm"
        v-if="mode != 'color'"
        :style="'background:' + gradColor1"
        @click="gradSlotActive = 1"
      ></div>
      <div
        class="palette__preview-sm"
        v-if="mode != 'color'"
        :style="'background:' + gradColor2"
        @click="gradSlotActive = 2"
      ></div>
    </div>
    <div class="val-block">
      <div class="triple-input" style="margin-top: 12px;">
        <lz-prepend size="small">RGB</lz-prepend>
        <lz-number-input size="small" v-model:value="pickedColorRGB.r" min="0" max="255"></lz-number-input>
        <lz-number-input size="small" v-model:value="pickedColorRGB.g" min="0" max="255"></lz-number-input>
        <lz-number-input size="small" v-model:value="pickedColorRGB.b" min="0" max="255"></lz-number-input>
      </div>

      <div class="triple-input" style="margin-top: 12px;">
        <lz-prepend size="small">HSL</lz-prepend>
        <lz-number-input size="small" v-model:value="pickedColorHSL.h" min="0" max="360"></lz-number-input>
        <lz-number-input size="small" v-model:value="pickedColorHSL.s" min="0" max="100"></lz-number-input>
        <lz-number-input size="small" v-model:value="pickedColorHSL.l" min="0" max="100"></lz-number-input>
      </div>

      <b-input-group size="sm" prepend="Hex" style="margin-top: 12px;">
        <b-input type="text" v-model="pickedColor"></b-input>
      </b-input-group>
    </div>
  </lz-modal>
</template>

<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import iro from '@jaames/iro'
import Color from '@/entities/Color'

let colorPicker

export default class ColorPalette extends Vue {
  @Prop() defaultColor: string = '#FF0000'
  @Prop() isColorPaletteOpened!: boolean
  @Prop() mode!: string

  pickedColor = '#FF0000'
  pickedColorRGB = { r: 255, g: 0, b: 0 }
  pickedColorHSL = { h: 0, s: 100, l: 50 }
  gradColor1 = '#FF0000'
  gradColor2 = '#008000'
  gradSlotActive = 1

  interpolateGradiColor(): string {
    const start = new Color().fromHex(this.gradColor1)
    const end = new Color().fromHex(this.gradColor2)

    const cssColors: string[] = []
    const stepCount = 7
    for (let i = 0; i < stepCount; i++) {
      const diff = {
        r: end.r - start.r,
        g: end.g - start.g,
        b: end.b - start.b,
      }
      const diffPercent = i / (stepCount - 1)
      diff.r = Math.round(diffPercent * diff.r) + start.r
      diff.g = Math.round(diffPercent * diff.g) + start.g
      diff.b = Math.round(diffPercent * diff.b) + start.b
      const color = new Color().fromRgb(diff.r, diff.g, diff.b)
      cssColors.push(color.toCssColor())
    }
    for (let i = 0; i < cssColors.length; i++) {
      const diffPercent = 100 / stepCount

      const element = cssColors[i]
      cssColors[i] = `${element} ${diffPercent * i}%, ${element} ${diffPercent * (i + 1)}%`
    }

    return cssColors.join(',')
  }

  get previewStyle() {
    switch (this.mode) {
      case 'color':
        return {
          background: this.pickedColor,
        }
      case 'gradient':
        return {
          backgroundImage: `linear-gradient(135deg, ${this.gradColor1} 10%, ${this.gradColor2} 100%)`,
        }
      case 'gradicolor':
        return {
          backgroundImage: `linear-gradient(180deg, ${this.interpolateGradiColor()})`,
        }
    }
    return {}
  }

  @Watch('pickedColor')
  updateGradient() {
    if (this.gradSlotActive == 1) this.gradColor1 = this.pickedColor
    else this.gradColor2 = this.pickedColor
  }

  @Watch('gradSlotActive')
  changeGradSlot() {
    if (this.gradSlotActive == 1) colorPicker.color.hexString = this.gradColor1
    else colorPicker.color.hexString = this.gradColor2
  }

  @Watch('pickedColorRGB')
  recalcRGB() {
    const val = this.pickedColorRGB

    val.r = Math.min(255, Math.max(val.r, 0))
    val.g = Math.min(255, Math.max(val.g, 0))
    val.b = Math.min(255, Math.max(val.b, 0))

    const col = colorPicker.color
    if (col.rgb.r != val.r || col.rgb.g != val.g || col.rgb.b != val.b) col.rgb = { ...val }
  }

  @Watch('pickedColorHSL')
  recalcHSL() {
    const val = this.pickedColorHSL

    val.h = Math.min(360, Math.max(val.h, 0))
    val.s = Math.min(100, Math.max(val.s, 0))
    val.l = Math.min(100, Math.max(val.l, 0))

    const col = colorPicker.color
    if (col.hsl.h != val.h || col.hsl.s != val.s || col.hsl.l != val.l) col.hsl = { ...val }
  }

  @Watch('isColorPaletteOpened')
  openPalette() {
    this.pickedColor = this.defaultColor
    if (!this.isColorPaletteOpened) this.close()
    else {
      this.$nextTick(this.mountColorPicker)
    }
  }

  mountColorPicker() {
    if (!document.querySelector('#color-palette')) colorPicker = null
    if (document.querySelector('#color-palette') && !colorPicker) {
      colorPicker = null
      colorPicker = iro.ColorPicker('#color-palette', {
        layout: [
          {
            component: iro.ui.Box,
            options: {},
          },

          {
            component: iro.ui.Slider,
            options: {
              borderColor: '#000000',
              sliderType: 'hue',
            },
          },
        ],
        width: 280,
        color: this.pickedColor,
      })

      const handler = (res) => {
        this.pickedColor = res.hexString
        const rgb = res.rgb
        const hsl = res.hsl

        this.pickedColorRGB.r = rgb.r
        this.pickedColorRGB.g = rgb.g
        this.pickedColorRGB.b = rgb.b

        this.pickedColorHSL.h = hsl.h
        this.pickedColorHSL.s = hsl.s
        this.pickedColorHSL.l = hsl.l
      }

      colorPicker.on('color:change', handler)
      colorPicker.on('color:init', handler)
    }
  }

  picked() {
    if (this.mode == 'color') this.$emit('picked', this.pickedColor)
    if (this.mode == 'gradient') this.$emit('picked', `135deg, ${this.gradColor1} 10%, ${this.gradColor2} 100%`)
    if (this.mode == 'gradicolor') this.$emit('picked', `180deg, ${this.interpolateGradiColor()}`)
  }

  close() {
    this.$emit('closed')
    colorPicker = null
  }

  getState() {}

  beforeMount() {
    this.getState()
  }
}
</script>

<style lang="scss" scoped>
.triple-input {
  display: inline-grid;
  width: 100%;
  grid-template-columns: min-content 1fr 1fr 1fr;

  & div:not(:first-child) {
    border-right: gray;
  }
}
#color-palette {
  width: fit-content;
  float: left;
  vertical-align: middle;
}
.palette {
  &__preview {
    background: blue;
    height: 210px;
    width: 210px;
    border-radius: 12px;
    float: right;
  }
  &__preview-sm {
    background: blue;
    height: 100px;
    width: 100px;
    float: right;

    margin-top: 10px;
    margin-left: 10px;
    background: blue;

    cursor: pointer;
    border-radius: 8px;
  }
  &__preview-block {
    float: left;
    width: 220px;
    margin-left: 14px;
  }
}
.val-block {
  float: left;
  width: 228px;
  margin-left: 24px;
  margin-top: -12px;
}
</style>

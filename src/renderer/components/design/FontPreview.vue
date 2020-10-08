<template>
  <div>
    <div
      :class="getCardClasses(preset.id)"
      class="card preset-card"
      v-for="preset in presets"
      :key="preset.id"
      @click="selectedPresetId = preset.id"
    >
      <div class="card-body">
        <div class="preset-card__content">
          <div :style="preset.style">
            <div contenteditable="true" @input="onPresetNameChange(preset, $event)" v-once>
              {{ preset.name }}
            </div>
          </div>
          <div>
            {{ preset.family }} - {{ preset.size }}px,
            {{ weightFromNumber(preset.weight) }}
          </div>
        </div>

        <div
          class="preset-card__close"
          :class="getCrossClasses(preset.id)"
          @click.stop="removePreset(preset.id)"
        >
          ×
        </div>
      </div>
    </div>
    <div v-if="presets.length == 0">
      <div class="card preset-card">
        <div class="card-body">
          There is no presets
        </div>
      </div>
    </div>
    <div class="presets__add-button-wrap">
      <lz-button @click="addPreset" size="large" variant="secondary">
        Add preset
      </lz-button>

      <lz-button @click="randomizePreset" size="large" variant="secondary" style="margin-top:15px">
        Random preset
      </lz-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import IFontPreset, { getBlankPreset } from '@/entities/IFontPreset'
import randomString from '@/utils/StringGenerator'
import DesignStore from '@/services/store/DesignStore'
import FontService from '@/services/design/FontService'
//import localize from '@/utils/locales'

let store = new DesignStore()
let fontService = new FontService()

@Component
export default class FontPreview extends Vue {
  scale: number = 1
  selectedPresetId

  @Prop() fontFamilies!: string[]

  get theme() {
    return store.theme
  }

  beforeMount() {
    console.log('there')
    window.addEventListener('resize', this.updateScale)
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScale)
  }

  updateScale() {
    let scale = 1 / 3
    if (window.innerWidth > 1500) scale = 0.5
    if (window.innerWidth > 2200) scale = 1

    this.scale = scale
  }

  get presets(): IFontPreset[] {
    let result: any[] = []

    let fonts = this.theme.fontPresets

    for (const font of fonts) {
      result.push({
        size: font.size,
        weight: font.weight,
        name: font.name,
        family: font.family,
        id: font.id,
        style: {
          fontFamily: font.family,
          fontWeight: font.weight,
          fontSize: `min(${font.size * (1 / 19.2)}vw, ${font.size * (1 / 10.8)}vh)`
        }
      })
    }
    return result
  }

  getFontStyle(name) {
    this.updateScale()

    let fonts = this.theme.fontPresets

    for (const font of fonts) {
      if (font.name == name) {
        return {
          fontFamily: font.family,
          fontWeight: font.weight,
          fontSize: font.size * this.scale
        }
      }
    }
    return `font-family:Arial;font-weight:400;font-size:${48 * this.scale}px;`
  }

  getCardClasses(id) {
    if (id == this.selectedPresetId) return ['text-white', 'bg-blue']
    else return []
  }

  getCrossClasses(id) {
    if (id == this.selectedPresetId) return ['preset-card__close_white']
    else return []
  }

  removePreset(id) {
    fontService.removeFontPreset(id)
    if (this.selectedPresetId == id) {
      if (store.theme.fontPresets.length > 0) this.selectedPresetId = store.theme.fontPresets[0].id
    }
  }

  addPreset() {
    let preset = getBlankPreset()
    let existingPresets = store.theme.fontPresets
    let i = 1

    let isPresetExists = function(num) {
      for (const entry of existingPresets) {
        if (entry.name == 'New preset ' + num) return true
      }
      return false
    }
    while (isPresetExists(i)) i++
    preset.name = 'New preset ' + i

    this.selectedPresetId = preset.name
    fontService.addFontPreset(preset)
  }

  weightFromNumber(num) {
    switch (num) {
      case 100:
        return 'thin'
      case 300:
        return 'light'
      case 400:
        return 'regular'
      case 500:
        return 'medium'
      case 700:
        return 'bold'
      case 800:
        return 'extra-bold'
      case 900:
        return 'black'
    }
    return 'regular'
  }

  @Watch('selectedPresetId')
  onPresetChanged() {
    this.$emit('presetChanged', this.selectedPresetId)
  }

  onPresetNameChange(preset: IFontPreset, event) {
    let text = event.target.innerText
    fontService.changePresetName(preset.id, text)
  }

  randomizePreset() {
    console.log('here')
    for (const preset of store.theme.fontPresets) {
      fontService.removeFontPreset(preset.id)
    }
    let fontFamily = this.fontFamilies[Math.floor(Math.random() * this.fontFamilies.length)]
    let fontPresets: IFontPreset[] = [
      {
        name: 'Title',
        family: fontFamily,
        size: 96,
        weight: 400,
        id: randomString(8)
      },
      {
        name: 'Subtitle',
        family: fontFamily,
        size: 80,
        weight: 400,
        id: randomString(8)
      },
      {
        name: 'Paragraph title',
        family: fontFamily,
        size: 56,
        weight: 400,
        id: randomString(8)
      },
      {
        name: 'Main text',
        family: fontFamily,
        size: 48,
        weight: 400,
        id: randomString(8)
      }
    ]
    for (const preset of fontPresets) {
      fontService.addFontPreset(preset)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.preset-card {
  margin-bottom: 15px;
  user-select: none;

  &__content {
    float: left;
  }

  &__close {
    color: gray;
    font-size: 28px;
    float: right;
    cursor: pointer;
    margin-top: -14px;

    &_white {
      color: White !important;
    }
  }
}

.bg-blue {
  background-color: $blue-light !important;
}
</style>

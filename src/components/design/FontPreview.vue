<template>
  <div>
    <lz-card
      :class="getCardClasses(preset.id)"
      class="preset-card"
      v-for="preset in presets"
      :key="preset.id"
      @click="selectedPresetId = preset.id"
    >
      <div class="preset-card__content">
        <div :style="preset.style">
          <div
            contenteditable="true"
            @input="onPresetNameChange(preset, $event)"
          >
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
    </lz-card>
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

      <lz-button
        @click="randomizePreset"
        size="large"
        variant="secondary"
        style="margin-top:15px"
      >
        Random preset
      </lz-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import IFontPreset, { getBlankPreset } from '@/entities/IFontPreset'
import randomString from '@/utils/StringGenerator'
import DesignStore from '@/services/store/DesignStore'
import FontService from '@/services/design/FontService'
//import localize from '@/utils/locales'

const store = new DesignStore()
const fontService = new FontService()

export default class FontPreview extends Vue {
  scale = 1
  selectedPresetId = 'none'

  @Prop() fontFamilies!: string[]

  get theme() {
    return store.theme
  }

  beforeMount() {
    console.log('there')
    window.addEventListener('resize', this.updateScale)
    if (this.presets.length > 0) this.selectedPresetId = this.presets[0].id
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
    const result: any[] = []

    const fonts = this.theme.fontPresets

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
          fontSize: `min(${font.size * (1 / 19.2)}vw, ${font.size *
            (1 / 10.8)}vh)`,
        },
      })
    }
    return result
  }

  getFontStyle(name) {
    this.updateScale()

    const fonts = this.theme.fontPresets

    for (const font of fonts) {
      if (font.name == name) {
        return {
          fontFamily: font.family,
          fontWeight: font.weight,
          fontSize: font.size * this.scale,
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
      if (store.theme.fontPresets.length > 0)
        this.selectedPresetId = store.theme.fontPresets[0].id
    }
  }

  addPreset() {
    console.log('adding preset')
    const preset = getBlankPreset()
    const existingPresets = store.theme.fontPresets
    let i = 1
    const isPresetExists = function(num) {
      for (const entry of existingPresets) {
        if (entry.name == 'New preset ' + num) return true
      }
      return false
    }
    while (isPresetExists(i)) i++
    preset.name = 'New preset ' + i
    fontService.addFontPreset(preset)

    this.$nextTick(() => (this.selectedPresetId = preset.id))
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
    const text = event.target.innerText
    fontService.changePresetName(preset.id, text)
  }

  randomizePreset() {
    console.log('here')
    for (const preset of store.theme.fontPresets) {
      fontService.removeFontPreset(preset.id)
    }
    const fontFamily = this.fontFamilies[
      Math.floor(Math.random() * this.fontFamilies.length)
    ]
    const fontPresets: IFontPreset[] = [
      {
        name: 'Title',
        family: fontFamily,
        size: 96,
        weight: 400,
        id: randomString(8),
      },
      {
        name: 'Subtitle',
        family: fontFamily,
        size: 80,
        weight: 400,
        id: randomString(8),
      },
      {
        name: 'Paragraph title',
        family: fontFamily,
        size: 56,
        weight: 400,
        id: randomString(8),
      },
      {
        name: 'Main text',
        family: fontFamily,
        size: 48,
        weight: 400,
        id: randomString(8),
      },
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
      transition: 0.3s;
    }
  }
}

.bg-blue {
  background-color: $blue-light !important;
  transition: 0.3s;
}
</style>

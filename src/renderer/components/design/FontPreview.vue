<template>
  <div>
    <div
      :class="getCardClasses(preset.name)"
      class="card preset-card"
      v-for="preset in presets"
      :key="preset.name"
      @click="selectedPreset = preset.name"
    >
      <div class="card-body">
        <div class="preset-card__content">
          <div :style="preset.style">
            {{ preset.name }}
          </div>
          <div>
            {{ preset.family }} - {{ preset.size }}px,
            {{ weightFromNumber(preset.weight) }}
          </div>
        </div>

        <div class="preset-card__close" :class="getCrossClasses(preset.name)" @click.stop="removePreset(preset.name)">
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
      <b-button block @click="addPreset">Add preset</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import DesignService from '@/services/DesignService'
import ITheme, { getBlankTheme } from '@/entities/ITheme'
import { getBlankPreset } from '@/entities/IFontPreset'
//import localize from '@/utils/locales'

const service = new DesignService()

@Component
export default class FontPreview extends Vue {
  selectedPreset = ''
  theme: ITheme = getBlankTheme()
  scale: number = 1

  getState() {
    this.theme = service.theme
    if (this.selectedPreset == '' && service.theme.fontPresets.length > 0)
      this.selectedPreset = service.theme.fontPresets[0].name
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
    window.addEventListener('resize', this.updateScale)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
    window.removeEventListener('resize', this.updateScale)
  }

  updateScale() {
    let scale = 1 / 3
    if (window.innerWidth > 1500) scale = 0.5
    if (window.innerWidth > 2200) scale = 1

    this.scale = scale
  }

  get presets() {
    let result: any[] = []

    let fonts = this.theme.fontPresets

    for (const font of fonts) {
      result.push({
        size: font.size,
        weight: font.weight,
        name: font.name,
        family: font.family,
        style: {
          fontFamily: font.family,
          fontWeight: font.weight,
          fontSize: `min(${font.size * (1 / 19.2)}vw, ${font.size * (1 / 10.8)}vh)`,
        },
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
          fontSize: font.size * this.scale,
        }
      }
    }
    return `font-family:Arial;font-weight:400;font-size:${48 * this.scale}px;`
  }

  getCardClasses(name) {
    if (name == this.selectedPreset) return ['text-white', 'bg-blue']
    else return []
  }

  getCrossClasses(name) {
    if (name == this.selectedPreset) return ['preset-card__close_white']
    else return []
  }

  removePreset(name) {
    service.removeFontPreset(name)
    if (this.selectedPreset == name) {
      if (service.theme.fontPresets.length > 0) this.selectedPreset = service.theme.fontPresets[0].name
    }
  }

  addPreset() {
    let preset = getBlankPreset()
    let existingPresets = service.theme.fontPresets
    let i = 1

    let isPresetExists = function(num) {
      for (const entry of existingPresets) {
        if (entry.name == 'New preset ' + num) return true
      }
      return false
    }
    while (isPresetExists(i)) i++
    preset.name = 'New preset ' + i

    this.selectedPreset = preset.name
    service.addFontPreset(preset)
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

  @Watch('selectedPreset')
  onPresetChanged() {
    this.$emit('presetChanged', this.selectedPreset)
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

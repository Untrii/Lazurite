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
            {{ preset.family }}
          </div>
        </div>

        <div class="preset-card__close" @click.stop="removePreset(preset.name)">
          ×
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesignService from '@/services/DesignService'
import ElementService from '@/services/ElementService'
import Theme, { getBlankTheme } from '@/entities/Theme'
//import localize from '@/utils/locales'

const service = new DesignService()
const elementService = new ElementService()

@Component
export default class FontPreview extends Vue {
  selectedPreset = ''
  theme: Theme = getBlankTheme()
  scale: number = 1

  getState() {
    this.theme = service.theme
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
    elementService.addOnChangeListener(() => this.getState())
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

  get presets() {
    let result: any[] = []

    let fonts = this.theme.fontPresets

    for (const font of fonts) {
      result.push({
        name: font.name,
        family: font.family,
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
    if (name == this.selectedPreset) return ['text-white', 'bg-info']
    else return []
  }

  removePreset(name) {
    console.log('Removing preset...')
    service.removeFontPreset(name)
  }
}
</script>

<style lang="scss" scoped>
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
  }
}
</style>

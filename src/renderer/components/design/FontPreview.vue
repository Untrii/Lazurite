<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h1 :style="getFontStyle('slideTitle')">
          Slide title
        </h1>
        <h2 :style="getFontStyle('slideSubtitle')">
          Slide subtitle
        </h2>
        <h3 :style="getFontStyle('paragraphTitle')">
          Paragraph title
        </h3>
        <h4 :style="getFontStyle('paragraphText')">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </h4>
        Scale 1:{{ 1 / this.scale }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesignService from '../../services/DesignService'
import Theme, { getBlankTheme } from '../../entities/Theme'
//import localize from '../../utils/locales'

const service = new DesignService()

@Component
export default class FontPreview extends Vue {
  theme: Theme = getBlankTheme()
  scale: number = 1

  getState() {
    this.theme = service.theme
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
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
}
</script>

<style lang="scss" scoped></style>

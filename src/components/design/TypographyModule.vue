<template>
  <div class="root">
    <div class="content">
      <div class="presets">
        <font-preview
          class="preview"
          @presetChanged="onPresetChanged"
          :fontFamilies="fontFamilies"
        ></font-preview>
      </div>
      <div class="preset-redactor">
        <div class="preset-redactor__font-settings">
          <lz-number-input
            :value="getPresetFont(selectedPresetId).size"
            @input="onSizeChange"
            size="large"
            prepend="Font size"
            class="preset-redactor__input"
          ></lz-number-input>

          <lz-select
            size="large"
            prepend="Font weight"
            :value="getPresetFont(selectedPresetId).weight"
            :options="presetFontVariants"
            @change="onWeightChange"
            class="preset-redactor__input"
          >
          </lz-select>
        </div>
        <div class="font-list">
          <font-demo-tile
            class="font-list__item"
            v-for="font in fontList"
            :key="font.name"
            :name="font.name"
            :variants="font.variants"
            :isSelected="selectedPresetFamily == font.name"
            @click="selectFont(font.name)"
          ></font-demo-tile>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import localize from '@/utils/locales'
import IFontPreset, { getBlankPreset } from '@/entities/IFontPreset'
import FontPreview from './FontPreview.vue'
import DesignStore from '@/services/store/DesignStore'
import FontService from '@/services/design/FontService'
import FontDemoTile from './FontDemoTile.vue'

const store = new DesignStore()
const service = new FontService()

@Options({
  components: {
    FontPreview,
    FontDemoTile,
  },
})
export default class TypographyModule extends Vue {
  pickedType = 'text'
  selectedPresetId = ''
  fontList: any[] = []

  localize(str) {
    return localize('en', str)
  }

  async beforeMount() {
    if (this.fontList.length == 0) {
      this.fontList = await store.getFontList()
    }
  }
  beforeDestroy() {}

  onPresetChanged(selectedPreset) {
    this.selectedPresetId = selectedPreset
  }

  get selectedPresetFamily() {
    return this.getPresetFont(this.selectedPresetId).family
  }

  onSizeChange(newSize) {
    if (newSize == '') return
    if (typeof newSize != 'number') newSize = parseInt(newSize)
    if (newSize > 200) newSize = 200
    service.changePresetFontSize(this.selectedPresetId, newSize)
  }

  onWeightChange(newWeight) {
    if (typeof newWeight != 'number') newWeight = parseInt(newWeight)
    service.changePresetFontWeight(this.selectedPresetId, newWeight)
  }

  selectFont(family) {
    service.changePresetFontFamily(this.selectedPresetId, family)
  }

  getPresetFont(presetId): IFontPreset {
    const presets = store.theme.fontPresets
    for (const entry of presets) {
      if (entry.id == presetId) return entry
    }
    return getBlankPreset()
  }
  get presetFontVariants() {
    for (const entry of this.fontList) {
      if (entry.name == this.getPresetFont(this.selectedPresetId).family)
        return entry.variants
    }
    return [400]
  }

  get fontFamilies() {
    const result: string[] = []
    for (const font of this.fontList) {
      result.push(font.name)
    }
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.root {
  height: 100%;

  &::-webkit-scrollbar-thumb {
    border-color: $gray-extralight;
  }
}
.type-picker {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  &__item {
    cursor: pointer;
    display: inline;
    margin: 20px;
    user-select: none;
    &_selected {
      text-decoration: underline;
    }
  }
}

.preset-redactor {
  display: grid;
  grid-template-rows: 68px 1fr;
  height: 100%;

  &__font-settings {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
  }

  &__input {
    padding-top: 20px;
    padding-right: 20px;
  }
}

.font-list {
  overflow-y: scroll;
  height: 100%;
  max-height: calc(100vh - 124px);
  margin-top: 20px;
  padding-right: 2px;
  margin-right: 6px;

  &__item {
    cursor: pointer;
    display: inline-block;
    width: calc(50% - 10px);
    &:nth-child(odd) {
      margin-right: 20px;
    }
    margin-top: 20px;
    &:nth-child(1) {
      margin-top: 0 !important;
    }
    &:nth-child(2) {
      margin-top: 0 !important;
    }
  }
  &__item-label {
    font-size: 18px;
  }
  &::-webkit-scrollbar-thumb {
    border-style: solid;
    border-width: 0px 10px 0px 0px;
    border-color: $gray-extralight;
    &:hover {
      border: solid 2px $gray-extralight;
      border-radius: 10px;
    }
  }
}

@media (max-width: 1640px) {
  .font-list__item {
    width: 100%;
    margin-right: 0px !important;
  }
}

.badge-entry {
  display: inline;
  margin: 0px 10px;
}

@media (max-width: 1200px) {
  .badge-entry {
    display: none;
  }
}

.preview {
  padding: 20px;
  position: sticky;
}

.content {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(max-content, 2fr) 3fr;
}

.presets {
  &__add-button-wrap {
    margin: 0 30px;
  }
}
</style>

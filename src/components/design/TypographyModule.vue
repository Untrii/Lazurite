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
          <!-- 
          <b-input-group prepend="Font weight" class="preset-redactor__input">
            <b-form-select
              :value="getPresetFont(selectedPresetId).weight"
              :options="presetFontVariants"
              @change="onWeightChange"
            ></b-form-select>
          </b-input-group> -->
        </div>
        <div class="font-list">
          <ul class="list-group">
            <li
              class="list-group-item font-list__item"
              :class="{
                'list-group-item-info':
                  getPresetFont(selectedPresetId).family == font.name,
              }"
              @click="selectFont(font.name)"
              v-for="font in fontList"
              :key="font.name"
            >
              <div
                :style="'font-family:' + font.name"
                class="font-list__item-label"
              >
                {{ font.name }}
              </div>
              <span class="badge badge-pill">
                <div
                  v-for="size in font.variants"
                  :key="size"
                  class="badge-entry"
                >
                  {{ size + ' ' }}
                </div>
              </span>
            </li>
          </ul>
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

const store = new DesignStore()
const service = new FontService()

@Options({
  components: {
    FontPreview,
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

  onSizeChange(newSize) {
    if (newSize == '') return
    if (typeof newSize != 'number') newSize = parseInt(newSize)
    if (newSize > 200) newSize = 200
    service.changePresetFontSize(this.selectedPresetId, newSize)
  }

  onWeightChange(newWeight) {
    console.log('changing weight: ' + newWeight)
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
  grid-template-rows: min-content 1fr;
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
    justify-content: space-between !important;
    display: flex !important;
    align-items: center !important;
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

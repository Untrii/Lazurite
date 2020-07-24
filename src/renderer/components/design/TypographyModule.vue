<template>
  <div class="root">
    <div class="content">
      <div class="presets">
        <font-preview
          class="preview"
          @presetChanged="onPresetChanged"
        ></font-preview>
      </div>
      <div class="preset-redactor">
        <div class="preset-redactor__font-settings">
          <b-input-group prepend="Font size" class="preset-redactor__input">
            <b-input
              type="number"
              :value="presetFont.size"
              @input="onSizeChange"
            ></b-input>
          </b-input-group>
          <b-input-group prepend="Font weight" class="preset-redactor__input">
            <b-form-select
              :value="presetFont.weight"
              :options="presetFontVariants"
              @change="onWeightChange"
            ></b-form-select>
          </b-input-group>
        </div>
        <div class="font-list">
          <ul class="list-group">
            <li
              class="list-group-item font-list__item"
              :class="{
                'list-group-item-info': presetFont.family == font.name,
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
              <span class="badge badge-pill" style="font-weight: 900">
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
import { Vue, Component } from 'vue-property-decorator'
import DesignService from '@/services/DesignService'
import localize from '@/utils/locales'
import { getBlankPreset } from '@/entities/FontPreset'
import FontPreview from './FontPreview.vue'

const service = new DesignService()

@Component({
  components: {
    FontPreview,
  },
})
export default class TypographyModule extends Vue {
  pickedType = 'text'
  selectedPreset = ''
  fontList: any[] = []

  localize(str) {
    return localize('en', str)
  }

  getState() {
    if (this.fontList.length == 0) {
      ;(async () => (this.fontList = await service.getFontList()))()
    }
  }

  beforeMount() {
    console.log('Typography module')
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  onPresetChanged(selectedPreset) {
    this.selectedPreset = selectedPreset
  }

  onSizeChange(newSize) {
    if (newSize == '') return
    if (typeof newSize != 'number') newSize = parseInt(newSize)
    if (newSize > 200) newSize = 200
    service.changePresetFontSize(this.selectedPreset, newSize)
  }

  onWeightChange(newWeight) {
    if (typeof newWeight != 'number') newWeight = parseInt(newWeight)
    service.changePresetFontWeight(this.selectedPreset, newWeight)
  }

  selectFont(family) {
    service.changePresetFontFamily(this.selectedPreset, family)
  }

  get presetFont() {
    let presets = service.theme.fontPresets
    for (const entry of presets) {
      if (entry.name == this.selectedPreset) return entry
    }
    return getBlankPreset()
  }
  get presetFontVariants() {
    for (const entry of this.fontList) {
      if (entry.name == this.presetFont.family) return entry.variants
    }
    return [400]
  }
}
</script>

<style lang="scss" scoped>
.root {
  height: 100%;

  &::-webkit-scrollbar-thumb {
    border-color: white;
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
    border-color: white;
    &:hover {
      border: solid 2px white;
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

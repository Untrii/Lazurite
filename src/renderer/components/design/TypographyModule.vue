<template>
  <div class="root">
    <div class="type-picker">
      <h4
        class="type-picker__item"
        :class="{ 'type-picker__item_selected': pickedType == 'text' }"
        @click="pickedType = 'text'"
      >
        {{ localize('text') }}
      </h4>
      <h4
        class="type-picker__item"
        :class="{ 'type-picker__item_selected': pickedType == 'headers' }"
        @click="pickedType = 'headers'"
      >
        {{ localize('headers') }}
      </h4>
    </div>
    <div class="content">
      <font-preview class="preview"></font-preview>
      <div class="font-list">
        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-between align-items-center font-list__item"
            v-for="font in fontList"
            :key="font.name"
          >
            <div :style="'font-family:' + font.name">
              {{ font.name.split("'").join('') }}
            </div>
            <span class="badge badge-pill" style="font-weight: 900">
              <div
                v-for="size in font.variants"
                :key="size"
                style="display: inline; margin: 0 10px;"
              >
                {{ size + ' ' }}
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesignService from '../../services/DesignService'
import localize from '../../utils/locales'
import FontPreview from './FontPreview.vue'

const service = new DesignService()

@Component({
  components: {
    FontPreview,
  },
})
export default class TypographyModule extends Vue {
  pickedType = 'text'
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
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped>
.root {
  overflow-y: scroll;
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

.font-list {
  &__item {
    cursor: pointer;
  }
}

.preview {
  padding: 0 15px;
}

.content {
  display: grid;
  grid-template-columns: 2fr 3fr;
}
</style>

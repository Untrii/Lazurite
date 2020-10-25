<template>
  <div class="preview" :style="rootStyle">
    <div class="preview__content">
      <div v-for="(s, index) in slides" :key="index" :class="itemClasses(index)" @click="selectSlide(index)">
        <div :style="itemStyle" class="preview__item">
          <slide :index="parseInt(index)" :height="previewHeight" :width="previewWidth"></slide>
        </div>
        <div class="preview__delete-button" @click.stop="deleteSlide(index)">
          <img :src="assets.delete" alt="" />
        </div>
      </div>
      <div class="preview__add-button" :style="itemStyle" @click="createSlide">
        <img :src="assets.plus" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import assets from '@/assets/index'
import { Options, Vue } from 'vue-class-component'
import Slide from './Slide.vue'
import HistoryService from '@/services/constructor/HistoryService'
import ConstrctorStore from '@/services/store/ConstructorStore'
import SlideService from '@/services/constructor/SlideService'

const historyService = new HistoryService()
const store = new ConstrctorStore()
const slideService = new SlideService()

@Options({
  components: {
    Slide,
  },
})
export default class Preview extends Vue {
  get previewSize() {
    return store.previewModuleSize
  }
  get selectedSlideIndex() {
    return store.selectedSlideIndex
  }
  get slides() {
    return store.presentation.slides
  }

  get assets(): any {
    return assets
  }
  get rootStyle(): object {
    return {
      width: this.previewSize + 'px',
    }
  }
  get itemStyle(): object {
    return {
      height: this.previewHeight + 'px',
    }
  }
  get previewHeight() {
    return ((this.previewSize - 40) / 16) * 9
  }
  get previewWidth() {
    return this.previewSize - 40
  }
  itemClasses(index: number): string[] {
    return ['preview__item-wrap', this.selectedSlideIndex == index ? 'preview__item-wrap_selected' : '']
  }

  createSlide() {
    slideService.createSlide()
    historyService.registerSlideCreate()
  }
  selectSlide(index: number | string) {
    console.log('preview')
    if (typeof index == 'string') index = parseInt(index)
    slideService.selectSlide(index)
  }
  deleteSlide(index: number) {
    console.log('here')
    const slide = slideService.deleteSlide(index)
    if (slide) {
      historyService.registerSlideDelete(index, slide)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.preview {
  height: 100%;
  width: 300px;
  background-color: $blue-dark;
  overflow-y: scroll;
  display: inline-block;

  &::-webkit-scrollbar-thumb {
    background: $blue-extralight !important;
    border-color: $blue-dark !important;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: $blue-extralight !important;
    border-color: $blue-dark !important;
  }

  &__content {
    padding: 20px;
  }

  &__add-button {
    background-color: #4d5f71;
    cursor: pointer;
    display: flex;
    width: calc(100% + 12px);
    align-items: center;

    img {
      margin: auto;
      height: 40px;
      width: 40px;
    }
  }

  &__delete-button {
    display: none;
    position: relative;
    height: 24px;
    top: 0;
    right: 23px;

    img {
      width: 20px;
      height: 20px;
      filter: drop-shadow(black 0px 0px 2px);
    }
  }

  &__item-wrap {
    display: flex;
    align-content: flex-end;
    width: calc(100% + 20px);
    margin-left: -20px;
    padding-left: 20px;
    margin-bottom: 20px;
    cursor: pointer;

    &:hover .preview__delete-button {
      display: block !important;
    }

    &_selected {
      border-left: 5px solid white !important;
      padding-left: 15px !important;
    }
  }
}
</style>

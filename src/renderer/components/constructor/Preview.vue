<template>
  <div class="preview" :style="rootStyle">
    <div class="preview__content">
      <div
        v-for="(s, index) in slides"
        :key="index"
        :class="itemClasses(index)"
        @click="selectSlide(index)"
      >
        <div :style="itemStyle" class="preview__item">
          <slide
            :index="parseInt(index)"
            :height="previewHeight"
            :width="previewWidth"
          ></slide>
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
import { Vue, Component } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import SlideObject from '@/entities/SlideObject'
import Slide from './Slide.vue'

let service = new ConstructorService()

@Component({
  components: {
    Slide,
  },
})
export default class Preview extends Vue {
  previewSize = 0
  selectedSlideIndex = 0
  slides: Map<string, SlideObject>[] = []

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  getState() {
    this.previewSize = service.previewModuleSize ?? 0
    this.selectedSlideIndex = service.selectedSlideIndex ?? 0
    if (service.presentation) this.slides = { ...service.presentation?.slides }
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
    return [
      'preview__item-wrap',
      this.selectedSlideIndex == index ? 'preview__item-wrap_selected' : '',
    ]
  }

  createSlide() {
    service.createSlide()
    this.getState()
  }
  selectSlide(index: number | string) {
    console.log('preview')
    if (typeof index == 'string') index = parseInt(index)
    service.selectSlide(index)
  }
  deleteSlide(index: number) {
    service.deleteSlide(index)
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

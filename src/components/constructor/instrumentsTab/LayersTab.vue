<template>
  <div>
    <lz-button
      class="tab-button"
      v-for="(element, index) in sortedElements"
      :key="element.id"
      :image="element.displayImage"
      :style="getButtonStyle(element.id, index)"
      variant="transparent"
      size="small"
      @mousedown="onMouseDown($event, element.id, index)"
      >{{ element.displayText }}</lz-button
    >
  </div>
</template>

<script lang="ts">
import ImageBlock from '@/components/elements/ImageBlock.vue'
import ISlideObject from '@/entities/ISlideObject'
import IImageBlock from '@/entities/slideObjects/IImageBlock'
import ConstrctorStore from '@/services/store/ConstructorStore'
import assets from '@/assets'
import { Vue } from 'vue-class-component'

const store = new ConstrctorStore()

interface ISlideObjectInfo {
  id: string
  type: string
  displayText: string
  displayImage: string
  zIndex: number
}

export default class LayersTab extends Vue {
  getDisplayImage(object: ISlideObject) {
    if (object.type == 'ImageBlock') {
      const imageBlock: any = object
      return 'local-img://' + imageBlock.src
    } else if (object.type == 'TextBlock') {
      return assets.text
    } else return assets.logo
  }

  getDisplayText(object: ISlideObject) {
    if (object.type == 'TextBlock') {
      const textBlock: any = object
      const virtualElement = document.createElement('velem')
      virtualElement.innerHTML = textBlock.content
      return virtualElement.innerText
    } else return object.type
  }

  get sortedElements(): ISlideObjectInfo[] {
    let slide = store.slideByIndex(store.selectedSlideIndex)
    let result: ISlideObjectInfo[] = []

    for (const object of slide.values()) {
      result.push({
        id: object.id,
        type: object.type,
        displayImage: this.getDisplayImage(object),
        displayText: this.getDisplayText(object),
        zIndex: object.zIndex,
      })
    }
    result.sort((a, b) => b.zIndex - a.zIndex)
    return result
  }

  lastPressedId = 'null'
  lastPressedIndex = -1
  startY = 0
  currentY = 0
  isMousePressed = false
  onMouseDown(event: MouseEvent, id: string, index: number) {
    this.isMousePressed = true
    this.lastPressedId = id
    this.lastPressedIndex = index
    this.startY = event.clientY
    this.currentY = event.clientY
    console.log(event)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseMove(event: MouseEvent) {
    this.currentY = event.clientY
  }

  resetValues() {
    this.isMousePressed = false
    this.lastPressedIndex = -1
    this.lastPressedId = 'null'
    this.startY = 0
    this.currentY = 0
  }

  onMouseUp(event: MouseEvent) {
    this.resetValues()
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  getButtonStyle(id: string, index: number): object {
    if (this.isMousePressed && id == this.lastPressedId) {
      return {
        zIndex: 10,
        transform: `translateY(${this.currentY - this.startY}px)`,
      }
    } else {
      let offsetY = this.currentY - this.startY
      if (offsetY > 0) {
        let lastIndex = this.lastPressedIndex + Math.floor((offsetY + 23) / 46.5)
        if (index <= lastIndex && index > this.lastPressedIndex)
          return {
            transform: `translateY(-46.5px)`,
          }
      }
      if (offsetY < 0) {
        let lastIndex = this.lastPressedIndex + Math.floor((offsetY + 23) / 46.5)
        if (index >= lastIndex && index < this.lastPressedIndex)
          return {
            transform: `translateY(46.5px)`,
          }
      }
    }
    return {}
  }
}
</script>

<style lang="scss" scoped>
.tab-button {
  transition: none !important;
  user-select: none;
}
</style>

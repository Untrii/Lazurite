<template>
  <div>
    <div v-for="name in groupNames" :key="name" class="element-group">
      <lz-group-caption>
        {{ name }}
      </lz-group-caption>
      <lz-button
        v-for="preset in elementGroups.get(name)"
        :key="preset.name"
        :image="preset.image"
        variant="transparent"
        :image-border="true"
        @click="createElement(preset)"
      >
        {{ preset.name }}
      </lz-button>
    </div>
    <lz-checkbox size="small">Penis</lz-checkbox>
    <lz-switch size="small">Penis</lz-switch>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ElementService from '@/services/ElementService'
import ElementPreset from '@/entities/ElementPreset'
import ConstructorService from '@/services/ConstructorService'
import HistoryService from '@/services/HistoryService'

let elementService = new ElementService()
let constructorService = new ConstructorService()
let historyService = new HistoryService()
@Component
export default class AddTab extends Vue {
  elementGroups: Map<string, ElementPreset[]> = new Map()
  groupNames: string[] = []

  getState() {
    this.elementGroups = elementService.getGroups()
    this.groupNames = Array.from(elementService.getGroups().keys())
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    elementService.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    elementService.removeOnChangeListener(this.onChangeListener)
  }

  async createElement(preset) {
    let element = await constructorService.createObject(preset)
    if (element)
      historyService.registerElementCreate(
        element,
        constructorService.selectedSlideIndex ?? 0
      )
  }
}
</script>

<style lang="scss" scoped>
.element-group {
  &__header {
    padding: 10px 20px;
    margin-bottom: 0 !important;
  }

  &__item {
    margin: 5px 10px;
    cursor: pointer;
    font-weight: 400;

    img {
      border: 1px solid #e6e6eb;
    }
  }
}
</style>

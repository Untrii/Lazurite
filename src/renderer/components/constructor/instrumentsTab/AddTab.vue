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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ElementPreset from '@/entities/ElementPreset'
import HistoryService from '@/services/constructor/HistoryService'
import ElementPresetFactory from '@/services/constructor/ElementPresetFactory'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import ConstrctorStore from '@/services/store/ConstructorStore'

let historyService = new HistoryService()
let elementPresetFactory = new ElementPresetFactory()
let slideObjectService = new SlideObjectService()
let store = new ConstrctorStore()
@Component
export default class AddTab extends Vue {
  elementGroups: Map<string, ElementPreset[]> = elementPresetFactory.getGroups()
  groupNames: string[] = Array.from(elementPresetFactory.getGroups().keys())

  async createElement(preset) {
    let element = await slideObjectService.createObject(preset)
    if (element) historyService.registerElementCreate(element, store.selectedSlideIndex ?? 0)
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

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
    <lz-range-input prepend="prepend" size="small"></lz-range-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ElementService from '@/services/ElementService'
import ElementPreset from '@/entities/ElementPreset'
import ConstructorService from '@/services/ConstructorService'

let elementService = new ElementService()
let constructorService = new ConstructorService()
@Component
export default class AddTab extends Vue {
  elementGroups: Map<string, ElementPreset[]> = new Map()
  groupNames: string[] = []

  getState() {
    this.elementGroups = elementService.getGroups()
    this.groupNames = Array.from(elementService.getGroups().keys())
  }

  beforeMount() {
    this.getState()
    elementService.addOnChangeListener(() => this.getState())
    constructorService.addOnChangeListener(() => this.getState())
  }

  createElement(preset) {
    constructorService.createObject(preset)
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

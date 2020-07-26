<template>
  <draggable-resizable :canActivate="true" :w="200" :h="200" :x="200" :y="200">
    <text-block :id="id" :scale="scale"></text-block>
  </draggable-resizable>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import TextBlock from '@/components/elements/TextBlock.vue'
import DraggableResizable from './DraggableResizable.vue'

let service = new ConstructorService()

@Component({
  components: { TextBlock, DraggableResizable },
})
export default class RedactableTextBlock extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped></style>

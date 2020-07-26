<template>
  <text-block :id="id" :scale="scale"></text-block>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import TextBlock from '@/components/elements/TextBlock.vue'

let service = new ConstructorService()

@Component({
  components: { TextBlock },
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

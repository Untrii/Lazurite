<template>
  <text-block v-bind="$props"></text-block>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import TextBlock from '@/components/elements/TextBlock.vue'
import Color from '@/entities/Color'

let service = new ConstructorService()

@Component({
  components: { TextBlock },
})
export default class RedactableTextBlock extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  @Prop() fontFamily!: string
  @Prop() fontSize!: number
  @Prop() fontWeight!: number
  @Prop() content!: string
  @Prop() color!: Color
  @Prop() backgroundColor!: Color

  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped></style>

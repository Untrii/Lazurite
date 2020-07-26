<script lang="tsx">
import { Vue, Component, Prop } from 'vue-property-decorator'
import elements from './index'
import VisualisationService from '@/services/VisualisationService'
import SlideObject from '@/entities/SlideObject'

let service = new VisualisationService()

@Component({
  components: elements,
})
export default class RedactableBaseElement extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  beforeMount() {
    service.addOnChangeListener(() => this.$forceUpdate())
  }

  get element(): SlideObject {
    return service.elementById(this.id)
  }

  // render(createElement) {
  //   return createElement(this.element.type.split('/')[0], {
  //     props: { ...this.element, scale: this.scale },

  //     on: this.$listeners,
  //   })
  // }
  get tagName() {
    return this.element.type.split('/')[0]
  }
  render(h) {
    let Element = this.tagName
    let props = { ...this.element, scale: this.scale }

    return <Element {...{ props: props, on: this.$listeners }}></Element>
  }
}
</script>

<style lang="scss" scoped></style>

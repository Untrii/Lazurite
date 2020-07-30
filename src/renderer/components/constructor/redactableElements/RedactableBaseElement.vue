<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import elements from './index'
import VisualisationService from '@/services/VisualisationService'
import SlideObject from '@/entities/SlideObject'
import DraggableResizable from './DraggableResizable.vue'
import ConstructorService from '@/services/ConstructorService'
import Hotkeys from '@/utils/Hotkeys'

let visualisationService = new VisualisationService()
let constructorService = new ConstructorService()

@Component({
  components: { ...elements, DraggableResizable },
})
export default class RedactableBaseElement extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  beforeMount() {
    visualisationService.addOnChangeListener(() => this.$forceUpdate())
    constructorService.addOnChangeListener(() => this.$forceUpdate())
  }

  get element(): SlideObject {
    return visualisationService.elementById(this.id)
  }

  getScaledElement(): SlideObject {
    let el = { ...this.element }
    el.width *= this.scale
    el.height *= this.scale
    el.top *= this.scale
    el.left *= this.scale
    return el
  }

  unscaleElement(element: SlideObject) {
    element = { ...element }
    element.width /= this.scale
    element.height /= this.scale
    element.top /= this.scale
    element.left /= this.scale
    return element
  }

  get tagName() {
    return this.element.type.split('/')[0]
  }

  renderTargetElement(h) {
    return h(this.tagName, {
      props: { ...this.element, scale: this.scale },
      attrs: { ...this.element, scale: this.scale },
      on: this.$listeners,
    })
  }

  // @Watch('scale')
  // onScaleChanged() {
  //   this.$forceUpdate()
  // }

  render(h) {
    console.log('rerendering')
    return h(
      'DraggableResizable',
      {
        props: {
          isActive: constructorService.selectedObjectIds.includes(this.id),

          gridX: 60 * this.scale,
          gridY: 60 * this.scale,

          w: this.getScaledElement().width,
          h: this.getScaledElement().height,
          x: this.getScaledElement().left,
          y: this.getScaledElement().top,

          parentWidth: 1920 * this.scale,
          parentHeight: 1080 * this.scale,
          canActivate: true,
        },
        on: {
          rectangleChanged: (newRect) => {
            console.log('rectangle changed')
            constructorService.changeObjectProperties(
              this.id,
              this.unscaleElement(newRect)
            )
          },
          activated: () => {
            if (!Hotkeys.control) constructorService.deselectAllObjects()
            constructorService.selectObject(this.id)
            Hotkeys.unbind('delete')
            Hotkeys.bind('delete', () => {
              console.log('deleteng...')
              constructorService.deleteObjects(
                constructorService.selectedObjectIds
              )
            })
          },
          deactivated: () => {
            if (!Hotkeys.control) constructorService.deselectAllObjects()
          },
        },
      },
      [this.renderTargetElement(h)]
    )
  }

  // render(h) {
  //   let Element = this.tagName
  //   let props = { ...this.element, scale: this.scale }

  //   return <Element {...{ props: props }}></Element>
  // }
}
</script>

<style lang="scss" scoped></style>

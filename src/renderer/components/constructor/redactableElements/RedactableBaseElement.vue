<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import elements from './index'
import VisualisationService from '@/services/VisualisationService'
import ISlideObject from '@/entities/ISlideObject'
import DraggableResizable from './DraggableResizable.vue'
import ConstructorService from '@/services/ConstructorService'
import Hotkeys from '@/utils/Hotkeys'
import HistoryService from '@/services/HistoryService'
import EditorService from '@/services/EditorService'

let visualisationService = new VisualisationService()
let constructorService = new ConstructorService()
let historyService = new HistoryService()
let editorSevice = new EditorService()

let start

@Component({
  components: { ...elements, DraggableResizable },
})
export default class RedactableBaseElement extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  isDraggable = true
  isResizable = true
  isActive = true

  onChangeListener!: Function
  beforeMount() {
    this.onChangeListener = () => this.$forceUpdate()

    constructorService.addOnChangeListener(this.onChangeListener)
  }

  beforeDestroy() {
    constructorService.removeOnChangeListener(this.onChangeListener)
  }

  get element(): ISlideObject {
    return visualisationService.elementById(this.id)
  }

  getScaledElement(): ISlideObject {
    let el = { ...this.element }
    el.width *= this.scale
    el.height *= this.scale
    el.top *= this.scale
    el.left *= this.scale
    return el
  }

  unscaleElement(element: ISlideObject) {
    element = { ...element }
    element.width /= this.scale
    element.height /= this.scale
    element.top /= this.scale
    element.left /= this.scale
    element.width = Math.round(element.width)
    element.height = Math.round(element.height)
    element.top = Math.round(element.top)
    element.left = Math.round(element.left)
    return element
  }

  get tagName() {
    return this.element.type.split('/')[0]
  }

  renderTargetElement(h) {
    return h(this.tagName, {
      props: { ...this.element, scale: this.scale },
      attrs: { ...this.element, scale: this.scale },
      on: {
        locked: () => {
          this.isDraggable = false
          this.isResizable = false
          this.isActive = false
        },
        unlocked: () => {
          this.isDraggable = true
          this.isResizable = true
          this.isActive = true
        },
      },
    })
  }

  // @Watch('scale')
  // onScaleChanged() {
  //   this.$forceUpdate()
  // }

  render(h) {
    return h(
      'DraggableResizable',
      {
        props: {
          isActive: constructorService.selectedObjectIds.includes(this.id) && this.isActive,

          gridX: 30 * this.scale,
          gridY: 30 * this.scale,

          snapToGrid: editorSevice.isGridEnabled,

          w: this.getScaledElement().width,
          h: this.getScaledElement().height,
          x: this.getScaledElement().left,
          y: this.getScaledElement().top,

          isDraggable: this.isDraggable,
          isResizable: this.isResizable,

          parentWidth: 1920 * this.scale,
          parentHeight: 1080 * this.scale,
          canActivate: true,
        },
        on: {
          rectangleChanged: (newRect) => {
            let unscaledElement = this.unscaleElement(newRect)
            constructorService.changeObjectProperties(this.id, unscaledElement)
          },
          rectangleChangeStarted: (startRect) => {
            start = this.unscaleElement(startRect)
          },
          moved: (newRect) => {
            newRect = this.unscaleElement(newRect)
            historyService.registerElementMove(
              this.id,
              {
                top: start.top,
                left: start.left,
              },
              {
                top: newRect.top,
                left: newRect.left,
              }
            )
          },
          resized: (newRect) => {
            newRect = this.unscaleElement(newRect)
            historyService.registerElementResize(
              this.id,
              {
                top: start.top,
                left: start.left,
                width: start.width,
                height: start.height,
              },
              {
                top: newRect.top,
                left: newRect.left,
                width: newRect.width,
                height: newRect.height,
              }
            )
          },
          activated: () => {
            if (!Hotkeys.control) constructorService.deselectAllObjects()
            constructorService.selectObject(this.id)
            Hotkeys.unbind('delete')
            Hotkeys.bind('delete', () => {
              let deletedElements = constructorService.deleteObjects(constructorService.selectedObjectIds)
              if (deletedElements) {
                historyService.registerElementDelete(deletedElements, constructorService.selectedSlideIndex ?? 0)
              }
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

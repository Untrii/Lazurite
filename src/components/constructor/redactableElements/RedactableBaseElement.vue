<script lang="ts">
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import elements from './index'
import ISlideObject from '@/entities/ISlideObject'
import DraggableResizable from './DraggableResizable.vue'
import Hotkeys from '@/utils/Hotkeys'
import HistoryService from '@/services/constructor/HistoryService'
import ConstrctorStore from '@/services/store/ConstructorStore'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import { h } from 'vue'

const historyService = new HistoryService()
const store = new ConstrctorStore()
const service = new SlideObjectService()

let start

@Options({
  components: { ...elements, DraggableResizable },
})
export default class RedactableBaseElement extends Vue {
  @Prop() id!: string
  @Prop() scale!: number

  isDraggable = true
  isResizable = true
  isActive = true

  element = store.elementById(this.id)

  getScaledElement(): ISlideObject {
    const el = { ...this.element }
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

  renderTargetElement() {
    return h(elements[this.tagName], {
      ...this.element,
      scale: this.scale,

      onLocked: () => {
        this.isDraggable = false
        this.isResizable = false
        this.isActive = false
      },
      onUnlocked: () => {
        this.isDraggable = true
        this.isResizable = true
        this.isActive = true
      },
    })
  }

  // @Watch('scale')
  // onScaleChanged() {
  //   this.$forceUpdate()
  // }

  render() {
    return h(
      DraggableResizable,
      {
        isActive: store.selectedObjectIds.includes(this.id) && this.isActive,

        gridX: 30 * this.scale,
        gridY: 30 * this.scale,

        snapToGrid: store.isGridEnabled,

        w: this.getScaledElement().width,
        h: this.getScaledElement().height,
        x: this.getScaledElement().left,
        y: this.getScaledElement().top,

        isDraggable: this.isDraggable,
        isResizable: this.isResizable,

        parentWidth: 1920 * this.scale,
        parentHeight: 1080 * this.scale,
        canActivate: true,

        style: {
          zIndex: this.element.zIndex,
        },

        onRectangleChanged: (newRect) => {
          const unscaledElement = this.unscaleElement(newRect)
          service.changeObjectProperties(this.id, unscaledElement)
        },
        onRectangleChangeStarted: (startRect) => {
          start = this.unscaleElement(startRect)
        },
        onMoved: (newRect) => {
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
        onResized: (newRect) => {
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
        onActivated: () => {
          if (!Hotkeys.control) service.deselectAllObjects()
          service.selectObject(this.id)
          Hotkeys.unbind('delete')
          Hotkeys.bind('delete', () => {
            const deletedElements = service.deleteObjects(
              store.selectedObjectIds
            )
            if (deletedElements) {
              historyService.registerElementDelete(
                deletedElements,
                store.selectedSlideIndex ?? 0
              )
            }
          })
        },
        onDeactivated: () => {
          if (!Hotkeys.control) service.deselectAllObjects()
        },
      },
      [this.renderTargetElement()]
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

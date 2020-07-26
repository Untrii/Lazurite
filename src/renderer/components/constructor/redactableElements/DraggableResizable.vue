<template>
  <div
    :id="uid"
    class="vdr"
    :style="getStyle()"
    :class="isActive ? 'active' : 'inactive'"
    @mousedown="callEvent('bodyDown', $event)"
    @click="handleRedaction"
  >
    <slot></slot>
    <div
      v-for="(stick, index) in sticks"
      class="vdr-stick"
      :class="['vdr-stick-' + stick, isResizable ? '' : 'not-resizable']"
      @mousedown.stop.prevent="callEvent('stickDown', stick, $event)"
      :style="computeStickStyle(stick)"
      :key="index"
    ></div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import generateString from '@/utils/StringGenerator'

function isntNegative(x) {
  return x >= 0
}
function zValidator(val) {
  let valid = typeof val === 'string' ? val === 'auto' : val >= 0
  return valid
}

const realStickSize = 8
let key = {
  shift: false,
}

/**
 * Generates events:
 */
@Component
export default class DraggableResizable extends Vue {
  @Prop({ default: 1 }) parentScale!: number
  @Prop({ default: true }) isActive!: boolean
  @Prop({ default: true }) isDraggable!: boolean
  @Prop({ default: true }) isResizable!: boolean
  @Prop({ default: true }) aspectRatio!: boolean
  @Prop({ default: 'none' }) parentLimitation!: string
  @Prop({ default: true }) snapToGrid!: boolean
  @Prop({ default: () => ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'] })
  sticks!: string[]

  @Prop({ default: 50, validator: isntNegative }) gridX!: number
  @Prop({ default: 50, validator: isntNegative }) gridY!: number
  @Prop({ default: 100, validator: isntNegative }) w!: number
  @Prop({ default: 100, validator: isntNegative }) h!: number
  @Prop({ default: 10, validator: isntNegative }) minw!: number
  @Prop({ default: 10, validator: isntNegative }) minh!: number
  @Prop({ default: 0, validator: isntNegative }) x!: number
  @Prop({ default: 0, validator: isntNegative }) y!: number
  @Prop({ default: 'auto', validator: zValidator }) z!: number | string

  @Prop() parentHeight!: number
  @Prop() parentWidth!: number
  @Prop() canActivate!: boolean

  uid = generateString(16)
  lastEvent = 'none'
  startRect = {
    width: this.w,
    height: this.h,
    top: this.x,
    left: this.y,
    angle: 0,
  }
  newRect = {
    width: 400,
    height: 200,
    top: 100,
    left: 150,
    angle: 0,
  }
  startMousePosition = { x: 0, y: 0 }
  currentMousePosition = { x: 0, y: 0 }
  pressedStick = 'none'
  isEventsRegistered = false

  getState() {}

  // beforeMount() {
  //   this.getState()
  //   service.addOnChangeListener(() => this.getState())
  // }

  computeStickStyle(stick) {
    let stickSize = realStickSize / this.parentScale
    let stickStyle: any = {
      width: `${stickSize}px`,
      height: `${stickSize}px`,
    }
    let offset = -stickSize / 2 + 'px'

    switch (stick[0]) {
      case 't':
        stickStyle.top = offset
        break
      case 'm':
        stickStyle.marginTop = offset
        break
      case 'b':
        stickStyle.bottom = offset
    }
    switch (stick[1]) {
      case 'l':
        stickStyle.left = offset
        break
      case 'm':
        stickStyle.marginLeft = offset
        break
      case 'r':
        stickStyle.right = offset
    }
    //console.log(stickStyle)
    return stickStyle
  }
  bodyDown(event) {
    if (this.canActivate) {
      event.stopPropagation()
      if (this.isActive) event.preventDefault()
    }
    console.log('bodyDown')
  }
  stickDown(stick, event) {
    this.pressedStick = stick
    console.log('stickDown')
  }
  bodyUp(event) {
    console.log('bodyUp')
  }
  stickUp(stick, event) {
    console.log('stickUp')
  }
  outerUp(event) {
    console.log('outerUp')
  }
  mouseUp(event) {
    let eventName
    if (this.lastEvent == 'bodyDown') eventName = 'bodyUp'
    else if (this.lastEvent == 'stickDown') eventName = 'stickUp'
    else if (this.lastEvent == 'none') return
    else return
    this.callEvent(eventName, event)
  }
  fieldMouseUp(event) {
    if (this.canActivate) event.stopPropagation()
    let eventName
    if (this.lastEvent == 'bodyDown') eventName = 'bodyUp'
    else if (this.lastEvent == 'stickDown') eventName = 'stickUp'
    else if (this.lastEvent == 'none') return
    else eventName = 'outerUp'
    this.callEvent(eventName, event)
  }
  callEvent(name, payload0?, payload1?, payload2?, payload3?) {
    if (!this.canActivate) return
    this.lastEvent = name
    this[name](payload0, payload1, payload2, payload3)
  }
  handleRedaction(event) {
    if (this.canActivate) event.stopPropagation()
  }
  mouseUpdate(event) {
    if (!this.isActive) return
    this.currentMousePosition = { x: event.clientX, y: event.clientY }
    if (this.startMousePosition.x == -1)
      this.startMousePosition = { x: event.clientX, y: event.clientY }
  }
  registerEvents() {
    let el = document.documentElement
    if (!this.isEventsRegistered) {
      el.addEventListener('mouseup', this.mouseUp)
      document
        .getElementById(this.uid)
        ?.parentNode?.addEventListener('mouseup', this.fieldMouseUp)
      //el.addEventListener('mousemove', this.mouseUpdate)
      this.isEventsRegistered = true
    }
  }
  removeEvents() {
    try {
      let el = document.documentElement
      if (this.isEventsRegistered) {
        el.removeEventListener('mouseup', this.mouseUp)
        document
          .getElementById(this.uid)
          ?.parentNode?.removeEventListener('mouseup', this.fieldMouseUp)
        //el.removeEventListener('mousemove', this.mouseUpdate)

        this.isEventsRegistered = false
      }
    } catch {}
  }
  /*
    Rectangle handlers
    */
  //changeType: 'move' or 'resize'
  //stickName: 'tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'
  calcNewRect(changeType: 'move' | 'resize', stickName?: string) {
    let delta = {
      x: this.currentMousePosition.x - this.startMousePosition.x,
      y: this.currentMousePosition.y - this.startMousePosition.y,
    }
    let newRect = { ...this.startRect }

    if (changeType == 'move') {
      newRect.left += delta.x
      newRect.top += delta.y
    }
    if (changeType == 'resize' && stickName && stickName.length > 1) {
      switch (stickName[0]) {
        case 't':
          newRect.top += delta.y
          newRect.height -= delta.y
          break

        case 'b':
          newRect.height += delta.y
          break
      }
      switch (stickName[1]) {
        case 'l':
          newRect.left += delta.x
          newRect.width -= delta.x
          break

        case 'r':
          newRect.width += delta.x
          break
      }
    }

    newRect = this.applySnapToGrid(newRect)
    newRect = this.limitByParent(newRect)
    newRect = this.applyAspectRatio(newRect)
    newRect = this.applyMinimumSize(newRect)
    newRect = this.limitByParent(newRect)
    return newRect
  }
  limitByParent(rect) {
    if (this.parentLimitation == 'full') {
      rect.width = Math.min(this.parentWidth, rect.width)
      rect.height = Math.min(this.parentHeight, rect.height)

      rect.top = Math.max(0, rect.top)
      rect.left = Math.max(0, rect.left)
      rect.top = Math.min(this.parentHeight - rect.height, rect.top)
      rect.left = Math.min(this.parentWidth - rect.width, rect.left)
    }
    if (this.parentLimitation == 'partial') {
      rect.width = Math.min(this.parentWidth * 2 - 40, rect.width)
      rect.height = Math.min(this.parentHeight * 2 - 40, rect.height)

      rect.top = Math.max(20 - rect.height, rect.top)
      rect.left = Math.max(20 - rect.width, rect.left)
      rect.top = Math.min(this.parentHeight - 20, rect.top)
      rect.left = Math.min(this.parentWidth - 20, rect.left)
    }
    return rect
  }
  applyAspectRatio(rect) {
    console.log('shift pressed: ' + key.shift)
    if (!key.shift) return rect
    if (this.lastEvent != 'stickDown') return rect

    let stick = this.pressedStick
    let startRect = this.startRect
    let startRatio = startRect.width / startRect.height
    let width = rect.height * startRatio
    let height = rect.width / startRatio

    switch (stick) {
      case 'tm':
      case 'bm':
        rect.left -= (width - rect.width) / 2
        rect.width = width
        break
      case 'mr':
      case 'ml':
        rect.top -= (height - rect.height) / 2
        rect.height = height
        break
      case 'tl':
      case 'bl':
        rect.left -= width - rect.width
        rect.width = width
        break
      case 'tr':
      case 'br':
        rect.width = width
    }
    return rect
  }
  applySnapToGrid(rect) {
    if (!this.snapToGrid) return rect
    let gridX = this.gridX
    let gridY = this.gridY
    if (this.lastEvent == 'bodyDown') {
      //snap x
      let left0 = Math.round(rect.left / gridX) * gridX
      let left1 =
        Math.round((rect.left + rect.width) / gridX) * gridX - rect.width

      if (Math.abs(rect.left - left0) < Math.abs(rect.left - left1))
        rect.left = left0
      else rect.left = left1

      //snap y
      let top0 = Math.round(rect.top / gridY) * gridY
      let top1 =
        Math.round((rect.top + rect.height) / gridY) * gridY - rect.height

      if (Math.abs(rect.top - top0) < Math.abs(rect.top - top1)) rect.top = top0
      else rect.top = top1
    }
    if (this.lastEvent == 'stickDown') {
      let ntop = Math.round(rect.top / gridY) * gridY
      let nleft = Math.round(rect.left / gridY) * gridY

      switch (this.pressedStick) {
        case 'tl':
          rect.height += rect.top - ntop
          rect.top = ntop
          rect.width += rect.left - nleft
          rect.left = nleft
          break
        case 'tm':
          rect.height += rect.top - ntop
          rect.top = ntop
          break
        case 'tr':
          rect.height += rect.top - ntop
          rect.top = ntop
          rect.width =
            Math.round((rect.width + rect.left) / gridY) * gridY - rect.left
          break
        case 'bl':
          rect.height =
            Math.round((rect.height + rect.top) / gridY) * gridY - rect.top
          rect.width += rect.left - nleft
          rect.left = nleft
          break
        case 'bm':
          rect.height =
            Math.round((rect.height + rect.top) / gridY) * gridY - rect.top
          break
        case 'br':
          rect.height =
            Math.round((rect.height + rect.top) / gridY) * gridY - rect.top
          rect.width =
            Math.round((rect.width + rect.left) / gridY) * gridY - rect.left
          break
        case 'ml':
          rect.width += rect.left - nleft
          rect.left = nleft
          break
        case 'mr':
          rect.width =
            Math.round((rect.width + rect.left) / gridY) * gridY - rect.left
          break
      }
    }
    return rect
  }
  applyMinimumSize(rect) {
    if (rect.width < this.minw) rect.width = this.minw
    if (rect.height < this.minh) rect.height = this.minh
    return rect
  }

  getStyle() {
    return {
      position: 'absolute',
      left: this.x + 'px',
      top: this.y + 'px',
      width: this.w + 'px',
      height: this.h + 'px',
      userSelect: this.isDraggable ? 'none' : 'auto',
    }
  }

  @Watch('lastEvent')
  handleEvents(val) {
    if (val.endsWith('Down')) {
      this.startRect = {
        width: this.w,
        height: this.h,
        top: this.y,
        left: this.x,
        angle: 0,
      }
      this.newRect = {
        width: 400,
        height: 200,
        top: 100,
        left: 150,
        angle: 0,
      }
      this.startMousePosition = {
        x: -1,
        y: -1,
      }
      document.documentElement.addEventListener('mousemove', this.mouseUpdate)
    } else {
      document.documentElement.removeEventListener(
        'mousemove',
        this.mouseUpdate
      )
    }
    if (val == 'bodyDown' && !this.isActive) this.$emit('activated')
    if (val == 'bodyUp') this.$emit('clicked')
    if (this.isActive && val == 'outerUp') this.$emit('deactivated')
  }

  @Watch('isActive')
  onDeactivate(val) {
    if (!val) {
      document.documentElement.removeEventListener(
        'mousemove',
        this.mouseUpdate
      )
    }
  }

  @Watch('currentMousePosition')
  onMousePositionChanged(val) {
    if (this.lastEvent == 'bodyDown' && this.isDraggable) {
      this.newRect = this.calcNewRect('move')

      //this.$emit('resizing', newRect)
    }
    if (this.lastEvent == 'stickDown' && this.isResizable) {
      this.newRect = this.calcNewRect('resize', this.pressedStick)
    }
  }

  mounted() {
    this.registerEvents()
    console.log('a')
  }
  beforeDestroy() {
    this.removeEvents()
  }
}
</script>

<style lang="scss" scoped>
.vdr {
  position: absolute;
  box-sizing: border-box;

  &.active:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    outline: 1px dashed #d6d6d6;
  }
}

.vdr-stick {
  box-sizing: border-box;
  position: absolute;
  font-size: 1px;
  background: #ffffff;
  border: 1px solid #6c6c6c;
  box-shadow: 0 0 2px #bbb;
  z-index: 999;
}

.inactive .vdr-stick {
  display: none;
}

.vdr-stick-tl,
.vdr-stick-br {
  cursor: nwse-resize;
}

.vdr-stick-tm,
.vdr-stick-bm {
  left: 50%;
  cursor: ns-resize;
}

.vdr-stick-tr,
.vdr-stick-bl {
  cursor: nesw-resize;
}

.vdr-stick-ml,
.vdr-stick-mr {
  top: 50%;
  cursor: ew-resize;
}

.vdr-stick.not-resizable {
  display: none;
}
</style>

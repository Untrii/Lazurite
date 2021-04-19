import { startLoading } from '@/dataLoader'
import ObjectSelection from '@/models/editor/ObjectSelection'
import Presentation from '@/models/presentation/Presentation'
import Slide from '@/models/presentation/Slide'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import ImageSlideObject from '@/models/presentation/slideObjects/ImageSlideObject'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import renderImage, { getRenderImageDeps } from './objectRenderers/renderImage'
import renderText, { getRenderTextDeps } from './objectRenderers/renderText'
import renderBackground from './renderBackground'
import renderSelection from './renderSelection'

const composites = new Map<Slide, Map<number, HTMLCanvasElement[]>>()
const identities = new Map<Slide, Map<number, any[][]>>()

function createComposite(ctx: CanvasRenderingContext2D) {
  const result = document.createElement('canvas')
  result.width = ctx.canvas.width
  result.height = ctx.canvas.height
  return result
}

const slideRenderEventListeners = new Map<Slide, Set<(canvas: HTMLCanvasElement) => void>>()

export function addSlideRenderEventListener(slide: Slide, listener: (canvas: HTMLCanvasElement) => void) {
  if (!slideRenderEventListeners.has(slide)) slideRenderEventListeners.set(slide, new Set())
  slideRenderEventListeners.get(slide).add(listener)
}
export function removeSlideRenderEventListener(slide: Slide, listener: (canvas: HTMLCanvasElement) => void) {
  if (!slideRenderEventListeners.has(slide)) return
  slideRenderEventListeners.get(slide).delete(listener)
  if (slideRenderEventListeners.get(slide).size == 0) slideRenderEventListeners.delete(slide)
}

export default function render(
  ctx: CanvasRenderingContext2D,
  presentation: Presentation,
  slide: Slide,
  requestRerender = () => {},
  selection?: ObjectSelection,
  highlight?: SlideObject
) {
  let targetWidth = ctx.canvas.width
  let resolution = new RendererResolution(presentation.resolution.width, presentation.resolution.height)

  const resId = ctx.canvas.width * 8192 + ctx.canvas.height
  const prevRenderComposites = composites.get(slide)?.get(resId) ?? []
  const prevRenderIdentity = identities.get(slide)?.get(resId) ?? []
  let currentRenderComposites = [] as HTMLCanvasElement[]
  let currentRenderIdentity = [] as any[][]

  try {
    resolution.targetWidth = targetWidth

    if (targetWidth < 4) return

    renderBackground(ctx, resolution, presentation.theme.background)
    let error = null

    for (const object of slide) {
      switch (object.type) {
        case TextSlideObject.name:
          currentRenderIdentity.push(getRenderTextDeps(object as TextSlideObject))
          break
        case ImageSlideObject.name:
          currentRenderIdentity.push(getRenderImageDeps(object as ImageSlideObject))
          break
        default:
          currentRenderIdentity.push([])
      }
    }

    const objectsPerComposite = Math.round(Math.sqrt(slide.length))
    let currentComposite = createComposite(ctx)
    let currentContext = currentComposite.getContext('2d')
    let isSimilarIdentity = prevRenderIdentity.length == currentRenderIdentity.length

    for (let i = 0; i < slide.length; i++) {
      if (isSimilarIdentity && i % objectsPerComposite == 0) {
        let isSame = true
        for (let j = i; isSame && j < i + objectsPerComposite && j < prevRenderIdentity.length; j++) {
          if (prevRenderIdentity[j].length != currentRenderIdentity[j].length) {
            isSame = false
          } else {
            const objectIdentity = currentRenderIdentity[j]
            const prevObjectIdentity = prevRenderIdentity[j]
            const length = objectIdentity.length

            for (let l = 0; l < length; l++) {
              if (objectIdentity[l] !== prevObjectIdentity[l]) {
                isSame = false
                break
              }
            }
          }
        }
        if (isSame) {
          const composite = prevRenderComposites[i / objectsPerComposite]
          currentRenderComposites.push(composite)
          ctx.drawImage(composite, 0, 0)
          i += objectsPerComposite - 1
          continue
        }
      }

      const object = slide[i]
      try {
        switch (object.type) {
          case TextSlideObject.name:
            renderText(currentContext, resolution, object as TextSlideObject)
            break
          case ImageSlideObject.name:
            renderImage(currentContext, resolution, object as ImageSlideObject)
            break
          default:
            console.error('Missing renderer for ' + object.type)
        }
      } catch (e) {
        error = e
      }

      if (i % objectsPerComposite == objectsPerComposite - 1 || i == slide.length - 1) {
        ctx.drawImage(currentComposite, 0, 0)
        currentRenderComposites.push(currentComposite)
        currentComposite = createComposite(ctx)
        currentContext = currentComposite.getContext('2d')
      }
    }

    const listeners = slideRenderEventListeners.get(slide) ?? new Set()
    listeners.forEach((value) => value(ctx.canvas))

    if (error) throw error
  } catch (err) {
    requestRerender()
    currentRenderIdentity = []
    console.warn(err)
  } finally {
    if (selection) {
      renderSelection(ctx, resolution, selection, highlight, requestRerender)
    }
    if (!composites.get(slide)) composites.set(slide, new Map())
    if (!identities.get(slide)) identities.set(slide, new Map())

    composites.get(slide).set(resId, currentRenderComposites)
    identities.get(slide).set(resId, currentRenderIdentity)
  }
}

import io from '@/io'
import store from '@/store'
import Presentation from 'common/models/presentation/Presentation'
import ImageSlideObject from 'common/models/presentation/slideObjects/ImageSlideObject'
import TextSlideObject from 'common/models/presentation/slideObjects/TextSlideObject'
import JsonSerializer from 'common/serialization/JsonSerializer'
import randomString from 'common/util/randomString'
import getFontFamilyName from 'common/util/text/getFontFamilyName'

export async function compile(presentation: Presentation): Promise<string> {
  const template = await io.getPresentationTemplate()
  const presentationJSON = JsonSerializer.toJSON(presentation)
  const presentationName = presentation.name
  const resources = [] as string[]

  let result = template.replace('$$presentationName', presentationName).replace('$$presentationJSON', presentationJSON)

  const getBase64 = async function (src: string) {
    const data = await (await fetch(src)).blob()
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(data)
      reader.onload = () => resolve(reader.result)
    })
    return base64
  }

  for (const slide of presentation.slides) {
    for (const object of slide) {
      if (object instanceof ImageSlideObject) {
        const JSONsrc = JSON.stringify(object.src)
        if (!result.includes(JSONsrc)) continue

        const resId = randomString()

        const base64 = await getBase64(object.src)
        resources.push(`<img src="${base64}" data-res-id="${resId}.anyimg" alt="resource">\n`)
        result = result.replaceAll(JSONsrc, JSON.stringify(resId + '.anyimg'))
      }
      if (object instanceof TextSlideObject) {
        const JSONsrc = JSON.stringify(object.style.fontSource)
        if (!result.includes(JSONsrc)) continue

        const resId = randomString()
        result = result.replaceAll(JSONsrc, JSON.stringify(resId + '.anyfont'))

        const originalFontFamily = object.style.fontFamily
        const newFontFamily = getFontFamilyName(resId + '.anyfont')
        result = result.replaceAll(JSON.stringify(originalFontFamily), JSON.stringify(newFontFamily))

        const base64 = await getBase64(object.style.fontSource)
        resources.push(`
<style data-res-id="${resId}.anyfont">
  @font-face {
    font-family: "${newFontFamily}";
    src: url('${base64}');
  }
</style>`)
      }
    }
  }

  result = result.replace('$$resources', resources.join(''))

  return result
}

window['compileCurrent'] = async function () {
  console.log(await compile(store.getCurrentPresentation()))
}

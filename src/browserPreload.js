const { ipcRenderer } = require('electron')

window.lzsubcode = function(handlerWebContentsID) {
  console.log('here')

  let getBase64Image = function(img) {
    let canvas = document.createElement('canvas')

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    let dataURL = canvas.toDataURL('image/png')

    return dataURL //.replace(/^data:image\/(png|jpg);base64,/, '')
  }

  window.savedFiles = {}
  window.lzmdev = event => {
    console.log('click: ' + event.button)
    if (event.button != 2) return

    let elems = document.elementsFromPoint(event.clientX, event.clientY)
    for (const elem of elems) {
      if (elem.tagName == 'IMG') {
        ipcRenderer.sendTo(
          handlerWebContentsID,
          'imgdata',
          getBase64Image(elem)
        )
        break
      }
    }
  }

  window.lzgetfls = function(lastTS) {
    let result = {}
    try {
      for (const key in window.savedFiles) {
        if (key > lastTS) result[key] = window.savedFiles[key]
      }
    } catch {}
    return result
  }

  document.addEventListener('mousedown', lzmdev)
}

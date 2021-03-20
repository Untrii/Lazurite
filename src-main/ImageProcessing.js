const jimp = require('jimp')
const Color = require('./Color').default
const fs = require('fs').promises

exports.createPreviews = async function () {
  let imgpath = 'data/background'
  let previewPath = imgpath + '/preview'

  console.log('preparing preview')

  try {
    await fs.mkdir(imgpath)
  } catch (e) {}
  try {
    await fs.mkdir(previewPath)
  } catch (e) {}

  try {
    let files = await fs.readdir(imgpath)
    let previewFiles = await fs.readdir(previewPath)

    if (!previewFiles) previewFiles = []

    for (let file of files) {
      let inf = await fs.lstat(imgpath + '/' + file)
      if (!inf.isDirectory())
        if (!previewFiles.includes(file)) {
          let img = await jimp.read(imgpath + '/' + file)
          img
            .resize(200, 140) // resize
            .quality(80) // set JPEG quality
            .write(previewPath + '/' + file) // save
        }
    }
  } catch (e) {
    console.log(e)
  }
}

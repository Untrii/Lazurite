import fs from 'fs'

export default function getPath(pathName) {
  const static = {
    backgroundCollection: 'data/bg.json',
    paletteCollection: 'data/palettes.json'
  }
  if (static.hasOwnProperty(pathName)) return static[pathName]
  else if (pathName == 'testPresentation') {
    return fs.readFileSync('testProjectPath.txt', {
      encoding: 'utf-8'
    })
  } else if (pathName == 'testPresentationHistory') {
    return (
      fs.readFileSync('testProjectPath.txt', {
        encoding: 'utf-8'
      }) + '.history'
    )
  }
}

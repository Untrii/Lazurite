const electronBuilder = require('electron-builder')
const path = require('path')
const { readdirSync, unlinkSync, copyFileSync } = require('fs')
const { moveSync } = require('fs-extra')

const webpackOutputPath = './webpack-dist'

const files = readdirSync(webpackOutputPath)
for (const file of files) {
  if (file.endsWith('.map') || file.endsWith('.txt')) unlinkSync(path.join(webpackOutputPath, file))
}

copyFileSync('./package.json', webpackOutputPath + '/package.json')

electronBuilder
  .build({
    projectDir: path.resolve(webpackOutputPath),
    config: {
      electronVersion: '11.4.1',
    },
  })
  .then((result) => {
    result.forEach(console.log)
    moveSync(webpackOutputPath + '/dist', './dist', {
      overwrite: true,
    })
    unlinkSync(webpackOutputPath + '/package.json')
  })

const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const { removeSync } = require('fs-extra')
const { resolve } = require('path')

exports.default = function rebuildTempalte() {
  console.log('building template...')
  execSync('npm run buildtpl')
  const html = readFileSync(resolve(__dirname, '../webpack-dist/template/index.html')).toString()
  const js = readFileSync(resolve(__dirname, '../webpack-dist/template/index.js')).toString()
  const result = html.replace('<script defer="defer" src="index.js">', '').replace('$$script', `<script>${js}</script>`)
  writeFileSync(resolve(__dirname, '../data/template.html'), result)
  removeSync(resolve(__dirname, '../webpack-dist/template'))
  console.log('template has built')
}

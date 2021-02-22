/* eslint-disable */

// install devtools
const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')

// debug
//require('electron-debug')()

require('electron').app.on('ready', () => {
  installExtension('ljjemllljcmogpfapbkkighbhhppjdbg')
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
})

require('./index')

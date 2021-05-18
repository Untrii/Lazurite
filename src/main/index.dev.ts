import { app, session } from 'electron'
import os from 'os'

const extensionID = 'ilcajpmogmhpliinlbcdebhbcanbghmd'
const extensionVersion = '1.3.0_0'
let absoluteExtensionPath = `${os.homedir()}/Library/Application Support/Google/Chrome/Default/Extensions/${extensionID}/${extensionVersion}`

if (process.platform == 'win32') {
  absoluteExtensionPath = `${process.env.LOCALAPPDATA}/Google/Chrome/User Data/Default/Extensions/${extensionID}/${extensionVersion}`
}

app.whenReady().then(async () => {
  await session.defaultSession.loadExtension(absoluteExtensionPath)
})

require('./index')

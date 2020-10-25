const req = require.context('./', true, /\.png$/)
const assets: any = {}
for (const item of req.keys()) {
  console.log('importing asset')
  assets[item.replace('./', '').replace('.png', '')] = req(item)
}

export default assets

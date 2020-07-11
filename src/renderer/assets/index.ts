let req = require.context('./', true, /\.png$/)
let assets: any = {}
for (const item of req.keys()) {
  assets[item.replace('./', '').replace('.png', '')] = req(item).default
}

export default assets

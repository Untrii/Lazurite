const req = require.context('./', true, /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i)
const assets: { [key: string]: string } = {}
for (const item of req.keys()) {
  console.log('importing asset')
  assets[item.replace('./', '').replace('.jpg', '').replace('.png', '').replace('.svg', '')] = req(item).default
}

export default assets

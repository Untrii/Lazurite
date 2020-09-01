let req = require.context('./', true, /\.vue$/)
let elements: any = {}
for (const item of req.keys()) {
  if (!item.includes('BaseElement')) elements[item.replace('./', '').replace('.vue', '')] = req(item).default
}

export default elements

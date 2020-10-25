const req = require.context('./', true, /\.vue$/)
const elements: any = {}
for (const item of req.keys()) {
  if (!item.includes('BaseElement') && !item.includes('DraggableResizable'))
    elements[item.replace('./', '').replace('.vue', '')] = req(item).default
}

export default elements

let req = require.context('./', true, /\.ts$/)
let objects: any = {}
for (const item of req.keys()) {
  Object.defineProperty(
    objects,
    item
      .replace('./', '')
      .replace('.ts', '')
      .replace('I', ''),
    {
      get: function() {
        return req(item).getBlankObject()
      },
    }
  )
  //objects[item.replace('./', '').replace('.ts', '')] = req(item).getBlankObject()
}

export default objects

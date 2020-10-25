export default interface IBackgroundCollection {
  default: Map<string, string[]>;
  custom: Map<string, string[]>;
}

export function getBlankCollection(): IBackgroundCollection {
  const res = {
    default: new Map(),
    custom: new Map(),
  }
  res.default.set('color', [])
  res.default.set('gradient', [])
  res.default.set('gradicolor', [])
  res.default.set('pattern', [])
  res.default.set('image', [])

  res.custom.set('color', [])
  res.custom.set('gradient', [])
  res.custom.set('gradicolor', [])
  res.custom.set('pattern', [])
  res.custom.set('image', [])
  return res
}

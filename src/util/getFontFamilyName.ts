import { sha256 } from 'js-sha256'

const cache = new Map<string, string>()

export default function (source: string) {
  if (!cache.has(source)) cache.set(source, 'ff_' + sha256(source).substr(0, 16))
  return cache.get(source)
}

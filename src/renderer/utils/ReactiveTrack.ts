export default function track<T>(object: T, callback: Function): T {
  let proxyHandler = {
    get(target: any, key: string): any {
      if (key == '__deactproxy') return target
      if (typeof target[key] != 'object') return target[key]
      return new Proxy(target[key], proxyHandler)
    },
    set(target: any, key: string, val: any) {
      if (typeof val == 'object' && val['__deactproxy'])
        val = val['__deactproxy']
      target[key] = val
      callback()
      return true
    },
  }
  return new Proxy(object, proxyHandler)
}

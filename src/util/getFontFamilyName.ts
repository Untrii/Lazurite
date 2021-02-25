import { sha256 } from 'js-sha256'

export default function (source: string) {
  return sha256(source).substr(0, 16)
}

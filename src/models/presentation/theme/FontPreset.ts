import randomString from '@/util/randomString'

export default class FontPreset {
  name = 'New preset'
  family = 'Roboto'
  size = 48
  weight = 400
  id = randomString()
}

import Color from '@/models/common/Color'
import Background, { BackgroundCollection } from '@/models/presentation/theme/Background'

function getMedianColor(gradient: string) {
  let cols = gradient.split(' ')

  let col0 = Color.fromHex(cols[1])
  let col1 = Color.fromHex(cols[3])

  return Color.fromRgb(
    Math.floor((col0.r + col1.r) / 2),
    Math.floor((col0.g + col1.g) / 2),
    Math.floor((col0.b + col1.b) / 2)
  )
}

const colors = [
  '#FFFFFF',
  '#C9DCEB',
  '#D7E1EA',
  '#C4D5DC',
  '#DCE8E4',
  '#E4E5D7',
  '#E4E1C2',
  '#F3EACD',
  '#E2DBC9',
  '#E4D1CA',
  '#E9DAD7',
  '#E2D8D9',
  '#E5DBD2',
  '#E5DED4',
  '#E7E8E2',
  '#DCDEDB',
  '#DBDFE2',
  '#F5F2E9',
  '#F7E29F',
  '#FBE6A5',
  '#F7DCAD',
  '#F9E5CC',
  '#FADAA1',
  '#F5CCAC',
  '#EDC1B6',
  '#F3C2C5',
  '#E395A5',
  '#EAB7CA',
  '#E8C5DD',
  '#D0B8DC',
  '#B3CAE9',
  '#97BDE2',
  '#98D1E5',
  '#A8D9DE',
  '#C6DFD9',
  '#B3DEB1',
  '#DFEFBE',
  '#516E4C',
  '#566A68',
  '#294D41',
  '#2A423C',
  '#39534D',
  '#444A40',
  '#2F3D3D',
  '#343a40',
  '#0E1621',
  '#282C34',
  '#202225',
  '#421d7e',
  '#b87676',
].map((item) => {
  const background = new Background()
  background.displayValue = item
  background.value = item
  background.type = 'color'
  background.medianColor = Color.fromHex(item)
  return background
})

const gradients = [
  '135deg, #5EFCE8 10%, #736EFE 100%',
  '135deg, #43CBFF 10%, #9708CC 100%',
  '135deg, #CE9FFC 10%, #7367F0 100%',
  '135deg, #E2B0FF 10%, #9F44D3 100%',
  '135deg, #F97794 10%, #623AA2 100%',
  '135deg, #ABDCFF 10%, #0396FF 100%',
  '135deg, #3B2667 10%, #BC78EC 100%',
  '135deg, #F761A1 10%, #8C1BAB 100%',
  '135deg, #FFAA85 10%, #B3315F 100%',
  '135deg, #FF9D6C 10%, #BB4E75 100%',
  '135deg, #FDD819 10%, #E80505 100%',
  '135deg, #FFE985 10%, #FA742B 100%',
  '135deg, #FD6E6A 10%, #FFC600 100%',
  '135deg, #F0FF00 10%, #58CFFB 100%',
  '135deg, #FFF720 10%, #3CD500 100%',
  '135deg, #69FF97 10%, #00E4FF 100%',
  '135deg, #70F570 10%, #49C628 100%',
  '135deg, #81FBB8 10%, #28C76F 100%',
  '135deg, #633a00 10%, #1ffbff 100%',
  '135deg, #fffcfc 10%, #ffd6f2 100%',
  '135deg, #0b2c3e 10%, #2c3e50 100%',
].map((item) => {
  const background = new Background()
  background.displayValue = item
  background.value = item
  background.type = 'gradient'

  background.medianColor = getMedianColor(item)
  return background
})

const result: BackgroundCollection = {
  color: colors,
  gradient: gradients,
  gradicolor: [],
  pattern: [],
  image: [],
}

export default result

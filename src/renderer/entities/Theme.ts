import Color from './Color'
import Font from './FontPreset'

export default interface Theme {
  backgroundColor: Color
  backgroundType: BackgroundType
  backgroundValue: string
  fontPresets: Font[]
  palette: Color[]
}

export enum BackgroundType {
  Color,
  Gradient,
  Gradicolor,
  Pattern,
  Image,
  Unknown,
}

export function getBlankTheme(): Theme {
  return {
    backgroundColor: new Color().fromRgb(255, 255, 255),
    backgroundType: BackgroundType.Color,
    backgroundValue: '#FFFFFF',
    fontPresets: [
      { name: 'preset1', family: 'Alegreya', size: 80, weight: 400 },
    ],
    palette: [],
  }
}

export function typeFromString(type: string) {
  switch (type) {
    case 'color':
      return BackgroundType.Color
    case 'gradient':
      return BackgroundType.Gradient
    case 'gradicolor':
      return BackgroundType.Gradicolor
    case 'pattern':
      return BackgroundType.Pattern
    case 'image':
      return BackgroundType.Image
  }
  return BackgroundType.Unknown
}

export function stringFromType(type: BackgroundType) {
  switch (type) {
    case BackgroundType.Color:
      return 'color'
    case BackgroundType.Gradient:
      return 'gradient'
    case BackgroundType.Gradicolor:
      return 'gradicolor'
    case BackgroundType.Pattern:
      return 'pattern'
    case BackgroundType.Image:
      return 'image'
  }
  return 'unknown'
}

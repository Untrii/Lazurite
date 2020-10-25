import Color from './Color'
import IColor from './IColor'
import FontPreset from './IFontPreset'

export default interface ITheme {
  backgroundColor: IColor;
  backgroundType: BackgroundType;
  backgroundValue: string;
  fontPresets: FontPreset[];
  palette: IColor[];
}

export enum BackgroundType {
  Color,
  Gradient,
  Gradicolor,
  Pattern,
  Image,
  Unknown,
}

export function getBlankTheme(): ITheme {
  return {
    backgroundColor: new Color().fromRgb(255, 255, 255),
    backgroundType: BackgroundType.Color,
    backgroundValue: '#FFFFFF',
    fontPresets: [],
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

import Font from 'common/models/common/Font'
import Presentation from 'common/models/presentation/Presentation'
import Background, { BackgroundCollection } from 'common/models/presentation/theme/Background'

export default abstract class IOManager {
  abstract loadOpenedPresentationPaths(): Promise<string[]>
  abstract loadRecentPresentationPaths(): Promise<string[]>
  abstract loadPresentation(id: string): Promise<Presentation>
  abstract loadUserBackgrounds(): Promise<BackgroundCollection>

  abstract saveOpenedPresentationPaths(paths: string[]): Promise<void>
  abstract saveRecentPresentationPaths(paths: string[]): Promise<void>
  abstract savePresentation(id: string, presentation: Presentation): Promise<void>
  abstract saveUserBackgrounds(colors: BackgroundCollection): Promise<void>

  abstract createNewPresentaiton(name: string, author: string): Promise<[Presentation, string]>
  abstract addFile(file: Blob, space: 'user' | 'proj', relativePath: string): Promise<string>
  abstract getPresentationTemplate(): Promise<string>

  abstract delete(url: string): Promise<void>

  abstract getFonts(): Promise<Font[]>

  private validateArray<T>(parsedJson: any, itemValidator: (arrayEntry: any) => boolean): [T[], boolean] {
    const validatedResult: T[] = []
    let isVlaid = true
    if (Array.isArray(parsedJson)) {
      for (let i = 0; i < parsedJson.length; i++) {
        if (itemValidator(parsedJson[i])) validatedResult.push(parsedJson[i])
        else isVlaid = false
      }
    } else isVlaid = false
    return [validatedResult, isVlaid]
  }

  validatePresentationIds(parsedJson: any): [string[], boolean] {
    return this.validateArray(parsedJson, (entry) => typeof entry == 'string')
  }

  validateUserBackgrounds(parsedJson: any): [BackgroundCollection, boolean] {
    const validatedResult: BackgroundCollection = {
      color: [],
      gradient: [],
      gradicolor: [],
      pattern: [],
      image: [],
    }

    let validationResult = true

    for (const key in validatedResult) {
      const [validatedData, result] = this.validateArray(parsedJson?.[key], (entry) => entry instanceof Background)
      validatedResult[key] = validatedData
      validationResult = validatedResult && result
    }

    return [validatedResult, validationResult]
  }
}

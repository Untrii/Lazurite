import Color from '@/models/common/Color'
import Presentation from '@/models/presentation/Presentation'
import Background from '@/models/presentation/theme/Background'

export default abstract class IoManager {
  abstract loadOpenedPresentationPaths(): Promise<string[]>
  abstract loadRecentPresentationPaths(): Promise<string[]>
  abstract loadPresentation(id: string): Promise<Presentation>
  abstract loadUserBackgrounds(): Promise<Background[]>

  abstract saveOpenedPresentationPaths(paths: string[]): Promise<void>
  abstract saveRecentPresentationPaths(paths: string[]): Promise<void>
  abstract savePresentation(id: string, presentation: Presentation): Promise<void>
  abstract saveUserBackgrounds(colors: Background[]): Promise<void>

  abstract createNewPresentaiton(name: string, author: string): Promise<[Presentation, string]>

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

  validateUserBackgrounds(parsedJson: any): [Background[], boolean] {
    return this.validateArray(parsedJson, (entry) => entry instanceof Background)
  }
}

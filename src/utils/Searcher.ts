export default class Searcher {
  private _phraseList: string[]
  private _arrayIndex: Set<string>[]
  private _getter: Function | undefined

  constructor(pharseList: any[], comparableElementGetter?: Function) {
    this._phraseList = [...pharseList]
    this._getter = comparableElementGetter
    this._arrayIndex = this.createIndex(this._phraseList)
  }

  createSymbolPairs(str: string) {
    let result: Set<string> = new Set()
    for (let j = 0; j < str.length; j++)
      for (let l = j + 1; l < j + 4 && l < str.length; l++)
        result.add(str[j] + str[l])
    return result
  }

  createIndex(sourceArray: string[]) {
    let result: Set<string>[] = []
    for (let i = 0; i < sourceArray.length; i++) {
      let element = sourceArray[i]
      if (this._getter) element = this._getter(element)
      result.push(this.createSymbolPairs(element))
    }
    return result
  }

  search(word: string) {
    let matchIndexes: number[] = []
    const wordSymbolPairs = this.createSymbolPairs(word)
    for (let i = 0; i < this._phraseList.length; i++) {
      let element = this._phraseList[i]
      if (this._getter) element = this._getter(element)

      if (element.includes(word)) {
        matchIndexes.push(i)
      } else {
        let matchCount = 0
        const arrayElementSymbolPairs = this._arrayIndex[i]
        for (const pair of wordSymbolPairs)
          if (arrayElementSymbolPairs.has(pair)) matchCount++
        if (matchCount > wordSymbolPairs.size * 0.4) matchIndexes.push(i)
      }
    }
    return new Set(matchIndexes)
  }
}

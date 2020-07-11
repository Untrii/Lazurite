export default interface FileSystem {
  readFile: ReadFunction
  writeFile: WriteFunction
}

export interface ReadFunction {
  (fileName: string): Promise<string>
}
export interface WriteFunction {
  (fileName: string, data: string): Promise<void>
}

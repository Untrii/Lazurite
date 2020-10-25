export default interface IFileSystem {
  readFile: ReadFunction;
  writeFile: WriteFunction;
  readFileSync: SyncReadFunction;
}

export interface ReadFunction {
  (fileName: string): Promise<string>;
}
export interface WriteFunction {
  (fileName: string, data: string): Promise<void>;
}
export interface SyncReadFunction {
  (fileName: string): string;
}

export default function randomString(length: number | undefined): string {
  if (length == undefined) length = 8
  let result: string[] = []
  let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join()
}

/**
 * Generates random string
 * @param length Length of generated string, by default 8
 */
export default function randomString(length?: number): string {
  if (length == undefined) length = 8
  const result: string[] = []
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}

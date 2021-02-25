export default function getFontScale(fontFamily, fontWeight = 400) {
  let textContainer = document.createElement('span')
  textContainer.appendChild(document.createTextNode('height'))
  textContainer.style.cssText = `
    opacity: 0;
    font-family: ${fontFamily};
    font-size: 100px;
    font-weight: ${fontWeight};
    white-space: nowrap;
    display: inline;`
  document.body.appendChild(textContainer)
  let height = textContainer.offsetHeight
  document.body.removeChild(textContainer)
  return height / 100
}

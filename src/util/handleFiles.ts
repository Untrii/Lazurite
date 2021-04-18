export default async function handleFiles(dataTransfer: DataTransfer, accept: string[]) {
  const result = [] as ArrayBuffer[]

  const files = dataTransfer.files
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)
    if (accept && !accept.includes(file.type)) continue
    else result.push(await file.arrayBuffer())
  }

  const items = dataTransfer.items
  for (let i = 0; i < items.length; i++) {
    if (items[i].type == 'text/uri-list') {
      try {
        const data = await new Promise<Response>((resolve, reject) => {
          items[i].getAsString((str) => {
            fetch(str).then(resolve).catch(reject)
          })
        })
        const blob = await data.blob()
        if (!accept || accept.includes(blob.type)) result.push(await blob.arrayBuffer())
      } catch {}
    }
  }

  return result
}

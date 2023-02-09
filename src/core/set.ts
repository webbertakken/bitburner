export function set<T>(object: object, path: string | string[], value: T): object {
  const pathArray = Array.isArray(path) ? path : path.split('.')
  let result: any = object

  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i]

    if (i === pathArray.length - 1) {
      result[key] = value
    } else {
      if (result[key] == null || typeof result[key] !== 'object') {
        result[key] = {}
      }
      result = result[key]
    }
  }

  return object
}

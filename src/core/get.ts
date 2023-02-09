export function get<T>(object: object, path: string | string[], defaultValue?: T): T {
  const pathArray = Array.isArray(path) ? path : path.split('.')
  let result: object | T = object

  for (const key of pathArray) {
    if (result == null || typeof result !== 'object') {
      return defaultValue as T
    }

    result = (result as any)[key]
  }

  return result === undefined ? (defaultValue as T) : (result as T)
}

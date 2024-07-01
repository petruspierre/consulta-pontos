export function propertyOf<T>(key: string | number | symbol, obj: T): key is keyof T {
  return key in (obj as any);
}
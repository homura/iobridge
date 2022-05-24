export function hasProp<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  if (typeof obj !== 'object' || obj === null) return false;
  return Object.prototype.hasOwnProperty.call(obj, key);
}

type ArrayItem<T> = T extends (infer U)[] ? U : never;

export function hasProps<K extends string[]>(obj: unknown, keys: K): obj is Record<ArrayItem<K>, unknown> {
  if (typeof obj !== 'object' || obj === null) return false;
  return keys.every((key) => hasProp(obj, key));
}

export function unimplemented(): never {
  throw new Error('Unimplemented');
}

export function asserts(condition: unknown, message = 'Assertion failed'): asserts condition {
  if (!condition) throw new Error(message);
}

export function nonNullable<T>(value: T | null | undefined, message = 'Value is null or undefined'): T {
  if (value === null || value === undefined) throw new Error(message);
  return value;
}

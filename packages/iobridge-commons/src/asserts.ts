export function unimplemented(): never {
  throw new Error('Unimplemented');
}

export function asserts(condition: unknown, message = 'Assertion failed'): asserts condition {
  if (!condition) throw new Error(message);
}

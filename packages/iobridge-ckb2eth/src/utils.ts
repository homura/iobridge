/**
 * assert
 * @param record
 * @param state
 */
export function assertsState<R extends { state: string }, S extends R['state']>(
  record: R,
  state: S
): asserts record is R & { state: S } {
  if (record.state !== state) throw new Error('mismatch status');
}

export function asyncSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

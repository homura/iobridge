import { asserts } from '../asserts';
import { hasProps } from '../utils';

export class KVConfigLoader<K extends string> {
  readonly config: Record<K, unknown>;

  static loadFromEnv<Key extends string>(keys: Key[]): KVConfigLoader<Key> {
    if (!hasProps(process.env, keys)) throw new Error(`Missing env variables, ensure ${keys.join(', ')} are set`);
    return KVConfigLoader.load(process.env);
  }

  static load<K extends string>(obj: Record<K, unknown>): KVConfigLoader<K> {
    return new KVConfigLoader(obj);
  }

  constructor(obj: Record<K, unknown>) {
    this.config = obj;
  }

  read<T>(key: K, transform?: (v: unknown) => T): T {
    if (transform) return transform(this.config[key]);
    return this.config[key] as T;
  }

  readAsString(key: K): string {
    asserts(typeof this.config[key] === 'string', `config[${key}] is not a string`);
    return String(this.config[key]);
  }

  readAsNumber(key: K): number {
    const num = Number(this.config[key]);
    asserts(!Number.isNaN(num), `config[${key}] is not a number`);
    return num;
  }
}

import { expect } from 'chai';
import { KVConfigLoader } from './';

describe('ConfigLoader', () => {
  it('Should load from env correctly', () => {
    process.env.__TEST_KEY_0__ = 'test value 0';
    process.env.__TEST_KEY_1__ = 'test value 1';
    process.env.__TEST_KEY_2__ = 'test value 2';

    const loader = KVConfigLoader.loadFromEnv(['__TEST_KEY_0__', '__TEST_KEY_1__', '__TEST_KEY_2__']);

    expect(loader.read('__TEST_KEY_0__')).to.equal('test value 0');
    expect(loader.read('__TEST_KEY_1__')).to.equals('test value 1');
    expect(loader.read('__TEST_KEY_2__')).to.equals('test value 2');

    delete process.env.__TEST_KEY_0__;
    delete process.env.__TEST_KEY_1__;
    delete process.env.__TEST_KEY_2__;
  });

  it("Should throw error if env variable doesn't exist", () => {
    expect(() => KVConfigLoader.loadFromEnv(['__TEST_KEY_NONEXIST__'])).to.throw();
  });

  it('Should read as typed value', () => {
    const loader = KVConfigLoader.load({ key1: '1', key2: '2', key3: 'NOT A NUMBER' });

    expect(loader.read('key1')).to.equals('1');
    expect(loader.read('key1', Number)).to.equals(1);

    expect(loader.readAsString('key2')).to.equals('2');
    expect(loader.readAsNumber('key2')).to.equals(2);

    expect(() => loader.readAsNumber('key3')).to.throw();
  });
});

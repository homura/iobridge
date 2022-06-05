import { expect } from 'chai';
import { asserts, nonNullable, unimplemented } from './asserts';

describe('asserts', () => {
  it('Should throw error if condition is false', () => {
    expect(() => asserts(false)).to.throw();
    expect(() => asserts(false, 'some message')).to.throw('some message');

    expect(() => unimplemented()).to.throw();

    expect(() => nonNullable(undefined)).to.throw();
    expect(() => nonNullable(null)).to.throw();
    expect(() => nonNullable(0)).to.not.throw();
    expect(() => nonNullable(false)).to.not.throw();
  });
});

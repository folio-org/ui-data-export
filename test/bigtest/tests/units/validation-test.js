import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  required,
  requiredArray,
} from '../../../../src/utils';

describe('generateFileDefinitionBody', () => {
  it('should validate correct simple values', () => {
    expect(required(10)).to.be.undefined;
    expect(required(false)).to.be.undefined;
    expect(required(0)).to.be.undefined;
    expect(required(null)).to.be.not.undefined;
  });

  it('should validate correct array values', () => {
    expect(requiredArray(null)).to.be.not.undefined;
    expect(requiredArray([])).to.be.not.undefined;
    expect(requiredArray([1])).to.be.undefined;
  });
});

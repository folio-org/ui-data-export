import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { checkFileHaveCsvExtension } from '../../../../src/components/QueryFileUploader/utils';

describe('checkFileHaveCsvExtension', () => {
  it('should return true with csv file', () => {
    const testFile = new File([], 'test.csv');

    expect(checkFileHaveCsvExtension(testFile)).to.be.true;
  });

  it('should return false with other extension file', () => {
    const testFile = new File([], 'test.pdf');

    expect(checkFileHaveCsvExtension(testFile)).to.be.false;
  });
});

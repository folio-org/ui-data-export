import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { getFileInfo } from '../../../../src/components/QueryFileUploader/utils';

describe('getFileInfo', () => {
  it('should return correct data with supported cvs file type', () => {
    const testFile = new File([], 'test.csv');

    expect(getFileInfo(testFile)).to.eql({
      isTypeSupported: true,
      fileType: 'csv',
    });
  });

  it('should return correct data with supported cql file type', () => {
    const testFile = new File([], 'test.cql');

    expect(getFileInfo(testFile)).to.eql({
      isTypeSupported: true,
      fileType: 'cql',
    });
  });

  it('should return correct data with unsupported file type', () => {
    const testFile = new File([], 'test.txt');

    expect(getFileInfo(testFile)).to.eql({
      isTypeSupported: false,
      fileType: 'txt',
    });
  });
});

import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { generateFileDefinitionBody } from '../../../../src/components/QueryFileUploader/utils/generateFileDefinitionBody';

describe('generateFileDefinitionBody', () => {
  it.only('should create correct file definition body', () => {
    const file = {
      size: 1024,
      name: 'File name',
    };
    const fileType = 'cql';
    const okapiHeaders = generateFileDefinitionBody(file, fileType);

    expect(okapiHeaders).to.deep.equal({
      fileName: file.name,
      size: 1,
      uploadFormat: fileType,
    });
  });
});

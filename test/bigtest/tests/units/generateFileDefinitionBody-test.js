import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { generateFileDefinitionBody } from '../../../../src/components/QueryFileUploader/utils/generateFileDefinitionBody';

describe('generateFileDefinitionBody', () => {
  it('should create correct file definition body', () => {
    const file = {
      size: 1024,
      name: 'File name',
    };
    const okapiHeaders = generateFileDefinitionBody(file);

    expect(okapiHeaders).to.deep.equal({
      fileName: file.name,
      size: 1,
    });
  });
});

import '../../../../test/jest/__mock__';
import { generateFileDefinitionBody } from './generateFileDefinitionBody';

describe('generateFileDefinitionBody', () => {
  it('should create correct file definition body', () => {
    const file = {
      size: 1024,
      name: 'File name',
    };
    const fileType = 'cql';
    const okapiHeaders = generateFileDefinitionBody(file, fileType);

    expect(okapiHeaders).toEqual({
      fileName: file.name,
      size: 1,
      uploadFormat: fileType,
    });
  });
});

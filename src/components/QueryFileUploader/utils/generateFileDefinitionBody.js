import { convertBytesToKilobytes } from '@folio/stripes-data-transfer-components';

export const generateFileDefinitionBody = file => ({
  size: convertBytesToKilobytes(file.size),
  fileName: file.name,
});

import { convertBytesToKilobytes } from '@folio/stripes-data-transfer-components';

export const generateFileDefinitionBody = (file, fileType) => ({
  size: convertBytesToKilobytes(file.size),
  fileName: file.name,
  uploadFormat: fileType,
});

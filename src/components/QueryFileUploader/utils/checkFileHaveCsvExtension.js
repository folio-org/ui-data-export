import { getFileExtension } from '@folio/stripes-data-transfer-components';

export const checkFileHaveCsvExtension = file => {
  const fileExtension = getFileExtension(file);

  return fileExtension === '.csv';
};
